import { IsNotEmpty, IsNumber, IsString, IsDate, IsEnum, IsOptional } from 'class-validator'; // v0.14.0+
import { MetricType, MetricSource } from '../types/health.types';

/**
 * Data Transfer Object for creating a new health metric.
 * This DTO validates the input data required to create a health metric entry.
 * Implements requirement F-101-RQ-001: Structure for health metrics input.
 */
export class CreateMetricDto {
  /**
   * Type of health metric (e.g., HEART_RATE, BLOOD_PRESSURE, etc.)
   */
  @IsNotEmpty()
  @IsEnum(MetricType)
  type: MetricType;

  /**
   * Numeric value of the health metric
   */
  @IsNotEmpty()
  @IsNumber()
  value: number;

  /**
   * Unit of measurement for the health metric (e.g., bpm, mmHg, etc.)
   */
  @IsNotEmpty()
  @IsString()
  unit: string;

  /**
   * Timestamp when the metric was recorded
   */
  @IsNotEmpty()
  @IsDate()
  timestamp: Date;

  /**
   * Source of the health metric data (e.g., MANUAL, DEVICE, API)
   */
  @IsNotEmpty()
  @IsEnum(MetricSource)
  source: MetricSource;

  /**
   * Optional notes or comments about the health metric
   */
  @IsOptional()
  @IsString()
  notes: string | null;
}