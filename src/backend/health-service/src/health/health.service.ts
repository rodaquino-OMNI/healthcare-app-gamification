/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorType } from '@app/shared/exceptions/error.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HealthMetric } from './entities/health-metric.entity';
import { Service } from '@app/shared/interfaces/service.interface';
import { FilterDto, PaginationDto } from './dto/filter.dto';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { FhirService } from '../integrations/fhir/fhir.service';
import { WearablesService } from '../integrations/wearables/wearables.service';
import { KafkaProducer } from '@app/shared/kafka/kafka.producer';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { Configuration } from '../config/configuration';
import { InsightsService } from '../insights/insights.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { ErrorType, ERROR_CODES } from '../types/error.types';

/**
 * Service responsible for handling health-related operations
 */
@Injectable()
export class HealthService implements Service<any, any, any> {
  constructor(
    @InjectRepository(HealthMetric)
    private readonly healthMetricsRepository: Repository<HealthMetric>,
    private readonly fhirService: FhirService,
    private readonly wearablesService: WearablesService,
    private readonly kafkaProducer: KafkaProducer,
    private readonly kafkaService: KafkaService,
    private readonly insightsService: InsightsService,
    private readonly configService: Configuration,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('HealthService');
  }

  /**
   * Creates a new health metric record
   * @param userId User or patient ID
   * @param metricData Health metric data
   * @returns The created health metric
   */
  async createHealthMetric(userId: string, metricData: Partial<HealthMetric>): Promise<HealthMetric> {
    try {
      this.logger.debug(`Creating health metric for user ${userId}`, { 
        userId,
        metricType: metricData.type
      });

      // Create a new metric
      const metric = this.healthMetricsRepository.create({
        id: uuidv4(),
        userId,
        ...metricData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Save the metric
      const savedMetric = await this.healthMetricsRepository.save(metric);

      // Publish event to Kafka for the gamification engine
      await this.publishMetricEvent(savedMetric);

      // Generate insights based on the new metric
      this.generateInsightsForMetric(savedMetric).catch((error: unknown) => {
        const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
        const errorStack = error instanceof Error ? (error as any).stack : undefined;
        this.logger.error(
          `Error generating insights for metric ${savedMetric.id}`,
          errorStack
        );
      });

      return savedMetric;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
      const errorStack = error instanceof Error ? (error as any).stack : undefined;
      this.logger.error(
        `Failed to create health metric for user ${userId}`,
        errorStack
      );
      throw error as any;
    }
  }

  /**
   * Process insights for a newly created or updated metric
   * @param metric The health metric to process
   */
  private async generateInsightsForMetric(metric: HealthMetric): Promise<void> {
    try {
      // Add your insight generation logic here
      // This is a placeholder for now
    } catch (error) {
      this.logger.error(
        `Failed to generate insights for metric ${metric.id}`,
        error instanceof Error ? (error as any).stack : undefined
      );
    }
  }

  /**
   * Updates an existing health metric
   * @param id Health metric ID
   * @param metricData Updated health metric data
   * @returns The updated health metric
   */
  async updateHealthMetric(id: string, metricData: Partial<HealthMetric>): Promise<HealthMetric> {
    try {
      this.logger.debug(`Updating health metric with ID ${id}`);

      // Find the existing metric
      const existingMetric = await this.healthMetricsRepository.findOne({
        where: { id }
      });

      if (!existingMetric) {
        throw new AppException(ErrorType.HEALTH_404, {
          metricId: id
        } as any);
      }

      // Update the metric
      Object.assign(existingMetric, {
        ...metricData,
        updatedAt: new Date()
      });

      // Save the updated metric
      return await this.healthMetricsRepository.save(existingMetric);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
      const errorStack = error instanceof Error ? (error as any).stack : undefined;
      this.logger.error(
        `Failed to update health metric with ID ${id}`,
        errorStack
      );
      throw error as any;
    }
  }

  /**
   * Fetches health metrics for a user with filtering and pagination
   * @param userId User or patient ID
   * @param filterDto Filter criteria
   * @param paginationDto Pagination options
   * @returns Paginated list of health metrics
   */
  async getHealthMetrics(
    userId: string,
    filterDto?: FilterDto,
    paginationDto?: PaginationDto
  ): Promise<{ data: HealthMetric[]; total: number; page: number; limit: number }> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 10;
    const skip = (page - 1) * limit;

    // Build query with filters
    const queryBuilder = this.healthMetricsRepository
      .createQueryBuilder('metric')
      .where('metric.userId = :userId', { userId });

    // Apply type filter if provided
    if (filterDto?.type) {
      queryBuilder.andWhere('metric.type = :type', { type: filterDto.type });
    }

    // Apply date range filter if provided
    if (filterDto?.startDate) {
      queryBuilder.andWhere('metric.timestamp >= :startDate', {
        startDate: new Date(filterDto.startDate)
      });
    }

    if (filterDto?.endDate) {
      queryBuilder.andWhere('metric.timestamp <= :endDate', {
        endDate: new Date(filterDto.endDate)
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Add pagination
    queryBuilder.orderBy('metric.timestamp', 'DESC').skip(skip).take(limit);

    // Execute query
    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit
    };
  }

  /**
   * Gets a specific health metric by ID
   * @param id Health metric ID
   * @returns The health metric
   */
  async getHealthMetricById(id: string): Promise<HealthMetric> {
    const metric = await this.healthMetricsRepository.findOne({
      where: { id }
    });

    if (!metric) {
      throw new AppException(ErrorType.HEALTH_404, {
        metricId: id
      } as any);
    }

    return metric;
  }

  /**
   * Deletes a health metric
   * @param id Health metric ID
   * @returns True if the delete was successful
   */
  async deleteHealthMetric(id: string): Promise<boolean> {
    const result = await this.healthMetricsRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Publishes a metric event to Kafka for the gamification engine
   * @param metric Health metric to publish
   */
  private async publishMetricEvent(metric: HealthMetric): Promise<void> {
    try {
      // Format the event
      const event = {
        eventType: 'health.metric.created',
        userId: metric.userId,
        metricId: metric.id,
        metricType: metric.type,
        timestamp: new Date().toISOString(),
        value: metric.value,
        unit: metric.unit
      };

      // Publish to Kafka
      await this.kafkaProducer.send('health.events', event);
      
      this.logger.debug(`Published health metric event for user ${metric.userId}`, {
        metricId: metric.id,
        metricType: metric.type
      });
    } catch (error) {
      this.logger.error(
        `Failed to publish health metric event for user ${metric.userId}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      // Don't rethrow - this is a non-critical operation
    }
  }

  /**
   * Gets aggregated health metrics for a user
   * @param userId User or patient ID
   * @param metricType Type of metric to aggregate
   * @param period Time period for aggregation (daily, weekly, monthly)
   * @returns Aggregated metrics
   */
  async getAggregatedMetrics(
    userId: string,
    metricType: string,
    period: 'daily' | 'weekly' | 'monthly'
  ): Promise<any[]> {
    // Implementation depends on the database - this is a simplified example
    // In production, use specialized time-series functionality or a time-series database
    
    let groupByFormat: string;
    let startDate: Date;
    
    const now = new Date();
    
    switch (period) {
      case 'daily':
        groupByFormat = 'YYYY-MM-DD'; // Daily format
        startDate = new Date(now.setDate(now.getDate() - 30)); // Last 30 days
        break;
      case 'weekly':
        groupByFormat = 'IYYY-IW'; // ISO year and week
        startDate = new Date(now.setDate(now.getDate() - 90)); // Last ~12 weeks
        break;
      case 'monthly':
        groupByFormat = 'YYYY-MM'; // Year and month
        startDate = new Date(now.setDate(now.getDate() - 365)); // Last 12 months
        break;
    }
    
    // Using raw query for aggregation with time buckets
    // Note: This is PostgreSQL-specific syntax
    const results = await this.healthMetricsRepository.query(`
      SELECT 
        to_char(timestamp, '${groupByFormat}') AS time_bucket,
        AVG(CASE WHEN value ~ '^[0-9]+(\.[0-9]+)?$' THEN value::numeric ELSE null END) AS avg_value,
        MIN(CASE WHEN value ~ '^[0-9]+(\.[0-9]+)?$' THEN value::numeric ELSE null END) AS min_value,
        MAX(CASE WHEN value ~ '^[0-9]+(\.[0-9]+)?$' THEN value::numeric ELSE null END) AS max_value,
        COUNT(*) AS count
      FROM 
        health_metric
      WHERE 
        user_id = $1 
        AND type = $2
        AND timestamp >= $3
      GROUP BY 
        time_bucket
      ORDER BY 
        time_bucket ASC
    `, [userId, metricType, startDate]);
    
    return results;
  }

  /**
   * Gets the latest health metrics for each type for a user
   * @param userId User or patient ID
   * @returns Latest health metrics by type
   */
  async getLatestMetrics(userId: string): Promise<Record<string, HealthMetric>> {
    // Using raw query to get the latest metric of each type
    // Note: This is PostgreSQL-specific syntax
    const results = await this.healthMetricsRepository.query(`
      SELECT DISTINCT ON (type) *
      FROM health_metric
      WHERE user_id = $1
      ORDER BY type, timestamp DESC
    `, [userId]);
    
    // Convert results to a map of type -> metric
    const latestMetrics: Record<string, HealthMetric> = {};
    for (const result of results) {
      latestMetrics[result.type] = result;
    }
    
    return latestMetrics;
  }

  /**
   * Generates a health summary for a user
   * @param userId User or patient ID
   * @returns Health summary object
   */
  async generateHealthSummary(userId: string): Promise<any> {
    // Get latest metrics
    const latestMetrics = await this.getLatestMetrics(userId);
    
    // Get aggregated metrics for key health indicators
    const stepsData = await this.getAggregatedMetrics(userId, 'steps', 'daily');
    const heartRateData = await this.getAggregatedMetrics(userId, 'heart_rate', 'daily');
    const bloodPressureData = await this.getAggregatedMetrics(userId, 'blood_pressure', 'daily');
    const sleepData = await this.getAggregatedMetrics(userId, 'sleep', 'daily');
    
    // Get insights
    const insights = await this.getHealthInsights(userId);
    
    // Compile summary
    return {
      userId,
      timestamp: new Date().toISOString(),
      latestMetrics,
      aggregatedData: {
        steps: stepsData,
        heartRate: heartRateData,
        bloodPressure: bloodPressureData,
        sleep: sleepData
      },
      insights
    };
  }

  /**
   * Gets health insights for a user
   * @param userId User ID
   * @returns List of health insights
   */
  private async getHealthInsights(userId: string): Promise<any[]> {
    try {
      // This is a placeholder - implement the actual logic to get insights
      return [];
    } catch (error) {
      this.logger.error(
        `Failed to get health insights for user ${userId}`,
        error instanceof Error ? (error as any).stack : undefined
      );
      return [];
    }
  }
}