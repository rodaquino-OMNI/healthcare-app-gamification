import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { LoggerService } from '@app/shared/logging/logger.service';

/**
 * Implementation of Passport's JWT strategy for token-based authentication.
 * This is used by the JwtAuthGuard to authenticate users based on their JWT token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
    private logger: LoggerService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('authService.jwt.secret'),
    });
  }

  /**
   * Validates the JWT payload and returns the user if valid.
   * This is called by Passport during authentication.
   * 
   * @param payload - The decoded JWT payload
   * @returns The authenticated user
   */
  async validate(payload: any) {
    this.logger.debug(`Validating JWT for user ID: ${payload.sub}`, 'JwtStrategy');
    
    // Use the auth service to validate the token and get the user
    const user = await this.authService.validateToken(payload);
    
    // If user is not found or invalid, return null to fail authentication
    if (!user) {
      this.logger.warn(`Failed to validate token for user ID: ${payload.sub}`, 'JwtStrategy');
      return null;
    }
    
    return user;
  }
}