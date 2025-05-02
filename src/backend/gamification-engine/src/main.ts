import { NestFactory } from '@nestjs/core'; // v10.0.0+
import { AppModule } from './app.module';
import { KafkaConsumerService } from './events/kafka/kafka.consumer';
import { LoggerService } from '@app/shared/logging/logger.service'; // @app/shared ^1.0.0
import axios from 'axios';
import { createSecureAxios } from '@app/shared/utils/secure-axios';
import helmet from 'helmet';

/**
 * Initializes and starts the NestJS application, configures the Kafka consumer, and sets up global exception handling.
 */
async function bootstrap(): Promise<void> {
  // Creates a NestJS application instance using NestFactory.
  const app = await NestFactory.create(AppModule);

  // Configure security middleware
  app.use(helmet());
  
  // Replace the global Axios instance with our secure version
  // This provides additional protection against SSRF vulnerabilities
  axios.defaults.adapter = createSecureAxios().defaults.adapter;

  // Retrieves the KafkaConsumerService from the application context.
  const kafkaConsumerService = app.get(KafkaConsumerService);

  // Starts the Kafka consumer to listen for events.
  await kafkaConsumerService.onModuleInit();

  // Starts listening for incoming requests.
  await app.listen(3000);
}

// Calls the bootstrap function to start the Gamification Engine service.
bootstrap();