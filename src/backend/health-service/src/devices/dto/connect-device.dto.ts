import { IsNotEmpty, IsString, IsEnum } from 'class-validator'; // class-validator@0.14.0 - Validation decorators for DTO properties

/**
 * Enum representing the supported wearable device types in the AUSTA SuperApp
 * These are the devices that can be connected to import health metrics
 */
export enum DeviceType {
    SMARTWATCH = 'SMARTWATCH',
    FITNESS_TRACKER = 'FITNESS_TRACKER',
    HEART_RATE_MONITOR = 'HEART_RATE_MONITOR',
    BLOOD_PRESSURE_MONITOR = 'BLOOD_PRESSURE_MONITOR',
    GLUCOSE_MONITOR = 'GLUCOSE_MONITOR',
    SCALE = 'SCALE',
    SLEEP_TRACKER = 'SLEEP_TRACKER',
    OTHER = 'OTHER',
}

/**
 * Data Transfer Object for connecting a wearable device to a user's health profile.
 * Used when a client requests to establish a connection with a supported device.
 */
export class ConnectDeviceDto {
    /**
     * Unique identifier for the device
     * This could be a manufacturer serial number, MAC address, or another unique ID
     */
    @IsNotEmpty({ message: 'Device ID is required' })
    @IsString({ message: 'Device ID must be a string' })
    deviceId!: string;

    /**
     * Type of wearable device being connected
     * Must be one of the supported device types defined in the DeviceType enum
     */
    @IsNotEmpty({ message: 'Device type is required' })
    @IsEnum(DeviceType, {
        message:
            'Invalid device type. Supported types: SMARTWATCH, FITNESS_TRACKER, HEART_RATE_MONITOR, BLOOD_PRESSURE_MONITOR, GLUCOSE_MONITOR, SCALE, SLEEP_TRACKER, OTHER',
    })
    deviceType!: DeviceType;
}
