import { Module } from '@nestjs/common'; // 10.0.0
import { RolesService } from './roles.service';

/**
 * A NestJS module that encapsulates the RolesService.
 * This module provides role management functionality for the AUSTA SuperApp's
 * authentication service, making it available to other modules.
 */
@Module({
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}