import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: Date.now(),
    };
  }

  @Get('ready')
  ready() {
    return {
      status: 'ok',
      database: true,
      service: 'api-gateway',
    };
  }
}
