import { Test, TestingModule } from '@nestjs/testing';

import { CreateNutritionRecordDto, FoodItemDto } from './dto/create-nutrition-record.dto';
import { FilterNutritionDto } from './dto/filter-nutrition.dto';
import { UpdateNutritionRecordDto } from './dto/update-nutrition-record.dto';
import { NutritionController } from './nutrition.controller';
import { NutritionService } from './nutrition.service';

describe('NutritionController', () => {
    let controller: NutritionController;
    let nutritionService: jest.Mocked<NutritionService>;

    const mockUserId = 'user-123';
    const mockRequest = { user: { id: mockUserId } };

    const mockNutritionRecord = {
        id: 'record-1',
        userId: mockUserId,
        mealType: 'lunch',
        foods: [{ name: 'Chicken', calories: 300, protein: 35 }],
        calories: 300,
        protein: 35,
        carbs: null,
        fat: null,
        date: new Date('2026-03-23T12:00:00Z'),
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const mockNutritionService: Partial<jest.Mocked<NutritionService>> = {
            listNutritionRecords: jest.fn(),
            getNutritionRecord: jest.fn(),
            createNutritionRecord: jest.fn(),
            updateNutritionRecord: jest.fn(),
            getDailySummary: jest.fn(),
            getNutritionGoals: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [NutritionController],
            providers: [{ provide: NutritionService, useValue: mockNutritionService }],
        }).compile();

        controller = module.get<NutritionController>(NutritionController);
        nutritionService = module.get(NutritionService);
    });

    describe('listNutritionRecords', () => {
        it('should return paginated records for the authenticated user', async () => {
            const filters: FilterNutritionDto = { limit: 10, offset: 0 };
            const expected = { records: [mockNutritionRecord], total: 1, limit: 10, offset: 0 };
            nutritionService.listNutritionRecords.mockResolvedValue(expected);

            const result = await controller.listNutritionRecords(mockRequest, filters);

            expect(nutritionService.listNutritionRecords).toHaveBeenCalledWith(mockUserId, filters);
            expect(result).toEqual(expected);
        });

        it('should pass date range filters to the service', async () => {
            const filters: FilterNutritionDto = {
                startDate: '2026-03-01',
                endDate: '2026-03-23',
                limit: 20,
                offset: 0,
            };
            const expected = { records: [], total: 0, limit: 20, offset: 0 };
            nutritionService.listNutritionRecords.mockResolvedValue(expected);

            await controller.listNutritionRecords(mockRequest, filters);

            expect(nutritionService.listNutritionRecords).toHaveBeenCalledWith(mockUserId, filters);
        });
    });

    describe('getDailySummary', () => {
        it('should return daily summary for the authenticated user', async () => {
            const summary = {
                date: '2026-03-23',
                totalCalories: 1800,
                totalProtein: 90,
                totalCarbs: 200,
                totalFat: 60,
                mealCount: 3,
            };
            nutritionService.getDailySummary.mockResolvedValue(summary);

            const result = await controller.getDailySummary(mockRequest, '2026-03-23');

            expect(nutritionService.getDailySummary).toHaveBeenCalledWith(mockUserId, '2026-03-23');
            expect(result).toEqual(summary);
        });

        it('should use undefined date when not provided', async () => {
            const summary = {
                date: '2026-03-23',
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                mealCount: 0,
            };
            nutritionService.getDailySummary.mockResolvedValue(summary);

            await controller.getDailySummary(mockRequest, undefined);

            expect(nutritionService.getDailySummary).toHaveBeenCalledWith(mockUserId, undefined);
        });
    });

    describe('getNutritionRecord', () => {
        it('should return a single record by id for the authenticated user', async () => {
            nutritionService.getNutritionRecord.mockResolvedValue(mockNutritionRecord);

            const result = await controller.getNutritionRecord('record-1', mockRequest);

            expect(nutritionService.getNutritionRecord).toHaveBeenCalledWith(
                'record-1',
                mockUserId
            );
            expect(result).toEqual(mockNutritionRecord);
        });
    });

    describe('createNutritionRecord', () => {
        it('should create a nutrition record and return it', async () => {
            const foodItem: FoodItemDto = { name: 'Apple', calories: 95, protein: 0.5 };
            const createDto: CreateNutritionRecordDto = {
                mealType: 'snack',
                foods: [foodItem],
                calories: 95,
                protein: 0.5,
                date: new Date('2026-03-23T15:00:00Z'),
            };
            nutritionService.createNutritionRecord.mockResolvedValue(mockNutritionRecord);

            const result = await controller.createNutritionRecord(mockRequest, createDto);

            expect(nutritionService.createNutritionRecord).toHaveBeenCalledWith(
                mockUserId,
                createDto
            );
            expect(result).toEqual(mockNutritionRecord);
        });
    });

    describe('updateNutritionRecord', () => {
        it('should update an existing nutrition record', async () => {
            const updateDto: UpdateNutritionRecordDto = { calories: 350, notes: 'Extra serving' };
            const updated = { ...mockNutritionRecord, calories: 350, notes: 'Extra serving' };
            nutritionService.updateNutritionRecord.mockResolvedValue(updated);

            const result = await controller.updateNutritionRecord(
                'record-1',
                mockRequest,
                updateDto
            );

            expect(nutritionService.updateNutritionRecord).toHaveBeenCalledWith(
                'record-1',
                mockUserId,
                updateDto
            );
            expect(result).toEqual(updated);
        });
    });

    describe('getNutritionGoals', () => {
        it('should return nutrition goals for the authenticated user', async () => {
            const goals = { calories: 2000, protein: 50, carbs: 275, fat: 78 };
            nutritionService.getNutritionGoals.mockResolvedValue(goals);

            const result = await controller.getNutritionGoals(mockRequest);

            expect(nutritionService.getNutritionGoals).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(goals);
        });
    });
});
