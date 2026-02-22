/**
 * Represents the connection status of a wearable device
 */
export enum DeviceConnectionStatus {
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
 * Represents a connection to a wearable device
 */
export class DeviceConnection {
  /**
   * Unique identifier for the device connection
   */
  id!: string;

  /**
   * ID of the user who owns this device connection
   */
  userId!: string;

  /**
   * ID of the health record this device is connected to
   */
  recordId!: string;

  /**
   * Type of device (e.g., 'fitbit', 'apple_health')
   */
  deviceType: DeviceType = DeviceType.FITBIT;

  /**
   * Unique identifier for the device on the provider's platform
   */
  deviceId?: string;

  /**
   * Current connection status
   */
  status: DeviceConnectionStatus = DeviceConnectionStatus.PENDING;

  /**
   * Last time data was synchronized from this device
   */
  lastSync!: Date;

  /**
   * Authentication token for the device connection
   */
  authToken?: string;

  /**
   * Refresh token for the device connection
   */
  refreshToken?: string;

  /**
   * Expiration timestamp for the auth token
   */
  tokenExpiry?: Date;

  /**
   * Additional metadata for the device connection (JSON)
   */
  metadata?: Record<string, any>;

  /**
   * Date when the connection was created
   */
  createdAt!: Date;

  /**
   * Date when the connection was last updated
   */
  updatedAt!: Date;
}
