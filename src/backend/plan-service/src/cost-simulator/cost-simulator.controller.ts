/* eslint-disable */
import {
    Controller,
    Post,
    Body,
    UseGuards,
    UseFilters,
    HttpStatus,
    SetMetadata,
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    Catch,
    ArgumentsHost,
    ExceptionFilter,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Correct import
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CostSimulatorService } from './cost-simulator.service';
import { SimulateCostDto } from './dto/simulate-cost.dto';

// Custom decorator for roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Simple mock guard for roles - replace with actual implementation when available
@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(_context: ExecutionContext): boolean {
        return true; // Mock implementation
    }
}

interface ResponseWithStatus {
    status: (code: number) => { json: (body: unknown) => void };
}
interface RequestWithUrl {
    url: string;
}

// Simple exception filter - replace with actual implementation when available
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<ResponseWithStatus>();
        const request = ctx.getRequest<RequestWithUrl>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: exception instanceof Error ? exception.message : String(exception),
        });
    }
}

/**
 * Controller for cost simulation functionality
 */
@ApiTags('Cost Simulator')
@Controller('cost-simulator')
@UseFilters(AllExceptionsFilter)
export class CostSimulatorController {
    constructor(private readonly costSimulatorService: CostSimulatorService) {}

    /**
     * Simulates the cost of a medical procedure based on plan coverage
     */
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user', 'admin')
    @ApiOperation({ summary: 'Simulate cost of a medical procedure' })
    @ApiResponse({ status: 201, description: 'Cost simulation completed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'Plan not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async simulateCost(@Body() simulateCostDto: SimulateCostDto): Promise<unknown> {
        return this.costSimulatorService.simulateCost(simulateCostDto);
    }
}
