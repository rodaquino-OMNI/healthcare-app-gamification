import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm'; // latest

/**
 * Represents a user entity in the database.
 * Stores core user information required for authentication and profile management.
 */
@Entity()
export class User {
  /**
   * Unique identifier for the user.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Full name of the user.
   */
  @Column()
  name: string;

  /**
   * Email address of the user (must be unique).
   * Used as the primary identifier for authentication.
   */
  @Column({ unique: true })
  email: string;

  /**
   * Phone number of the user (optional).
   * Can be used for MFA and notifications.
   */
  @Column({ nullable: true })
  phone: string;

  /**
   * CPF (Brazilian national ID) of the user (optional).
   * Used for identity verification in Brazilian healthcare context.
   */
  @Column({ nullable: true })
  cpf: string;

  /**
   * Hashed password of the user.
   * Never stored in plain text.
   */
  @Column()
  password: string;

  /**
   * Timestamp of when the user was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp of when the user was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}