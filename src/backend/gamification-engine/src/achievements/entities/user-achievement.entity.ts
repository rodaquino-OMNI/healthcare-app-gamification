import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'; // typeorm 0.3.17
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
@Entity()
export class UserAchievement {
  /**
   * The ID of the user's game profile.
   */
  @PrimaryColumn()
  profileId!: string;

  /**
   * The ID of the achievement.
   */
  @PrimaryColumn()
  achievementId!: string;

  /**
   * The user's game profile.
   */
  @ManyToOne(() => GameProfile, gameProfile => gameProfile.achievements)
  @JoinColumn({ name: 'profileId' })
  profile!: GameProfile;

  /**
   * The achievement.
   */
  @ManyToOne(() => Achievement, achievement => achievement.id)
  @JoinColumn({ name: 'achievementId' })
  achievement!: Achievement;

  /**
   * The user's current progress towards unlocking the achievement.
   */
  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  @Max(1000)
  progress: number = 0;

  /**
   * Indicates whether the achievement has been unlocked by the user.
   */
  @Column({ default: false })
  @IsBoolean()
  unlocked: boolean = false;

  /**
   * The date and time when the achievement was unlocked.
   */
  @Column({ nullable: true })
  unlockedAt?: Date;

  /**
   * The date and time when the user achievement was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * The date and time when the user achievement was last updated.
   */
  @UpdateDateColumn()
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