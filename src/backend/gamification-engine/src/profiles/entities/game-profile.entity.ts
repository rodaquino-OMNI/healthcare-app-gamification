import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserAchievement } from '../../achievements/entities/user-achievement.entity';

/**
 * Entity representing a user's game profile in the gamification system.
 * Contains all gamification-related data for a single user including level,
 * experience points (XP), and achievements.
 */
@Entity('game_profiles')
export class GameProfile {
  /**
   * Unique identifier for this game profile
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  /**
   * The ID of the user this profile belongs to
   */
  @Column()
  userId!: string;
  
  /**
   * The user's current level in the gamification system
   */
  @Column({ default: 1 })
  level: number = 1;
  
  /**
   * The user's current experience points
   */
  @Column({ default: 0 })
  xp: number = 0;
  
  /**
   * Achievements unlocked by the user
   */
  @OneToMany(() => UserAchievement, achievement => achievement.profile, { 
    eager: false,
    cascade: true 
  })
  achievements?: UserAchievement[];
  
  /**
   * The date and time when this profile was created
   */
  @CreateDateColumn()
  createdAt!: Date;
  
  /**
   * The date and time when this profile was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Creates a new GameProfile instance
   * 
   * @param data Optional initialization data
   */
  constructor(data?: Partial<GameProfile>) {
    if (data) {
      Object.assign(this, data);
    }
    
    // Initialize arrays to empty if undefined
    this.achievements = this.achievements ?? [];
  }
}