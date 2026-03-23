import { PartialType } from '@nestjs/mapped-types';

import { CreateNutritionRecordDto } from './create-nutrition-record.dto';

export class UpdateNutritionRecordDto extends PartialType(CreateNutritionRecordDto) {}
