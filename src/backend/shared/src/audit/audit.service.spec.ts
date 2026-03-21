import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { AuditService } from './audit.service';
import { PrismaService } from '../database/prisma.service';
import { LoggerService } from '../logging/logger.service';
import { AuditAction, AuditLogEntry } from './dto/audit-log.dto';

describe('AuditService', () => {
    let service: AuditService;
    let prismaService: jest.Mocked<Pick<PrismaService, 'auditLog'>>;

    const mockChildLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const mockLoggerService = {
        createLogger: jest.fn().mockReturnValue(mockChildLogger),
    };

    const mockPrismaService = {
        auditLog: {
            create: jest.fn().mockResolvedValue({}),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        service = module.get<AuditService>(AuditService);
        prismaService = mockPrismaService as any;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call loggerService.createLogger with "AuditService" during construction', () => {
        expect(mockLoggerService.createLogger).toHaveBeenCalledWith('AuditService');
    });

    describe('log()', () => {
        it('should call prisma.auditLog.create with the correct data', async () => {
            const entry: AuditLogEntry = {
                userId: 'user-123',
                action: AuditAction.READ,
                resourceType: 'HealthMetric',
                resourceId: 'metric-456',
                journeyId: 'journey-789',
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0',
                metadata: { source: 'mobile' },
            };

            service.log(entry);

            // Flush the fire-and-forget promise microtask queue
            await new Promise((r) => setTimeout(r, 0));

            expect(prismaService.auditLog.create).toHaveBeenCalledTimes(1);
            expect(prismaService.auditLog.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user-123',
                    action: AuditAction.READ,
                    resourceType: 'HealthMetric',
                    resourceId: 'metric-456',
                    journeyId: 'journey-789',
                    ipAddress: '192.168.1.1',
                    userAgent: 'Mozilla/5.0',
                    metadata: { source: 'mobile' },
                },
            });
        });

        it('should use null for optional fields when they are absent', async () => {
            const entry: AuditLogEntry = {
                userId: 'user-abc',
                action: AuditAction.WRITE,
                resourceType: 'Plan',
            };

            service.log(entry);
            await new Promise((r) => setTimeout(r, 0));

            expect(prismaService.auditLog.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user-abc',
                    action: AuditAction.WRITE,
                    resourceType: 'Plan',
                    resourceId: null,
                    journeyId: null,
                    ipAddress: null,
                    userAgent: null,
                    metadata: Prisma.JsonNull,
                },
            });
        });

        it('should not throw when prisma.auditLog.create fails (fire-and-forget)', async () => {
            mockPrismaService.auditLog.create.mockRejectedValueOnce(
                new Error('DB connection lost')
            );

            const entry: AuditLogEntry = {
                userId: 'user-fail',
                action: AuditAction.DELETE,
                resourceType: 'Document',
            };

            // log() must not throw synchronously or cause unhandled rejection
            expect(() => service.log(entry)).not.toThrow();

            // Flush the rejected promise — the service catches it internally
            await new Promise((r) => setTimeout(r, 0));

            // The internal logger should have recorded the error
            expect(mockChildLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('DB connection lost'),
                expect.anything()
            );
        });

        it('should handle non-Error rejections without throwing', async () => {
            mockPrismaService.auditLog.create.mockRejectedValueOnce('plain string error');

            const entry: AuditLogEntry = {
                userId: 'user-x',
                action: AuditAction.LOGIN,
                resourceType: 'Session',
            };

            expect(() => service.log(entry)).not.toThrow();
            await new Promise((r) => setTimeout(r, 0));

            expect(mockChildLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('plain string error'),
                undefined
            );
        });
    });

    describe('logPHIAccess()', () => {
        it('should call log() with phiAccess:true in metadata', async () => {
            const logSpy = jest.spyOn(service, 'log');

            service.logPHIAccess('user-phi', 'Patient', 'patient-999', AuditAction.READ);

            expect(logSpy).toHaveBeenCalledTimes(1);
            expect(logSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: 'user-phi',
                    resourceType: 'Patient',
                    resourceId: 'patient-999',
                    action: AuditAction.READ,
                    metadata: expect.objectContaining({ phiAccess: true }),
                })
            );
        });

        it('should merge extra metadata with phiAccess:true', async () => {
            const logSpy = jest.spyOn(service, 'log');

            service.logPHIAccess('user-merge', 'HealthRecord', 'record-1', AuditAction.EXPORT, {
                requestId: 'req-42',
                region: 'us-east-1',
            });

            expect(logSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    metadata: {
                        requestId: 'req-42',
                        region: 'us-east-1',
                        phiAccess: true,
                    },
                })
            );
        });

        it('should call prisma.auditLog.create after logPHIAccess', async () => {
            service.logPHIAccess('user-create', 'Claim', 'claim-7', AuditAction.READ);
            await new Promise((r) => setTimeout(r, 0));

            expect(prismaService.auditLog.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        userId: 'user-create',
                        metadata: expect.objectContaining({ phiAccess: true }),
                    }),
                })
            );
        });
    });
});
