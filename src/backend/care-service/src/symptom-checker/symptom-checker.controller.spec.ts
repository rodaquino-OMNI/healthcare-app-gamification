// Mock the JwtAuthGuard to avoid auth setup in unit tests
jest.mock('@app/auth/auth/guards/jwt-auth.guard', () => ({
    JwtAuthGuard: jest.fn().mockImplementation(() => ({
        canActivate: jest.fn().mockReturnValue(true),
    })),
}));

import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { Test, TestingModule } from '@nestjs/testing';

import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';

describe('SymptomCheckerController', () => {
    let controller: SymptomCheckerController;
    let service: SymptomCheckerService;

    const mockSymptomCheckerService = {
        checkSymptoms: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [SymptomCheckerController],
            providers: [
                {
                    provide: SymptomCheckerService,
                    useValue: mockSymptomCheckerService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<SymptomCheckerController>(SymptomCheckerController);
        service = module.get<SymptomCheckerService>(SymptomCheckerService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('checkSymptoms', () => {
        it('should return low severity guidance for minor symptoms', async () => {
            const dto = { symptoms: ['headache'] };
            const mockResult = {
                severity: 'low',
                guidance: 'Your symptoms suggest a minor condition.',
                careOptions: {
                    emergency: false,
                    appointmentRecommended: false,
                    telemedicineRecommended: false,
                },
            };
            mockSymptomCheckerService.checkSymptoms.mockResolvedValue(mockResult);

            const result = await controller.checkSymptoms(dto as any);

            expect(result).toEqual(mockResult);
            expect(service.checkSymptoms).toHaveBeenCalledWith(dto);
        });

        it('should return medium severity guidance for multiple symptoms', async () => {
            const dto = { symptoms: ['fever', 'cough', 'fatigue', 'body_aches', 'headache'] };
            const mockResult = {
                severity: 'medium',
                guidance: 'Your symptoms may require medical attention.',
                careOptions: {
                    emergency: false,
                    appointmentRecommended: true,
                    telemedicineRecommended: false,
                },
                possibleConditions: [
                    {
                        name: 'Influenza',
                        confidence: 0.6,
                        description: 'A viral infection.',
                    },
                ],
            };
            mockSymptomCheckerService.checkSymptoms.mockResolvedValue(mockResult);

            const result = await controller.checkSymptoms(dto as any);

            expect(result).toEqual(mockResult);
            expect(result.severity).toBe('medium');
        });

        it('should return emergency guidance for emergency symptoms', async () => {
            const dto = { symptoms: ['chest_pain', 'shortness_of_breath'] };
            const mockResult = {
                severity: 'high',
                guidance: 'Seek immediate medical attention.',
                emergencyNumber: '192',
                careOptions: {
                    emergency: true,
                    appointmentRecommended: false,
                    telemedicineRecommended: false,
                },
            };
            mockSymptomCheckerService.checkSymptoms.mockResolvedValue(mockResult);

            const result = await controller.checkSymptoms(dto as any);

            expect(result.careOptions.emergency).toBe(true);
            expect(result.emergencyNumber).toBeDefined();
        });

        it('should propagate errors from the symptom checker service', async () => {
            const dto = { symptoms: ['headache'] };
            mockSymptomCheckerService.checkSymptoms.mockRejectedValue(
                new Error('Symptom checker is currently disabled')
            );

            await expect(controller.checkSymptoms(dto as any)).rejects.toThrow(
                'Symptom checker is currently disabled'
            );
        });
    });
});
