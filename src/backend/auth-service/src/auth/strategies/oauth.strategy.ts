import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { LoggerService } from '@app/shared/logging/logger.service';

/**
 * Base class for OAuth strategies.
 * This is used as a foundation for specific OAuth provider implementations
 * such as Google, Facebook, and Apple.
 */
@Injectable()
export class OAuthStrategy {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly authService: AuthService,
    protected readonly logger: LoggerService
  ) {}

  /**
   * Validates an OAuth profile and either creates a new user or returns an existing one.
   * 
   * @param profile - The profile data from the OAuth provider
   * @param provider - The name of the OAuth provider (google, facebook, apple)
   * @returns The user object
   */
  async validate(profile: any, provider: string) {
    this.logger.log(`Validating OAuth profile for ${provider}`, 'OAuthStrategy');
    
    try {
      // Extract standard user info from the profile
      const email = this.extractEmail(profile, provider);
      const name = this.extractName(profile, provider);
      
      // Implementation would create or find user based on OAuth profile
      // Placeholder for actual implementation
      
      return {
        id: 'oauth-user-id',
        email,
        name,
        provider
      };
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown OAuth validation error';
      const errorStack = error.stack || '';
      
      this.logger.error(
        `Failed to validate ${provider} OAuth profile: ${errorMsg}`,
        errorStack,
        'OAuthStrategy'
      );
      return null;
    }
  }
  
  /**
   * Extracts the email from an OAuth profile.
   * 
   * @param profile - The profile from the OAuth provider
   * @param provider - The name of the OAuth provider
   * @returns The email address
   */
  protected extractEmail(profile: any, provider: string): string {
    switch (provider) {
      case 'google':
        return profile.emails[0].value;
      case 'facebook':
        return profile.emails?.[0]?.value || '';
      case 'apple':
        return profile.email;
      default:
        return '';
    }
  }
  
  /**
   * Extracts the name from an OAuth profile.
   * 
   * @param profile - The profile from the OAuth provider
   * @param provider - The name of the OAuth provider
   * @returns The user's name
   */
  protected extractName(profile: any, provider: string): string {
    switch (provider) {
      case 'google':
        return `${profile.name.givenName} ${profile.name.familyName}`;
      case 'facebook':
        return profile.displayName;
      case 'apple':
        return profile.name?.firstName && profile.name?.lastName
          ? `${profile.name.firstName} ${profile.name.lastName}`
          : 'Apple User';
      default:
        return '';
    }
  }
}