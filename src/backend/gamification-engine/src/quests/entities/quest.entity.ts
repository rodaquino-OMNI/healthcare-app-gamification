import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator'; // class-validator@0.14.1

/**
 * Quest entity representing challenges that users can undertake
 * within the gamification system. Quests are associated with specific
 * journeys and provide XP rewards upon completion.
 */
export class Quest {
  /**
   * Unique identifier for the quest.
   */
  id: string = '';

  /**
   * The title of the quest that will be displayed to users.
   */
  @IsString()
  @IsNotEmpty()
  title: string = '';

  /**
   * A detailed description of what the quest entails.
   */
  @IsString()
  description: string = '';

  /**
   * The journey to which the quest belongs (e.g., 'health', 'care', 'plan').
   * This allows for journey-specific quests and filtering.
   */
  @IsString()
  journey: string = '';

  /**
   * The name of the icon to display for the quest.
   */
  @IsString()
  icon: string = '';

  /**
   * The amount of XP (experience points) awarded for completing the quest.
   * Limited to a maximum of 1000 XP per quest.
   */
  @IsInt()
  @Min(0)
  @Max(1000)
  xpReward: number = 0;
}
