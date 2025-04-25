import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator'; // version: latest

/**
 * Data transfer object for updating user information.
 * Used for partial updates of user profile data in the AUSTA SuperApp.
 * All fields are optional as this DTO is used for PATCH operations.
 */
export class UpdateUserDto {
  /**
   * The updated name of the user.
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  /**
   * The updated email address of the user.
   */
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  /**
   * The updated phone number of the user.
   */
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  /**
   * The updated CPF (Brazilian national ID) of the user.
   * Must be exactly 11 characters.
   */
  @IsString()
  @IsOptional()
  @MinLength(11)
  @MaxLength(11)
  cpf?: string;
}