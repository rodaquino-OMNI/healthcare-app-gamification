import { PrismaService } from '@app/shared/database/prisma.service';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

/**
 * Module that configures the UsersController and UsersService.
 */
@Module({
    imports: [AuthModule, ExceptionsModule, LoggerModule],
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
    exports: [UsersService],
})
export class UsersModule {}
