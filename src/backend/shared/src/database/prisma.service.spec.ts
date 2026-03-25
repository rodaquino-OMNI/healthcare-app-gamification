import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from './prisma.service';
import { EncryptionService } from '../encryption';

// Mock PrismaClient to avoid requiring a real database adapter
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: class MockPrismaClient {
            $connect = jest.fn().mockResolvedValue(undefined);
            $disconnect = jest.fn().mockResolvedValue(undefined);
            $extends = jest.fn().mockReturnThis();
        },
    };
});

describe('PrismaService (Shared)', () => {
    let service: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaService,
                {
                    provide: EncryptionService,
                    useValue: {
                        encrypt: jest.fn().mockReturnValue('encrypted'),
                        decrypt: jest.fn().mockReturnValue('decrypted'),
                        isEncrypted: jest.fn().mockReturnValue(false),
                    },
                },
            ],
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

    describe('encryption extension', () => {
        it('should call $extends with encryption extension when EncryptionService is provided', async () => {
            jest.spyOn(service, '$connect').mockResolvedValue();
            const extendsSpy = jest.spyOn(service, '$extends' as never);

            await service.onModuleInit();

            expect(extendsSpy).toHaveBeenCalledTimes(1);
        });

        it('should expose encrypted getter returning the extended client', async () => {
            jest.spyOn(service, '$connect').mockResolvedValue();

            await service.onModuleInit();

            expect(service.encrypted).toBeDefined();
        });
    });

    describe('onModuleInit without EncryptionService', () => {
        it('should connect without encryption extension when EncryptionService is not provided', async () => {
            const moduleWithout: TestingModule = await Test.createTestingModule({
                providers: [PrismaService],
            }).compile();

            const svc = moduleWithout.get<PrismaService>(PrismaService);
            const connectSpy = jest.spyOn(svc, '$connect').mockResolvedValue();

            await svc.onModuleInit();

            expect(connectSpy).toHaveBeenCalledTimes(1);
        });

        it('should return self from encrypted getter when no EncryptionService', async () => {
            const moduleWithout: TestingModule = await Test.createTestingModule({
                providers: [PrismaService],
            }).compile();

            const svc = moduleWithout.get<PrismaService>(PrismaService);

            expect(svc.encrypted).toBe(svc);
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
