import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that uses the local authentication strategy.
 * This is typically used for username/password login.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}