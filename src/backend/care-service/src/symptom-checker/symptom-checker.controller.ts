import { PhiAccess } from '@app/shared/audit';
import { Controller, Post, Body, UseGuards } from '@nestjs/common'; // v10.0.0+
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';

import { CheckSymptomsDto } from './dto/check-symptoms.dto';
import { SymptomCheckerService } from './symptom-checker.service';

/**
 * Controller for handling symptom check requests in the Care Now journey.
 * Provides an endpoint for users to input symptoms and receive preliminary guidance.
 * Part of the F-102 Care Now Journey feature.
 */
@Controller('symptom-checker')
export class SymptomCheckerController {
    /**
     * Initializes the SymptomCheckerController.
     *
     * @param symptomCheckerService Service that handles symptom checking logic
     */
    constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

    /**
     * Processes symptom check requests and returns preliminary guidance.
     * Implements requirement F-102-RQ-001 allowing users to input symptoms and receive guidance.
     *
     * @param checkSymptomsDto DTO containing the symptoms to check
     * @returns Preliminary guidance based on the symptoms, including severity level and care options
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    @PhiAccess('SymptomCheck')
    async checkSymptoms(@Body() checkSymptomsDto: CheckSymptomsDto): Promise<any> {
        return this.symptomCheckerService.checkSymptoms(checkSymptomsDto);
    }
}
