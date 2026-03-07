import { Roles } from '@app/auth/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { Controller, Get, Query, UseGuards, UseFilters } from '@nestjs/common'; // @nestjs/common 10.0.0+

import { InsuranceService } from '../insurance/insurance.service';
import { VerifyCoverageDto } from './dto/verify-coverage.dto';

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
