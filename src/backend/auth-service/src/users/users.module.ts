import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';

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