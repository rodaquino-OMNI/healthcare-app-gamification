import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { EncryptionService } from '../encryption';

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
            const useSpy = jest.spyOn(service, '$use').mockImplementation();

            await service.onModuleInit();

            expect(useSpy).toHaveBeenCalled();
            expect(connectSpy).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from $connect', async () => {
            jest.spyOn(service, '$use').mockImplementation();
            jest.spyOn(service, '$connect').mockRejectedValue(new Error('Connection failed'));

            await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
        });
    });

    describe('onModuleInit without EncryptionService', () => {
        it('should not attach encryption middleware when EncryptionService is not provided', async () => {
            const moduleWithout: TestingModule = await Test.createTestingModule({
                providers: [PrismaService],
            }).compile();

            const svc = moduleWithout.get<PrismaService>(PrismaService);
            const connectSpy = jest.spyOn(svc, '$connect').mockResolvedValue();
            const useSpy = jest.spyOn(svc, '$use').mockImplementation();

            await svc.onModuleInit();

            expect(useSpy).not.toHaveBeenCalled();
            expect(connectSpy).toHaveBeenCalledTimes(1);
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
