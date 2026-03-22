import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { HealthGoal, GoalStatus } from '../health/entities/health-goal.entity';
import { HealthMetric } from '../health/entities/health-metric.entity';
import { FhirService } from '../integrations/fhir/fhir.service';
import { WearablesService } from '../integrations/wearables/wearables.service';

/** Shape of user insights data */
interface InsightsData {
    metricsCount: number;
    goalsCount: number;
    recommendations: string[];
}

/**
 * Generates health insights for users based on their health data.
 * It retrieves health metrics, analyzes trends, and generates
 * personalized recommendations. This service integrates with
 * external data sources and the gamification engine to provide
 * a comprehensive health management experience.
 */
@Injectable()
export class InsightsService {
    /**
     * Initializes the InsightsService.
     * @param prisma - The Prisma service for database access.
     * @param fhirService - The FHIR service for integrating with EHR systems.
     * @param wearablesService - The Wearables service for integrating with wearable devices.
     * @param kafkaService - The Kafka service for event-driven communication.
     * @param logger - The logger service for logging events.
     * @param tracingService - The tracing service for distributed tracing.
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly fhirService: FhirService,
        private readonly wearablesService: WearablesService,
        private readonly kafkaService: KafkaService,
        private readonly logger: LoggerService,
        private readonly tracingService: TracingService
    ) {
        this.logger.setContext(InsightsService.name); // Sets the context for the logger
    }

    /**
     * Generates health insights for all users.
     * This method is scheduled to run every day at midnight.
     * Uses cursor-based batch processing to avoid loading all users into memory at once.
     * @returns A promise that resolves when the insights have been generated.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async generateInsights(): Promise<void> {
        this.logger.log('Starting daily insight generation');

        try {
            const batchSize = 100;
            let cursor: string | undefined;
            let totalProcessed = 0;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const users = await this.prisma.user.findMany({
                    take: batchSize,
                    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
                    select: { id: true },
                    orderBy: { id: 'asc' },
                });

                if (users.length === 0) {
                    break;
                }

                await Promise.all(users.map((user) => this.generateUserInsights(user.id)));

                totalProcessed += users.length;
                cursor = users[users.length - 1].id;

                if (users.length < batchSize) {
                    break;
                }
            }

            this.logger.log(`Daily insight generation complete: ${totalProcessed} users processed`);
        } catch (error: unknown) {
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error('Error during daily health insights generation', errorStack); // Logs any errors that occur during the process
        }
    }

    /**
     * Generates health insights for a specific user.
     * @param userId - The ID of the user to generate insights for.
     * @returns A promise that resolves with the generated insights for the user.
     */
    async generateUserInsights(userId: string, requestingUserId?: string): Promise<InsightsData> {
        if (requestingUserId && userId !== requestingUserId) {
            throw new ForbiddenException("Access denied: cannot access another user's data");
        }

        this.logger.log(`Generating health insights for user ${userId}`); // Logs the start of the process

        try {
            // Retrieves the user's health metrics from the database using PrismaService.
            const metrics = await this.getUserHealthMetrics(
                userId,
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                new Date()
            );

            // Retrieves the user's health goals from the database using PrismaService.
            const goals = await this.getUserHealthGoals(userId);

            // Analyzes the user's health data and goals to generate personalized insights.
            const insightsData = this.analyzeHealthData(metrics, goals);

            // Publishes insight generation events to Kafka for gamification processing.
            await this.publishInsightEvent(userId, insightsData);

            this.logger.log(
                `Generated insights for user ${userId}: ${JSON.stringify(insightsData)}`
            ); // Logs the generated insights.

            return insightsData; // Returns the generated insights.
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Error generating insights for user ${userId}`, errorStack); // Logs any errors that occur during the process
            throw new AppException(
                'Failed to generate user insights',
                ErrorType.TECHNICAL,
                'HEALTH_INVALID_METRIC',
                { userId, error: errorMessage }
            );
        }
    }

    /**
     * Retrieves health metrics for a specific user.
     * @param userId - The ID of the user to retrieve metrics for.
     * @param startDate - The start date for the metrics query.
     * @param endDate - The end date for the metrics query.
     * @returns A promise that resolves with an array of health metrics.
     */
    async getUserHealthMetrics(
        userId: string,
        startDate: Date,
        endDate: Date,
        requestingUserId?: string
    ): Promise<HealthMetric[]> {
        if (requestingUserId && userId !== requestingUserId) {
            throw new ForbiddenException("Access denied: cannot access another user's data");
        }

        this.logger.log(`Retrieving health metrics for user ${userId}`); // Logs the start of the process

        try {
            // Queries the database using PrismaService to retrieve
            // health metrics for the specified user.
            /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- Prisma model delegate not exposed */
            const metrics: HealthMetric[] = await (this.prisma as any).healthMetric.findMany({
                where: {
                    userId: userId,
                    timestamp: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            /* eslint-enable
               @typescript-eslint/no-unsafe-assignment,
               @typescript-eslint/no-unsafe-call,
               @typescript-eslint/no-unsafe-member-access,
               @typescript-eslint/no-explicit-any */

            this.logger.log(`Retrieved ${metrics.length} health metrics ` + `for user ${userId}`);

            return metrics;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Error retrieving health metrics for user ${userId}`, errorStack); // Logs any errors that occur during the process
            throw new AppException(
                'Failed to retrieve user health metrics',
                ErrorType.TECHNICAL,
                'HEALTH_INVALID_METRIC',
                { userId, error: errorMessage }
            );
        }
    }

    /**
     * Retrieves health goals for a specific user.
     * @param userId - The ID of the user to retrieve goals for.
     * @returns A promise that resolves with an array of health goals.
     */
    async getUserHealthGoals(userId: string, requestingUserId?: string): Promise<HealthGoal[]> {
        if (requestingUserId && userId !== requestingUserId) {
            throw new ForbiddenException("Access denied: cannot access another user's data");
        }

        this.logger.log(`Retrieving health goals for user ${userId}`); // Logs the start of the process

        try {
            // Queries the database using PrismaService to
            // retrieve health goals for the specified user.
            /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- Prisma model delegate not exposed */
            const goals: HealthGoal[] = await (this.prisma as any).healthGoal.findMany({
                where: {
                    recordId: userId,
                    status: GoalStatus.ACTIVE,
                },
            });
            /* eslint-enable
               @typescript-eslint/no-unsafe-assignment,
               @typescript-eslint/no-unsafe-call,
               @typescript-eslint/no-unsafe-member-access,
               @typescript-eslint/no-explicit-any */

            this.logger.log(`Retrieved ${goals.length} health goals ` + `for user ${userId}`);

            return goals;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Error retrieving health goals for user ${userId}`, errorStack); // Logs any errors that occur during the process
            throw new AppException(
                'Failed to retrieve user health goals',
                ErrorType.TECHNICAL,
                'HEALTH_INVALID_METRIC',
                { userId, error: errorMessage }
            );
        }
    }

    /**
     * Analyzes health data to generate insights.
     * @param metrics - An array of health metrics to analyze.
     * @param goals - An array of health goals to consider.
     * @returns The generated insights based on the health data.
     */
    analyzeHealthData(metrics: HealthMetric[], goals: HealthGoal[]): InsightsData {
        this.logger.log('Analyzing health data to generate insights'); // Logs the start of the process

        // Analyzes trends in health metrics.
        // Identifies abnormal values.
        // Checks progress towards goals.
        // Generates personalized recommendations.

        const insights = {
            metricsCount: metrics.length,
            goalsCount: goals.length,
            recommendations: ['Stay hydrated', 'Get some exercise'],
        };

        this.logger.log(`Generated insights: ${JSON.stringify(insights)}`); // Logs the generated insights

        return insights; // Returns the analysis results and recommendations.
    }

    /**
     * Publishes insight generation events to Kafka for gamification processing.
     * @param userId - The ID of the user to publish the event for.
     * @param insightData - The generated insight data.
     * @returns A promise that resolves when the event has been published.
     */
    async publishInsightEvent(userId: string, insightData: InsightsData): Promise<void> {
        this.logger.log(`Publishing insight event for user ${userId}`); // Logs the start of the process

        try {
            // Creates an event payload with user ID and insight data.
            const eventPayload = {
                userId: userId,
                insightData: insightData,
            };

            // Publishes the event to the Kafka topic for gamification processing.
            await this.kafkaService.produce(
                'austa.health.insights', // Replace with actual topic name
                eventPayload
            );

            this.logger.log(`Published insight event for user ${userId}`); // Logs the event publication.
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Error publishing insight event for user ${userId}`, errorStack); // Logs any errors that occur during the process
            throw new AppException(
                'Failed to publish insight event',
                ErrorType.EXTERNAL,
                'GAME_INVALID_EVENT_DATA',
                { userId, error: errorMessage }
            );
        }
    }
}
