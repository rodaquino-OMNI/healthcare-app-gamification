/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { PrismaService } from '@app/shared/database/prisma.service';

/**
 * Interface for role objects with a name property
 */
interface Role {
  name: string;
  [key: string]: any;
}

/**
 * Service responsible for authentication operations including user registration,
 * login, JWT token management, and authentication-related functionalities.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: LoggerService,
    private prisma: PrismaService
  ) {}

  /**
   * Registers a new user in the system.
   * @param createUserDto User registration data
   * @returns The created user object (without password)
   */
  async register(createUserDto: CreateUserDto): Promise<any> {
    this.logger.log(`Registering user with email: ${createUserDto.email}`, 'AuthService');
    
    try {
      // Try to find if a user with the same email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email }
      });
      
      if (existingUser) {
        throw new AppException(
          'User with this email already exists',
          ErrorType.VALIDATION,
          'AUTH_002',
          { email: createUserDto.email }
        );
      }
      
      // Create the user using the users service
      const user = await this.usersService.create(createUserDto);
      
      return user;
    } catch (error: any) {
      // If it's already our custom AppException, just rethrow it
      if (error instanceof AppException) {
        throw error as any;
      }
      
      // Otherwise wrap in a new AppException
      const errorMsg = (error as any).message || 'Unknown error during registration';
      const errorStack = (error as any).stack || '';
      this.logger.error(`Failed to register user: ${errorMsg}`, errorStack, 'AuthService');
      
      throw new AppException(
        'Registration failed',
        ErrorType.TECHNICAL,
        'AUTH_003',
        { email: createUserDto.email },
        error instanceof Error ? undefined : undefined
      );
    }
  }

  /**
   * Authenticates a user and generates a JWT token.
   * @param email User's email
   * @param password User's password
   * @returns Object containing access token and user data
   */
  async login(email: string, password: string): Promise<any> {
    this.logger.log(`Attempting login for user: ${email}`, 'AuthService');
    
    try {
      // Validate user credentials
      const user = await this.usersService.validateCredentials(email, password);
      
      // Generate JWT token
      const payload = { 
        sub: user.id,
        email: user.email,
        roles: user.roles?.map((role: Role) => role.name) || [] 
      };
      
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('authService.jwt.secret'),
        expiresIn: this.configService.get<string>('authService.jwt.accessTokenExpiration')
      });
      
      return {
        access_token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error: any) {
      const errorMsg = (error as any).message || 'Unknown login error';
      const errorStack = (error as any).stack || '';
      this.logger.error(`Login failed for user ${email}: ${errorMsg}`, errorStack, 'AuthService');
      
      // Use a generic error message to avoid revealing too much information
      throw new AppException(
        'Invalid login credentials',
        ErrorType.VALIDATION,
        'AUTH_004',
        {},
        error instanceof Error ? undefined : undefined
      );
    }
  }

  /**
   * Validates a user's JWT token and returns the user data.
   * @param payload JWT payload
   * @returns User object if token is valid
   */
  async validateToken(payload: any): Promise<any> {
    this.logger.log(`Validating token for user ID: ${payload.sub}`, 'AuthService');
    
    try {
      const user = await this.usersService.findOne(payload.sub);
      return user;
    } catch (error: any) {
      const errorMsg = (error as any).message || 'Unknown token validation error';
      const errorStack = (error as any).stack || '';
      this.logger.error(`Token validation failed: ${errorMsg}`, errorStack, 'AuthService');
      return null;
    }
  }
}