import { Module } from '@nestjs/common'; // @nestjs/common 10.0.0+
import { ConfigModule } from '@nestjs/config'; // @nestjs/config 10.0.0+
import { planService } from './config/configuration';
import { ClaimsModule } from './claims/claims.module';
import { PlansModule } from './plans/plans.module';
import { CostSimulatorModule } from './cost-simulator/cost-simulator.module';
import { DocumentsModule } from './documents/documents.module';
import { InsuranceModule } from './insurance/insurance.module';
import { PrismaService } from '../../shared/src/database/prisma.service';
import { KafkaModule } from '../../shared/src/kafka/kafka.module';
import { LoggerModule } from '../../shared/src/logging/logger.module';
import { ExceptionsModule } from '../../shared/src/exceptions/exceptions.module';
import { RedisModule } from '../../shared/src/redis/redis.module';
import { TracingModule } from '../../shared/src/tracing/tracing.module';

/**
 * Root module for the Plan Service that configures and organizes all the necessary components.
 * This module integrates all the necessary components for insurance plan management, claims processing,
 * cost simulation, document handling, and insurance verification.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [planService],
      isGlobal: true,
    }),
    LoggerModule,
    ExceptionsModule,
    KafkaModule,
    RedisModule,
    TracingModule,
    PlansModule,
    ClaimsModule,
    CostSimulatorModule,
    DocumentsModule,
    InsuranceModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {
  /**
   * The constructor is empty as this is a module class.
   */
  constructor() {}
}