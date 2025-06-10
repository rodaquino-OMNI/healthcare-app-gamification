import { FilterDto } from '@app/shared/dto/filter.dto';
import { IsOptional, IsString } from 'class-validator';

/**
 * Extended filter DTO for user filtering operations
 * Adds search property to the base FilterDto
 */
export class UserFilterDto extends FilterDto {
  /**
   * Search string to filter users by name or email
   */
  @IsOptional()
  @IsString()
  search?: string;
}