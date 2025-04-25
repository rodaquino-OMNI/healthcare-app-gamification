import { NestFactory } from '@nestjs/core'; // @nestjs/core v10.0.0+
import { AppModule } from './app.module';
import { notification } from './config/configuration';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = notification();
  const logger = new LoggerService('Main');
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  
  await app.listen(config.port);
  logger.log(`Notification service running on port: ${config.port}`)
}
bootstrap();