import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    check(): { status: string; service: string; timestamp: number } {
        return {
            status: 'ok',
            service: 'api-gateway',
            timestamp: Date.now(),
        };
    }

    @Get('ready')
    ready(): { status: string; database: boolean; service: string } {
        return {
            status: 'ok',
            database: true,
            service: 'api-gateway',
        };
    }
}
