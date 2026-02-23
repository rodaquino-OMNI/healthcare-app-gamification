import { IsBoolean, IsInt, Min, Max } from 'class-validator'; // class-validator@0.14.1
import { Quest } from '../entities/quest.entity';

/**
 * Represents a user's participation in a quest, tracking their progress and completion status.
 * This entity establishes the relationship between a user's game profile and a specific quest,
 * allowing the system to track quest progress as part of the gamification engine.
 */
export class UserQuest {
  /**
   * Unique identifier for the user quest.
   */
  id?: string;

  /**
   * The ID of the user's game profile.
   */
  profileId?: string;

  /**
   * The ID of the quest.
   */
  questId?: string;

  /**
   * The game profile of the user participating in the quest (included via Prisma relation).
   */
  profile?: any;

  /**
   * The quest being undertaken by the user (included via Prisma relation).
   */
  quest?: Quest;

  /**
   * The user's current progress toward completing the quest (0-100).
   * This allows tracking partial completion of quests that require
   * multiple steps or actions.
   */
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number = 0;

  /**
   * Indicates whether the user has completed the quest.
   * When true, the quest is considered fully completed and rewards are granted.
   */
  @IsBoolean()
  completed: boolean = false;

  /**
   * The date and time when the quest was completed.
   */
  completedAt?: Date | null;

  /**
   * The date and time when the user quest was created.
   */
  createdAt?: Date;

  /**
   * The date and time when the user quest was last updated.
   */
  updatedAt?: Date;
}
