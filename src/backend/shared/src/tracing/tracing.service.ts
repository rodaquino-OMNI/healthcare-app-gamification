import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tracer, trace, SpanStatusCode, context, Exception } from '@opentelemetry/api';

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
            // Using context.with to associate the span with the current context
            const activeCtx = trace.setSpan(context.active(), span);
            const result = await context.with(activeCtx, fn);

            // If the function completes successfully, set the span status to OK
            if (span.isRecording()) {
                span.setStatus({ code: SpanStatusCode.OK });
            }

            return result;
        } catch (error) {
            // On error: set span status to ERROR and record the exception
            if (span.isRecording()) {
                // Safe handling of error by ensuring it's an Exception type
                if (error instanceof Error) {
                    span.recordException(error as unknown as Exception);
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: error.message,
                    });
                } else {
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: 'Unknown error occurred',
                    });
                }
            }

            // Safe error logging with proper type checking
            if (error instanceof Error) {
                this.logger.error(
                    `Error in span ${name}: ${error.message}`,
                    error.stack,
                    'AustaTracing'
                );
            } else {
                this.logger.error(
                    `Error in span ${name}: Unknown error`,
                    undefined,
                    'AustaTracing'
                );
            }

            throw error;
        } finally {
            // Always end the span regardless of success or failure
            span.end();
        }
    }
}
