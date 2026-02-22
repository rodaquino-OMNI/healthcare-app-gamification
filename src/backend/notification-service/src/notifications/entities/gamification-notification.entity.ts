import { ApiProperty } from '@nestjs/swagger';
import { Notification } from './notification.entity';

/**
 * Extends the base notification entity with gamification-specific fields
 */
export class GamificationNotification extends Notification {
  /**
   * The achievement or badge ID related to this notification
   * @example "daily_login_streak"
   */
  @ApiProperty({
    description: 'Unique identifier of the achievement or badge',
    example: 'daily_login_streak'
  })
  achievementId?: string;

  /**
   * Type of gamification event that triggered this notification
   * @example "ACHIEVEMENT_UNLOCKED"
   */
  @ApiProperty({
    description: 'Type of gamification event',
    enum: ['ACHIEVEMENT_UNLOCKED', 'LEVEL_UP', 'STREAK_MILESTONE', 'POINTS_EARNED', 'CHALLENGE_COMPLETED'],
    example: 'ACHIEVEMENT_UNLOCKED'
  })
  gamificationEventType!: string;

  /**
   * Points earned in this gamification event, if applicable
   * @example 100
   */
  @ApiProperty({
    description: 'Points earned in this event, if applicable',
    example: 100,
    required: false
  })
  pointsEarned?: number;

  /**
   * User's new level after this event, if applicable
   * @example 5
   */
  @ApiProperty({
    description: 'User\'s new level after this event, if applicable',
    example: 5,
    required: false
  })
  newLevel?: number;

  /**
   * Whether this notification should trigger a celebration animation
   * @example true
   */
  @ApiProperty({
    description: 'Whether this notification should trigger a celebration animation',
    example: true,
    default: false
  })
  showCelebration!: boolean;
}
