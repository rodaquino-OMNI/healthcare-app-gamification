import { UserAchievement } from '../../achievements/entities/user-achievement.entity';

/**
 * Entity representing a user's game profile in the gamification system.
 * Contains all gamification-related data for a single user including level,
 * experience points (XP), and achievements.
 */
export class GameProfile {
  /**
   * Unique identifier for this game profile
   */
  id: string;
  
  /**
   * The ID of the user this profile belongs to
   */
  userId: string;
  
  /**
   * The user's current level in the gamification system
   */
  level: number;
  
  /**
   * The user's current experience points
   */
  xp: number;
  
  /**
   * Achievements unlocked by the user
   */
  achievements?: UserAchievement[];
  
  /**
   * The date and time when this profile was created
   */
  createdAt: Date;
  
  /**
   * The date and time when this profile was last updated
   */
  updatedAt: Date;
}