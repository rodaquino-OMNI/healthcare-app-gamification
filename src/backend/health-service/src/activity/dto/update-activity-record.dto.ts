import { PartialType } from '@nestjs/mapped-types';

import { CreateActivityRecordDto } from './create-activity-record.dto';

/**
 * DTO for updating an existing activity record.
 * All fields from CreateActivityRecordDto become optional.
 */
export class UpdateActivityRecordDto extends PartialType(CreateActivityRecordDto) {}
