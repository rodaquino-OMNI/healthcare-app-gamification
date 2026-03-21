import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';

describe('RolesGuard (Plan Service)', () => {
    let guard: RolesGuard;
    let mockReflector: jest.Mocked<Reflector>;

    beforeEach(() => {
        mockReflector = {
            get: jest.fn(),
        } as unknown as jest.Mocked<Reflector>;

        guard = new RolesGuard(mockReflector);
    });

    const createMockContext = (user?: { roles: string[] }): ExecutionContext =>
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
        it('should allow when no roles required', () => {
            mockReflector.get.mockReturnValue(undefined);

            expect(guard.canActivate(createMockContext())).toBe(true);
        });

        it('should allow when empty roles array', () => {
            mockReflector.get.mockReturnValue([]);

            expect(guard.canActivate(createMockContext())).toBe(true);
        });

        it('should deny when no user is present', () => {
            mockReflector.get.mockReturnValue(['admin']);

            expect(guard.canActivate(createMockContext())).toBe(false);
        });

        it('should allow when user has matching role', () => {
            mockReflector.get.mockReturnValue(['admin']);
            const user = { roles: ['admin', 'user'] };

            expect(guard.canActivate(createMockContext(user))).toBe(true);
        });

        it('should deny when user lacks role', () => {
            mockReflector.get.mockReturnValue(['admin']);
            const user = { roles: ['user'] };

            expect(guard.canActivate(createMockContext(user))).toBe(false);
        });

        it('should deny when user has no roles', () => {
            mockReflector.get.mockReturnValue(['admin']);
            const user = { roles: undefined as unknown as string[] };

            expect(guard.canActivate(createMockContext(user))).toBe(false);
        });
    });
});
