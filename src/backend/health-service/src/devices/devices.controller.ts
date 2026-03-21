import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'; // NestJS Common 9.0.0+
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DevicesService } from './devices.service';
import { ConnectDeviceDto } from './dto/connect-device.dto';
import { DeviceConnection } from './entities/device-connection.entity';
import { FilterDto } from '../../../shared/src/dto/filter.dto';

/**
 * Handles incoming HTTP requests related to device connections,
 * providing endpoints for connecting new devices and retrieving
 * existing device connections for a user.
 */
@ApiTags('devices')
@Controller('records/:recordId/devices')
export class DevicesController {
    /**
     * Initializes the DevicesController.
     *
     * @param devicesService - Service that handles the business logic for device connections
     */
    constructor(private readonly devicesService: DevicesService) {}

    /**
     * Connects a new wearable device to a user's health profile.
     * Addresses F-101-RQ-004: Wearable Device Integration
     *
     * @param recordId - ID of the health record to connect the device to
     * @param connectDeviceDto - Data for connecting the device
     * @returns The newly created DeviceConnection entity.
     */
    @Post()
    @ApiOperation({ summary: 'Connect a wearable device to a health record' })
    @ApiResponse({ status: 201, description: 'Device connected successfully' })
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async connectDevice(
        @Param('recordId') recordId: string,
        @Body() connectDeviceDto: ConnectDeviceDto
    ): Promise<DeviceConnection> {
        return this.devicesService.connectDevice(recordId, connectDeviceDto);
    }

    /**
     * Retrieves all connected devices for a given user record.
     * Part of F-101-RQ-004: Wearable Device Integration
     *
     * @param recordId - ID of the health record to get devices for
     * @param filterDto - Optional filtering criteria
     * @returns A promise that resolves to an array of DeviceConnection entities.
     */
    @Get()
    @ApiOperation({ summary: 'Get all connected devices for a health record' })
    @ApiResponse({ status: 200, description: 'Returns list of connected devices' })
    async getDevices(
        @Param('recordId') recordId: string,
        @Query() filterDto: FilterDto
    ): Promise<DeviceConnection[]> {
        return this.devicesService.getDevices(recordId, filterDto);
    }
}
