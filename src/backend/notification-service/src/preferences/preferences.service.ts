import { ErrorType } from '@app/shared/exceptions/error.types';
import { Injectable, Inject } from '@nestjs/common'; // @nestjs/common v9.0.0+
import { NotificationPreference } from './entities/notification-preference.entity';
import { Repository } from '@app/shared/interfaces/repository.interface';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { SYS_INTERNAL_SERVER_ERROR } from '@app/shared/constants/error-codes.constants';

@Injectable()
export class PreferencesService {
  constructor(
    @Inject('NOTIFICATION_PREFERENCE_REPOSITORY')
    private readonly notificationPreferenceRepository: Repository<NotificationPreference>,
  ) {}

  /**
   * Retrieves all notification preferences based on the provided filter and pagination parameters.
   * 
   * @param filter - Optional filtering criteria
   * @param pagination - Optional pagination parameters
   * @returns A promise that resolves to an array of NotificationPreference entities
   */
  async findAll(
    filter?: FilterDto,
    pagination?: PaginationDto,
  ): Promise<NotificationPreference[]> {
    try {
      // Note: Currently, the Repository interface doesn't directly support pagination.
      // Only the filter parameter is used when calling the repository.
      return this.notificationPreferenceRepository.findAll(filter) as unknown as NotificationPreference[];
    } catch (error) {
      throw new AppException(
        'Failed to retrieve notification preferences',
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        { filter, pagination },
        error,
      );
    }
  }

  /**
   * Creates a new notification preference record for a user with default settings.
   * 
   * @param userId - The ID of the user
   * @returns A promise that resolves to the newly created NotificationPreference entity
   */
  async create(userId: string): Promise<NotificationPreference> {
    try {
      // Only need to specify the userId. The rest will use default values from the entity definition
      const newPreference = {
        userId,
      };
      
      return this.notificationPreferenceRepository.create(newPreference);
    } catch (error) {
      throw new AppException(
        'Failed to create notification preferences',
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        { userId },
        error,
      );
    }
  }

  /**
   * Updates an existing notification preference record.
   * 
   * @param id - The ID of the notification preference record (as string)
   * @param data - Partial notification preference data to update
   * @returns A promise that resolves to the updated NotificationPreference entity
   */
  async update(
    id: string,
    data: Partial<NotificationPreference>,
  ): Promise<NotificationPreference> {
    try {
      // Note: The NotificationPreference entity uses a numeric ID, but
      // the Repository interface expects a string ID. Conversion may be
      // handled by the repository implementation.
      return this.notificationPreferenceRepository.update(id, data);
    } catch (error) {
      throw new AppException(
        'Failed to update notification preferences',
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        { id, data },
        error,
      );
    }
  }
}