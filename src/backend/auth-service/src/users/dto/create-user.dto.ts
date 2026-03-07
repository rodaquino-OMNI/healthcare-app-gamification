import { IsString, IsEmail, MinLength, MaxLength, IsOptional, Matches } from 'class-validator'; // class-validator@0.14.0

/**
 * Data transfer object for creating a new user in the AUSTA SuperApp.
 * Contains all necessary information required for user registration.
 */
export class CreateUserDto {
    /**
     * Full name of the user.
     */
    @IsString()
    @MaxLength(255)
    name: string = '';

    /**
     * Email address of the user.
     * Must be a valid email format and unique in the system.
     */
    @IsString()
    @IsEmail()
    @MaxLength(255)
    email: string = '';

    /**
     * Password of the user.
     * Must be at least 10 characters long with uppercase, lowercase, number, and special character.
     */
    @IsString()
    @MinLength(10)
    @MaxLength(255)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/, {
        message: 'Password must contain uppercase, lowercase, number, and special character',
    })
    password: string = '';

    /**
     * Phone number of the user (optional).
     * Used for SMS notifications and multi-factor authentication.
     */
    @IsString()
    @IsOptional()
    @MaxLength(20)
    phone?: string;

    /**
     * CPF (Brazilian national ID) of the user (optional).
     * Used for identity verification as required by Brazilian regulations.
     */
    @IsString()
    @IsOptional()
    @MaxLength(20)
    cpf?: string;
}
