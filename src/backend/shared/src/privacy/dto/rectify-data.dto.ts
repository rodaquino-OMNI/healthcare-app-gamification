import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';

/**
 * DTO for rectifying personal data under LGPD Art. 18-III.
 * Only allows updating non-sensitive identity fields.
 */
export class RectifyDataDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
