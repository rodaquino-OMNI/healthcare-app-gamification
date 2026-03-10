import { PartialType } from '@nestjs/swagger';

import { CreateTreatmentPlanDto } from './create-treatment-plan.dto';

/**
 * DTO for updating an existing treatment plan
 * Inherits from CreateTreatmentPlanDto but makes all fields optional for partial updates
 */
export class UpdateTreatmentPlanDto extends PartialType(CreateTreatmentPlanDto) {
    // All fields from CreateTreatmentPlanDto are inherited but made optional by PartialType
}
