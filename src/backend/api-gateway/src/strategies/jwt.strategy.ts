import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const jwtSecret = configService.get<string>('JWT_SECRET', 'your-secret-key');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    // eslint-disable-next-line @typescript-eslint/require-await -- NestJS Passport strategy interface requires async signature
    async validate(
        payload: Record<string, unknown>
    ): Promise<{ userId: unknown; email: unknown; roles: unknown }> {
        return { userId: payload.sub, email: payload.email, roles: payload.roles };
    }
}
