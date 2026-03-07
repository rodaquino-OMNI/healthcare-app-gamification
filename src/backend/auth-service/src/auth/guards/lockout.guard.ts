import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Guard that checks if a user account is temporarily locked due to
 * too many failed login attempts. Must be applied BEFORE LocalAuthGuard
 * so it short-circuits before credentials are validated.
 *
 * The lockout counter is managed by AuthService (increment on failure,
 * reset on success). This guard only reads the current count.
 */
@Injectable()
export class LockoutGuard implements CanActivate {
    constructor(
        private readonly redisService: RedisService,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const email = request.body?.email;

        if (!email) {
            return true;
        }

        const key = `lockout:${email}`;
        const raw = await this.redisService.get(key);
        const attempts = parseInt(raw || '0', 10);
        const threshold = this.configService.get<number>('authService.password.lockoutThreshold') ?? 5;

        if (attempts >= threshold) {
            throw new AppException(
                'Account temporarily locked due to too many failed attempts. Try again later.',
                ErrorType.RATE_LIMIT_EXCEEDED,
                'AUTH_007',
                { email },
                HttpStatus.TOO_MANY_REQUESTS
            );
        }

        return true;
    }
}
