/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Test, TestingModule } from '@nestjs/testing';

import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
    let service: TemplatesService;

    const mockPrismaService = {
        notificationTemplate: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        setContext: jest.fn(),
    };

    const mockTemplate = {
        id: 'template-1',
        templateId: 'APPOINTMENT_REMINDER',
        title: 'Appointment Reminder',
        body: 'Your appointment with {{doctorName}} is at {{time}}',
        language: 'pt-BR',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TemplatesService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        service = module.get<TemplatesService>(TemplatesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // findById
    // -------------------------------------------------------------------------
    describe('findById', () => {
        it('should return a template when found by ID', async () => {
            mockPrismaService.notificationTemplate.findUnique.mockResolvedValue(mockTemplate);

            const result = await service.findById('template-1');

            expect(mockPrismaService.notificationTemplate.findUnique).toHaveBeenCalledWith({
                where: { id: 'template-1' },
            });
            expect(result).toEqual(mockTemplate);
        });

        it('should return null when template is not found', async () => {
            mockPrismaService.notificationTemplate.findUnique.mockResolvedValue(null);

            const result = await service.findById('nonexistent-id');

            expect(result).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // findByCode
    // -------------------------------------------------------------------------
    describe('findByCode', () => {
        it('should return a template found by its templateId code', async () => {
            mockPrismaService.notificationTemplate.findFirst.mockResolvedValue(mockTemplate);

            const result = await service.findByCode('APPOINTMENT_REMINDER');

            expect(mockPrismaService.notificationTemplate.findFirst).toHaveBeenCalledWith({
                where: { templateId: 'APPOINTMENT_REMINDER' },
            });
            expect(result).toEqual(mockTemplate);
        });

        it('should return null when no template with that code exists', async () => {
            mockPrismaService.notificationTemplate.findFirst.mockResolvedValue(null);

            const result = await service.findByCode('UNKNOWN_CODE');

            expect(result).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // findByTemplateId
    // -------------------------------------------------------------------------
    describe('findByTemplateId', () => {
        it('should return all templates matching the templateId', async () => {
            mockPrismaService.notificationTemplate.findMany.mockResolvedValue([mockTemplate]);

            const result = await service.findByTemplateId('APPOINTMENT_REMINDER');

            expect(mockPrismaService.notificationTemplate.findMany).toHaveBeenCalledWith({
                where: { templateId: 'APPOINTMENT_REMINDER' },
            });
            expect(result).toEqual([mockTemplate]);
        });

        it('should filter by language when provided', async () => {
            mockPrismaService.notificationTemplate.findMany.mockResolvedValue([mockTemplate]);

            await service.findByTemplateId('APPOINTMENT_REMINDER', 'pt-BR');

            expect(mockPrismaService.notificationTemplate.findMany).toHaveBeenCalledWith({
                where: { templateId: 'APPOINTMENT_REMINDER', language: 'pt-BR' },
            });
        });

        it('should return empty array when no templates match', async () => {
            mockPrismaService.notificationTemplate.findMany.mockResolvedValue([]);

            const result = await service.findByTemplateId('NO_MATCH');

            expect(result).toEqual([]);
        });
    });

    // -------------------------------------------------------------------------
    // findAll
    // -------------------------------------------------------------------------
    describe('findAll', () => {
        it('should return all templates without a filter', async () => {
            mockPrismaService.notificationTemplate.findMany.mockResolvedValue([mockTemplate]);

            const result = await service.findAll();

            expect(mockPrismaService.notificationTemplate.findMany).toHaveBeenCalledWith({
                where: undefined,
            });
            expect(result).toEqual([mockTemplate]);
        });

        it('should apply the provided filter', async () => {
            mockPrismaService.notificationTemplate.findMany.mockResolvedValue([mockTemplate]);

            await service.findAll({ isActive: true });

            expect(mockPrismaService.notificationTemplate.findMany).toHaveBeenCalledWith({
                where: { isActive: true },
            });
        });
    });

    // -------------------------------------------------------------------------
    // create
    // -------------------------------------------------------------------------
    describe('create', () => {
        it('should create and return the new template', async () => {
            mockPrismaService.notificationTemplate.create.mockResolvedValue(mockTemplate);
            const { id: _id, ...templateData } = mockTemplate;

            const result = await service.create(templateData as any);

            expect(mockPrismaService.notificationTemplate.create).toHaveBeenCalledWith({
                data: templateData,
            });
            expect(result).toEqual(mockTemplate);
        });

        it('should propagate errors from prisma on create', async () => {
            mockPrismaService.notificationTemplate.create.mockRejectedValue(
                new Error('Unique constraint violation')
            );

            await expect(service.create({} as any)).rejects.toThrow('Unique constraint violation');
        });
    });

    // -------------------------------------------------------------------------
    // update
    // -------------------------------------------------------------------------
    describe('update', () => {
        it('should update and return the modified template', async () => {
            const updatedTemplate = { ...mockTemplate, title: 'Updated Title' };
            mockPrismaService.notificationTemplate.update.mockResolvedValue(updatedTemplate);

            const result = await service.update('template-1', { title: 'Updated Title' });

            expect(mockPrismaService.notificationTemplate.update).toHaveBeenCalledWith({
                where: { id: 'template-1' },
                data: { title: 'Updated Title' },
            });
            expect(result.title).toBe('Updated Title');
        });

        it('should propagate errors from prisma on update', async () => {
            mockPrismaService.notificationTemplate.update.mockRejectedValue(
                new Error('Record not found')
            );

            await expect(service.update('nonexistent-id', {})).rejects.toThrow('Record not found');
        });
    });

    // -------------------------------------------------------------------------
    // delete
    // -------------------------------------------------------------------------
    describe('delete', () => {
        it('should return true when the template is deleted successfully', async () => {
            mockPrismaService.notificationTemplate.delete.mockResolvedValue(mockTemplate);

            const result = await service.delete('template-1');

            expect(result).toBe(true);
        });

        it('should return false when the template delete throws an error', async () => {
            mockPrismaService.notificationTemplate.delete.mockRejectedValue(
                new Error('Record not found')
            );

            const result = await service.delete('nonexistent-id');

            expect(result).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // formatTemplateWithData
    // -------------------------------------------------------------------------
    describe('formatTemplateWithData', () => {
        it('should replace {{variable}} placeholders with provided data', () => {
            const result = service.formatTemplateWithData(mockTemplate as any, {
                doctorName: 'Dr. Smith',
                time: '2:00 PM',
            });

            expect((result as any).body).toBe('Your appointment with Dr. Smith is at 2:00 PM');
        });

        it('should leave unmatched placeholders as-is when data key is missing', () => {
            const result = service.formatTemplateWithData(mockTemplate as any, {
                doctorName: 'Dr. Silva',
            });

            expect((result as any).body).toContain('{{time}}');
        });

        it('should replace placeholders in both title and body', () => {
            const template = {
                ...mockTemplate,
                title: 'Hello {{name}}',
                body: 'Message for {{name}}',
            };

            const result = service.formatTemplateWithData(template as any, { name: 'Jane' }) as any;

            expect(result.title).toBe('Hello Jane');
            expect(result.body).toBe('Message for Jane');
        });
    });
});
