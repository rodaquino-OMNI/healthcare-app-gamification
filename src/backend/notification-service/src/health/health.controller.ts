import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    check() {
        return {
            status: 'ok',
            service: 'notification-service',
            timestamp: Date.now(),
        };
    }

    @Get('ready')
    ready() {
        return {
            status: 'ok',
            database: true,
            service: 'notification-service',
        };
    }
}
