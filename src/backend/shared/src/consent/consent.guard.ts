import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsentService } from './consent.service';
import { ConsentType } from './dto/create-consent.dto';
import { AppException, ErrorType } from '../exceptions/exceptions.types';

/**
 * Metadata key used to store required consent types on route handlers.
 */
export const CONSENT_KEY = 'required_consent';

/**
 * Decorator to specify which consent type is required to access a route.
 * Used in conjunction with ConsentGuard.
 *
 * @example
 * ```typescript
 * @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
 * @UseGuards(JwtAuthGuard, ConsentGuard)
 * @Get('health-data')
 * async getHealthData() { ... }
 * ```
 */
export const RequireConsent = (consentType: ConsentType) =>
  SetMetadata(CONSENT_KEY, consentType);

/**
 * Guard that checks whether the authenticated user has granted
 * the required consent type before allowing access to a route.
 *
 * Uses the @RequireConsent() decorator to determine which consent
 * type is needed. If no consent metadata is found on the handler,
 * the guard allows access by default.
 *
 * Follows the same CanActivate pattern as RolesGuard.
 */
@Injectable()
export class ConsentGuard implements CanActivate {
  constructor(
    private readonly consentService: ConsentService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Determines if the current request is authorized based on consent status.
   *
   * @param context - The execution context of the current request
   * @returns True if consent is granted or not required
   * @throws AppException with FORBIDDEN type if consent is missing
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredConsent = this.reflector.get<ConsentType>(
      CONSENT_KEY,
      context.getHandler(),
    );

    // If no consent requirement is set, allow access
    if (!requiredConsent) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new AppException(
        'Authentication required to verify consent',
        ErrorType.UNAUTHORIZED,
        'CONSENT_003',
      );
    }

    const hasConsent = await this.consentService.hasActiveConsent(
      user.id || user.sub,
      requiredConsent,
    );

    if (!hasConsent) {
      throw new AppException(
        `User consent required: ${requiredConsent}`,
        ErrorType.FORBIDDEN,
        'CONSENT_004',
        { requiredConsent, userId: user.id || user.sub },
      );
    }

    return true;
  }
}
