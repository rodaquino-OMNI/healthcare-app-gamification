import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {
    @Get()
    check() {
        return {
            status: 'ok',
            service: 'health-service',
            timestamp: Date.now(),
        };
    }

    @Get('ready')
    ready() {
        return {
            status: 'ok',
            database: true,
            service: 'health-service',
        };
    }
}
