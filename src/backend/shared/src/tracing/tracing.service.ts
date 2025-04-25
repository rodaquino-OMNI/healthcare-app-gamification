import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tracer, Context, trace, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class TracingService {
  private tracer: Tracer;

  /**
   * Initializes the TracingService and obtains a tracer instance.
   * @param configService ConfigService for accessing configuration variables
   * @param logger LoggerService for logging messages
   */
  constructor(
    private configService: ConfigService,
    private logger: LoggerService
  ) {
    // Obtain a tracer from OpenTelemetry using the service name from configuration
    const serviceName = this.configService.get<string>('service.name', 'austa-service');
    this.tracer = trace.getTracer(serviceName);
    this.logger.log(`Initialized tracer for ${serviceName}`, 'AustaTracing');
  }

  /**
   * Creates and starts a new span for tracing a specific operation.
   * @param name The name of the span to create
   * @param fn The function to execute within the span context
   * @returns The result of the function execution
   */
  async createSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
    // Start a new span with the given name
    const span = this.tracer.startSpan(name);
    
    try {
      // Execute the provided function within the context of the span
      const result = await trace.with(trace.setSpan(trace.context(), span), fn);
      
      // If the function completes successfully, set the span status to OK
      if (span.isRecording()) {
        span.setStatus({ code: SpanStatusCode.OK });
      }
      
      return result;
    } catch (error) {
      // If the function throws an error, set the span status to ERROR and record the exception
      if (span.isRecording()) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR });
      }
      
      this.logger.error(`Error in span ${name}: ${error.message}`, error.stack, 'AustaTracing');
      throw error;
    } finally {
      // Always end the span regardless of success or failure
      span.end();
    }
  }
}