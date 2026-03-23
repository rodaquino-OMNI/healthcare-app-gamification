import { PartialType } from '@nestjs/mapped-types';

import { CreateCycleRecordDto } from './create-cycle-record.dto';

export class UpdateCycleRecordDto extends PartialType(CreateCycleRecordDto) {}
