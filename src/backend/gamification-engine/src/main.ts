/* eslint-disable @typescript-eslint/no-explicit-any */
import { NestFactory } from '@nestjs/core'; // v10.0.0+
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { KafkaConsumerService } from './events/kafka/kafka.consumer';
import { LoggerService } from '@app/shared/logging/logger.service'; // @app/shared ^1.0.0
import axios from 'axios';
import { createSecureAxios } from '@app/shared/utils/secure-axios';
import helmet from 'helmet';
import { DEFAULT_PORT } from './config/validation.schema';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Initializes and starts the NestJS application, configures the Kafka consumer, and sets up global exception handling.
 */
async function bootstrap(): Promise<void> {
  let app;
  try {
    // Creates a NestJS application instance using NestFactory.
    app = await NestFactory.create(AppModule);
    
    // Configure security middleware
    app.use(helmet());
    
    // Get the ConfigService instance after app is created to ensure configuration is fully loaded
    const configService = app.get(ConfigService);
    
    // Access configuration using the namespace defined in registerAs
    const nodeEnv = configService.get<string>('gamificationEngine.nodeEnv');
    const port = configService.get<number>('gamificationEngine.port', DEFAULT_PORT);
    
    // Validate port is within valid range
    if (port < 1 || port > 65535) {
      throw new Error(`Invalid port number: ${port}. Port must be between 1 and 65535.`);
    }
    
    // Replace the global Axios instance with our secure version
    // This provides additional protection against SSRF vulnerabilities
    axios.defaults.adapter = createSecureAxios().defaults.adapter;
    
    // Get the logger service after app is created
    const logger = app.get(LoggerService);
    logger.log(`Starting Gamification Engine in ${nodeEnv} environment on port ${port}`, 'Bootstrap');
    
    try {
      // Retrieves the KafkaConsumerService from the application context after config is loaded
      // Using get with { strict: false } to avoid errors if the service is not available
      const kafkaConsumerService = app.get(KafkaConsumerService, { strict: false });
      
      if (kafkaConsumerService) {
        // Starts the Kafka consumer to listen for events.
        await kafkaConsumerService.onModuleInit();
        logger.log('Kafka consumer initialized successfully', 'Bootstrap');
      } else {
        logger.warn('Kafka consumer service not found. Event processing may be disabled.', 'Bootstrap');
      }
    } catch (kafkaError: any) {
      logger.error(`Failed to initialize Kafka consumer: ${kafkaError?.message || 'Unknown error'}`, 'Bootstrap');
      // Continue application startup even if Kafka fails - we don't want to prevent the API from working
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

    // Starts listening for incoming requests.
    await app.listen(port);
    logger.log(`Gamification Engine successfully started on port ${port}`, 'Bootstrap');
  } catch (error) {
    console.error('Failed to start Gamification Engine:', error instanceof Error ? (error as any).message : 'Unknown error');
    console.error(error instanceof Error ? (error as any).stack : 'No stack trace available');
    
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
bootstrap();