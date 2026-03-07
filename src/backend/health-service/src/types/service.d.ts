/**
 * Declaration for the Service interface from shared module
 */
declare module '@app/shared/interfaces/service.interface' {
    export interface Service<T = any, F = any, P = any> {
        // These are empty interfaces, as we don't need the actual implementation
        // The TS error is due to "implements Service" without any methods
    }
}
