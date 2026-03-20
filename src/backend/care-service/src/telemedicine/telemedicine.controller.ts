import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { PhiAccess } from '@app/shared/audit';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateSessionDto } from './dto/create-session.dto';
import { TelemedicineSession } from './entities/telemedicine-session.entity';
import { TelemedicineService } from './telemedicine.service';

/**
 * Controller for handling telemedicine session requests.
 */
@Controller('telemedicine')
export class TelemedicineController {
    /**
     * Initializes the TelemedicineController with required dependencies.
     *
     * @param telemedicineService - Service for handling telemedicine operations
     * @param logger - Service for structured logging
     */
    constructor(
        private readonly telemedicineService: TelemedicineService,
        private readonly logger: LoggerService
    ) {}

    /**
     * Starts a new telemedicine session.
     *
     * @param createSessionDto - Data required to create a telemedicine session
     * @returns The result of the telemedicine session creation.
     */
    @Post('session')
    @UseGuards(JwtAuthGuard)
    @PhiAccess('TelemedicineSession')
    @UsePipes(ValidationPipe)
    async startTelemedicineSession(
        @Body() createSessionDto: CreateSessionDto
    ): Promise<TelemedicineSession> {
        try {
            // Call the telemedicine service to start a new session
            const session =
                await this.telemedicineService.startTelemedicineSession(createSessionDto);

            this.logger.log(
                `Telemedicine session started: ${session.id}`,
                'TelemedicineController'
            );

            // Return the result of the session creation
            return session;
        } catch (error) {
            // If it's already an AppException, just rethrow
            if (error instanceof AppException) {
                throw error;
            }

            const err = error instanceof Error ? error : new Error(String(error));
            this.logger.error(
                `Failed to start telemedicine session: ${err.message}`,
                err.stack,
                'TelemedicineController'
            );

            // Wrap other errors
            throw new AppException(
                'Failed to start telemedicine session',
                ErrorType.TECHNICAL,
                'CARE_TELEMEDICINE_CONNECTION_FAILED',
                { dto: createSessionDto }
            );
        }
    }
}
