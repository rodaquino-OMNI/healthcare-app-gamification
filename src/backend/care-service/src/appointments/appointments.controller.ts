import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/auth/auth/guards/roles.guard';
import { PhiAccess } from '@app/shared/audit';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginatedResponse } from '@app/shared/dto/pagination.dto';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    UseFilters,
    HttpCode,
    HttpStatus,
    Query,
    Patch,
} from '@nestjs/common'; // v10.0.0+

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

/**
 * Handles incoming requests related to appointments.
 * Uses AppointmentsService for business logic and authentication middleware
 * for proper access control.
 */
@Controller('appointments')
@UseFilters(AllExceptionsFilter)
export class AppointmentsController {
    /**
     * Initializes the AppointmentsController.
     * @param appointmentsService The service responsible for appointment-related business logic.
     */
    constructor(private readonly appointmentsService: AppointmentsService) {}

    /**
     * Creates a new appointment.
     * @param createAppointmentDto Data transfer object containing appointment information.
     * @returns The newly created appointment.
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @PhiAccess('Appointment')
    async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        return this.appointmentsService.create(createAppointmentDto);
    }

    /**
     * Retrieves all appointments based on optional filters and pagination.
     * @param query Query parameters for filtering and pagination.
     * @returns A list of appointments.
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @PhiAccess('Appointment')
    async findAll(@Query() query: FilterDto): Promise<PaginatedResponse<Appointment>> {
        return this.appointmentsService.findAll(query);
    }

    /**
     * Retrieves a single appointment by ID.
     * @param id The ID of the appointment to retrieve.
     * @returns The requested appointment.
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @PhiAccess('Appointment')
    async findOne(@Param('id') id: string): Promise<Appointment | null> {
        return this.appointmentsService.findById(id);
    }

    /**
     * Updates an existing appointment.
     * @param id The ID of the appointment to update.
     * @param updateAppointmentDto Data transfer object containing updated appointment information.
     * @returns The updated appointment.
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @PhiAccess('Appointment')
    async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    /**
     * Deletes an appointment.
     * @param id The ID of the appointment to delete.
     * @returns A promise that resolves when the appointment is deleted.
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @PhiAccess('Appointment')
    async remove(@Param('id') id: string): Promise<void> {
        await this.appointmentsService.delete(id);
    }
}
