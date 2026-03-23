import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { MetricSource } from '../../health/types/health.types';

/**
 * Activity type enum for categorizing activity records
 */
export enum ActivityType {
    STEPS = 'STEPS',
    CALORIES = 'CALORIES',
    DISTANCE = 'DISTANCE',
    WORKOUT = 'WORKOUT',
    EXERCISE = 'EXERCISE',
}

/**
 * DTO for creating a new activity record.
 */
export class CreateActivityRecordDto {
    /** The type of activity being recorded */
    @IsEnum(ActivityType)
    type!: ActivityType;

    /** Numeric value for this activity (e.g. step count, calorie count) */
    @IsNumber()
    @Min(0)
    value!: number;

    /** Unit of measurement (e.g. steps, kcal, km) */
    @IsString()
    unit!: string;

    /** Duration of the activity in minutes */
    @IsOptional()
    @IsNumber()
    @Min(0)
    durationMinutes?: number;

    /** Human-readable name of the activity (e.g. "Morning Run") */
    @IsOptional()
    @IsString()
    activityName?: string;

    /** Source of the activity data */
    @IsOptional()
    @IsEnum(MetricSource)
    source?: MetricSource;

    /** Optional free-form notes */
    @IsOptional()
    @IsString()
    notes?: string;

    /** Date when the activity occurred */
    @IsDate()
    @Type(() => Date)
    date!: Date;
}
