import { PassportStrategy } from '@nestjs/passport'; // @nestjs/passport@10.0.0+
import { Injectable } from '@nestjs/common'; // @nestjs/common@10.0.0+

/**
 * Base class for OAuth 2.0 authentication strategies.
 * This serves as a foundation for implementing specific OAuth provider strategies
 * such as Google, Facebook, and Apple for the AUSTA SuperApp.
 * 
 * Extending classes should implement provider-specific configurations and
 * validation logic while leveraging this common base.
 * 
 * Example usage with specific providers:
 * ```typescript
 * // Google OAuth strategy implementation
 * export class GoogleStrategy extends OAuthStrategy {
 *   constructor(
 *     private configService: ConfigService,
 *     private authService: AuthService
 *   ) {
 *     const GoogleStrategy = require('passport-google-oauth20').Strategy;
 *     super(
 *       new GoogleStrategy(
 *         {
 *           clientID: configService.get('GOOGLE_CLIENT_ID'),
 *           clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
 *           callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
 *           scope: ['email', 'profile']
 *         },
 *         async (accessToken, refreshToken, profile, done) => {
 *           try {
 *             const user = await authService.validateOAuthUser({
 *               provider: 'google',
 *               providerId: profile.id,
 *               email: profile.emails[0].value,
 *               name: profile.displayName
 *             });
 *             done(null, user);
 *           } catch (error) {
 *             done(error, false);
 *           }
 *         }
 *       )
 *     );
 *   }
 * }
 * ```
 */
@Injectable()
export class OAuthStrategy extends PassportStrategy {
  /**
   * Initializes the OAuth strategy.
   * 
   * @param strategy - The OAuth strategy instance or name to be used with Passport
   * @param verify - The verification callback function that processes the authenticated user
   */
  constructor(strategy: string, verify: Function) {
    super(strategy, verify);
  }
}