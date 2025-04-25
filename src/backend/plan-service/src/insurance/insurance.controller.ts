import { Controller, Get, Query, UseGuards, UseFilters } from '@nestjs/common'; // @nestjs/common 10.0.0+
import { InsuranceService } from '../insurance/insurance.service';
import { VerifyCoverageDto } from './dto/verify-coverage.dto';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';
import { JwtAuthGuard } from 'src/backend/auth-service/src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/backend/auth-service/src/auth/decorators/roles.decorator';

/**
 * Handles incoming HTTP requests related to insurance operations.
 */
@Controller('insurance')
export class InsuranceController {
  /**
   * Initializes the InsuranceController.
   * @param insuranceService Service for handling insurance-related business logic
   */
  constructor(private readonly insuranceService: InsuranceService) {}

  /**
   * Verifies if a procedure is covered by the user's insurance plan.
   * Implements requirement F-103-RQ-001 - Display detailed insurance coverage information
   * 
   * @param verifyCoverageDto The DTO containing verification request data
   * @returns A boolean indicating whether the procedure is covered
   */
  @Get('coverage')
  @UseGuards(JwtAuthGuard)
  @UseFilters(AllExceptionsFilter)
  async verifyCoverage(@Query() verifyCoverageDto: VerifyCoverageDto): Promise<boolean> {
    return this.insuranceService.verifyCoverage(verifyCoverageDto);
  }
}