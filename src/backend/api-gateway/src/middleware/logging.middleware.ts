import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { TracingService } from 'src/backend/shared/src/tracing/tracing.service';

/**
 * Middleware that logs incoming requests and outgoing responses.
 * Provides valuable information for monitoring, debugging, and auditing purposes.
 * Integrates with the tracing service for distributed tracing.
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  /**
   * Constructor for the LoggingMiddleware class.
   * @param loggerService Service used for logging.
   * @param tracingService Service used for distributed tracing.
   */
  constructor(
    private readonly loggerService: LoggerService,
    private readonly tracingService: TracingService,
  ) {}

  /**
   * Logs the incoming request and outgoing response.
   * @param req The incoming request object.
   * @param res The outgoing response object.
   * @param next The next function in the middleware chain.
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const journey = this.extractJourney(originalUrl);
    const logContext = journey ? `API-Gateway:${journey}` : 'API-Gateway';

    try {
      // Create a span for request logging
      this.tracingService.createSpan(`API-Gateway ${method} ${originalUrl}`, async () => {
        // Log the request in this span
        this.loggerService.log(`Request: ${method} ${originalUrl}`, logContext);
      }).catch(error => {
        // Catch and log any errors from tracing
        this.loggerService.error(`Tracing error: ${error.message}`, error.stack, logContext);
      });
      
      // Track start time for duration calculation
      const startTime = Date.now();
      
      // Store logger reference for the response callback closure
      const logger = this.loggerService;
      
      // Capture original end method
      const originalEnd = res.end;
      
      // Override end method to log response
      res.end = function(...args: any[]): any {
        const statusCode = this.statusCode;
        const duration = Date.now() - startTime;
        
        // Log response
        logger.log(`Response: ${statusCode} ${method} ${originalUrl} - ${duration}ms`, logContext);
        
        // Call original end method
        return originalEnd.apply(this, args);
      };
      
      // Continue middleware chain
      next();
    } catch (error) {
      this.loggerService.error(`Logging error: ${error.message}`, error.stack, logContext);
      next();
    }
  }

  /**
   * Extracts the journey identifier from the request URL.
   * @param url The request URL.
   * @returns The journey identifier or null if not found.
   */
  private extractJourney(url: string): string | null {
    // Extract journey from URL
    const journeyPatterns = {
      health: /\/health/i,
      care: /\/care/i,
      plan: /\/plan/i,
      game: /\/game/i,
    };

    for (const [journey, pattern] of Object.entries(journeyPatterns)) {
      if (pattern.test(url)) {
        return journey;
      }
    }

    return null;
  }
}