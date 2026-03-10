import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from '../../shared/src/exceptions/exceptions.filter';
import { LoggerService } from '../../shared/src/logging/logger.service';

/**
 * Bootstrap function to initialize and configure the NestJS application
 * for the Auth Service in the AUSTA SuperApp.
 */
async function bootstrap(): Promise<void> {
    // Create a NestJS application instance using NestFactory.create with AppModule
    const app = await NestFactory.create(AppModule);

    // S1: Adds security HTTP headers via helmet middleware.
    app.use(helmet());

    // Set up the LoggerService as the application logger
    const logger = app.get(LoggerService);
    app.useLogger(logger);

    // Get the ConfigService to access configuration values
    const configService = app.get(ConfigService);

    // Retrieve the server port from configuration
    const port = configService.get<number>('authService.server.port', 3001);

    // Apply global exception filter using AllExceptionsFilter
    app.useGlobalFilters(new AllExceptionsFilter(logger));

    // Configure CORS settings based on allowed origins from configuration
    app.enableCors({
        origin: ['https://app.austa.com.br', /\.austa\.com\.br$/],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });

    // Set up global validation pipe with options for stripping unknown properties,
    // transforming inputs, and detailed error messages
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
        })
    );

    // Set global prefix for all routes (e.g., '/api/auth')
    const apiPrefix = configService.get<string>('authService.server.apiPrefix', 'api/auth');
    app.setGlobalPrefix(apiPrefix);

    // Swagger setup
    const swaggerConfig = new DocumentBuilder()
        .setTitle('AUSTA Auth Service API')
        .setDescription('Authentication and authorization service')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, swaggerDocument);

    // Start the application listening on the configured port
    await app.listen(port);

    // Log the application start with the port information
    logger.log(`Auth Service started successfully on port ${port}`, 'Bootstrap');
}

// Call the bootstrap function
void bootstrap();
