import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { PrismaService } from '@app/shared/database/prisma.service';

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