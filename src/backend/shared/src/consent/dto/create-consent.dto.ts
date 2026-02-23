import { IsEnum, IsString, IsArray, IsOptional, IsDateString, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Enum representing the types of consent under LGPD.
 * Mirrors the Prisma ConsentType enum.
 */
export enum ConsentType {
  DATA_PROCESSING = 'DATA_PROCESSING',
  HEALTH_DATA_SHARING = 'HEALTH_DATA_SHARING',
  MARKETING = 'MARKETING',
  RESEARCH = 'RESEARCH',
  TELEMEDICINE = 'TELEMEDICINE',
  THIRD_PARTY_SHARING = 'THIRD_PARTY_SHARING',
}

/**
 * DTO for creating a new consent record.
 * Validates that the user provides a valid consent type, purpose,
 * and list of data categories being consented to.
 */
export class CreateConsentDto {
  @ApiProperty({
    enum: ConsentType,
    description: 'Type of consent being granted',
    example: ConsentType.HEALTH_DATA_SHARING,
  })
  @IsEnum(ConsentType)
  consentType!: ConsentType;

  @ApiProperty({
    description: 'Clear description of the purpose for data processing',
    example: 'Share health metrics with treating physician for telemedicine sessions',
  })
  @IsString()
  purpose!: string;

  @ApiProperty({
    description: 'Categories of personal data covered by this consent',
    example: ['health_metrics', 'medical_history', 'prescriptions'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  dataCategories!: string[];

  @ApiPropertyOptional({
    description: 'ISO 8601 date when the consent expires (optional, null means indefinite)',
    example: '2027-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
