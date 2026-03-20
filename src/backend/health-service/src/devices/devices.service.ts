import { HttpStatus, Injectable } from '@nestjs/common';

import { ConnectDeviceDto } from './dto/connect-device.dto';
import { DeviceConnection } from './entities/device-connection.entity';
import { FilterDto } from '../../../shared/src/dto/filter.dto';
import { AppException, ErrorType } from '../../../shared/src/exceptions/exceptions.types';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { WearablesService } from '../integrations/wearables/wearables.service';

/**
 * Handles the business logic for connecting, retrieving, and managing wearable devices
 * associated with user health records. It orchestrates interactions with different
 * wearable APIs and ensures data consistency.
 */
@Injectable()
export class DevicesService {
    private logger: LoggerService;

    /**
     * Initializes the DevicesService.
     *
     * @param logger - Logger service for device-related operations
     * @param wearablesService - Service for interacting with wearable device APIs
     */
    constructor(
        private readonly loggerService: LoggerService,
        private readonly wearablesService: WearablesService
    ) {
        this.logger = this.loggerService.createLogger('DevicesService');
    }

    /**
     * Connects a new wearable device to a user's health profile.
     *
     * @param recordId - ID of the health record to connect the device to
     * @param connectDeviceDto - Data for connecting the device
     * @returns The newly created DeviceConnection entity.
     */
    async connectDevice(
        recordId: string,
        connectDeviceDto: ConnectDeviceDto
    ): Promise<DeviceConnection> {
        try {
            this.logger.log(
                `Connecting device ${connectDeviceDto.deviceType} for record ${recordId}`
            );

            // Validates the device type
            // This is already handled by class-validator in the DTO,
            // but we could add additional validation here

            // Convert the deviceType enum to a string format
            // that the WearablesService expects
            const deviceType = String(connectDeviceDto.deviceType).toLowerCase();

            // Calls the appropriate adapter to connect
            /* eslint-disable @typescript-eslint/no-explicit-any,
               @typescript-eslint/no-unsafe-assignment,
               @typescript-eslint/no-unsafe-call,
               @typescript-eslint/no-unsafe-member-access
               -- WearablesService.connect not exposed */
            const deviceConnection: DeviceConnection = await (this.wearablesService as any).connect(
                recordId,
                deviceType
            );
            /* eslint-enable @typescript-eslint/no-explicit-any,
               @typescript-eslint/no-unsafe-assignment,
               @typescript-eslint/no-unsafe-call,
               @typescript-eslint/no-unsafe-member-access */

            this.logger.log(
                `Successfully connected device ` +
                    `${connectDeviceDto.deviceType} ` +
                    `for record ${recordId}`
            );

            return deviceConnection;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            const errStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to connect device ${connectDeviceDto.deviceType} for record ${recordId}: ${errMsg}`,
                errStack
            );

            throw new AppException(
                `Failed to connect device: ${errMsg}`,
                ErrorType.TECHNICAL,
                'HEALTH_DEVICE_CONNECTION_FAILED',
                {
                    deviceType: connectDeviceDto.deviceType,
                    recordId,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Retrieves all connected devices for a given user record.
     *
     * @param recordId - ID of the health record to get devices for
     * @param filterDto - Optional filtering criteria
     * @returns A promise that resolves to an array of DeviceConnection entities.
     */
    // eslint-disable-next-line @typescript-eslint/require-await -- placeholder for future DB call
    async getDevices(recordId: string, filterDto?: FilterDto): Promise<DeviceConnection[]> {
        try {
            this.logger.log(`Retrieving connected devices for record ${recordId}`);

            // Create a filter that includes the record ID (reserved for repository use)
            const _filter: FilterDto = {
                where: {
                    recordId,
                    ...(filterDto?.where || {}),
                },
                orderBy: filterDto?.orderBy || { lastSync: 'DESC' as const },
                ...filterDto,
            };

            // Retrieves all connected devices for a given user record from the database
            // Note: In a complete implementation, this would use a repository or database client
            // to fetch the devices. Since the implementation details were not provided in the spec,
            // we return an empty array as a placeholder.
            const deviceConnections: DeviceConnection[] = [];

            this.logger.log(`Retrieved ${deviceConnections.length} devices for record ${recordId}`);

            return deviceConnections;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            const errStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to retrieve devices for record ${recordId}: ${errMsg}`,
                errStack
            );

            throw new AppException(
                `Failed to retrieve devices: ${errMsg}`,
                ErrorType.TECHNICAL,
                'SYS_INTERNAL_SERVER_ERROR',
                {
                    recordId,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
