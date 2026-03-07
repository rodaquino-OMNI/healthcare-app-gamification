import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { LoggerService } from '@app/shared/logging/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'; // @nestjs/core v10.0.0+
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { configuration } from './config/configuration';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

/**
 * Bootstraps the NestJS application, configures middleware, and starts the server.
 */
async function bootstrap() {
    // LD1: Creates a NestJS application instance.
    const app = await NestFactory.create(AppModule);

    // S1: Adds security HTTP headers via helmet middleware.
    app.use(helmet());

    // LD1: Retrieves the application configuration.
    const config = app.get(configuration);

    // LD1: Applies global exception filter
    const exceptionFilter = app.get(AllExceptionsFilter);
    app.useGlobalFilters(exceptionFilter);

    // LD1, IE1: Applies the authentication middleware to secure the API Gateway.
    app.use(app.get(AuthMiddleware).use.bind(app.get(AuthMiddleware)));

    // LD1, IE1: Applies the logging middleware to log requests and responses.
    app.use(app.get(LoggingMiddleware).use.bind(app.get(LoggingMiddleware)));

    // LD1, IE1: Applies the rate limiting middleware to protect against abuse.
    app.use(app.get(RateLimitMiddleware).use.bind(app.get(RateLimitMiddleware)));

    // Swagger setup
    const swaggerConfig = new DocumentBuilder()
        .setTitle('AUSTA API Gateway')
        .setDescription('Central API Gateway for AUSTA SuperApp')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, swaggerDocument);

    // LD1: Starts the server and listens for incoming requests on the configured port.
    const port = config.port || 4000;

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

    await app.listen(port);

    // LD1, S1: Logs a message indicating that the server has started successfully.
    const logger = app.get(LoggerService);
    logger.setContext('Main');
    logger.log('info', `API Gateway started on port ${port}`);
}

// LD1: Calls the bootstrap function to start the application.
bootstrap();
