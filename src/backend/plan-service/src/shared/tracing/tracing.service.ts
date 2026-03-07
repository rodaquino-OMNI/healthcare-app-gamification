/* eslint-disable */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';

/**
 * TracingService for distributed tracing in the Plan Service
 * This is a simplified implementation for local development
 * In production, this would integrate with OpenTelemetry, Jaeger, or similar
 */
@Injectable()
export class TracingService {
    /**
     * Creates a span and executes the provided callback within that span
     * @param name Name of the span
     * @param callback Function to execute within the span
     * @returns Result of the callback
     */
    async createSpan<T>(name: string, callback: () => Promise<T>): Promise<T> {
        const startTime = Date.now();
        try {
            // In a real implementation, this would create an actual tracing span
            const result = await callback();
            this.recordSpanCompletion(name, Date.now() - startTime);
            return result;
        } catch (error) {
            this.recordSpanError(name, error, Date.now() - startTime);
            throw error as any;
        }
    }

    /**
     * Records the completion of a span
     * @param name Name of the span
     * @param durationMs Duration of the span in milliseconds
     */
    private recordSpanCompletion(name: string, durationMs: number): void {
        console.debug(`[Tracing] Span '${name}' completed in ${durationMs}ms`);
    }

    /**
     * Records an error in a span
     * @param name Name of the span
     * @param error Error that occurred
     * @param durationMs Duration of the span in milliseconds
     */
    private recordSpanError(name: string, error: unknown, durationMs: number): void {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[Tracing] Span '${name}' failed after ${durationMs}ms: ${msg}`);
    }

    /**
     * Gets the active span
     * @returns The currently active span or null if none exists
     */
    getActiveSpan(): any {
        // In a real implementation, this would return the current active span
        return null;
    }
}
