import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateNutritionRecordDto, FoodItemDto } from './dto/create-nutrition-record.dto';
import { FilterNutritionDto } from './dto/filter-nutrition.dto';
import { NutritionService } from './nutrition.service';

describe('NutritionService', () => {
    let service: NutritionService;
    let prismaService: {
        nutritionLog: {
            findMany: jest.Mock;
            findFirst: jest.Mock;
            findUnique: jest.Mock;
            create: jest.Mock;
            update: jest.Mock;
            count: jest.Mock;
        };
    };
    let redisService: jest.Mocked<Pick<RedisService, 'get' | 'set' | 'del'>>;

    const mockUserId = 'user-abc';
    const mockRecordId = 'record-xyz';
    const mockDate = new Date('2026-03-23T12:00:00Z');

    const mockNutritionRecord = {
        id: mockRecordId,
        userId: mockUserId,
        mealType: 'lunch',
        foods: [{ name: 'Salmon', calories: 400, protein: 42, carbs: 0, fat: 18 }],
        calories: 400,
        protein: 42,
        carbs: 0,
        fat: 18,
        date: mockDate,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        prismaService = {
            nutritionLog: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                count: jest.fn(),
            },
        };

        redisService = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue('OK'),
            del: jest.fn().mockResolvedValue(1),
        } as jest.Mocked<Pick<RedisService, 'get' | 'set' | 'del'>>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NutritionService,
                { provide: PrismaService, useValue: prismaService },
                { provide: RedisService, useValue: redisService },
            ],
        }).compile();

        service = module.get<NutritionService>(NutritionService);
    });

    describe('listNutritionRecords', () => {
        it('should return paginated records from database when cache is empty', async () => {
            const filters: FilterNutritionDto = { limit: 10, offset: 0 };
            prismaService.nutritionLog.findMany.mockResolvedValue([mockNutritionRecord]);
            prismaService.nutritionLog.count.mockResolvedValue(1);

            const result = await service.listNutritionRecords(mockUserId, filters);

            expect(prismaService.nutritionLog.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: mockUserId }, take: 10, skip: 0 })
            );
            expect(result.records).toEqual([mockNutritionRecord]);
            expect(result.total).toBe(1);
        });

        it('should return cached result when cache hit occurs', async () => {
            const cached = { records: [mockNutritionRecord], total: 1, limit: 20, offset: 0 };
            redisService.get.mockResolvedValue(JSON.stringify(cached));

            const result = await service.listNutritionRecords(mockUserId, {});

            expect(prismaService.nutritionLog.findMany).not.toHaveBeenCalled();
            expect(result).toEqual(cached);
        });

        it('should apply date range filters to the where clause', async () => {
            const filters: FilterNutritionDto = {
                startDate: '2026-03-01',
                endDate: '2026-03-23',
            };
            prismaService.nutritionLog.findMany.mockResolvedValue([]);
            prismaService.nutritionLog.count.mockResolvedValue(0);

            await service.listNutritionRecords(mockUserId, filters);

            expect(prismaService.nutritionLog.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        userId: mockUserId,
                        date: expect.objectContaining({
                            gte: new Date('2026-03-01'),
                            lte: new Date('2026-03-23'),
                        }),
                    }),
                })
            );
        });
    });

    describe('getNutritionRecord', () => {
        it('should return a record when found', async () => {
            prismaService.nutritionLog.findFirst.mockResolvedValue(mockNutritionRecord);

            const result = await service.getNutritionRecord(mockRecordId, mockUserId);

            expect(prismaService.nutritionLog.findFirst).toHaveBeenCalledWith({
                where: { id: mockRecordId, userId: mockUserId },
            });
            expect(result).toEqual(mockNutritionRecord);
        });

        it('should throw NotFoundException when record does not exist', async () => {
            prismaService.nutritionLog.findFirst.mockResolvedValue(null);

            await expect(service.getNutritionRecord('nonexistent', mockUserId)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('createNutritionRecord', () => {
        it('should create and return a new nutrition record', async () => {
            const foodItem: FoodItemDto = { name: 'Rice', calories: 200, carbs: 45 };
            const createDto: CreateNutritionRecordDto = {
                mealType: 'dinner',
                foods: [foodItem],
                calories: 200,
                carbs: 45,
                date: mockDate,
            };
            prismaService.nutritionLog.create.mockResolvedValue(mockNutritionRecord);

            const result = await service.createNutritionRecord(mockUserId, createDto);

            expect(prismaService.nutritionLog.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    userId: mockUserId,
                    mealType: 'dinner',
                    calories: 200,
                }),
            });
            expect(result).toEqual(mockNutritionRecord);
        });

        it('should invalidate user cache after creating a record', async () => {
            const foodItem: FoodItemDto = { name: 'Banana', calories: 105 };
            const createDto: CreateNutritionRecordDto = {
                mealType: 'snack',
                foods: [foodItem],
                calories: 105,
                date: mockDate,
            };
            prismaService.nutritionLog.create.mockResolvedValue(mockNutritionRecord);

            await service.createNutritionRecord(mockUserId, createDto);

            expect(redisService.del).toHaveBeenCalled();
        });
    });

    describe('updateNutritionRecord', () => {
        it('should update and return the nutrition record when it exists', async () => {
            prismaService.nutritionLog.findFirst.mockResolvedValue(mockNutritionRecord);
            const updated = { ...mockNutritionRecord, calories: 500 };
            prismaService.nutritionLog.update.mockResolvedValue(updated);

            const result = await service.updateNutritionRecord(mockRecordId, mockUserId, {
                calories: 500,
            });

            expect(prismaService.nutritionLog.update).toHaveBeenCalledWith({
                where: { id: mockRecordId },
                data: expect.objectContaining({ calories: 500 }),
            });
            expect(result).toEqual(updated);
        });

        it('should throw NotFoundException when trying to update a non-existent record', async () => {
            prismaService.nutritionLog.findFirst.mockResolvedValue(null);

            await expect(
                service.updateNutritionRecord('nonexistent', mockUserId, { calories: 100 })
            ).rejects.toThrow(NotFoundException);

            expect(prismaService.nutritionLog.update).not.toHaveBeenCalled();
        });
    });

    describe('getDailySummary', () => {
        it('should sum calories, protein, carbs and fat for records on a given date', async () => {
            const records = [
                { ...mockNutritionRecord, calories: 400, protein: 42, carbs: 10, fat: 18 },
                {
                    ...mockNutritionRecord,
                    id: 'record-2',
                    mealType: 'breakfast',
                    calories: 350,
                    protein: 20,
                    carbs: 50,
                    fat: 10,
                },
            ];
            prismaService.nutritionLog.findMany.mockResolvedValue(records);

            const result = await service.getDailySummary(mockUserId, '2026-03-23');

            expect(result.totalCalories).toBe(750);
            expect(result.totalProtein).toBe(62);
            expect(result.totalCarbs).toBe(60);
            expect(result.totalFat).toBe(28);
            expect(result.mealCount).toBe(2);
        });

        it('should return zeroed summary when no records found for the day', async () => {
            prismaService.nutritionLog.findMany.mockResolvedValue([]);

            const result = await service.getDailySummary(mockUserId, '2026-03-23');

            expect(result.totalCalories).toBe(0);
            expect(result.totalProtein).toBe(0);
            expect(result.mealCount).toBe(0);
        });
    });

    describe('getNutritionGoals', () => {
        it('should return default nutrition goals for a user', async () => {
            const result = await service.getNutritionGoals(mockUserId);

            expect(result).toEqual({
                calories: 2000,
                protein: 50,
                carbs: 275,
                fat: 78,
            });
        });

        it('should return cached goals when available', async () => {
            const cachedGoals = { calories: 1800, protein: 60, carbs: 250, fat: 70 };
            redisService.get.mockResolvedValue(JSON.stringify(cachedGoals));

            const result = await service.getNutritionGoals(mockUserId);

            expect(result).toEqual(cachedGoals);
        });
    });
});
