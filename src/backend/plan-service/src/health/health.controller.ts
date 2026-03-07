/* eslint-disable */
import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
    status: string;
    service: string;
    timestamp?: number;
    database?: boolean;
}

@Controller('health')
export class HealthController {
    @Get()
    check(): HealthResponse {
        return {
            status: 'ok',
            service: 'plan-service',
            timestamp: Date.now(),
        };
    }

    @Get('ready')
    ready(): HealthResponse {
        return {
            status: 'ok',
            database: true,
            service: 'plan-service',
        };
    }
}
