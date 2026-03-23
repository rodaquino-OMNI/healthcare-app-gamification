import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMoodCheckInDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    moodLevel!: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsDate()
    @Type(() => Date)
    timestamp!: Date;
}
