jest.mock('@nestjs/passport', () => {
    class MockAuthGuard {
        canActivate() {
            return true;
        }
        getRequest(context: unknown) {
            return context;
        }
    }
    return { AuthGuard: () => MockAuthGuard };
});

import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard (Auth Service)', () => {
    let guard: JwtAuthGuard;
    let mockReflector: jest.Mocked<Reflector>;
    let mockLogger: Record<string, jest.Mock>;

    beforeEach(() => {
        mockReflector = { get: jest.fn() } as unknown as jest.Mocked<Reflector>;
        mockLogger = { warn: jest.fn(), log: jest.fn(), error: jest.fn() };

        guard = new JwtAuthGuard(mockReflector, mockLogger as never);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('handleRequest', () => {
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({ url: '/test', method: 'GET' }),
            }),
        } as unknown as ExecutionContext;

        it('should return user when authentication succeeds', () => {
            const user = { id: 'user-1' };

            const result = guard.handleRequest(null, user, null, mockContext);

            expect(result).toEqual(user);
        });

        it('should throw when no user is found', () => {
            expect(() => {
                guard.handleRequest(null, null, null, mockContext);
            }).toThrow();
        });

        it('should throw when error is provided', () => {
            expect(() => {
                guard.handleRequest(new Error('auth failed'), null, null, mockContext);
            }).toThrow();
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });
});
