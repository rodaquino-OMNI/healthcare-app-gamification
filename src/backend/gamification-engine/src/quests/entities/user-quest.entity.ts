import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  Generated 
} from 'typeorm'; // typeorm@0.3.17
import { IsBoolean, IsInt, Min, Max } from 'class-validator'; // class-validator@0.14.1
import { Quest } from '../entities/quest.entity';

/**
 * Represents a user's participation in a quest, tracking their progress and completion status.
 * This entity establishes the relationship between a user's game profile and a specific quest,
 * allowing the system to track quest progress as part of the gamification engine.
 */
@Entity()
export class UserQuest {
  /**
   * Unique identifier for the user quest.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  /**
   * The game profile of the user participating in the quest.
   * This establishes a many-to-one relationship with GameProfile.
   * Using string reference to avoid circular dependency issues.
   */
  @ManyToOne('GameProfile', 'quests')
  @JoinColumn({ name: 'profileId' })
  profile: any; // Using 'any' as GameProfile is not imported directly

  /**
   * The quest being undertaken by the user.
   * This establishes a many-to-one relationship with Quest.
   */
  @ManyToOne(() => Quest)
  @JoinColumn({ name: 'questId' })
  quest: Quest = new Quest();

  /**
   * The user's current progress toward completing the quest (0-100).
   * This allows tracking partial completion of quests that require
   * multiple steps or actions.
   */
  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number = 0;

  /**
   * Indicates whether the user has completed the quest.
   * When true, the quest is considered fully completed and rewards are granted.
   */
  @Column({ default: false })
  @IsBoolean()
  completed: boolean = false;
}