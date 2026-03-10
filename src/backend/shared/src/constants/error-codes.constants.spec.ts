import {
    SYS_INTERNAL_SERVER_ERROR,
    SYS_SERVICE_UNAVAILABLE,
    SYS_NOT_FOUND,
    AUTH_INVALID_CREDENTIALS,
    AUTH_USER_NOT_FOUND,
    AUTH_TOKEN_EXPIRED,
    ErrorCodes,
    ErrorCodeDetails,
} from './error-codes.constants';

describe('Error Codes Constants', () => {
    describe('system error codes', () => {
        it('should define SYS_INTERNAL_SERVER_ERROR', () => {
            expect(SYS_INTERNAL_SERVER_ERROR).toBe('SYS_001');
        });

        it('should define SYS_SERVICE_UNAVAILABLE', () => {
            expect(SYS_SERVICE_UNAVAILABLE).toBe('SYS_002');
        });

        it('should define SYS_NOT_FOUND', () => {
            expect(SYS_NOT_FOUND).toBe('SYS_006');
        });
    });

    describe('auth error codes', () => {
        it('should define AUTH_INVALID_CREDENTIALS', () => {
            expect(AUTH_INVALID_CREDENTIALS).toBe('AUTH_INVALID_CREDENTIALS');
        });

        it('should define AUTH_USER_NOT_FOUND', () => {
            expect(AUTH_USER_NOT_FOUND).toBe('AUTH_USER_NOT_FOUND');
        });

        it('should define AUTH_TOKEN_EXPIRED', () => {
            expect(AUTH_TOKEN_EXPIRED).toBe('AUTH_TOKEN_EXPIRED');
        });
    });

    describe('ErrorCodes enum', () => {
        it('should have SYS_INTERNAL_SERVER_ERROR', () => {
            expect(ErrorCodes.SYS_INTERNAL_SERVER_ERROR).toBe('SYS_001');
        });

        it('should have HEALTH_RECORD_NOT_FOUND', () => {
            expect(ErrorCodes.HEALTH_RECORD_NOT_FOUND).toBe('HEALTH_RECORD_NOT_FOUND');
        });

        it('should have CARE_TREATMENT_PLAN_NOT_FOUND', () => {
            expect(ErrorCodes.CARE_TREATMENT_PLAN_NOT_FOUND).toBe('CARE_TREATMENT_PLAN_NOT_FOUND');
        });
    });

    describe('ErrorCodeDetails', () => {
        it('should have details for SYS_001', () => {
            const detail = ErrorCodeDetails[ErrorCodes.SYS_INTERNAL_SERVER_ERROR];
            expect(detail).toBeDefined();
            expect(detail.statusCode).toBe(500);
            expect(detail.message).toContain('internal server error');
        });

        it('should have details for health record not found', () => {
            const detail = ErrorCodeDetails[ErrorCodes.HEALTH_RECORD_NOT_FOUND];
            expect(detail).toBeDefined();
            expect(detail.statusCode).toBe(404);
        });

        it('should have a DEFAULT fallback', () => {
            const detail = ErrorCodeDetails['DEFAULT'];
            expect(detail).toBeDefined();
            expect(detail.statusCode).toBe(500);
        });
    });
});
