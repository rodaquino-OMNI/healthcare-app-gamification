import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global database module that provides PrismaService to all modules.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
