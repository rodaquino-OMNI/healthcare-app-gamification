/* eslint-disable */
/**
 * Declaration for the AppException class from shared module
 */
declare module '@app/shared/exceptions/exceptions.types' {
    export class AppException extends Error {
        constructor(message: string, code: string, additionalInfo?: Record<string, unknown>);
    }
}
