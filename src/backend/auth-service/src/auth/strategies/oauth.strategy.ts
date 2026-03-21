import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';

/** Typed shape of an OAuth provider profile (Google, Facebook, Apple). */
interface OAuthProfile {
    emails?: Array<{ value: string }>;
    email?: string;
    displayName?: string;
    name?: {
        givenName?: string;
        familyName?: string;
        firstName?: string;
        lastName?: string;
    };
}

/** Normalised user object returned from OAuth validation. */
interface OAuthUser {
    id: string;
    email: string;
    name: string;
    provider: string;
}

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
    // eslint-disable-next-line @typescript-eslint/require-await -- NestJS Passport strategy interface requires async signature
    async validate(profile: OAuthProfile, provider: string): Promise<OAuthUser | null> {
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
                provider,
            };
        } catch (error: unknown) {
            const err = error as { message?: string; stack?: string };
            const errorMsg = err.message || 'Unknown OAuth validation error';
            const errorStack = err.stack || '';

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
    protected extractEmail(profile: OAuthProfile, provider: string): string {
        switch (provider) {
            case 'google':
                return profile.emails?.[0]?.value ?? '';
            case 'facebook':
                return profile.emails?.[0]?.value || '';
            case 'apple':
                return profile.email ?? '';
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
    protected extractName(profile: OAuthProfile, provider: string): string {
        switch (provider) {
            case 'google':
                return `${profile.name?.givenName ?? ''} ${profile.name?.familyName ?? ''}`.trim();
            case 'facebook':
                return profile.displayName ?? '';
            case 'apple':
                return profile.name?.firstName && profile.name?.lastName
                    ? `${profile.name.firstName} ${profile.name.lastName}`
                    : 'Apple User';
            default:
                return '';
        }
    }
}
