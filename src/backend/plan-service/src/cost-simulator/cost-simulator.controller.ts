import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseFilters,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'; // @nestjs/swagger ^6.0.0
import { JwtAuthGuard, RolesGuard } from '@nestjs/passport'; // @nestjs/passport ^10.0.0
import { Roles, Role } from '@nestjs/common'; // @nestjs/common 10.0.0+

import { CostSimulatorService } from './cost-simulator.service';
import { SimulateCostDto } from './dto/simulate-cost.dto';
import { ErrorCodes } from 'src/backend/shared/src/constants/error-codes.constants';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';

/**
 * Controller for the cost simulator feature.
 */
@Controller('cost-simulator')
@ApiTags('Cost Simulator')
export class CostSimulatorController {
  /**
   * Initializes the CostSimulatorController.
   * @param costSimulatorService Inject CostSimulatorService for cost simulation logic.
   */
  constructor(private readonly costSimulatorService: CostSimulatorService) {}

  /**
   * Simulates the cost of a healthcare procedure.
   * @param simulateCostDto The DTO containing simulation request data
   * @returns The estimated cost of the procedure.
   */
  @Post('simulate')
  @ApiOperation({ summary: 'Simulate cost of a procedure' })
  @ApiOkResponse({ description: 'Successfully simulated cost.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @HttpCode(HttpStatus.OK)
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  simulateCost(@Body() simulateCostDto: SimulateCostDto): Promise<number> {
    return this.costSimulatorService.simulateCost(simulateCostDto);
  }
}