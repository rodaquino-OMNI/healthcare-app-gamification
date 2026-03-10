import { ValidationPipe } from '@nestjs/common'; // @nestjs/common 10.0.0+
import { ConfigService } from '@nestjs/config'; // @nestjs/config 10.0.0+
import { NestFactory } from '@nestjs/core'; // @nestjs/core 10.0.0+
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // @nestjs/swagger 10.0.0+
import compression from 'compression'; // compression ^1.7.4
import helmet from 'helmet'; // helmet ^6.0.0

import { AppModule } from './app.module';
import { AllExceptionsFilter } from '../../shared/src/exceptions/exceptions.filter';
import { LoggerService } from '../../shared/src/logging/logger.service';

/**
 * Bootstraps the NestJS application for the Plan Service.
 * @returns {Promise<void>} Resolves when the application has started successfully.
 */
async function bootstrap(): Promise<void> {
    // LD1: Create a NestJS application instance with the AppModule
    const app = await NestFactory.create(AppModule);

    // LD1: Get the LoggerService from the app's DI container
    const logger = app.get(LoggerService);

    // LD1: Set up the global exception filter with dependency injection
    app.useGlobalFilters(new AllExceptionsFilter(logger));

    // LD1: Configure global validation pipe with appropriate options
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw error if unknown properties are sent
            transform: true, // Transform primitive types
            transformOptions: {
                enableImplicitConversion: true, // Enable conversion based on type annotations
            },
        })
    );

    // LD1: Apply security middleware (helmet)
    app.use(helmet());

    // LD1: Apply compression middleware
    app.use(compression());

    // LD1: Get the ConfigService from the app's DI container
    const configService = app.get(ConfigService);

    // LD1: Set up CORS with appropriate configuration
    const corsOrigin = configService.get<string | string[]>('planService.server.cors.origin');
    const corsCredentials = configService.get<boolean>('planService.server.cors.credentials', true);
    app.enableCors({
        origin: corsOrigin,
        credentials: corsCredentials,
    });

    // LD1: Set up Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('AUSTA Plan Service API')
        .setDescription('API for managing insurance plans and claims')
        .setVersion('1.0')
        .addTag('plans')
        .addTag('claims')
        .addTag('cost-simulator')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // LD1: Get the port from environment or use default
    const port = process.env.PORT || 3004;

    // LD1: Start the HTTP server on the configured port
    await app.listen(port as number);

    // LD1: Log the application startup with the service URL
    logger.log(`Plan Service started on port ${port}`, 'Bootstrap');
    logger.log(`Service URL: http://localhost:${port}`, 'Bootstrap');
}

// LD1: Bootstrap the application
void bootstrap();
