import { ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';

import { OwnershipGuard, OwnershipConfig } from './ownership.guard';

class MockService {
    async findById(_id: string): Promise<{ userId: string } | null> {
        return { userId: 'user-1' };
    }
}

describe('OwnershipGuard', () => {
    let guard: OwnershipGuard;
    let reflector: jest.Mocked<Reflector>;
    let moduleRef: jest.Mocked<ModuleRef>;
    let mockService: MockService;

    const createMockContext = (
        user: Record<string, unknown> | undefined,
        params: Record<string, string>
    ): ExecutionContext =>
        ({
            switchToHttp: () => ({
                getRequest: () => ({ user, params }),
            }),
            getHandler: () => jest.fn(),
            getClass: () => jest.fn(),
        }) as unknown as ExecutionContext;

    const defaultConfig: OwnershipConfig = {
        service: MockService,
        method: 'findById',
        paramName: 'id',
        userField: 'userId',
    };

    beforeEach(() => {
        reflector = {
            get: jest.fn(),
            getAll: jest.fn(),
            getAllAndMerge: jest.fn(),
            getAllAndOverride: jest.fn(),
        } as unknown as jest.Mocked<Reflector>;

        mockService = new MockService();

        moduleRef = {
            get: jest.fn().mockReturnValue(mockService),
        } as unknown as jest.Mocked<ModuleRef>;

        guard = new OwnershipGuard(reflector, moduleRef);
    });

    it('should allow access when userId matches resource.userId', async () => {
        reflector.get.mockReturnValue(defaultConfig);
        jest.spyOn(mockService, 'findById').mockResolvedValue({ userId: 'user-1' });

        const context = createMockContext({ id: 'user-1' }, { id: 'metric-1' });
        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(mockService.findById).toHaveBeenCalledWith('metric-1');
    });

    it('should throw ForbiddenException when userId does not match', async () => {
        reflector.get.mockReturnValue(defaultConfig);
        jest.spyOn(mockService, 'findById').mockResolvedValue({ userId: 'user-2' });

        const context = createMockContext({ id: 'user-1' }, { id: 'metric-1' });

        await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
        await expect(guard.canActivate(context)).rejects.toThrow('You do not own this resource');
    });

    it('should throw NotFoundException when resource is not found', async () => {
        reflector.get.mockReturnValue(defaultConfig);
        jest.spyOn(mockService, 'findById').mockResolvedValue(null);

        const context = createMockContext({ id: 'user-1' }, { id: 'metric-1' });

        await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
        await expect(guard.canActivate(context)).rejects.toThrow('Resource not found');
    });

    it('should throw ForbiddenException when user is not in request', async () => {
        reflector.get.mockReturnValue(defaultConfig);

        const context = createMockContext(undefined, { id: 'metric-1' });

        await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
        await expect(guard.canActivate(context)).rejects.toThrow('User not authenticated');
    });

    it('should work with req.user.sub (JWT sub claim)', async () => {
        reflector.get.mockReturnValue(defaultConfig);
        jest.spyOn(mockService, 'findById').mockResolvedValue({ userId: 'user-jwt' });

        const context = createMockContext({ sub: 'user-jwt' }, { id: 'metric-1' });
        const result = await guard.canActivate(context);

        expect(result).toBe(true);
    });

    it('should work with a custom param name (e.g., metricId)', async () => {
        const customConfig: OwnershipConfig = {
            ...defaultConfig,
            paramName: 'metricId',
        };
        reflector.get.mockReturnValue(customConfig);
        jest.spyOn(mockService, 'findById').mockResolvedValue({ userId: 'user-1' });

        const context = createMockContext({ id: 'user-1' }, { metricId: 'metric-42' });
        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(mockService.findById).toHaveBeenCalledWith('metric-42');
    });

    it('should work with a custom user field on the resource', async () => {
        const customConfig: OwnershipConfig = {
            ...defaultConfig,
            userField: 'ownerId',
        };
        reflector.get.mockReturnValue(customConfig);
        jest.spyOn(mockService, 'findById').mockResolvedValue({ ownerId: 'user-1' } as unknown as {
            userId: string;
        });

        const context = createMockContext({ id: 'user-1' }, { id: 'resource-1' });
        const result = await guard.canActivate(context);

        expect(result).toBe(true);
    });

    it('should skip ownership check when no config metadata is set', async () => {
        reflector.get.mockReturnValue(undefined);

        const context = createMockContext(undefined, {});
        const result = await guard.canActivate(context);

        expect(result).toBe(true);
    });

    it('should throw NotFoundException when resource ID is missing from params', async () => {
        reflector.get.mockReturnValue(defaultConfig);

        const context = createMockContext({ id: 'user-1' }, {});

        await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
        await expect(guard.canActivate(context)).rejects.toThrow(
            'Resource ID not found in request params'
        );
    });
});
