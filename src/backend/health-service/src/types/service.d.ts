/* eslint-disable */
/**
 * Declaration for the Service interface from shared module
 */
declare module '@app/shared/interfaces/service.interface' {
    export interface Service<_T = unknown, _F = unknown, _P = unknown> {
        // These are empty interfaces, as we don't need the actual implementation
        // The TS error is due to "implements Service" without any methods
    }
}
