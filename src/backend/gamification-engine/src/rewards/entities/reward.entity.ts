import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

/**
 * Represents a reward that a user can earn in the gamification system.
 * Part of the reward management feature (F-303) that handles distribution of 
 * digital and physical rewards based on user achievements and progress.
 */
export class Reward {
  /**
   * Unique identifier for the reward
   */
  @IsUUID()
  id: string = '';
  
  /**
   * Title of the reward displayed to users
   */
  @IsString()
  title: string = '';
  
  /**
   * Detailed description of the reward
   */
  @IsString()
  description: string = '';
  
  /**
   * Amount of XP awarded when earning this reward
   */
  @IsNumber()
  xpReward: number = 0;
  
  /**
   * Icon name/path used to visually represent the reward
   */
  @IsString()
  icon: string = '';
  
  /**
   * The journey this reward is associated with
   * Can be 'health', 'care', 'plan', or 'global' for cross-journey rewards
   */
  @IsString()
  journey: string = 'global';
}