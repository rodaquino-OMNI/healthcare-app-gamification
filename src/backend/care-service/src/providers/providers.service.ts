/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';

import { SearchProvidersDto } from './dto/search-providers.dto';
import { Provider } from './entities/provider.entity';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { PaginationDto } from '../../../shared/src/dto/pagination.dto';
import { AppException, ErrorType } from '../../../shared/src/exceptions/exceptions.types';

/**
 * Service responsible for managing healthcare providers, including search,
 * availability checking, and provider data management.
 */
@Injectable()
export class ProvidersService {
    private readonly logger = new Logger(ProvidersService.name);

    /**
     * Initializes the ProvidersService with required dependencies.
     *
     * @param prisma Database service for provider data access
     */
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Retrieves a list of providers based on search criteria and pagination options.
     *
     * @param searchDto Search criteria for filtering providers
     * @param paginationDto Pagination options
     * @returns List of providers and total count
     */
    async findAll(
        searchDto: SearchProvidersDto,
        paginationDto: PaginationDto
    ): Promise<{ providers: Provider[]; total: number }> {
        try {
            const { page = 1, limit = 10 } = paginationDto;
            const skip = (page - 1) * limit;

            // Build filter based on search criteria
            const where: Record<string, any> = {};

            if (searchDto.specialty) {
                where.specialty = {
                    contains: searchDto.specialty,
                    mode: 'insensitive',
                };
            }

            if (searchDto.location) {
                where.location = {
                    contains: searchDto.location,
                    mode: 'insensitive',
                };
            }

            if (searchDto.name) {
                where.name = {
                    contains: searchDto.name,
                    mode: 'insensitive',
                };
            }

            // Apply custom where conditions if provided
            if (searchDto.where) {
                Object.assign(where, searchDto.where);
            }

            // Query providers with pagination
            const providers = await this.prisma.provider.findMany({
                where,
                skip,
                take: limit,
                orderBy: (searchDto.orderBy as any) || { name: 'asc' },
            });

            // Count total for pagination
            const total = await this.prisma.provider.count({ where });

            return { providers, total };
        } catch (error) {
            this.logger.error(`Failed to find providers: ${(error as any).message}`, (error as any).stack);
            throw new AppException('Failed to retrieve providers', ErrorType.TECHNICAL, 'CARE_004', {
                searchDto,
                paginationDto,
            });
        }
    }

