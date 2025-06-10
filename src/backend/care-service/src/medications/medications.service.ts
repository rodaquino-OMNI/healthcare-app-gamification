/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorType } from '@app/shared/exceptions/error.types';
import { Injectable } from '@nestjs/common'; // v10.0.0+
import { Repository } from 'typeorm'; // latest
import { InjectRepository } from '@nestjs/typeorm'; // latest

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
   * @param medicationsRepository The TypeORM repository for medications
   * @param logger The logging service
   * @param kafkaService The Kafka service for event publishing
   * @param configService The configuration service
   */
  constructor(
    @InjectRepository(Medication)
    private readonly medicationsRepository: Repository<Medication>,
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
      // Creates a new medication entity
      const medication = this.medicationsRepository.create({
        ...createMedicationDto,
        userId,
        startDate: new Date(createMedicationDto.startDate),
        endDate: createMedicationDto.endDate ? new Date(createMedicationDto.endDate) : null
      });

      // Saves the medication to the database
      const savedMedication = await this.medicationsRepository.save(medication);
      
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
      return savedMedication;
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
      // Retrieves all medications from the database based on the filter and pagination parameters
      const queryBuilder = this.medicationsRepository.createQueryBuilder('medication');
      
      // Apply filters
      if (filterDto?.where) {
        Object.entries(filterDto.where).forEach(([key, value]) => {
          queryBuilder.andWhere(`medication.${key} = :${key}`, { [key]: value });
        });
      }
      
      // Apply sorting
      if (filterDto?.orderBy) {
        Object.entries(filterDto.orderBy).forEach(([key, value]) => {
          queryBuilder.orderBy(`medication.${key}`, value.toUpperCase());
        });
      } else {
        queryBuilder.orderBy('medication.createdAt', 'DESC');
      }
      
      // Apply pagination
      if (paginationDto) {
        const skip = paginationDto.skip || 
          (paginationDto.page && paginationDto.limit ? (paginationDto.page - 1) * paginationDto.limit : 0);
        const take = paginationDto.limit || 10;
        
        queryBuilder.skip(skip).take(take);
      }
      
      // Returns the list of medications
      return await queryBuilder.getMany();
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
      const medication = await this.medicationsRepository.findOne({ where: { id } });
      
      if (!medication) {
        throw new AppException(
          `Medication with ID ${id} not found`,
          ErrorType.BUSINESS,
          'CARE_003',
          { id }
        );
      }
      
      // Returns the medication, if found
      return medication;
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
      // Retrieves the medication from the database by ID
      const medication = await this.findOne(id);
      
      // Handle date conversions
      if (updateMedicationData.startDate) {
        updateMedicationData.startDate = new Date(updateMedicationData.startDate);
      }
      
      if (updateMedicationData.endDate) {
        updateMedicationData.endDate = updateMedicationData.endDate ? 
          new Date(updateMedicationData.endDate) : null;
      }
      
      // Updates the medication with the new data
      Object.assign(medication, updateMedicationData);
      
      // Saves the updated medication to the database
      const updatedMedication = await this.medicationsRepository.save(medication);
      
      this.logger.log(`Medication updated: ${id}`, 'MedicationsService');
      
      // Returns the updated medication
      return updatedMedication;
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
      await this.medicationsRepository.delete(id);
      
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