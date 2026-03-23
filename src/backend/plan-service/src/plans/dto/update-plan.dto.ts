import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsArray,
    Min,
    Max,
    ValidateNested,
} from 'class-validator';

export class CoverageDetailDto {
    @IsString()
    procedureCode!: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    coveragePercentage!: number;

    @IsOptional()
    @IsNumber()
    copay?: number;

    @IsOptional()
    @IsNumber()
    deductible?: number;
}

export class CreatePlanDto {
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    type!: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CoverageDetailDto)
    coverageDetails?: CoverageDetailDto[];
}

export class UpdatePlanDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CoverageDetailDto)
    coverageDetails?: CoverageDetailDto[];
}
