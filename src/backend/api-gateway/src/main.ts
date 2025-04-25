import { NestFactory } from '@nestjs/core'; // @nestjs/core v10.0.0+
import { AppModule } from './app.module';
import { Configuration } from './config/configuration';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter';

/**
 * Bootstraps the NestJS application, configures middleware, and starts the server.
 */
async function bootstrap() {
  // LD1: Creates a NestJS application instance.
  const app = await NestFactory.create(AppModule);

  // LD1: Retrieves the application configuration.
  const config = app.get(Configuration);

  // LD1: Applies global exception filter
  const exceptionFilter = app.get(AllExceptionsFilter);
  app.useGlobalFilters(exceptionFilter);

  // LD1, IE1: Applies the authentication middleware to secure the API Gateway.
  // IE1: The AuthMiddleware requires AuthService, UsersService, LoggerService, and Configuration.
  // The AuthService and UsersService are provided by their respective modules.
  // The LoggerService and Configuration are provided by the shared modules.
  app.use(app.get(AuthMiddleware).use.bind(app.get(AuthMiddleware)));

  // LD1, IE1: Applies the logging middleware to log requests and responses.
  // IE1: The LoggingMiddleware requires LoggerService.
  // The LoggerService is provided by the shared modules.
  app.use(app.get(LoggingMiddleware).use.bind(app.get(LoggingMiddleware)));

  // LD1, IE1: Applies the rate limiting middleware to protect against abuse.
  // IE1: The RateLimitMiddleware requires RedisService and ConfigService.
  // The RedisService is provided by the shared modules.
  // The ConfigService is provided by the @nestjs/config library.
  app.use(app.get(RateLimitMiddleware).use.bind(app.get(RateLimitMiddleware)));

  // LD1: Starts the server and listens for incoming requests on the configured port.
  const port = config.port || 4000;
  await app.listen(port);

  // LD1, S1: Logs a message indicating that the server has started successfully.
  const logger = app.get(LoggerService);
  logger.setContext('Main');
  logger.log(`API Gateway started on port ${port}`);
}

// LD1: Calls the bootstrap function to start the application.
bootstrap();