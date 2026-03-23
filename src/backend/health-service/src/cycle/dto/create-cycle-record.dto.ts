import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsOptional,
    IsNumber,
    IsString,
    IsArray,
    Min,
    Max,
    ValidateNested,
} from 'class-validator';

export class CycleSymptomDto {
    @ApiProperty({ description: 'Symptom type (e.g., cramps, bloating, headache)' })
    @IsString()
    type!: string;

    @ApiProperty({ description: 'Severity level (e.g., mild, moderate, severe)' })
    @IsString()
    severity!: string;

    @ApiProperty({ description: 'Date the symptom occurred (ISO string)' })
    @IsString()
    date!: string;
}

export class CreateCycleRecordDto {
    @ApiProperty({ description: 'Start date of the cycle / period' })
    @IsDate()
    @Type(() => Date)
    startDate!: Date;

    @ApiPropertyOptional({ description: 'End date of the period' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @ApiPropertyOptional({
        description: 'Total cycle length in days (1-90)',
        minimum: 1,
        maximum: 90,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(90)
    cycleLength?: number;

    @ApiPropertyOptional({ description: 'Period duration in days (1-14)', minimum: 1, maximum: 14 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(14)
    periodLength?: number;

    @ApiPropertyOptional({ description: 'Flow intensity (e.g., light, medium, heavy, spotting)' })
    @IsOptional()
    @IsString()
    flowIntensity?: string;

    @ApiPropertyOptional({ description: 'List of symptoms experienced', type: [CycleSymptomDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CycleSymptomDto)
    symptoms?: CycleSymptomDto[];

    @ApiPropertyOptional({ description: 'Additional notes about the cycle' })
    @IsOptional()
    @IsString()
    notes?: string;
}
