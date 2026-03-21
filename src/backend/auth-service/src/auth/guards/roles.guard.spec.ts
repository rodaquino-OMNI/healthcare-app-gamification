import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';

describe('RolesGuard (Auth Service)', () => {
    let guard: RolesGuard;
    let mockReflector: jest.Mocked<Reflector>;

    beforeEach(() => {
        mockReflector = {
            get: jest.fn(),
        } as unknown as jest.Mocked<Reflector>;

        guard = new RolesGuard(mockReflector);
    });

    const createMockContext = (user?: Record<string, unknown>): ExecutionContext =>
        ({
            getHandler: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => ({ user }),
            }),
        }) as unknown as ExecutionContext;

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should allow access when no roles are required', () => {
            mockReflector.get.mockReturnValue(undefined);

            const result = guard.canActivate(createMockContext());

            expect(result).toBe(true);
        });

        it('should allow access when roles array is empty', () => {
            mockReflector.get.mockReturnValue([]);

            const result = guard.canActivate(createMockContext());

            expect(result).toBe(true);
        });

        it('should throw when no user is present', () => {
            mockReflector.get.mockReturnValue(['admin']);

            expect(() => guard.canActivate(createMockContext())).toThrow('Authentication required');
        });

        it('should allow access when user has required role', () => {
            mockReflector.get.mockReturnValue(['admin']);
            const user = { roles: [{ name: 'admin' }] };

            const result = guard.canActivate(createMockContext(user));

            expect(result).toBe(true);
        });

        it('should throw when user lacks required role', () => {
            mockReflector.get.mockReturnValue(['admin']);
            const user = { roles: [{ name: 'user' }] };

            expect(() => guard.canActivate(createMockContext(user))).toThrow(
                'Insufficient permissions'
            );
        });

        it('should throw when user has no roles', () => {
            mockReflector.get.mockReturnValue(['admin']);
            const user = { roles: null };

            expect(() => guard.canActivate(createMockContext(user))).toThrow();
        });
    });
});
