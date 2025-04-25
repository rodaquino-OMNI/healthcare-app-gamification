import { Injectable } from '@nestjs/common'; // NestJS Common 10.0.0+
import { Injectable } from '@nestjs/common'; // NestJS Common 10.0.0+
import { HealthMetric } from './entities/health-metric.entity';
import { HealthGoal } from './entities/health-goal.entity';
import { DeviceConnection } from 'src/backend/health-service/src/devices/entities/device-connection.entity';
import { Service } from 'src/backend/shared/src/interfaces/service.interface';
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto';
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto';
import { AppException } from 'src/backend/shared/src/exceptions/exceptions.types';
import { FhirService } from 'src/backend/health-service/src/integrations/fhir/fhir.service';
import { WearablesService } from 'src/backend/health-service/src/integrations/wearables/wearables.service';
import { KafkaProducer } from 'src/backend/gamification-engine/src/events/kafka/kafka.producer';
import { KafkaService } from 'src/backend/shared/src/kafka/kafka.service';
import { Configuration } from 'src/backend/health-service/src/config/configuration';
import { InsightsService } from 'src/backend/health-service/src/insights/insights.service';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';

/**
 * Handles the business logic for managing health data.
 */
@Injectable()
export class HealthService {
  /**
   * Initializes the HealthService.
   * @param prisma 
   * @param logger 
   * @param kafkaProducer 
   */
  constructor(
    private readonly prisma: any,
    private readonly logger: LoggerService,
    private readonly kafkaProducer: KafkaProducer,
  ) {
    this.logger.setContext(HealthService.name);
  }

  /**
   * Creates a new health metric for a user.
   * @param recordId 
   * @param createMetricDto 
   * @returns The newly created HealthMetric entity.
   */
  async createHealthMetric(recordId: string, createMetricDto: any): Promise<HealthMetric> {
    this.logger.log(`Creating health metric for record ${recordId}`);
    try {
      // Creates a new health metric in the database.
      const healthMetric = await this.prisma.healthMetric.create({
        data: {
          recordId: recordId,
          ...createMetricDto,
        },
      });

      this.logger.debug(`Created health metric with ID ${healthMetric.id}`);
      // Returns the created metric.
      return healthMetric;
    } catch (error) {
      this.logger.error(`Failed to create health metric for record ${recordId}`, error.stack);
      throw new AppException(
        'Failed to create health metric',
        'TECHNICAL',
        'HEALTH_001',
        { recordId },
        error,
      );
    }
  }

  /**
   * Updates an existing health metric for a user.
   * @param id 
   * @param updateMetricDto 
   * @returns The updated HealthMetric entity.
   */
  async updateHealthMetric(id: string, updateMetricDto: any): Promise<HealthMetric> {
    this.logger.log(`Updating health metric with ID ${id}`);
    try {
      // Updates an existing health metric in the database.
      const healthMetric = await this.prisma.healthMetric.update({
        where: { id },
        data: updateMetricDto,
      });

      this.logger.debug(`Updated health metric with ID ${healthMetric.id}`);
      // Returns the updated metric.
      return healthMetric;
    } catch (error) {
      this.logger.error(`Failed to update health metric with ID ${id}`, error.stack);
      throw new AppException(
        'Failed to update health metric',
        'TECHNICAL',
        'HEALTH_002',
        { id },
        error,
      );
    }
  }
}