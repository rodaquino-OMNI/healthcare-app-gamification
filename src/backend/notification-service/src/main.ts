import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/shared/logging/logger.service';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  
  const port = configService.get<number>('notification.port', 3003);
  await app.listen(port);
  logger.log(`Notification service running on port: ${port}`);
}
bootstrap();