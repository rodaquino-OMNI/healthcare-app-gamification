/* eslint-disable */
import { PrismaService } from '@app/shared/database/prisma.service';
import { ErrorType } from '@app/shared/exceptions/error.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';

import { GoogleFitAdapter } from './adapters/googlefit.adapter';
import { HealthKitAdapter } from './adapters/healthkit.adapter';
import { Configuration } from '../../config/configuration';
import { DeviceConnection } from '../../devices/entities/device-connection.entity';
import { HealthMetric } from '../../health/entities/health-metric.entity';

/**
 * Abstract class for wearable device adapters
 */
export abstract class WearableAdapter {
    abstract connect(userId: string, authToken: string, refreshToken?: string): Promise<DeviceConnection>;
    abstract getHealthMetrics(
        userId: string,
        deviceConnection: DeviceConnection,
        startTime: Date,
        endTime: Date
    ): Promise<HealthMetric[]>;
    abstract disconnect(userId: string, deviceConnection: DeviceConnection): Promise<boolean>;
}

/**
 * Service for integrating with wearable devices and health tracking platforms
 */
@Injectable()
export class WearablesService {
    private readonly logger: LoggerService;
    private readonly adapters: Map<string, WearableAdapter> = new Map();

    /**
     * Constructs a new WearablesService instance
     * @param googleFitAdapter The Google Fit adapter
     * @param healthKitAdapter The Apple HealthKit adapter
     * @param configService The configuration service
     * @param logger The logger service
     * @param prisma The Prisma service for database access
     */
    constructor(
        private readonly googleFitAdapter: GoogleFitAdapter,
        private readonly healthKitAdapter: HealthKitAdapter,
        private readonly configService: Configuration,
        loggerService: LoggerService,
        private readonly prisma: PrismaService
    ) {
        this.logger = loggerService.createLogger(WearablesService.name);

        // Register adapters
        this.adapters.set('GOOGLE_FIT', googleFitAdapter);
        this.adapters.set('HEALTH_KIT', healthKitAdapter);
    }

    /**
     * Connects a wearable device to a user's health record
     * @param userId User ID
     * @param recordId Health record ID
     * @param deviceType Type of device (e.g., 'GOOGLE_FIT', 'HEALTH_KIT')
     * @param authToken Authentication token
     * @param refreshToken Refresh token (optional)
     */
    async connectDevice(
        userId: string,
        recordId: string,
        deviceType: string,
        authToken: string,
        refreshToken?: string
    ): Promise<DeviceConnection> {
        this.logger.log('info', `Connecting ${deviceType} to record ${recordId}`);

        try {
            const adapter = this.adapters.get(deviceType);

            if (!adapter) {
                throw new Error(`${ErrorType.HEALTH_002}: Unsupported device type: ${deviceType}`);
            }

            const deviceConnection = await adapter.connect(userId, authToken, refreshToken);

            // Persist the device connection in the database
            const persistedConnection = await (this.prisma as any).deviceConnection.create({
                data: {
                    recordId,
                    userId,
                    deviceType,
                    status: deviceConnection.status,
                    connectionData: (deviceConnection as any).connectionData,
                    lastSyncedAt: deviceConnection.lastSync,
                },
            });

            this.logger.log('info', `Connected ${deviceType} to record ${recordId}`);

            return persistedConnection;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
            const errorStack = error instanceof Error ? (error as any).stack : undefined;

            this.logger.error(`Failed to connect ${deviceType} to record ${recordId}: ${errorMessage}`, errorStack);

            throw error as any;
        }
    }

    /**
     * Retrieves health metrics from a connected wearable device
     * @param userId User ID
     * @param recordId Health record ID
     * @param deviceType Type of device (e.g., 'GOOGLE_FIT', 'HEALTH_KIT')
     * @param startTime Start time for data retrieval
     * @param endTime End time for data retrieval
     */
    async getHealthMetrics(
        userId: string,
        recordId: string,
        deviceType: string,
        startTime: Date,
        endTime: Date
    ): Promise<HealthMetric[]> {
        this.logger.log('info', `Retrieving metrics from ${deviceType} for record ${recordId}`);

        try {
            const adapter = this.adapters.get(deviceType);

            if (!adapter) {
                throw new Error(`${ErrorType.HEALTH_001}: Unsupported device type: ${deviceType}`);
            }

            // Retrieve the device connection from the database
            const deviceConnection = await (this.prisma as any).deviceConnection.findFirst({
                where: {
                    recordId,
                    userId,
                    deviceType,
                    status: 'CONNECTED',
                },
            });

            if (!deviceConnection) {
                throw new Error(
                    `${ErrorType.HEALTH_001}: No active ${deviceType} connection found for record ${recordId}`
                );
            }

            const healthMetrics = await adapter.getHealthMetrics(userId, deviceConnection, startTime, endTime);

            // Update the last synced timestamp
            await (this.prisma as any).deviceConnection.update({
                where: { id: deviceConnection.id },
                data: { lastSyncedAt: new Date() },
            });

            this.logger.log(
                'info',
                `Retrieved ${healthMetrics.length} metrics from ${deviceType} for record ${recordId}`
            );

            return healthMetrics;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
            const errorStack = error instanceof Error ? (error as any).stack : undefined;

            this.logger.error(
                `Failed to retrieve metrics for record ${recordId} from ${deviceType}: ${errorMessage}`,
                errorStack
            );

            throw error as any;
        }
    }

    /**
     * Disconnects a wearable device from a user's health record
     * @param userId User ID
     * @param recordId Health record ID
     * @param deviceType Type of device (e.g., 'GOOGLE_FIT', 'HEALTH_KIT')
     */
    async disconnectDevice(userId: string, recordId: string, deviceType: string): Promise<boolean> {
        this.logger.log('info', `Disconnecting ${deviceType} from record ${recordId}`);

        try {
            const adapter = this.adapters.get(deviceType);

            if (!adapter) {
                throw new Error(`${ErrorType.HEALTH_002}: Unsupported device type: ${deviceType}`);
            }

            // Retrieve the device connection from the database
            const deviceConnection = await (this.prisma as any).deviceConnection.findFirst({
                where: {
                    recordId,
                    userId,
                    deviceType,
                    status: 'CONNECTED',
                },
            });

            if (!deviceConnection) {
                this.logger.warn(`No active ${deviceType} connection found for record ${recordId}`);
                return false;
            }

            const disconnected = await adapter.disconnect(userId, deviceConnection);

            if (disconnected) {
                // Update the connection status in the database
                await (this.prisma as any).deviceConnection.update({
                    where: { id: deviceConnection.id },
                    data: { status: 'DISCONNECTED' },
                });
            }

            this.logger.log('info', `Disconnected ${deviceType} from record ${recordId}`);

            return disconnected;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
            const errorStack = error instanceof Error ? (error as any).stack : undefined;

            this.logger.error(
                `Failed to disconnect ${deviceType} from record ${recordId}: ${errorMessage}`,
                errorStack
            );

            throw error as any;
        }
    }
}
