import { ExtractJwt, Strategy } from 'passport-jwt'; // passport-jwt@4.0.0+
import { Injectable } from '@nestjs/common'; // @nestjs/common@10.0.0+
import { PassportStrategy } from '@nestjs/passport'; // @nestjs/passport@10.0.0+
import { ConfigService } from '@nestjs/config'; // @nestjs/config@10.0.0+
import { AuthService } from '@nestjs/auth'; // @nestjs/auth@10.0.0+
import { UsersService } from '@nestjs/users'; // @nestjs/users@10.0.0+

/**
 * Passport strategy for authenticating users based on JWT tokens.
 * Validates tokens and extracts user information from the payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes the JWT strategy with configuration options.
   * 
   * @param configService Service to access JWT configuration values
   * @param authService Service to validate JWT token
   * @param usersService Service to retrieve user information
   */
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Enforce token expiration
      secretOrKey: configService.get<string>('JWT_SECRET'),
      audience: configService.get<string>('JWT_AUDIENCE'),
      issuer: configService.get<string>('JWT_ISSUER'),
    });
  }

  /**
   * Validates the JWT payload and returns the user object.
   * This method is called by Passport.js after the token is decoded.
   * 
   * @param payload The decoded JWT payload
   * @returns The user object if the token is valid, null otherwise
   */
  async validate(payload: any): Promise<any> {
    // Extract the user ID from the payload
    const userId = payload.sub;
    
    // Call the UsersService to find the user by ID
    const user = await this.usersService.findById(userId);
    
    // If the user doesn't exist, return null
    if (!user) {
      return null;
    }
    
    // Return the user object
    return user;
  }
}