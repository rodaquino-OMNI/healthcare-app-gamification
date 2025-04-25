import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm'; // latest
import { Appointment } from '../appointments/entities/appointment.entity';
import { User } from 'src/backend/auth-service/src/users/entities/user.entity';

/**
 * Represents a telemedicine session entity in the database.
 */
@Entity()
export class TelemedicineSession {
  /**
   * Unique identifier for the telemedicine session.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID of the appointment associated with the telemedicine session.
   */
  @Column()
  appointmentId: string;

  /**
   * The appointment associated with the telemedicine session.
   */
  @ManyToOne(() => Appointment)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  /**
   * ID of the patient participating in the telemedicine session.
   */
  @Column()
  patientId: string;

  /**
   * The patient participating in the telemedicine session.
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  /**
   * ID of the healthcare provider conducting the telemedicine session.
   */
  @Column()
  providerId: string;

  /**
   * The healthcare provider conducting the telemedicine session.
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'providerId' })
  provider: User;

  /**
   * Start time of the telemedicine session.
   */
  @Column()
  startTime: Date;

  /**
   * End time of the telemedicine session (nullable if the session is ongoing).
   */
  @Column({ nullable: true })
  endTime: Date;

  /**
   * Status of the telemedicine session (e.g., scheduled, ongoing, completed, cancelled).
   */
  @Column()
  status: string;

  /**
   * Timestamp of when the telemedicine session was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp of when the telemedicine session was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}