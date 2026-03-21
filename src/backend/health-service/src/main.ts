import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'; // NestJS Core 10.0.0+
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { health } from './config/configuration';
import { AllExceptionsFilter } from '../../shared/src/exceptions/exceptions.filter';
import { LoggerService } from '../../shared/src/logging/logger.service';

/**
 * Initializes and starts the NestJS application.
 */
async function bootstrap(): Promise<void> {
    // LD1: Create a NestJS application instance using AppModule.
    const app = await NestFactory.create(AppModule);

    // S1: Adds security HTTP headers via helmet middleware.
    app.use(helmet());

    // LD1: Get the configuration for the health service
    const config = health();

    // LD1: Apply the global exception filter AllExceptionsFilter to handle exceptions.
    // IE3: The AllExceptionsFilter requires a LoggerService, which is provided by the LoggerModule.
    app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggerService)));

    // LD1: Set the global prefix for the API endpoints.
    app.setGlobalPrefix(config.apiPrefix);

    // Swagger setup
    const swaggerConfig = new DocumentBuilder()
        .setTitle('AUSTA Health Service API')
        .setDescription('Health monitoring and insights service')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, swaggerDocument);

    // LD1: Start the application, listening on the configured port.
    // IE1: The health function is imported from the configuration file and is used to get the port.

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

    app.enableCors({
        origin: ['https://app.austa.com.br', /\.austa\.com\.br$/],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });

    await app.listen(config.port);
}

// LD1: Calls the bootstrap function to start the application.
void bootstrap();
