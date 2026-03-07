/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorType } from '@app/shared/exceptions/error.types';
import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, HttpStatus, Logger } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@nestjs/jwt';

import { SearchProvidersDto } from './dto/search-providers.dto';
import { Provider } from './entities/provider.entity';
import { ProvidersService } from './providers.service';
import { CurrentUser } from '../../../auth-service/src/auth/decorators/current-user.decorator';
import { Roles } from '../../../auth-service/src/auth/decorators/roles.decorator';
import { PaginationDto } from '../../../shared/src/dto/pagination.dto';
import { AppException, ErrorType } from '../../../shared/src/exceptions/exceptions.types';

/**
 * Controller for managing healthcare provider-related endpoints in the Care Now journey.
 */
@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
    private readonly logger = new Logger(ProvidersController.name);

    /**
     * Initializes the ProvidersController with required dependencies.
     *
     * @param providersService Service for managing provider data and operations
     */
    constructor(private readonly providersService: ProvidersService) {}

    /**
     * Retrieves a list of providers based on search criteria and pagination options.
     *
     * @param searchDto Search criteria for filtering providers
     * @param paginationDto Pagination options
     * @returns List of providers and total count
     */
    @Get()
    @Roles('user', 'provider', 'admin')
    async findAll(
        @Query() searchDto: SearchProvidersDto,
        @Query() paginationDto: PaginationDto
    ): Promise<{ providers: Provider[]; total: number }> {
        this.logger.log(`Finding providers with search criteria: ${JSON.stringify(searchDto)}`);
        return this.providersService.findAll(searchDto, paginationDto);
    }

    /**
     * Searches for providers that offer telemedicine services.
     *
     * @param paginationDto Pagination options
     * @returns List of telemedicine providers and total count
     */
    @Get('telemedicine')
    @Roles('user', 'provider', 'admin')
    async getTelemedicineProviders(
        @Query() paginationDto: PaginationDto
    ): Promise<{ providers: Provider[]; total: number }> {
        this.logger.log('Getting providers with telemedicine capabilities');
        return this.providersService.getTelemedicineProviders(paginationDto);
    }

    /**
     * Searches for providers by medical specialty.
     *
     * @param specialty Specialty to search for
     * @param paginationDto Pagination options
     * @returns List of providers and total count
     */
    @Get('specialty/:specialty')
    @Roles('user', 'provider', 'admin')
    async searchBySpecialty(
        @Param('specialty') specialty: string,
        @Query() paginationDto: PaginationDto
    ): Promise<{ providers: Provider[]; total: number }> {
        this.logger.log(`Searching providers by specialty: ${specialty}`);
        return this.providersService.searchBySpecialty(specialty, paginationDto);
    }

    /**
     * Searches for providers by location.
     *
     * @param location Location to search for
     * @param paginationDto Pagination options
     * @returns List of providers and total count
     */
    @Get('location/:location')
    @Roles('user', 'provider', 'admin')
    async searchByLocation(
        @Param('location') location: string,
        @Query() paginationDto: PaginationDto
    ): Promise<{ providers: Provider[]; total: number }> {
        this.logger.log(`Searching providers by location: ${location}`);
        return this.providersService.searchByLocation(location, paginationDto);
    }

    /**
     * Retrieves a provider by their unique identifier.
     *
     * @param id Provider ID
     * @returns The provider if found
     */
    @Get(':id')
    @Roles('user', 'provider', 'admin')
    async findById(@Param('id') id: string): Promise<Provider> {
        this.logger.log(`Finding provider with ID: ${id}`);
        return this.providersService.findById(id);
    }

    /**
     * Checks a provider's availability for a specific date and time.
     *
     * @param id Provider ID
     * @param dateTime Date and time to check availability (ISO string)
     * @returns Availability status
     */
    @Get(':id/availability')
    @Roles('user', 'provider', 'admin')
    async checkAvailability(
        @Param('id') id: string,
        @Query('dateTime') dateTime: string
    ): Promise<{ available: boolean }> {
        this.logger.log(`Checking availability for provider ID: ${id} at ${dateTime}`);

        try {
            const date = new Date(dateTime);
            if (isNaN(date.getTime())) {
                throw new AppException('Invalid date format', ErrorType.VALIDATION, 'CARE_019', { dateTime });
            }

            const available = await this.providersService.checkAvailability(id, date);
            return { available };
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Error checking availability: ${(error as any).message}`, (error as any).stack);
            throw new AppException(
                'Failed to check provider availability',
                ErrorType.TECHNICAL,
                'CARE_020',
                { id, dateTime },
                error
            );
        }
    }

    /**
     * Retrieves available time slots for a provider on a specific date.
     *
     * @param id Provider ID
     * @param date Date to check availability (ISO string)
     * @returns List of time slots with availability
     */
    @Get(':id/time-slots')
    @Roles('user', 'provider', 'admin')
    async getAvailableTimeSlots(
        @Param('id') id: string,
        @Query('date') date: string
    ): Promise<{ timeSlots: { time: string; available: boolean }[] }> {
        this.logger.log(`Getting available time slots for provider ID: ${id} on ${date}`);

        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                throw new AppException('Invalid date format', ErrorType.VALIDATION, 'CARE_021', { date });
            }

            const timeSlots = await this.providersService.getAvailableTimeSlots(id, dateObj);
            return { timeSlots };
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Error getting time slots: ${(error as any).message}`, (error as any).stack);
            throw new AppException(
                'Failed to get provider time slots',
                ErrorType.TECHNICAL,
                'CARE_022',
                { id, date },
                error
            );
        }
    }

    /**
     * Creates a new provider in the system.
     *
     * @param providerData Provider data
     * @param user Current user (admin)
     * @returns The newly created provider
     */
    @Post()
    @Roles('admin')
    async create(@Body() providerData: Provider, @CurrentUser() user: any): Promise<Provider> {
        this.logger.log(`Creating provider: ${JSON.stringify(providerData)}`);
        return this.providersService.create(providerData);
    }

    /**
     * Updates an existing provider's information.
     *
     * @param id Provider ID
     * @param providerData Updated provider data
     * @param user Current user (admin)
     * @returns The updated provider
     */
    @Put(':id')
    @Roles('admin')
    async update(@Param('id') id: string, @Body() providerData: Provider, @CurrentUser() user: any): Promise<Provider> {
        this.logger.log(`Updating provider with ID: ${id}`);
        return this.providersService.update(id, providerData);
    }

    /**
     * Removes a provider from the system.
     *
     * @param id Provider ID
     * @param user Current user (admin)
     * @returns Success status of the deletion
     */
    @Delete(':id')
    @Roles('admin')
    async delete(@Param('id') id: string, @CurrentUser() user: any): Promise<{ success: boolean }> {
        this.logger.log(`Deleting provider with ID: ${id}`);
        const success = await this.providersService.delete(id);
        return { success };
    }
}
