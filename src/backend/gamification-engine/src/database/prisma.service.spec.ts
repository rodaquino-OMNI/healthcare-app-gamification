import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from './prisma.service';

// Mock PrismaClient to avoid requiring a real database adapter
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: class MockPrismaClient {
            $connect = jest.fn().mockResolvedValue(undefined);
            $disconnect = jest.fn().mockResolvedValue(undefined);
        },
    };
});

describe('PrismaService (Gamification)', () => {
    let service: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService],
        }).compile();

        service = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be an instance of PrismaService', () => {
        expect(service).toBeInstanceOf(PrismaService);
    });

    describe('onModuleInit', () => {
        it('should call $connect on module init', async () => {
            const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();

            await service.onModuleInit();

            expect(connectSpy).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from $connect', async () => {
            jest.spyOn(service, '$connect').mockRejectedValue(new Error('Connection failed'));

            await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
        });
    });

    describe('onModuleDestroy', () => {
        it('should call $disconnect on module destroy', async () => {
            const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue();

            await service.onModuleDestroy();

            expect(disconnectSpy).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from $disconnect', async () => {
            jest.spyOn(service, '$disconnect').mockRejectedValue(new Error('Disconnect failed'));

            await expect(service.onModuleDestroy()).rejects.toThrow('Disconnect failed');
        });
    });
});
