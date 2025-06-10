import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

/**
 * Represents the connection status of a wearable device
 */
export enum DeviceDeviceDeviceConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  EXPIRED = 'expired',
  PENDING = 'pending',
  FAILED = 'failed'
}

/**
 * Represents the type of wearable device
 */
export enum DeviceType {
  FITBIT = 'fitbit',
  APPLE_HEALTH = 'apple_health',
  GOOGLE_FIT = 'google_fit',
  SAMSUNG_HEALTH = 'samsung_health',
  GARMIN = 'garmin'
}

/**
 * Represents a connection to a wearable device in the database
 */
@Entity('device_connections')
export class DeviceConnection {
  /**
   * Unique identifier for the device connection
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID of the user who owns this device connection
   */
  @Column()
  userId!: string;

  /**
   * ID of the health record this device is connected to
   */
  @Column()
  recordId!: string;

  /**
   * Type of device (e.g., 'fitbit', 'apple_health')
   */
  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.FITBIT
  })
  deviceType!: DeviceType;

  /**
   * Unique identifier for the device on the provider's platform
   */
  @Column({ nullable: true })
  deviceId?: string;

  /**
   * Current connection status
   */
  @Column({
    type: 'enum',
    enum: DeviceDeviceDeviceConnectionStatus,
    default: DeviceDeviceDeviceConnectionStatus.PENDING
  })
  status!: DeviceDeviceDeviceConnectionStatus;

  /**
   * Last time data was synchronized from this device
   */
  @Column({ nullable: true })
  lastSync!: Date;

  /**
   * Authentication token for the device connection
   */
  @Column({ nullable: true })
  authToken?: string;

  /**
   * Refresh token for the device connection
   */
  @Column({ nullable: true })
  refreshToken?: string;

  /**
   * Expiration timestamp for the auth token
   */
  @Column({ nullable: true })
  tokenExpiry?: Date;

  /**
   * Additional metadata for the device connection (JSON)
   */
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  /**
   * Date when the connection was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Date when the connection was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}