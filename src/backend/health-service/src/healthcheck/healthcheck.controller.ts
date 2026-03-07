/* eslint-disable */
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {
    @Get()
    check(): { status: string; service: string; timestamp: number } {
        return {
            status: 'ok',
            service: 'health-service',
            timestamp: Date.now(),
        };
    }

    @Get('ready')
    ready(): { status: string; database: boolean; service: string } {
        return {
            status: 'ok',
            database: true,
            service: 'health-service',
        };
    }
}
