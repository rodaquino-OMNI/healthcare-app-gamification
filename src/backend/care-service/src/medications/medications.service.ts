/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorType } from '@app/shared/exceptions/error.types';
import { Injectable } from '@nestjs/common'; // v10.0.0+
import { PrismaService } from '@app/shared/database/prisma.service';

import { CreateMedicationDto } from './dto/create-medication.dto';
import { Medication } from './entities/medication.entity';
import { Service } from '@app/shared/interfaces/service.interface';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { Configuration } from '@app/care/config/configuration';
import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';

/**
 * Service class for managing medications.
 * Handles the business logic for medication tracking, including
 * creating, retrieving, updating, and deleting medication records.
 */
@Injectable()
export class MedicationsService {
  /**
   * Constructor for MedicationsService.
   * @param prisma The Prisma database service
   * @param logger The logging service
   * @param kafkaService The Kafka service for event publishing
   * @param configService The configuration service
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly kafkaService: KafkaService,
    private readonly configService: Configuration
  ) {
    // Initializes the logger
    this.logger.log('MedicationsService initialized', 'MedicationsService');
  }

  /**
   * Creates a new medication.
   * @param createMedicationDto The data for creating the medication
   * @param userId The ID of the user who owns the medication
   * @returns The created medication
   */
  async create(createMedicationDto: CreateMedicationDto, userId: string): Promise<Medication> {
    try {
      // Creates a new medication record via Prisma
      const savedMedication = await this.prisma.medication.create({
        data: {
          ...createMedicationDto,
          userId,
          startDate: new Date(createMedicationDto.startDate),
          endDate: createMedicationDto.endDate ? new Date(createMedicationDto.endDate) : null,
        },
      });

      // Publish event for gamification if enabled
      if (this.configService.gamification?.enabled) {
        try {
          await this.kafkaService.produce(
            this.configService.gamification.defaultEvents.medicationAdherence,
            {
              eventType: 'MEDICATION_CREATED',
              userId,
              medicationId: savedMedication.id,
              timestamp: new Date().toISOString()
            }
          );
        } catch (error) {
          this.logger.error('Failed to publish medication creation event', error, 'MedicationsService');
          // Continue despite Kafka error
        }
      }

      this.logger.log(`Medication created: ${savedMedication.id} for user ${userId}`, 'MedicationsService');

      // Returns the created medication
      return savedMedication as Medication;
    } catch (error) {
      this.logger.error('Failed to create medication', error, 'MedicationsService');
      throw new AppException(
        'Failed to create medication record',
        ErrorType.TECHNICAL,
        'CARE_001',
        { userId },
        error
      );
    }
  }

  /**
   * Finds all medications based on the filter and pagination parameters.
   * @param filterDto Filter criteria for the query
   * @param paginationDto Pagination parameters
   * @returns A list of medications
   */
  async findAll(filterDto: FilterDto, paginationDto: PaginationDto): Promise<Medication[]> {
    try {
      // Build where clause from filter
      const where: Record<string, any> = {};
      if (filterDto?.where) {
        Object.assign(where, filterDto.where);
      }

      // Build orderBy from filter
      let orderBy: any = { createdAt: 'desc' };
      if (filterDto?.orderBy) {
        orderBy = {};
        Object.entries(filterDto.orderBy).forEach(([key, value]) => {
          orderBy[key] = (value as string).toLowerCase();
        });
      }

      // Calculate pagination
      let skip: number | undefined;
      let take: number | undefined;
      if (paginationDto) {
        skip = paginationDto.skip ||
          (paginationDto.page && paginationDto.limit ? (paginationDto.page - 1) * paginationDto.limit : 0);
        take = paginationDto.limit || 10;
      }

      // Retrieves all medications from the database
      const medications = await this.prisma.medication.findMany({
        where,
        orderBy,
        skip,
        take,
      });

      return medications as Medication[];
    } catch (error) {
      this.logger.error('Failed to fetch medications', error, 'MedicationsService');
      throw new AppException(
        'Failed to retrieve medications',
        ErrorType.TECHNICAL,
        'CARE_002',
        { filter: filterDto, pagination: paginationDto },
        error
      );
    }
  }

  /**
   * Finds a medication by ID.
   * @param id The ID of the medication to find
   * @returns The medication, if found
   */
  async findOne(id: string): Promise<Medication> {
    try {
      // Retrieves the medication from the database by ID
      const medication = await this.prisma.medication.findUnique({ where: { id } });

      if (!medication) {
        throw new AppException(
          `Medication with ID ${id} not found`,
          ErrorType.BUSINESS,
          'CARE_003',
          { id }
        );
      }

      // Returns the medication, if found
      return medication as Medication;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to fetch medication with ID ${id}`, error, 'MedicationsService');
      throw new AppException(
        `Failed to retrieve medication`,
        ErrorType.TECHNICAL,
        'CARE_004',
        { id },
        error
      );
    }
  }

  /**
   * Updates an existing medication.
   * @param id The ID of the medication to update
   * @param updateMedicationData The data to update the medication with
   * @returns The updated medication
   */
  async update(id: string, updateMedicationData: Record<string, any>): Promise<Medication> {
    try {
      // Verify the medication exists
      await this.findOne(id);

      // Handle date conversions
      const data = { ...updateMedicationData };
      if (data.startDate) {
        data.startDate = new Date(data.startDate);
      }
      if (data.endDate) {
        data.endDate = data.endDate ? new Date(data.endDate) : null;
      }

      // Updates the medication with the new data
      const updatedMedication = await this.prisma.medication.update({
        where: { id },
        data,
      });

      this.logger.log(`Medication updated: ${id}`, 'MedicationsService');

      // Returns the updated medication
      return updatedMedication as Medication;
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to update medication with ID ${id}`, error, 'MedicationsService');
      throw new AppException(
        `Failed to update medication`,
        ErrorType.TECHNICAL,
        'CARE_005',
        { id },
        error
      );
    }
  }

  /**
   * Removes a medication by ID.
   * @param id The ID of the medication to remove
   */
  async remove(id: string): Promise<void> {
    try {
      // Verify the medication exists before deletion
      await this.findOne(id);

      // Deletes the medication from the database by ID
      await this.prisma.medication.delete({ where: { id } });

      this.logger.log(`Medication deleted: ${id}`, 'MedicationsService');
    } catch (error) {
      if (error instanceof AppException) {
        throw error as any;
      }

      this.logger.error(`Failed to delete medication with ID ${id}`, error, 'MedicationsService');
      throw new AppException(
        `Failed to delete medication`,
        ErrorType.TECHNICAL,
        'CARE_006',
        { id },
        error
      );
    }
  }
}
