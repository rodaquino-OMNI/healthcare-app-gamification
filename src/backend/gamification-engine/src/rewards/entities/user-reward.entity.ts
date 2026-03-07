import { Reward } from './reward.entity';
import { GameProfile } from '../../profiles/entities/game-profile.entity';

/**
 * Represents a reward earned by a user.
 * Part of the reward management feature (F-303) that handles distribution of
 * digital and physical rewards based on user achievements and progress.
 */
export class UserReward {
    /**
     * Unique identifier for the user reward.
     */
    id: string = '';

    /**
     * The game profile associated with this reward.
     */
    profile: GameProfile = {} as GameProfile;

    /**
     * The reward earned by the user.
     */
    reward: Reward = new Reward();

    /**
     * The date and time when the reward was earned.
     */
    earnedAt: Date = new Date();
}
