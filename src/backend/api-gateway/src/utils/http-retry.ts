import { Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError, retry, throwError, timer } from 'rxjs';

const logger = new Logger('HttpRetry');

export interface RetryOptions {
    maxRetries?: number;
    initialDelay?: number;
    context?: string;
}

export function withRetry<T>(
    request$: Observable<AxiosResponse<T>>,
    options: RetryOptions = {}
): Observable<AxiosResponse<T>> {
    const { maxRetries = 3, initialDelay = 300, context = 'unknown' } = options;

    return request$.pipe(
        retry({
            count: maxRetries,
            delay: (error: Error, retryCount: number) => {
                const delay = initialDelay * Math.pow(2, retryCount - 1);
                logger.warn(
                    `Retry ${retryCount}/${maxRetries} for ${context} after ${delay}ms: ${error.message}`
                );
                return timer(delay);
            },
            resetOnSuccess: true,
        }),
        catchError((error: Error) => {
            logger.error(`All ${maxRetries} retries exhausted for ${context}: ${error.message}`);
            return throwError(() => error);
        })
    );
}
