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

/**
 * Represents a user's progress and status for a specific achievement.
 */
@Entity()
export class UserAchievement {
  /**
   * The ID of the user's game profile.
   */
  @PrimaryColumn()
  profileId: string;

  /**
   * The ID of the achievement.
   */
  @PrimaryColumn()
  achievementId: string;

  /**
   * The user's game profile. Uses string reference to avoid circular dependency.
   */
  @ManyToOne('GameProfile', undefined, { primary: true })
  @JoinColumn({ name: 'profileId' })
  profile: any;

  /**
   * The achievement.
   */
  @ManyToOne(() => Achievement, achievement => achievement.id, { primary: true })
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;

  /**
   * The user's current progress towards unlocking the achievement.
   */
  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  @Max(1000)
  progress: number;

  /**
   * Indicates whether the achievement has been unlocked by the user.
   */
  @Column({ default: false })
  @IsBoolean()
  unlocked: boolean;

  /**
   * The date and time when the achievement was unlocked.
   */
  @Column({ nullable: true })
  unlockedAt: Date;

  /**
   * The date and time when the user achievement was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the user achievement was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}