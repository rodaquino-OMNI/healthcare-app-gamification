import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm'; // typeorm 0.3.17
import { GameProfile } from 'src/backend/gamification-engine/src/profiles/entities/game-profile.entity';
import { Reward } from 'src/backend/gamification-engine/src/rewards/entities/reward.entity';

/**
 * Represents a reward earned by a user.
 * Part of the reward management feature (F-303) that handles distribution of 
 * digital and physical rewards based on user achievements and progress.
 */
@Entity()
export class UserReward {
  /**
   * Unique identifier for the user reward.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The game profile associated with this reward.
   */
  @ManyToOne(() => GameProfile)
  @JoinColumn({ name: 'profileId' })
  profile: GameProfile;

  /**
   * The reward earned by the user.
   */
  @ManyToOne(() => Reward)
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;

  /**
   * The date and time when the reward was earned.
   */
  @CreateDateColumn()
  earnedAt: Date;
}