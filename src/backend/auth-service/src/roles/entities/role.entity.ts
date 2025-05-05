import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany, 
  JoinTable, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm'; // typeorm latest
import { Permission } from '../../permissions/entities/permission.entity';

/**
 * Role entity representing a collection of permissions that can be assigned to users
 * within the AUSTA SuperApp. Roles enable journey-specific access control across the
 * application's three core journeys: Health, Care, and Plan.
 */
@Entity()
export class Role {
  /**
   * Unique identifier for the role
   */
  @PrimaryGeneratedColumn()
  id: number = 0;

  /**
   * Unique name of the role (e.g., 'User', 'Caregiver', 'Provider', 'Administrator')
   */
  @Column({ unique: true })
  name: string = '';

  /**
   * Description of the role and its purpose
   */
  @Column()
  description: string = '';

  /**
   * The journey this role is associated with (health, care, plan, or null for global roles)
   */
  @Column({ nullable: true })
  journey: string = '';

  /**
   * Indicates if this is a default role assigned to new users
   */
  @Column({ default: false })
  isDefault: boolean = false;

  /**
   * Permissions assigned to this role
   */
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[] = [];

  /**
   * Timestamp of when the role was created
   */
  @CreateDateColumn()
  createdAt: Date = new Date();

  /**
   * Timestamp of when the role was last updated
   */
  @UpdateDateColumn()
  updatedAt: Date = new Date();
}