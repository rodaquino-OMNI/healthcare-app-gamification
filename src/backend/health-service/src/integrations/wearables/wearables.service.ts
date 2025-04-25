import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common'; // @nestjs/common v9.0.0+
import { GoogleFitAdapter } from '../adapters/googlefit.adapter';
import { HealthKitAdapter } from '../adapters/healthkit.adapter';
import { Configuration } from '../../../config/configuration';
import { LoggerService } from '@shared/logging/logger.service';
import { Service } from '@shared/interfaces/service.interface';
import { DeviceConnection } from '../../../devices/entities/device-connection.entity';
import { ErrorCodes } from '@shared/constants/error-codes.constants';
import { HealthMetric } from '../../../health/entities/health-metric.entity';
import { PrismaService } from '@shared/database/prisma.service';

/**
 * Abstract class defining the interface for wearable device adapters.
 * All wearable-specific adapters must extend this class and implement its methods.
 */
export abstract class WearableAdapter {
  /**
   * Initiates the connection to a wearable device.
   * @param userId - The user ID to associate with the device connection
   * @returns A promise resolving to a DeviceConnection entity
   */
  abstract connect(userId: string): Promise<DeviceConnection>;

  /**
   * Retrieves health metrics from a wearable device for a specific date range.
   * @param userId - The user ID associated with the device connection
   * @param startDate - The start date for retrieving metrics
   * @param endDate - The end date for retrieving metrics
   * @returns A promise resolving to an array of HealthMetric entities
   */
  abstract getHealthMetrics(userId: string, startDate: Date, endDate: Date): Promise<HealthMetric[]>;

  /**
   * Disconnects a wearable device from a user's profile.
   * @param userId - The user ID associated with the device connection
   * @returns A promise that resolves when the device has been disconnected
   */
  abstract disconnect(userId: string): Promise<void>;
}

/**
 * Service for managing wearable device integrations.
 * Provides a unified interface for connecting to different wearable APIs and retrieving health metrics.
 * Abstracts the complexities of each wearable's specific API and provides consistent data formats.
 */
@Injectable()
export class WearablesService {
  private readonly logger: LoggerService;
  private googleFitAdapter: GoogleFitAdapter;
  private healthKitAdapter: HealthKitAdapter;
  private configService: Configuration;
  private prisma: PrismaService;

