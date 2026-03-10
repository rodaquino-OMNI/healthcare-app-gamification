import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    check(): { status: string; service: string; timestamp: number } {
        return {
            status: 'ok',
            service: 'gamification-engine',
            timestamp: Date.now(),
        };
    }

    @Get('ready')
    ready(): { status: string; database: boolean; service: string } {
        return {
            status: 'ok',
            database: true,
            service: 'gamification-engine',
        };
    }
}
