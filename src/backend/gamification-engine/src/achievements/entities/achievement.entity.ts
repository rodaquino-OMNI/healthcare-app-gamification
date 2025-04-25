import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  OneToMany 
} from 'typeorm'; // typeorm 0.3.17
import { 
  IsString, 
  IsInt, 
  Min, 
  Max, 
  IsNotEmpty 
} from 'class-validator'; // class-validator 0.14.1

/**
 * Represents an achievement that a user can earn in the gamification system.
 */
@Entity()
export class Achievement {
  /**
   * Unique identifier for the achievement.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The title of the achievement.
   */
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * A description of the achievement.
   */
  @Column()
  @IsString()
  description: string;

  /**
   * The journey to which the achievement belongs (e.g., 'health', 'care', 'plan').
   */
  @Column()
  @IsString()
  journey: string;

  /**
   * The name of the icon to display for the achievement.
   */
  @Column()
  @IsString()
  icon: string;

  /**
   * The amount of XP (experience points) awarded for unlocking the achievement.
   */
  @Column()
  @IsInt()
  @Min(0)
  @Max(1000)
  xpReward: number;
}