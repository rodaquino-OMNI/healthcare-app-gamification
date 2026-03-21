import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { Test, TestingModule } from '@nestjs/testing';

import { ProcedureType, VerifyCoverageDto } from './dto/verify-coverage.dto';
import { InsuranceService } from './insurance.service';

// Mock the planService config to prevent validation failures in tests
// Note: jest.mock is hoisted, so we define the config inline inside the factory
jest.mock('../config/configuration', () => {
    const configValue = {
        server: {
            port: 3000,
            host: 'localhost',
            cors: { origin: [], credentials: true },
            timeout: 30000,
        },
        database: { url: 'postgresql://localhost/test', schema: 'plan', ssl: false, poolSize: 5 },
        insuranceApi: {
            baseUrl: 'http://insurance-api.test',
            apiKey: 'test-key',
            timeout: 10000,
            retries: 3,
            rateLimit: { windowMs: 60000, maxRequests: 100 },
        },
        claims: {
            supportedDocumentTypes: ['pdf'],
            maxDocumentSize: 10485760,
            maxDocumentsPerClaim: 5,
            autoApprovalThreshold: 100,
            processingTimeEstimate: { standard: 3, express: 1 },
            retentionPeriod: 2555,
        },
        storage: {
            provider: 's3',
            s3: {
                bucket: 'test',
                region: 'sa-east-1',
                accessKeyId: 'key',
                secretAccessKey: 'secret',
                pathPrefix: 'plan',
            },
            local: {},
        },
        costSimulator: {
            currency: 'BRL',
            procedureCatalog: { source: 'database', refreshInterval: 86400 },
            coverageDefaults: {
                consultations: 80,
                examinations: 70,
                procedures: 60,
                emergencies: 90,
            },
        },
        gamification: {
            enabled: true,
            timeout: 5000,
            events: {
                claimSubmitted: 'CLAIM_SUBMITTED',
                claimApproved: 'CLAIM_APPROVED',
                digitalCardAccessed: 'DIGITAL_CARD_ACCESSED',
                benefitUsed: 'BENEFIT_USED',
            },
        },
        notifications: {
            enabled: true,
            timeout: 5000,
            templates: {
                claimStatus: 'plan-claim-status',
                claimReminder: 'plan-claim-reminder',
                benefitExpiration: 'plan-benefit-expiration',
            },
        },
        logging: { level: 'info', format: 'json', destination: 'stdout' },
    };
    const fn = () => configValue;
    fn.KEY = 'planService';
    // __esModule: true is required for ts-jest to correctly handle the default export
    return { __esModule: true, default: fn, planService: fn };
});

const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

const mockTracingService = {
    createSpan: jest.fn(),
};

describe('InsuranceService', () => {
    let service: InsuranceService;

    beforeEach(async () => {
        jest.clearAllMocks();
        mockTracingService.createSpan.mockImplementation((_name: string, fn: () => unknown) =>
            fn()
        );

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InsuranceService,
                { provide: LoggerService, useValue: mockLoggerService },
                { provide: TracingService, useValue: mockTracingService },
            ],
        }).compile();

        service = module.get<InsuranceService>(InsuranceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('verifyCoverage', () => {
        it('should return true for CONSULTATION procedure type', async () => {
            const dto: VerifyCoverageDto = {
                procedureCode: 'CON-001',
                procedureType: ProcedureType.CONSULTATION,
                planId: 'test-plan-id',
            };

            const result = await service.verifyCoverage(dto);

            expect(result).toBe(true);
        });

        it('should return true for EXAM procedure type', async () => {
            const dto: VerifyCoverageDto = {
                procedureCode: 'EX-001',
                procedureType: ProcedureType.EXAM,
                planId: 'test-plan-id',
            };

            const result = await service.verifyCoverage(dto);

            expect(result).toBe(true);
        });

        it('should return true for PREVENTIVE procedure type', async () => {
            const dto: VerifyCoverageDto = {
                procedureCode: 'PREV-001',
                procedureType: ProcedureType.PREVENTIVE,
                planId: 'test-plan-id',
            };

            const result = await service.verifyCoverage(dto);

            expect(result).toBe(true);
        });

        it('should return true for EMERGENCY procedure type', async () => {
            const dto: VerifyCoverageDto = {
                procedureCode: 'EM-001',
                procedureType: ProcedureType.EMERGENCY,
                planId: 'test-plan-id',
            };

            const result = await service.verifyCoverage(dto);

            expect(result).toBe(true);
        });

        it('should return true for in-network THERAPY procedure', async () => {
            const dto: VerifyCoverageDto = {
                procedureCode: 'THER-001',
                procedureType: ProcedureType.THERAPY,
                planId: 'test-plan-id',
                isInNetwork: true,
            };

            const result = await service.verifyCoverage(dto);

            expect(result).toBe(true);
        });

        it('should return false for out-of-network THERAPY procedure', async () => {
            const dto: VerifyCoverageDto = {
                procedureCode: 'THER-001',
                procedureType: ProcedureType.THERAPY,
                planId: 'test-plan-id',
                isInNetwork: false,
            };

            const result = await service.verifyCoverage(dto);

            expect(result).toBe(false);
        });

        it('should log coverage verification result', async () => {
            const dto: VerifyCoverageDto = {
                procedureCode: 'CON-001',
                procedureType: ProcedureType.CONSULTATION,
                planId: 'test-plan-id',
            };

            await service.verifyCoverage(dto);

            expect(mockLoggerService.log).toHaveBeenCalled();
        });

        it('should throw AppException when tracing span throws an unexpected error', async () => {
            mockTracingService.createSpan.mockImplementationOnce(() => {
                throw new Error('Unexpected tracing error');
            });

            const dto: VerifyCoverageDto = {
                procedureCode: 'CON-001',
                procedureType: ProcedureType.CONSULTATION,
                planId: 'test-plan-id',
            };

            await expect(service.verifyCoverage(dto)).rejects.toThrow();

            mockTracingService.createSpan.mockImplementation((_name, fn) => fn());
        });
    });
});
