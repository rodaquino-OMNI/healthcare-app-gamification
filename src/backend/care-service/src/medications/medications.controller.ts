import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { PhiAccess } from '@app/shared/audit';
import { AUTH_INSUFFICIENT_PERMISSIONS } from '@app/shared/constants/error-codes.constants';
import { ErrorType } from '@app/shared/exceptions/error.types';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { Service } from '@app/shared/interfaces/service.interface';
import { LoggerService } from '@app/shared/logging/logger.service';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    UseFilters,
    HttpCode,
    HttpStatus,
    Inject,
} from '@nestjs/common'; // v10.0.0+

import { CreateMedicationDto } from './dto/create-medication.dto';
import { Medication } from './entities/medication.entity';
import { MedicationsService } from './medications.service';

/**
 * Controller class for managing medications.
 */
@Controller('medications')
@UseGuards(JwtAuthGuard)
@UseFilters(AllExceptionsFilter)
export class MedicationsController {
    /**
     * Constructor for MedicationsController.
     * @param medicationsService The service for handling medication business logic
     * @param logger The logger service for logging operations
     */
    constructor(
        private readonly medicationsService: MedicationsService,
        private readonly logger: LoggerService
    ) {
        this.logger.log('MedicationsController initialized', 'MedicationsController');
    }

    /**
     * Creates a new medication.
     * @param createMedicationDto The data for creating the medication
     * @param req The request object containing the user information
     * @returns The created medication
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PhiAccess('Medication')
    async create(
        @Body() createMedicationDto: CreateMedicationDto,
        @CurrentUser('id') userId: string
    ): Promise<Medication> {
        this.logger.log(`Creating medication for user ${userId}`, 'MedicationsController');
        return this.medicationsService.create(createMedicationDto, userId);
    }

    /**
     * Retrieves all medications for the authenticated user.
     * @param req The request object containing the user information
     * @returns A list of medications
     */
    @Get()
    @PhiAccess('Medication')
    async findAll(@CurrentUser('id') userId: string): Promise<Medication[]> {
        this.logger.log(`Retrieving all medications for user ${userId}`, 'MedicationsController');
        return this.medicationsService.findAll({ where: { userId } }, { limit: 100 });
    }

    /**
     * Retrieves a medication by ID.
     * @param id The ID of the medication to retrieve
     * @param req The request object containing the user information
     * @returns The medication, if found
     */
    @Get(':id')
    @PhiAccess('Medication')
    async findOne(@Param('id') id: string, @CurrentUser('id') userId: string): Promise<Medication> {
        this.logger.log(`Retrieving medication ${id} for user ${userId}`, 'MedicationsController');
        const medication = await this.medicationsService.findOne(id);

        // Ensure user only accesses their own medications
        if (medication.userId !== userId) {
            this.logger.warn(
                `User ${userId} attempted to access medication ${id} belonging to user ${medication.userId}`,
                'MedicationsController'
            );
            throw new AppException(
                'You do not have permission to access this medication',
                ErrorType.BUSINESS,
                AUTH_INSUFFICIENT_PERMISSIONS
            );
        }

        return medication;
    }

    /**
     * Updates an existing medication.
     * @param id The ID of the medication to update
     * @param updateMedicationData The data to update the medication with
     * @param req The request object containing the user information
     * @returns The updated medication
     */
    @Put(':id')
    @PhiAccess('Medication')
    async update(
        @Param('id') id: string,
        @Body() updateMedicationData: Record<string, any>,
        @CurrentUser('id') userId: string
    ): Promise<Medication> {
        this.logger.log(`Updating medication ${id} for user ${userId}`, 'MedicationsController');
        const medication = await this.medicationsService.findOne(id);

        // Ensure user only updates their own medications
        if (medication.userId !== userId) {
            this.logger.warn(
                `User ${userId} attempted to update medication ${id} belonging to user ${medication.userId}`,
                'MedicationsController'
            );
            throw new AppException(
                'You do not have permission to update this medication',
                ErrorType.BUSINESS,
                AUTH_INSUFFICIENT_PERMISSIONS
            );
        }

        return this.medicationsService.update(id, updateMedicationData);
    }

    /**
     * Removes a medication by ID.
     * @param id The ID of the medication to remove
     * @param req The request object containing the user information
     */
    @Delete(':id')
    @PhiAccess('Medication')
    async remove(@Param('id') id: string, @CurrentUser('id') userId: string): Promise<void> {
        this.logger.log(`Deleting medication ${id} for user ${userId}`, 'MedicationsController');
        const medication = await this.medicationsService.findOne(id);

        // Ensure user only deletes their own medications
        if (medication.userId !== userId) {
            this.logger.warn(
                `User ${userId} attempted to delete medication ${id} belonging to user ${medication.userId}`,
                'MedicationsController'
            );
            throw new AppException(
                'You do not have permission to delete this medication',
                ErrorType.BUSINESS,
                AUTH_INSUFFICIENT_PERMISSIONS
            );
        }

        return this.medicationsService.remove(id);
    }
}
