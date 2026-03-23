import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';

/**
 * DTO for filtering activity records by date range and pagination.
 */
export class FilterActivityDto {
    /** Start of date range filter */
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    /** End of date range filter */
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    /** Maximum number of records to return */
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number;

    /** Number of records to skip for pagination */
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}
