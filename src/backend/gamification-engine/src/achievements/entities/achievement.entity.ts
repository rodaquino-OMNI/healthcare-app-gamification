import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator'; // class-validator 0.14.1

/**
 * Represents an achievement that a user can earn in the gamification system.
 */
export class Achievement {
    /**
     * Unique identifier for the achievement.
     */
    id: string = '';

    /**
     * The title of the achievement.
     */
    @IsString()
    @IsNotEmpty()
    title: string = '';

    /**
     * A description of the achievement.
     */
    @IsString()
    description: string = '';

    /**
     * The journey to which the achievement belongs (e.g., 'health', 'care', 'plan').
     */
    @IsString()
    journey: string = '';

    /**
     * The name of the icon to display for the achievement.
     */
    @IsString()
    icon: string = '';

    /**
     * The amount of XP (experience points) awarded for unlocking the achievement.
     */
    @IsInt()
    @Min(0)
    @Max(1000)
    xpReward: number = 0;
}
