import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false,
        value: true,
      },
    }),
  );

  app.enableCors({
    origin: [
      "https://app.austa.com.br",
      /\.austa\.com\.br$/
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });

  await app.listen(port);
  logger.log(`Notification service running on port: ${port}`);
}
bootstrap();