import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';

export class FilterSleepDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}
