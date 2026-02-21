import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/shared/logging/logger.service';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // S1: Adds security HTTP headers via helmet middleware.
  app.use(helmet());

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);
  
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  
  const port = configService.get<number>('notification.port', 3003);

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AUSTA Notification Service API')
    .setDescription('Notification and messaging service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(port);
  logger.log(`Notification service running on port: ${port}`);
}
bootstrap();