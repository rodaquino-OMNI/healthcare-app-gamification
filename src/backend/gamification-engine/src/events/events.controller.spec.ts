/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ProcessEventDto } from './dto/process-event.dto';
import { LoggerService } from '../../../shared/src/logging/logger.service';

// Mock the JwtAuthGuard to avoid auth setup in unit tests
jest.mock('@app/auth/auth/guards/jwt-auth.guard', () => ({
    JwtAuthGuard: jest.fn().mockImplementation(() => ({
        canActivate: jest.fn().mockReturnValue(true),
    })),
}));

describe('EventsController', () => {
    let controller: EventsController;
    let eventsService: EventsService;

    const mockEventsService = {
        processEvent: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
            providers: [
                { provide: EventsService, useValue: mockEventsService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        })
            .overrideGuard(require('@app/auth/auth/guards/jwt-auth.guard').JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<EventsController>(EventsController);
        eventsService = module.get<EventsService>(EventsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // ----------------------------------------------------------------
    // processEvent
    // ----------------------------------------------------------------
    describe('processEvent', () => {
        const validDto: ProcessEventDto = {
            type: 'STEPS_RECORDED',
            userId: 'user-1',
            journey: 'health',
            data: { steps: 10000 },
        };

        const successResponse = {
            success: true,
            profile: { id: 'profile-1', userId: 'user-1', level: 2, xp: 200 },
            message: 'Event processed successfully',
        };

        it('should call eventsService.processEvent with the provided DTO', async () => {
            mockEventsService.processEvent.mockResolvedValue(successResponse);

            await controller.processEvent(validDto);

            expect(mockEventsService.processEvent).toHaveBeenCalledWith(validDto);
        });

        it('should return the result from eventsService', async () => {
            mockEventsService.processEvent.mockResolvedValue(successResponse);

            const result = await controller.processEvent(validDto);

            expect(result).toEqual(successResponse);
            expect(result.success).toBe(true);
        });

        it('should propagate errors thrown by the service', async () => {
            mockEventsService.processEvent.mockRejectedValue(new Error('Processing failed'));

            await expect(controller.processEvent(validDto)).rejects.toThrow('Processing failed');
        });

        it('should handle events without an optional journey field', async () => {
            const dtoWithoutJourney: ProcessEventDto = {
                type: 'GENERIC_EVENT',
                userId: 'user-2',
                data: {},
            };

            mockEventsService.processEvent.mockResolvedValue({ success: true });

            const result = await controller.processEvent(dtoWithoutJourney);

            expect(mockEventsService.processEvent).toHaveBeenCalledWith(dtoWithoutJourney);
            expect(result.success).toBe(true);
        });
    });
});
