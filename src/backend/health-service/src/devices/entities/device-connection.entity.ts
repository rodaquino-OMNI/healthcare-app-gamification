import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm'; // v0.3.17

/**
 * Enum representing possible device connection statuses
 */
export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  PAIRING = 'pairing',
  ERROR = 'error'
}

/**
 * Enum representing supported device types
 */
export enum DeviceType {
  SMARTWATCH = 'smartwatch',
  FITNESS_TRACKER = 'fitness_tracker',
  SMART_SCALE = 'smart_scale',
  BLOOD_PRESSURE_MONITOR = 'blood_pressure_monitor',
  GLUCOSE_MONITOR = 'glucose_monitor',
  SLEEP_TRACKER = 'sleep_tracker',
  OTHER = 'other'
}

/**
 * Represents a connection between a user's health record and a wearable device.
 * This entity stores information about the device, its connection status, and synchronization details.
 */
@Entity('device_connections')
export class DeviceConnection {
  /**
   * Unique identifier for the device connection
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Reference to the health record this device is connected to
   */
  @Column('uuid')
  recordId: string;

  /**
   * Type of wearable device (e.g., smartwatch, fitness tracker)
   */
  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.OTHER
  })
  deviceType: DeviceType;

  /**
   * Unique identifier for the device (typically provided by the device itself)
   */
  @Column({ length: 255 })
  deviceId: string;

  /**
   * When the device data was last synchronized
   */
  @Column({ type: 'timestamp', nullable: true })
  lastSync: Date;

  /**
   * Current connection status of the device
   */
  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.DISCONNECTED
  })
  status: ConnectionStatus;

  /**
   * When the device connection was created
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * When the device connection was last updated
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relationship with the HealthRecord entity
   * Note: The HealthRecord entity would need to be imported in a real implementation
   */
  /*
  @ManyToOne(() => HealthRecord, healthRecord => healthRecord.deviceConnections)
  @JoinColumn({ name: 'recordId' })
  healthRecord: HealthRecord;
  */
}