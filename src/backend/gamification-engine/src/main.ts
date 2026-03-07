/* eslint-disable */
import { LoggerService } from '@app/shared/logging/logger.service';
import { createSecureAxios } from '@app/shared/utils/secure-axios';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { DEFAULT_PORT } from './config/validation.schema';
import { KafkaConsumerService } from './events/kafka/kafka.consumer';

/**
 * Initializes and starts the NestJS application, configures the Kafka consumer,
 * and sets up global exception handling.
 */
async function bootstrap(): Promise<void> {
    let app: Awaited<ReturnType<typeof NestFactory.create>> | undefined;
    try {
        // Creates a NestJS application instance using NestFactory.
        app = await NestFactory.create(AppModule);

        // Configure security middleware
        app.use(helmet());

        // Get the ConfigService instance after app is created
        const configService = app.get(ConfigService);

        // Access configuration using the namespace defined in registerAs
        const nodeEnv = configService.get<string>('gamificationEngine.nodeEnv');
        const port = configService.get<number>('gamificationEngine.port', DEFAULT_PORT);

        // Validate port is within valid range
        if (port < 1 || port > 65535) {
            throw new Error(`Invalid port number: ${port}. Port must be between 1 and 65535.`);
        }

        // Replace the global Axios instance with our secure version
        axios.defaults.adapter = createSecureAxios().defaults.adapter;

        // Get the logger service after app is created
        const logger = app.get(LoggerService);
        logger.log(`Starting Gamification Engine in ${nodeEnv} environment on port ${port}`, 'Bootstrap');

        try {
            // Retrieves the KafkaConsumerService from the application context
            const kafkaConsumerService = app.get(KafkaConsumerService, { strict: false });

            if (kafkaConsumerService) {
                await kafkaConsumerService.onModuleInit();
                logger.log('Kafka consumer initialized successfully', 'Bootstrap');
            } else {
                logger.warn('Kafka consumer service not found. Event processing may be disabled.', 'Bootstrap');
            }
        } catch (kafkaError: unknown) {
            const msg = kafkaError instanceof Error ? kafkaError.message : 'Unknown error';
            logger.error(`Failed to initialize Kafka consumer: ${msg}`, 'Bootstrap');
            // Continue application startup even if Kafka fails
        }

        // Swagger setup
        const swaggerConfig = new DocumentBuilder()
            .setTitle('AUSTA Gamification Engine API')
            .setDescription('Gamification, achievements, and rewards service')
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
            })
        );

        app.enableCors({
            origin: ['https://app.austa.com.br', /\.austa\.com\.br$/],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
        });

        // Starts listening for incoming requests.
        await app.listen(port);
        logger.log(`Gamification Engine successfully started on port ${port}`, 'Bootstrap');
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : 'No stack trace available';
        console.error('Failed to start Gamification Engine:', msg);
        console.error(stack);

        // Attempt to close the app gracefully if it was created
        if (app) {
            try {
                await app.close();
            } catch (closeError) {
                console.error('Error while closing application:', closeError);
            }
        }

        process.exit(1);
    }
}

// Calls the bootstrap function to start the Gamification Engine service.
void bootstrap();
