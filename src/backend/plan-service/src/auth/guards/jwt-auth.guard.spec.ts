jest.mock('@nestjs/passport', () => {
    class MockAuthGuard {
        canActivate() { return true; }
    }
    return { AuthGuard: () => MockAuthGuard };
});

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard (Plan Service)', () => {
    let guard: JwtAuthGuard;

    beforeEach(() => {
        guard = new JwtAuthGuard();
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('handleRequest', () => {
        const mockContext = {} as ExecutionContext;

        it('should return user when authenticated', () => {
            const user = { id: 'user-1' };

            const result = guard.handleRequest(null, user, null, mockContext);

            expect(result).toEqual(user);
        });

        it('should throw when no user is present', () => {
            expect(() => {
                guard.handleRequest(null, null, null, mockContext);
            }).toThrow(UnauthorizedException);
        });

        it('should rethrow Error instances', () => {
            const error = new Error('Token expired');

            expect(() => {
                guard.handleRequest(error, null, null, mockContext);
            }).toThrow('Token expired');
        });

        it('should throw UnauthorizedException for non-Error errors', () => {
            expect(() => {
                guard.handleRequest('string error', null, null, mockContext);
            }).toThrow(UnauthorizedException);
        });
    });
});
