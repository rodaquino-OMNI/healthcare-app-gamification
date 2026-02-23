import {
  IsBoolean,
  IsInt,
  Min,
  Max
} from 'class-validator'; // class-validator 0.14.1
import { Achievement } from './achievement.entity';
// Import GameProfile type for better type safety
import { GameProfile } from '../../profiles/entities/game-profile.entity';

/**
 * Represents a user's progress and status for a specific achievement.
 */
export class UserAchievement {
  /**
   * The ID of the user's game profile.
   */
  profileId!: string;

  /**
   * The ID of the achievement.
   */
  achievementId!: string;

  /**
   * The user's game profile (included via Prisma relation).
   */
  profile?: GameProfile;

  /**
   * The achievement (included via Prisma relation).
   */
  achievement?: Achievement;

  /**
   * The user's current progress towards unlocking the achievement.
   */
  @IsInt()
  @Min(0)
  @Max(1000)
  progress: number = 0;

  /**
   * Indicates whether the achievement has been unlocked by the user.
   */
  @IsBoolean()
  unlocked: boolean = false;

  /**
   * The date and time when the achievement was unlocked.
   */
  unlockedAt?: Date | null;

  /**
   * The date and time when the user achievement was created.
   */
  createdAt!: Date;

  /**
   * The date and time when the user achievement was last updated.
   */
  updatedAt!: Date;

  /**
   * Creates a new UserAchievement instance
   */
  constructor(data?: Partial<UserAchievement>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
