import { getHelmetOptions, parseCorsOrigins } from '@app/shared/config/security.config';
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';
import { LoggerService } from '@app/shared/logging/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    // S1: Adds security HTTP headers via helmet middleware with CSP.
    app.use(helmet(getHelmetOptions()));

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
        })
    );

    app.enableCors({
        origin: parseCorsOrigins(configService.get<string>('CORS_ORIGINS')),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });

    await app.listen(port);
    logger.log(`Notification service running on port: ${port}`);
}
void bootstrap();
