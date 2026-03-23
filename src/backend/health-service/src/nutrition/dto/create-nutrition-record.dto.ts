import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    IsDate,
    Min,
    ValidateNested,
} from 'class-validator';

export class FoodItemDto {
    @ApiProperty({ description: 'Name of the food item' })
    @IsString()
    name!: string;

    @ApiProperty({ description: 'Calories in this food item', minimum: 0 })
    @IsNumber()
    @Min(0)
    calories!: number;

    @ApiPropertyOptional({ description: 'Protein in grams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    protein?: number;

    @ApiPropertyOptional({ description: 'Carbohydrates in grams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    carbs?: number;

    @ApiPropertyOptional({ description: 'Fat in grams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    fat?: number;

    @ApiPropertyOptional({ description: 'Dietary fiber in grams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    fiber?: number;

    @ApiPropertyOptional({ description: 'Sodium in milligrams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    sodium?: number;
}

export class CreateNutritionRecordDto {
    @ApiProperty({
        description: 'Type of meal',
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    })
    @IsString()
    mealType!: string;

    @ApiProperty({ description: 'List of food items consumed', type: [FoodItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FoodItemDto)
    foods!: FoodItemDto[];

    @ApiProperty({ description: 'Total calories for the meal', minimum: 0 })
    @IsNumber()
    @Min(0)
    calories!: number;

    @ApiPropertyOptional({ description: 'Total protein in grams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    protein?: number;

    @ApiPropertyOptional({ description: 'Total carbohydrates in grams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    carbs?: number;

    @ApiPropertyOptional({ description: 'Total fat in grams', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    fat?: number;

    @ApiProperty({ description: 'Date and time of the meal' })
    @IsDate()
    @Type(() => Date)
    date!: Date;

    @ApiPropertyOptional({ description: 'Optional notes about the meal' })
    @IsOptional()
    @IsString()
    notes?: string;
}
