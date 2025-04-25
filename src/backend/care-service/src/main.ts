import { NestFactory } from '@nestjs/core'; // v10.0.0+
import { ValidationPipe } from '@nestjs/common'; // v10.0.0+
import { ConfigService } from '@nestjs/config'; // v10.0.0+
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // v7.0.0+
import helmet from 'helmet'; // v7.0.0+
import compression from 'compression'; // v1.7.4+

import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';

/**
 * Bootstraps the NestJS application for the Care Service.
 */
async function bootstrap(): Promise<void> {
  // LD1: Create a NestJS application instance with the AppModule
  const app = await NestFactory.create(AppModule);

  // LD1: Get the ConfigService to access configuration values
  const configService = app.get(ConfigService);

  // LD1: Set up global middleware (helmet, compression)
  app.use(helmet()); // S1: Adds security HTTP headers
  app.use(compression()); // S1: Enables response compression

  // LD1: Configure CORS with appropriate settings
  app.enableCors({
    origin: configService.get<string[]>('apiGateway.cors.origin'), // S1: Define allowed origins from config
    credentials: configService.get<boolean>('apiGateway.cors.credentials'), // S1: Enable credentials if needed
    methods: configService.get<string[]>('apiGateway.cors.methods'), // S1: Define allowed methods from config
  });

  // LD1: Apply global ValidationPipe for request validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // S1: Strip unwanted properties
    forbidNonWhitelisted: true, // S1: Throw error on unwanted properties
    transform: true, // S1: Transform payloads based on DTO types
  }));

  // LD1: Apply global AllExceptionsFilter for error handling
  const logger = new LoggerService();
  app.useGlobalFilters(new AllExceptionsFilter(logger)); // S1: Use custom exception filter

  // LD1: Set up Swagger documentation with appropriate metadata
  const config = new DocumentBuilder()
    .setTitle('Care Service API')
    .setDescription('API documentation for the Care Service')
    .setVersion('1.0')
    .addTag('care')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // S1: Serve Swagger UI at /api

  // LD1: Get the port from configuration (default to 3000)
  const port = configService.get<number>('care.port') || 3000;

  // LD1: Start the HTTP server on the configured port
  await app.listen(port);

  // LD1: Log the application startup with the service URL
  logger.log(`Care Service running on ${configService.get<string>('care.baseUrl')}:${port}`, 'Bootstrap');
}

// LD1: Call the bootstrap function to start the application
bootstrap();