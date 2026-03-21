import { Test, TestingModule } from '@nestjs/testing';

import { CostSimulatorService } from './cost-simulator.service';
import { ProcedureType, CodingStandard, SimulateCostDto } from './dto/simulate-cost.dto';

describe('CostSimulatorService', () => {
    let service: CostSimulatorService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [CostSimulatorService],
        }).compile();

        service = module.get<CostSimulatorService>(CostSimulatorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('simulateCost', () => {
        const basePlanId = 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6';

        it('should return a cost simulation result for a consultation', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 200,
                planId: basePlanId,
                networkType: 'in-network',
            };

            const result = await service.simulateCost(dto);

            expect(result).toBeDefined();
            expect(result.procedureCode).toBe('99213');
            expect(result.procedureType).toBe(ProcedureType.CONSULTATION);
            expect(result.estimatedFullCost).toBe(200);
            expect(result.coveragePercentage).toBeGreaterThanOrEqual(0);
            expect(result.coveragePercentage).toBeLessThanOrEqual(100);
            expect(result.coveredAmount).toBeGreaterThanOrEqual(0);
            expect(result.outOfPocketAmount).toBeGreaterThanOrEqual(0);
        });

        it('should apply 80% coverage for CONSULTATION type', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 100,
                planId: basePlanId,
                networkType: 'in-network',
            };

            const result = await service.simulateCost(dto);

            expect(result.coveragePercentage).toBe(80);
            expect(result.coveredAmount).toBe(80);
            expect(result.outOfPocketAmount).toBe(20);
        });

        it('should apply 100% coverage for PREVENTIVE procedures', async () => {
            const dto: SimulateCostDto = {
                procedureCode: 'PREV-001',
                procedureType: ProcedureType.PREVENTIVE,
                estimatedFullCost: 150,
                planId: basePlanId,
                networkType: 'in-network',
            };

            const result = await service.simulateCost(dto);

            expect(result.coveragePercentage).toBe(100);
            expect(result.coveredAmount).toBe(150);
            expect(result.outOfPocketAmount).toBe(0);
        });

        it('should apply -20% network adjustment for out-of-network procedures', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 200,
                planId: basePlanId,
                networkType: 'out-of-network',
            };

            const result = await service.simulateCost(dto);

            expect(result.coverageAdjustments.networkAdjustment).toBe(-20);
            expect(result.coveragePercentage).toBe(60); // 80 - 20 = 60
        });

        it('should apply recurring discount for recurring procedures', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 100,
                planId: basePlanId,
                networkType: 'in-network',
                isRecurring: true,
                occurrences: 6,
            };

            const result = await service.simulateCost(dto);

            // 5 extra occurrences * 2% = 10% discount (max)
            expect(result.coverageAdjustments.recurringDiscount).toBeGreaterThan(0);
        });

        it('should include a cost breakdown in the result', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 100,
                planId: basePlanId,
                networkType: 'in-network',
            };

            const result = await service.simulateCost(dto);

            expect(result.costBreakdown).toBeDefined();
            expect(result.costBreakdown.professionalFee).toBeDefined();
        });

        it('should include a simulatedAt timestamp in the result', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 100,
                planId: basePlanId,
                networkType: 'in-network',
            };

            const result = await service.simulateCost(dto);

            expect(result.simulatedAt).toBeDefined();
            expect(new Date(result.simulatedAt)).toBeInstanceOf(Date);
        });

        it('should apply preferred facility adjustment for facility IDs starting with a, b, or c', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 100,
                planId: basePlanId,
                networkType: 'in-network',
                facilityId: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
            };

            const result = await service.simulateCost(dto);

            expect(result.coverageAdjustments.facilityAdjustment).toBe(10);
        });

        it('should return 90% coverage for EMERGENCY procedures', async () => {
            const dto: SimulateCostDto = {
                procedureCode: 'EM-001',
                procedureType: ProcedureType.EMERGENCY,
                estimatedFullCost: 500,
                planId: basePlanId,
                networkType: 'in-network',
            };

            const result = await service.simulateCost(dto);

            expect(result.coveragePercentage).toBe(90);
            expect(result.coveredAmount).toBe(450);
            expect(result.outOfPocketAmount).toBe(50);
        });

        it('should include the coding standard when provided', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                codingStandard: CodingStandard.CPT,
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 100,
                planId: basePlanId,
                networkType: 'in-network',
            };

            const result = await service.simulateCost(dto);

            expect(result.codingStandard).toBe(CodingStandard.CPT);
        });

        it('should handle missing optional fields with defaults', async () => {
            const dto: SimulateCostDto = {
                procedureCode: '99213',
                procedureType: ProcedureType.CONSULTATION,
                estimatedFullCost: 100,
                planId: basePlanId,
            };

            const result = await service.simulateCost(dto);

            expect(result.isRecurring).toBe(false);
            expect(result.occurrences).toBe(1);
        });
    });
});
