import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WearableAdapter } from '../wearables.service';
import { HealthMetric } from '../../health/entities/health-metric.entity';
import { DeviceConnection } from '../../devices/entities/device-connection.entity';
import { ErrorCodes } from 'src/backend/shared/src/constants/error-codes.constants';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';

@Injectable()
export class GoogleFitAdapter extends WearableAdapter {
  private readonly logger: Logger;
  private readonly baseUrl = 'https://www.googleapis.com/fitness/v1/users/me';
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    loggerService: LoggerService
  ) {
    super();
    this.logger = loggerService.createLogger(GoogleFitAdapter.name);
  }

  /**
   * Initiates the connection to Google Fit API using OAuth 2.0 flow.
   * @param userId The ID of the user to connect
   * @returns A promise that resolves to a DeviceConnection entity
   */
  async connect(userId: string): Promise<DeviceConnection> {
    try {
      this.logger.log(`Initiating connection to Google Fit for user ${userId}`);
      
      const clientId = this.configService.get<string>('GOOGLE_FIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_FIT_CLIENT_SECRET');
      const redirectUri = this.configService.get<string>('GOOGLE_FIT_REDIRECT_URI');
      
      if (!clientId || !clientSecret || !redirectUri) {
        this.logger.error(`Missing Google Fit API credentials`, null, { userId });
        throw new Error(ErrorCodes.HEALTH_002);
      }
      
      // Note: In a real implementation, we would redirect the user to the Google OAuth consent screen
      // and handle the callback with the authorization code
      // For this example, we'll assume the authorization code has been obtained
      
      // This would be the URL to redirect the user to
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=https://www.googleapis.com/auth/fitness.activity.read ` +
        `https://www.googleapis.com/auth/fitness.blood_glucose.read ` +
        `https://www.googleapis.com/auth/fitness.blood_pressure.read ` +
        `https://www.googleapis.com/auth/fitness.body.read ` +
        `https://www.googleapis.com/auth/fitness.heart_rate.read ` +
        `https://www.googleapis.com/auth/fitness.sleep.read`;
      
      // In a real implementation, we would redirect the user to authUrl
      // Then, in the callback handler, we would exchange the authorization code for tokens
      
      // For this example, we'll assume we have an authorization code
      const authorizationCode = 'example_authorization_code';
      
      // Exchange authorization code for tokens
      const tokenResponse = await firstValueFrom(
        this.httpService.post('https://oauth2.googleapis.com/token', {
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      );
      
      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      
      // Create a new device connection record
      const deviceConnection = new DeviceConnection();
      deviceConnection.userId = userId;
      deviceConnection.deviceType = 'GOOGLE_FIT';
      deviceConnection.status = 'CONNECTED';
      deviceConnection.connectionData = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000).toISOString()
      };
      deviceConnection.lastSyncedAt = new Date();
      
      this.logger.log(`Successfully connected to Google Fit for user ${userId}`);
      
      return deviceConnection;
      
    } catch (error) {
      this.logger.error(`Failed to connect to Google Fit for user ${userId}`, error.stack, { userId });
      throw new Error(`${ErrorCodes.HEALTH_002}: ${error.message}`);
    }
  }

  /**
   * Retrieves health metrics from the Google Fit API for a specific user and date range.
   * @param userId The ID of the user
   * @param startDate The start date for the metrics query
   * @param endDate The end date for the metrics query
   * @returns A promise that resolves to an array of HealthMetric entities
   */
  async getHealthMetrics(userId: string, startDate: Date, endDate: Date): Promise<HealthMetric[]> {
    try {
      this.logger.log(`Retrieving health metrics from Google Fit for user ${userId}`);
      
      // Retrieve the device connection for the user
      const deviceConnection = await this.getDeviceConnection(userId);
      
      if (!deviceConnection || deviceConnection.status !== 'CONNECTED') {
        this.logger.warn(`No active Google Fit connection found for user ${userId}`, { userId });
        throw new Error(ErrorCodes.HEALTH_002);
      }
      
      // Check if the access token is expired and refresh if needed
      await this.refreshTokenIfNeeded(deviceConnection);
      
      const accessToken = deviceConnection.connectionData.accessToken;
      
      // Define the data sources to query
      const dataSources = [
        'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
        'derived:com.google.weight:com.google.android.gms:merge_weight',
        'derived:com.google.blood_pressure:com.google.android.gms:merged',
        'derived:com.google.blood_glucose:com.google.android.gms:merged',
        'derived:com.google.sleep.segment:com.google.android.gms:merged'
      ];
      
      // Collect metrics from all data sources
      const healthMetrics: HealthMetric[] = [];
      
      for (const dataSource of dataSources) {
        // Construct request payload for Google Fit Data Sets API
        const requestBody = {
          aggregateBy: [{
            dataTypeName: dataSource
          }],
          bucketByTime: {
            durationMillis: 86400000 // 1 day in milliseconds
          },
          startTimeMillis: startDate.getTime(),
          endTimeMillis: endDate.getTime()
        };
        
        // Make request to Google Fit API
        const response = await firstValueFrom(
          this.httpService.post(
            `${this.baseUrl}/dataset:aggregate`,
            requestBody,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          )
        );
        
        // Process the response and extract metrics
        const buckets = response.data.bucket || [];
        
        for (const bucket of buckets) {
          for (const dataset of bucket.dataset || []) {
            for (const point of dataset.point || []) {
              for (const value of point.value || []) {
                const metricType = this.mapGoogleFitTypeToMetricType(dataset.dataSourceId);
                
                if (!metricType) {
                  continue; // Skip unrecognized data types
                }
                
                // Create a new health metric
                const metric = new HealthMetric();
                metric.userId = userId;
                metric.type = metricType;
                metric.timestamp = new Date(point.startTimeNanos / 1000000); // Convert nanos to millis
                
                // Extract and convert the value based on the metric type
                switch (metricType) {
                  case 'STEPS':
                    metric.value = value.intVal;
                    metric.unit = 'steps';
                    break;
                  case 'HEART_RATE':
                    metric.value = value.fpVal;
                    metric.unit = 'bpm';
                    break;
                  case 'WEIGHT':
                    // Google Fit stores weight in kg, convert if necessary
                    metric.value = value.fpVal;
                    metric.unit = 'kg';
                    break;
                  case 'BLOOD_PRESSURE':
                    // Google Fit stores blood pressure as systolic/diastolic in mmHg
                    metric.value = `${value.mapVal.find(m => m.key === 'systolic').value.fpVal}/${
                      value.mapVal.find(m => m.key === 'diastolic').value.fpVal}`;
                    metric.unit = 'mmHg';
                    break;
                  case 'BLOOD_GLUCOSE':
                    // Google Fit stores blood glucose in mmol/L, convert to mg/dL if needed
                    metric.value = this.convertUnit(value.fpVal, 'mmol/L', 'mg/dL');
                    metric.unit = 'mg/dL';
                    break;
                  case 'SLEEP':
                    // Sleep stages are encoded as integers in Google Fit
                    metric.value = this.mapSleepStage(value.intVal);
                    metric.unit = 'stage';
                    break;
                  default:
                    metric.value = value.fpVal || value.intVal;
                    metric.unit = 'unknown';
                }
                
                metric.source = 'GOOGLE_FIT';
                
                healthMetrics.push(metric);
              }
            }
          }
        }
      }
      
      // Update the last synced time for the device connection
      deviceConnection.lastSyncedAt = new Date();
      // In a real implementation, we would save this update to the database
      
      this.logger.log(`Retrieved ${healthMetrics.length} health metrics from Google Fit for user ${userId}`);
      
      return healthMetrics;
      
    } catch (error) {
      this.logger.error(`Failed to retrieve health metrics from Google Fit for user ${userId}`, error.stack, { userId });
      throw new Error(`${ErrorCodes.HEALTH_001}: ${error.message}`);
    }
  }

  /**
   * Disconnects the user's account from the Google Fit API.
   * @param userId The ID of the user to disconnect
   */
  async disconnect(userId: string): Promise<void> {
    try {
      this.logger.log(`Disconnecting from Google Fit for user ${userId}`);
      
      // Retrieve the device connection for the user
      const deviceConnection = await this.getDeviceConnection(userId);
      
      if (!deviceConnection || deviceConnection.status !== 'CONNECTED') {
        this.logger.warn(`No active Google Fit connection found for user ${userId}`, { userId });
        return;
      }
      
      const clientId = this.configService.get<string>('GOOGLE_FIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_FIT_CLIENT_SECRET');
      
      if (!clientId || !clientSecret) {
        this.logger.error(`Missing Google Fit API credentials`, null, { userId });
        throw new Error(ErrorCodes.HEALTH_002);
      }
      
      // Revoke the access token
      await firstValueFrom(
        this.httpService.post(
          'https://oauth2.googleapis.com/revoke',
          `token=${deviceConnection.connectionData.accessToken}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
      );
      
      // Update the device connection status
      deviceConnection.status = 'DISCONNECTED';
      deviceConnection.connectionData = null;
      // In a real implementation, we would save this update to the database
      
      this.logger.log(`Successfully disconnected from Google Fit for user ${userId}`);
      
    } catch (error) {
      this.logger.error(`Failed to disconnect from Google Fit for user ${userId}`, error.stack, { userId });
      throw new Error(`${ErrorCodes.HEALTH_002}: ${error.message}`);
    }
  }

  /**
   * Maps Google Fit data types to standardized metric types used in the application.
   * @param googleFitType The Google Fit data type identifier
   * @returns The standardized metric type
   */
  private mapGoogleFitTypeToMetricType(googleFitType: string): string {
    if (googleFitType.includes('step_count')) {
      return 'STEPS';
    } else if (googleFitType.includes('heart_rate')) {
      return 'HEART_RATE';
    } else if (googleFitType.includes('weight')) {
      return 'WEIGHT';
    } else if (googleFitType.includes('blood_pressure')) {
      return 'BLOOD_PRESSURE';
    } else if (googleFitType.includes('blood_glucose')) {
      return 'BLOOD_GLUCOSE';
    } else if (googleFitType.includes('sleep')) {
      return 'SLEEP';
    }
    
    // If no mapping is found, return null
    return null;
  }

  /**
   * Converts a value from Google Fit's unit to the application's standard unit.
   * @param value The value to convert
   * @param fromUnit The source unit
   * @param toUnit The target unit
   * @returns The converted value
   */
  private convertUnit(value: number, fromUnit: string, toUnit: string): number {
    // Handle various unit conversions
    if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
      // Convert blood glucose from mmol/L to mg/dL
      return value * 18.0182;
    } else if (fromUnit === 'kg' && toUnit === 'lb') {
      // Convert weight from kg to lb
      return value * 2.20462;
    } else if (fromUnit === 'lb' && toUnit === 'kg') {
      // Convert weight from lb to kg
      return value / 2.20462;
    } else if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
      // Convert blood glucose from mg/dL to mmol/L
      return value / 18.0182;
    }
    
    // If no conversion is needed or supported, return the original value
    return value;
  }

  /**
   * Maps Google Fit sleep stage values to human-readable stage names.
   * @param sleepStageValue The Google Fit sleep stage value
   * @returns The human-readable sleep stage name
   */
  private mapSleepStage(sleepStageValue: number): string {
    switch (sleepStageValue) {
      case 1:
        return 'AWAKE';
      case 2:
        return 'LIGHT';
      case 3:
        return 'DEEP';
      case 4:
        return 'REM';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * Helper method to get a device connection for a user.
   * In a real implementation, this would query the database.
   * @param userId The ID of the user
   * @returns The device connection entity
   */
  private async getDeviceConnection(userId: string): Promise<DeviceConnection> {
    // This is a mock implementation
    // In a real application, this would query the database
    
    // For the purpose of this example, we'll return a mock device connection
    const mockConnection = new DeviceConnection();
    mockConnection.userId = userId;
    mockConnection.deviceType = 'GOOGLE_FIT';
    mockConnection.status = 'CONNECTED';
    mockConnection.connectionData = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour from now
    };
    mockConnection.lastSyncedAt = new Date(Date.now() - 86400 * 1000); // 1 day ago
    
    return mockConnection;
  }

  /**
   * Refreshes the access token if it's expired or about to expire.
   * @param deviceConnection The device connection containing the tokens
   */
  private async refreshTokenIfNeeded(deviceConnection: DeviceConnection): Promise<void> {
    const expiresAt = new Date(deviceConnection.connectionData.expiresAt);
    const now = new Date();
    
    // If the token expires in less than 5 minutes, refresh it
    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      this.logger.log(`Refreshing access token for Google Fit connection`);
      
      const clientId = this.configService.get<string>('GOOGLE_FIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_FIT_CLIENT_SECRET');
      
      if (!clientId || !clientSecret) {
        this.logger.error(`Missing Google Fit API credentials`);
        throw new Error(ErrorCodes.HEALTH_002);
      }
      
      try {
        const refreshResponse = await firstValueFrom(
          this.httpService.post('https://oauth2.googleapis.com/token', {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: deviceConnection.connectionData.refreshToken,
            grant_type: 'refresh_token'
          })
        );
        
        const { access_token, expires_in } = refreshResponse.data;
        
        // Update the device connection with the new access token
        deviceConnection.connectionData.accessToken = access_token;
        deviceConnection.connectionData.expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();
        
        // In a real implementation, we would save this update to the database
        
        this.logger.log(`Successfully refreshed access token for Google Fit connection`);
        
      } catch (error) {
        this.logger.error(`Failed to refresh access token for Google Fit connection`, error.stack);
        throw new Error(`${ErrorCodes.HEALTH_002}: Failed to refresh access token: ${error.message}`);
      }
    }
  }
}