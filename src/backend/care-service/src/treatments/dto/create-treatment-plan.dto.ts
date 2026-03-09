import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber, Min, Max, IsUUID } from 'class-validator';

/**
 * DTO for creating a new treatment plan
 */
export class CreateTreatmentPlanDto {
    @ApiProperty({
        description: 'The name of the treatment plan',
        example: 'Diabetes Management Plan',
    })
    @IsString()
    name!: string;

    @ApiProperty({
        description: 'A detailed description of the treatment plan',
        example: 'Daily monitoring and medication plan for type 2 diabetes',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The start date of the treatment plan',
        example: '2023-09-01T00:00:00.000Z',
    })
    @IsDateString()
    startDate!: Date;

    @ApiProperty({
        description: 'The end date of the treatment plan',
        example: '2023-12-31T00:00:00.000Z',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    endDate?: Date;

    @ApiProperty({
        description: 'The current progress percentage of the treatment plan (0-100)',
        example: 25,
        required: false,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    progress?: number;

    @ApiProperty({
        description: 'The UUID of the associated care activity',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    careActivityId!: string;
}