  /**
   * Initializes the WearablesService.
   * @param logger - The logger service for logging events
   * @param configService - The configuration service for accessing app settings
   * @param prisma - The Prisma service for database operations
   */
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: Configuration,
    private readonly prismaService: PrismaService
  ) {
    this.logger = loggerService.createLogger('WearablesService');
    this.googleFitAdapter = new GoogleFitAdapter();
    this.healthKitAdapter = new HealthKitAdapter();
    this.configService = configService;
    this.prisma = prismaService;
  }

  /**
   * Connects a new wearable device to a user's health profile.
   * @param recordId - The health record ID to connect the device to
   * @param deviceType - The type of wearable device to connect
   * @returns A promise resolving to the newly created DeviceConnection entity
   */
  async connect(recordId: string, deviceType: string): Promise<DeviceConnection> {
    this.logger.log(`Connecting device type ${deviceType} to record ${recordId}`);
    
    // Validate the device type
    this.validateDeviceType(deviceType);
    
    try {
      // Get the appropriate adapter for the device type
      const adapter = this.getAdapter(deviceType);
      
      // Connect to the device using the adapter
      const connection = await adapter.connect(recordId);
      
      // Save the connection in the database
      const deviceConnection = await this.createDeviceConnection(
        recordId,
        deviceType,
        connection.deviceId
      );
      
      this.logger.log(`Successfully connected ${deviceType} to record ${recordId}`);
      return deviceConnection;
    } catch (error) {
      this.logger.error(
        `Failed to connect ${deviceType} to record ${recordId}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Retrieves health metrics from a wearable device for a specific user and date range.
   * @param recordId - The health record ID associated with the device
   * @param startDate - The start date for the metrics query
   * @param endDate - The end date for the metrics query
   * @param deviceType - The type of wearable device to retrieve metrics from
   * @returns A promise resolving to an array of HealthMetric entities
   */
  async getHealthMetrics(
    recordId: string,
    startDate: Date,
    endDate: Date,
    deviceType: string
  ): Promise<HealthMetric[]> {
    this.logger.log(
      `Retrieving health metrics for record ${recordId} from ${deviceType} ` +
      `between ${startDate.toISOString()} and ${endDate.toISOString()}`
    );
    
    // Validate the device type
    this.validateDeviceType(deviceType);
    
    try {
      // Verify the device connection exists
      const deviceConnection = await this.findDeviceConnection(recordId, deviceType);
      
      // Get the appropriate adapter for the device type
      const adapter = this.getAdapter(deviceType);
      
      // Retrieve health metrics using the adapter
      const metrics = await adapter.getHealthMetrics(recordId, startDate, endDate);
      
      // Update the last sync timestamp
      await this.prisma.deviceConnection.update({
        where: { 
          id: deviceConnection.id 
        },
        data: { 
          lastSync: new Date() 
        }
      });
      
      this.logger.log(`Successfully retrieved ${metrics.length} metrics for record ${recordId} from ${deviceType}`);
      return metrics;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve metrics for record ${recordId} from ${deviceType}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Disconnects a wearable device from a user's health profile.
   * @param recordId - The health record ID associated with the device
   * @param deviceType - The type of wearable device to disconnect
   * @returns A promise that resolves when the device has been disconnected
   */
  async disconnect(recordId: string, deviceType: string): Promise<void> {
    this.logger.log(`Disconnecting ${deviceType} from record ${recordId}`);
    
    // Validate the device type
    this.validateDeviceType(deviceType);
    
    try {
      // Verify the device connection exists
      const deviceConnection = await this.findDeviceConnection(recordId, deviceType);
      
      // Get the appropriate adapter for the device type
      const adapter = this.getAdapter(deviceType);
      
      // Disconnect the device using the adapter
      await adapter.disconnect(recordId);
      
      // Remove the device connection from the database
      await this.deleteDeviceConnection(recordId, deviceType);
      
      this.logger.log(`Successfully disconnected ${deviceType} from record ${recordId}`);
    } catch (error) {
      this.logger.error(
        `Failed to disconnect ${deviceType} from record ${recordId}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Validates the provided device type against the supported device types in the configuration.
   * @param deviceType - The device type to validate
   * @throws BadRequestException if the device type is not supported
   */
  validateDeviceType(deviceType: string): void {
    // Get the list of supported device types from the configuration
    const supportedDeviceTypes = this.configService.get('wearablesSupported')?.split(',') || [];
    
    if (!supportedDeviceTypes.includes(deviceType.toLowerCase())) {
      this.logger.warn(`Unsupported device type: ${deviceType}`);
      throw new BadRequestException(
        `Unsupported device type: ${deviceType}. Supported types are: ${supportedDeviceTypes.join(', ')}.`
      );
    }
  }

  /**
   * Returns the appropriate adapter for the given device type.
   * @param deviceType - The device type to get the adapter for
   * @returns The appropriate adapter for the given device type
   * @throws BadRequestException if the device type is not supported
   */
  getAdapter(deviceType: string): GoogleFitAdapter | HealthKitAdapter {
    const type = deviceType.toLowerCase();
    
    if (type === 'googlefit') {
      return this.googleFitAdapter;
    } else if (type === 'healthkit') {
      return this.healthKitAdapter;
    }
    
    throw new BadRequestException(`Unsupported device type: ${deviceType}`);
  }

  /**
   * Finds a device connection for a specific user and device type.
   * @param recordId - The health record ID to find the connection for
   * @param deviceType - The device type to find the connection for
   * @returns A promise resolving to the found DeviceConnection entity
   * @throws NotFoundException if no connection is found
   */
  async findDeviceConnection(recordId: string, deviceType: string): Promise<DeviceConnection> {
    const connection = await this.prisma.deviceConnection.findFirst({
      where: {
        recordId,
        deviceType: deviceType.toLowerCase()
      }
    });
    
    if (!connection) {
      throw new NotFoundException(
        `No ${deviceType} connection found for record ${recordId}`
      );
    }
    
    return connection as DeviceConnection;
  }

  /**
   * Creates a new device connection in the database.
   * @param recordId - The health record ID to create the connection for
   * @param deviceType - The device type to create the connection for
   * @param deviceId - The device ID to associate with the connection
   * @returns A promise resolving to the newly created DeviceConnection entity
   */
  async createDeviceConnection(
    recordId: string,
    deviceType: string,
    deviceId: string
  ): Promise<DeviceConnection> {
    const newConnection = await this.prisma.deviceConnection.create({
      data: {
        recordId,
        deviceType: deviceType.toLowerCase(),
        deviceId,
        status: 'connected',
        lastSync: new Date()
      }
    });
    
    return newConnection as DeviceConnection;
  }

  /**
   * Deletes a device connection from the database.
   * @param recordId - The health record ID associated with the connection
   * @param deviceType - The device type associated with the connection
   * @returns A promise that resolves when the device connection has been deleted
   */
  async deleteDeviceConnection(recordId: string, deviceType: string): Promise<void> {
    await this.prisma.deviceConnection.deleteMany({
      where: {
        recordId,
        deviceType: deviceType.toLowerCase()
      }
    });
    
    this.logger.log(`Deleted ${deviceType} connection for record ${recordId}`);
  }
}