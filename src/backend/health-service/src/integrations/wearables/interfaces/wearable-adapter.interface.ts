import { DeviceConnection } from '../../../devices/entities/device-connection.entity';
import { HealthMetric } from '../../../health/entities/health-metric.entity';

/**
 * Contract for wearable device adapters.
 *
 * Each adapter (Google Fit, Apple Health, Fitbit, etc.) must implement
 * this interface to provide a unified API for connecting, retrieving
 * health metrics, and disconnecting wearable devices.
 */
export interface WearableAdapter {
    /** Establish a connection to the wearable platform for a given user. */
    connect(userId: string, authToken: string, refreshToken?: string): Promise<DeviceConnection>;

    /** Retrieve health metrics within a date range from a connected device. */
    getHealthMetrics(
        userId: string,
        deviceConnection: DeviceConnection,
        startTime: Date,
        endTime: Date
    ): Promise<HealthMetric[]>;

    /** Disconnect a user's wearable device and revoke access. */
    disconnect(userId: string, deviceConnection: DeviceConnection): Promise<boolean>;

    /** Return the OAuth authorization URL for the wearable platform. */
    getAuthUrl(userId: string): string;
}
