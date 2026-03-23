import { Test, TestingModule } from '@nestjs/testing';

import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { CreateCycleRecordDto } from './dto/create-cycle-record.dto';
import { FilterCycleDto } from './dto/filter-cycle.dto';
import { UpdateCycleRecordDto } from './dto/update-cycle-record.dto';

describe('CycleController', () => {
    let controller: CycleController;
    let cycleService: jest.Mocked<CycleService>;

    const mockUserId = 'user-123';
    const mockRequest = { user: { id: mockUserId } };

    const mockCycleRecord = {
        id: 'record-1',
        userId: mockUserId,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-05'),
        cycleLength: 28,
        periodLength: 5,
        flowIntensity: 'medium',
        symptoms: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const mockCycleService: Partial<jest.Mocked<CycleService>> = {
            listCycleRecords: jest.fn(),
            getCycleRecord: jest.fn(),
            createCycleRecord: jest.fn(),
            updateCycleRecord: jest.fn(),
            getPredictions: jest.fn(),
            getCycleHistory: jest.fn(),
            getSymptomsSummary: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CycleController],
            providers: [{ provide: CycleService, useValue: mockCycleService }],
        }).compile();

        controller = module.get<CycleController>(CycleController);
        cycleService = module.get(CycleService);
    });

    describe('listCycleRecords', () => {
        it('should return paginated cycle records for the authenticated user', async () => {
            const filter: FilterCycleDto = { limit: 10, offset: 0 };
            const expected = { records: [mockCycleRecord], total: 1, limit: 10, offset: 0 };
            cycleService.listCycleRecords.mockResolvedValue(expected);

            const result = await controller.listCycleRecords(mockRequest, filter);

            expect(result).toEqual(expected);
            expect(cycleService.listCycleRecords).toHaveBeenCalledWith(mockUserId, filter);
        });

        it('should pass date range filters to the service', async () => {
            const filter: FilterCycleDto = { startDate: '2026-01-01', endDate: '2026-03-31' };
            cycleService.listCycleRecords.mockResolvedValue({
                records: [],
                total: 0,
                limit: 20,
                offset: 0,
            });

            await controller.listCycleRecords(mockRequest, filter);

            expect(cycleService.listCycleRecords).toHaveBeenCalledWith(mockUserId, filter);
        });
    });

    describe('getCycleRecord', () => {
        it('should return a single cycle record by ID', async () => {
            cycleService.getCycleRecord.mockResolvedValue(mockCycleRecord);

            const result = await controller.getCycleRecord(mockRequest, 'record-1');

            expect(result).toEqual(mockCycleRecord);
            expect(cycleService.getCycleRecord).toHaveBeenCalledWith(mockUserId, 'record-1');
        });
    });

    describe('createCycleRecord', () => {
        it('should create and return a new cycle record', async () => {
            const dto: CreateCycleRecordDto = {
                startDate: new Date('2026-03-15'),
                cycleLength: 28,
                periodLength: 5,
                flowIntensity: 'medium',
            };
            cycleService.createCycleRecord.mockResolvedValue(mockCycleRecord);

            const result = await controller.createCycleRecord(mockRequest, dto);

            expect(result).toEqual(mockCycleRecord);
            expect(cycleService.createCycleRecord).toHaveBeenCalledWith(mockUserId, dto);
        });
    });

    describe('updateCycleRecord', () => {
        it('should update and return the cycle record', async () => {
            const dto: UpdateCycleRecordDto = { flowIntensity: 'heavy' };
            const updated = { ...mockCycleRecord, flowIntensity: 'heavy' };
            cycleService.updateCycleRecord.mockResolvedValue(updated);

            const result = await controller.updateCycleRecord(mockRequest, 'record-1', dto);

            expect(result).toEqual(updated);
            expect(cycleService.updateCycleRecord).toHaveBeenCalledWith(
                mockUserId,
                'record-1',
                dto
            );
        });
    });

    describe('getPredictions', () => {
        it('should return cycle predictions for the user', async () => {
            const prediction = {
                predictedNextStart: new Date('2026-04-12'),
                averageCycleLength: 28,
                averagePeriodLength: 5,
                confidence: 0.83,
            };
            cycleService.getPredictions.mockResolvedValue(prediction);

            const result = await controller.getPredictions(mockRequest);

            expect(result).toEqual(prediction);
            expect(cycleService.getPredictions).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe('getCycleHistory', () => {
        it('should return cycle history with stats', async () => {
            const history = {
                records: [mockCycleRecord],
                stats: {
                    totalCycles: 1,
                    averageCycleLength: 28,
                    averagePeriodLength: 5,
                    shortestCycle: 28,
                    longestCycle: 28,
                },
            };
            cycleService.getCycleHistory.mockResolvedValue(history);

            const result = await controller.getCycleHistory(mockRequest);

            expect(result).toEqual(history);
            expect(cycleService.getCycleHistory).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe('getSymptomsSummary', () => {
        it('should return symptom frequency summary', async () => {
            const summary = [{ type: 'cramps', count: 3, severities: ['mild', 'moderate'] }];
            cycleService.getSymptomsSummary.mockResolvedValue(summary);

            const result = await controller.getSymptomsSummary(mockRequest);

            expect(result).toEqual(summary);
            expect(cycleService.getSymptomsSummary).toHaveBeenCalledWith(mockUserId);
        });
    });
});
