import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TelemedicineService } from './telemedicine.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from 'src/backend/auth-service/src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/backend/auth-service/src/auth/decorators/current-user.decorator';
import { AppException, ErrorType } from 'src/backend/shared/src/exceptions/exceptions.types';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { CARE_TELEMEDICINE_CONNECTION_FAILED } from 'src/backend/shared/src/constants/error-codes.constants';

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
  async startTelemedicineSession(
    @Body() createSessionDto: CreateSessionDto
  ): Promise<any> {
    try {
      // Call the telemedicine service to start a new session
      const session = await this.telemedicineService.startTelemedicineSession(createSessionDto);
      
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
      
      this.logger.error(
        `Failed to start telemedicine session: ${error.message}`,
        error.stack,
        'TelemedicineController'
      );
      
      // Wrap other errors
      throw new AppException(
        'Failed to start telemedicine session',
        ErrorType.TECHNICAL,
        CARE_TELEMEDICINE_CONNECTION_FAILED,
        { dto: createSessionDto },
        error
      );
    }
  }
}