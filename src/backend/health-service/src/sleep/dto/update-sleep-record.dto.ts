import { PartialType } from '@nestjs/mapped-types';

import { CreateSleepRecordDto } from './create-sleep-record.dto';

export class UpdateSleepRecordDto extends PartialType(CreateSleepRecordDto) {}
