import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    Max,
    ValidateNested,
} from 'class-validator';

import { MetricSource } from '../../health/types/health.types';

export enum SleepQuality {
    POOR = 'POOR',
    FAIR = 'FAIR',
    GOOD = 'GOOD',
    EXCELLENT = 'EXCELLENT',
}

export class SleepStagesDto {
    @IsNumber()
    @Min(0)
    light!: number;

    @IsNumber()
    @Min(0)
    deep!: number;

    @IsNumber()
    @Min(0)
    rem!: number;

    @IsNumber()
    @Min(0)
    awake!: number;
}

export class CreateSleepRecordDto {
    @IsDate()
    @Type(() => Date)
    date!: Date;

    @IsNumber()
    @Min(0)
    @Max(1440)
    durationMinutes!: number;

    @IsEnum(SleepQuality)
    quality!: SleepQuality;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    bedtime?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    wakeTime?: Date;

    @IsOptional()
    @ValidateNested()
    @Type(() => SleepStagesDto)
    stages?: SleepStagesDto;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsEnum(MetricSource)
    source?: MetricSource;
}