    /**
     * Retrieves a provider by their unique identifier.
     *
     * @param id Provider ID
     * @returns The provider if found
     */
    async findById(id: string): Promise<Provider> {
        try {
            const provider = await this.prisma.provider.findUnique({
                where: { id },
            });

            if (!provider) {
                throw new AppException(`Provider with ID ${id} not found`, ErrorType.BUSINESS, 'CARE_005', { id });
            }

            return provider;
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Failed to find provider: ${(error as any).message}`, (error as any).stack);
            throw new AppException(`Failed to retrieve provider with ID ${id}`, ErrorType.TECHNICAL, 'CARE_006', {
                id,
            });
        }
    }

    /**
     * Creates a new provider in the system.
     *
     * @param providerData Provider data without ID
     * @returns The newly created provider
     */
    async create(providerData: Omit<Provider, 'id'>): Promise<Provider> {
        try {
            // Validate provider data
            this.validateProviderData(providerData);

            // Create provider
            const provider = await this.prisma.provider.create({
                data: providerData,
            });

            this.logger.log(`Provider created: ${provider.id}`);
            return provider;
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Failed to create provider: ${(error as any).message}`, (error as any).stack);
            throw new AppException('Failed to create provider', ErrorType.TECHNICAL, 'CARE_007', { providerData });
        }
    }

    /**
     * Updates an existing provider's information.
     *
     * @param id Provider ID
     * @param providerData Updated provider data
     * @returns The updated provider
     */
    async update(id: string, providerData: Partial<Provider>): Promise<Provider> {
        try {
            // Check if provider exists
            await this.findById(id);

            // Update provider
            const updatedProvider = await this.prisma.provider.update({
                where: { id },
                data: providerData,
            });

            this.logger.log(`Provider updated: ${id}`);
            return updatedProvider;
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Failed to update provider: ${(error as any).message}`, (error as any).stack);
            throw new AppException(`Failed to update provider with ID ${id}`, ErrorType.TECHNICAL, 'CARE_008', {
                id,
                providerData,
            });
        }
    }

    /**
     * Removes a provider from the system.
     *
     * @param id Provider ID
     * @returns True if deletion was successful
     */
    async delete(id: string): Promise<boolean> {
        try {
            // Check if provider exists
            await this.findById(id);

            // Check if provider has any active appointments
            const activeAppointments = await (this.prisma as any).appointment.count({
                where: {
                    providerId: id,
                    status: {
                        in: ['SCHEDULED', 'CONFIRMED'],
                    },
                },
            });

            if (activeAppointments > 0) {
                throw new AppException(
                    `Cannot delete provider with ID ${id} due to ${activeAppointments} active appointments`,
                    ErrorType.BUSINESS,
                    'CARE_009',
                    { id, activeAppointments }
                );
            }

            // Delete provider
            await this.prisma.provider.delete({
                where: { id },
            });

            this.logger.log(`Provider deleted: ${id}`);
            return true;
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Failed to delete provider: ${(error as any).message}`, (error as any).stack);
            throw new AppException(`Failed to delete provider with ID ${id}`, ErrorType.TECHNICAL, 'CARE_010', { id });
        }
    }

    /**
     * Checks a provider's availability for a specific date and time.
     *
     * @param providerId Provider ID
     * @param dateTime Date and time to check availability
     * @returns True if the provider is available
     */
    async checkAvailability(providerId: string, dateTime: Date): Promise<boolean> {
        try {
            // Check if provider exists
            await this.findById(providerId);

            // Check for existing appointments at the requested time
            const existingAppointment = await (this.prisma as any).appointment.findFirst({
                where: {
                    providerId,
                    dateTime: {
                        // Check for appointments that overlap with the requested time
                        // (assuming appointments are 1 hour long)
                        gte: new Date(dateTime.getTime() - 30 * 60000), // 30 minutes before
                        lte: new Date(dateTime.getTime() + 30 * 60000), // 30 minutes after
                    },
                    status: {
                        in: ['SCHEDULED', 'CONFIRMED'],
                    },
                },
            });

            // Provider is available if no appointments exist at the requested time
            return !existingAppointment;
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Failed to check provider availability: ${(error as any).message}`, (error as any).stack);
            throw new AppException(
                `Failed to check availability for provider with ID ${providerId}`,
                ErrorType.TECHNICAL,
                'CARE_011',
                { providerId, dateTime }
            );
        }
    }

    /**
     * Retrieves available time slots for a provider on a specific date.
     *
     * @param providerId Provider ID
     * @param date Date to check availability
     * @returns List of time slots with availability status
     */
    // eslint-disable-next-line max-len
    async getAvailableTimeSlots(providerId: string, date: Date): Promise<{ time: string; available: boolean }[]> {
        try {
            // Check if provider exists
            await this.findById(providerId);

            // Generate all possible time slots for the day (9AM to 5PM, 1-hour slots)
            const timeSlots: { time: string; available: boolean }[] = [];
            const startHour = 9; // 9 AM
            const endHour = 17; // 5 PM

            date.setHours(0, 0, 0, 0); // Reset time to start of day
            const dateStart = new Date(date);
            const dateEnd = new Date(date);
            dateEnd.setDate(dateEnd.getDate() + 1); // Next day

            // Get all appointments for the provider on the specified day
            const appointments = await (this.prisma as any).appointment.findMany({
                where: {
                    providerId,
                    dateTime: {
                        gte: dateStart,
                        lt: dateEnd,
                    },
                    status: {
                        in: ['SCHEDULED', 'CONFIRMED'],
                    },
                },
            });

            // Generate hourly time slots
            for (let hour = startHour; hour < endHour; hour++) {
                const slotTime = new Date(date);
                slotTime.setHours(hour);

                const timeString = slotTime.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                });

                // Check if there's an appointment at this time slot
                const isBooked = appointments.some((appointment: any) => {
                    const apptHour = appointment.dateTime.getHours();
                    return apptHour === hour;
                });

                timeSlots.push({
                    time: timeString,
                    available: !isBooked,
                });
            }

            return timeSlots;
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(`Failed to get provider time slots: ${(error as any).message}`, (error as any).stack);
            throw new AppException(
                `Failed to retrieve time slots for provider with ID ${providerId}`,
                ErrorType.TECHNICAL,
                'CARE_012',
                { providerId, date }
            );
        }
    }

    /**
     * Searches for providers by medical specialty.
     *
     * @param specialty Specialty to search for
     * @param paginationDto Pagination options
     * @returns List of providers and total count
     */
    async searchBySpecialty(
        specialty: string,
        paginationDto: PaginationDto
    ): Promise<{ providers: Provider[]; total: number }> {
        const searchDto: SearchProvidersDto = { specialty };
        return this.findAll(searchDto, paginationDto);
    }

    /**
     * Searches for providers by location.
     *
     * @param location Location to search for
     * @param paginationDto Pagination options
     * @returns List of providers and total count
     */
    async searchByLocation(
        location: string,
        paginationDto: PaginationDto
    ): Promise<{ providers: Provider[]; total: number }> {
        const searchDto: SearchProvidersDto = { location };
        return this.findAll(searchDto, paginationDto);
    }

    /**
     * Retrieves providers that offer telemedicine services.
     *
     * @param paginationDto Pagination options
     * @returns List of telemedicine providers and total count
     */
    // eslint-disable-next-line max-len
    async getTelemedicineProviders(paginationDto: PaginationDto): Promise<{ providers: Provider[]; total: number }> {
        try {
            const { page = 1, limit = 10 } = paginationDto;
            const skip = (page - 1) * limit;

            // Query providers that offer telemedicine
            const providers = await this.prisma.provider.findMany({
                where: {
                    telemedicineAvailable: true,
                },
                skip,
                take: limit,
                orderBy: {
                    name: 'asc',
                },
            });

            // Count total for pagination
            const total = await this.prisma.provider.count({
                where: {
                    telemedicineAvailable: true,
                },
            });

            return { providers, total };
        } catch (error) {
            this.logger.error(`Failed to find telemedicine providers: ${(error as any).message}`, (error as any).stack);
            throw new AppException('Failed to retrieve telemedicine providers', ErrorType.TECHNICAL, 'CARE_013', {
                paginationDto,
            });
        }
    }

    /**
     * Validates provider data for creation or update.
     *
     * @param providerData Provider data to validate
     * @private
     */
    private validateProviderData(providerData: Partial<Provider>): void {
        // Check required fields
        if (!providerData.name) {
            throw new AppException('Provider name is required', ErrorType.VALIDATION, 'CARE_014', { providerData });
        }

        if (!providerData.specialty) {
            throw new AppException('Provider specialty is required', ErrorType.VALIDATION, 'CARE_015', {
                providerData,
            });
        }

        if (!providerData.location) {
            throw new AppException('Provider location is required', ErrorType.VALIDATION, 'CARE_016', { providerData });
        }

        // Validate email format
        if (providerData.email && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(providerData.email)) {
            throw new AppException('Invalid email format', ErrorType.VALIDATION, 'CARE_017', {
                email: providerData.email,
            });
        }

        // Validate phone format (simple validation)
        if (providerData.phone && !/^\+?[0-9\s()-]{8,20}$/.test(providerData.phone)) {
            throw new AppException('Invalid phone number format', ErrorType.VALIDATION, 'CARE_018', {
                phone: providerData.phone,
            });
        }
    }
}
