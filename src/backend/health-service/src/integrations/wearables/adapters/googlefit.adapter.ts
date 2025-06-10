/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HealthMetric } from '../../../health/entities/health-metric.entity';
import { DeviceConnection } from '../../../devices/entities/device-connection.entity';
import { LoggerService } from '@app/shared/logging/logger.service';
import { WearableAdapter } from '../interfaces/wearable-adapter.interface';
import { MetricType, MetricSource } from '../../../health/types/health.types';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { SYS_INTERNAL_SERVER_ERROR } from '@app/shared/constants/error-codes.constants';

/**
 * Interface for connection data that will be stored in DeviceConnection metadata
 */
interface GoogleFitConnectionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  retryCount?: number;
}

/**
 * Adapter for integrating with Google Fit API
 * Provides functionality for connecting, syncing, and retrieving health data
 * from Google Fit wearable devices and the Google Fit app.
 */
@Injectable()
export class GoogleFitAdapter implements WearableAdapter {
  // Define max retries and backoff constants
  private readonly MAX_RETRIES = 3;
  private readonly INITIAL_BACKOFF_MS = 1000;
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {}
  
  /**
   * Connect to Google Fit API
   */
  async connect(userId: string, authToken: string, refreshToken?: string): Promise<DeviceConnection> {
    try {
      this.logger.log(`Initiating connection to Google Fit for user ${userId}`);
      const clientId = this.configService.get<string>('GOOGLE_FIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_FIT_CLIENT_SECRET');
      const redirectUri = this.configService.get<string>('GOOGLE_FIT_REDIRECT_URI');
      
      if (!clientId || !clientSecret || !redirectUri) {
        this.logger.error(`Missing Google Fit API credentials`, null, 'GoogleFitAdapter');
        throw new AppException(
          'Missing Google Fit API credentials',
          ErrorType.TECHNICAL,
          'CONFIG_ERROR',
          { service: 'GoogleFitAdapter' }
        );
      }
      
      const tokenResponse = await this.makeRequestWithRetry(() => 
        firstValueFrom(
          this.httpService.post('https://oauth2.googleapis.com/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: authToken,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
          })
        )
      );
      
      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      
      const deviceConnection = new DeviceConnection();
      const connectionData: GoogleFitConnectionData = {
        accessToken: access_token,
        refreshToken: refresh_token || refreshToken || '',
        expiresAt: new Date(Date.now() + expires_in * 1000).toISOString(),
        retryCount: 0
      };
      
      deviceConnection.deviceType = 'FITNESS_TRACKER';
      deviceConnection.status = 'CONNECTED';
      deviceConnection.deviceId = `google-fit-${userId}`;
      deviceConnection.lastSync = new Date();
      deviceConnection.userId = userId;
      
      deviceConnection.metadata = {
        connectionType: 'GOOGLE_FIT',
        connectionData: JSON.stringify(connectionData)
      };
      
      return deviceConnection;
    } catch (error: any) {
      // Check for specific OAuth errors
      if (error.response && error.response.data) {
        const { error: errorType, error_description } = error.response.data;
        
        if (errorType === 'invalid_grant') {
          throw new AppException(
            'Invalid authorization code or refresh token',
            ErrorType.BUSINESS,
            'AUTH_ERROR',
            { userId }
          );
        } else if (errorType === 'invalid_client') {
          throw new AppException(
            'Invalid client credentials',
            ErrorType.TECHNICAL,
            'CONFIG_ERROR',
            { service: 'GoogleFitAdapter' }
          );
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to connect to Google Fit: ${errorMessage}`, 
        error instanceof Error ? error.stack : null, 'GoogleFitAdapter');
      
      throw new AppException(
        `Failed to connect to Google Fit`,
        ErrorType.TECHNICAL,
        'API_INTEGRATION_ERROR',
        { userId },
        error
      );
    }
  }
  
  /**
   * Makes API requests with retry logic for transient failures
   */
  private async makeRequestWithRetry<T>(
    requestFn: () => Promise<T>,
    retryCount = 0,
    maxRetries = this.MAX_RETRIES,
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: any) {
      // Don't retry for client errors (4xx except 429)
      if (error.response && error.response.status >= 400 && 
          error.response.status < 500 && error.response.status !== 429) {
        throw error;
      }
      
      if (retryCount >= maxRetries) {
        this.logger.error(`Request failed after ${maxRetries} retries`, null, 'GoogleFitAdapter');
        throw error;
      }
      
      const delay = this.INITIAL_BACKOFF_MS * Math.pow(2, retryCount);
      this.logger.log(`Retrying request after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`, 
        'GoogleFitAdapter');
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.makeRequestWithRetry(requestFn, retryCount + 1, maxRetries);
    }
  }
  
  /**
   * Retrieves health metrics from the Google Fit API for a specific user and date range.
   */
  async getHealthMetrics(
    userId: string, 
    deviceConnection: DeviceConnection, 
    startTime: Date, 
    endTime: Date
  ): Promise<HealthMetric[]> {
    try {
      if (!deviceConnection) {
        this.logger.warn(`No active Google Fit connection found for user ${userId}`, 'GoogleFitAdapter');
        return [];
      }
      
      // Extract and validate connection data from metadata
      let connectionData: GoogleFitConnectionData | null = null;
      try {
        connectionData = JSON.parse(deviceConnection.metadata?.connectionData || '{}') as GoogleFitConnectionData;
      } catch (e) {
        this.logger.error(`Invalid connection data format for user ${userId}`, null, 'GoogleFitAdapter');
        throw new AppException(
          'Invalid connection data format',
          ErrorType.TECHNICAL,
          'DATA_FORMAT_ERROR',
          { userId }
        );
      }
      
      if (!connectionData || !connectionData.accessToken) {
        this.logger.error(`Missing connection data for Google Fit user ${userId}`, null, 'GoogleFitAdapter');
        throw new AppException(
          'Missing connection data',
          ErrorType.BUSINESS,
          'INVALID_CONNECTION',
          { userId }
        );
      }
      
      // Ensure token is valid
      await this.refreshTokenIfNeeded(deviceConnection);
      // Get the updated connection data after refresh
      connectionData = JSON.parse(deviceConnection.metadata?.connectionData || '{}') as GoogleFitConnectionData;
      const accessToken = connectionData.accessToken;
      
      const dataSources = [
        'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
        'derived:com.google.weight:com.google.android.gms:merge_weight',
        'derived:com.google.blood_pressure:com.google.android.gms:merged',
        'derived:com.google.blood_glucose:com.google.android.gms:merged',
        'derived:com.google.sleep.segment:com.google.android.gms:merged'
      ];
      
      const healthMetrics: HealthMetric[] = [];
      const baseUrl = 'https://www.googleapis.com/fitness/v1/users/me';
      
      for (const dataSource of dataSources) {
        const requestBody = {
          aggregateBy: [{
            dataTypeName: dataSource
          }],
          bucketByTime: {
            durationMillis: 86400000
          },
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime()
        };
        
        try {
          const response = await this.makeRequestWithRetry(() => 
            firstValueFrom(
              this.httpService.post(
                `${baseUrl}/dataset:aggregate`,
                requestBody,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  }
                }
              )
            )
          );
          
          const buckets = response.data.bucket || [];
          
          for (const bucket of buckets) {
            for (const dataset of bucket.dataset || []) {
              for (const point of dataset.point || []) {
                for (const value of point.value || []) {
                  const metricType = this.mapGoogleFitTypeToMetricType(dataset.dataSourceId);
                  if (!metricType) {
                    continue;
                  }
                  
                  const metric = new HealthMetric();
                  metric.userId = userId;
                  metric.type = metricType;
                  metric.timestamp = new Date(parseInt(point.startTimeNanos) / 1000000);
                  metric.source = 'GOOGLE_FIT' as MetricSource;
                  
                  switch (metricType) {
                    case 'STEPS':
                      metric.value = value.intVal || 0;
                      metric.unit = 'steps';
                      break;
                    case 'HEART_RATE':
                      metric.value = value.fpVal || 0;
                      metric.unit = 'bpm';
                      break;
                    case 'WEIGHT':
                      metric.value = value.fpVal || 0;
                      metric.unit = 'kg';
                      break;
                    case 'BLOOD_PRESSURE_SYSTOLIC':
                      metric.value = this.extractSystolicBP(value);
                      metric.unit = 'mmHg';
                      break;
                    case 'BLOOD_PRESSURE_DIASTOLIC':
                      metric.value = this.extractDiastolicBP(value);
                      metric.unit = 'mmHg';
                      break;
                    case 'BLOOD_GLUCOSE':
                      metric.value = value.fpVal || 0;
                      metric.unit = 'mg/dL';
                      break;
                    case 'SLEEP':
                      metric.value = value.intVal || 0;
                      metric.unit = 'stage';
                      break;
                    default:
                      metric.value = value.fpVal || value.intVal || 0;
                      metric.unit = 'unknown';
                  }
                  
                  healthMetrics.push(metric);
                }
              }
            }
          }
        } catch (error: any) {
          // Log error but continue with other data sources
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Failed to retrieve ${dataSource} data: ${errorMessage}`, error instanceof Error ? error.stack : null, 'GoogleFitAdapter');
        }
      }
      
      deviceConnection.lastSync = new Date();
      this.logger.log(`Retrieved ${healthMetrics.length} health metrics from Google Fit for user ${userId}`, 'GoogleFitAdapter');
      return healthMetrics;
    } catch (error: any) {
      // Enhanced error handling with AppException
      if (error instanceof AppException) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to retrieve Google Fit metrics: ${errorMessage}`, 
        error instanceof Error ? error.stack : null, 'GoogleFitAdapter');
      
      throw new AppException(
        'Failed to retrieve health metrics',
        ErrorType.TECHNICAL,
        'API_INTEGRATION_ERROR',
        { userId },
        error
      );
    }
  }
  
  /**
   * Disconnect from Google Fit
   */
  async disconnect(userId: string, deviceConnection: DeviceConnection): Promise<boolean> {
    try {
      if (!deviceConnection) {
        this.logger.warn(`No active Google Fit connection found for user ${userId}`, 'GoogleFitAdapter');
        return false;
      }
      
      const clientId = this.configService.get<string>('GOOGLE_FIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_FIT_CLIENT_SECRET');
      
      if (!clientId || !clientSecret) {
        this.logger.error(`Missing Google Fit API credentials`, null, 'GoogleFitAdapter');
        throw new AppException(
          'Missing Google Fit API credentials',
          ErrorType.TECHNICAL,
          'CONFIG_ERROR',
          { service: 'GoogleFitAdapter' }
        );
      }
      
      // Extract connection data from metadata
      let connectionData: GoogleFitConnectionData | null = null;
      try {
        connectionData = JSON.parse(deviceConnection.metadata?.connectionData || '{}') as GoogleFitConnectionData;
      } catch (e) {
        this.logger.error(`Invalid connection data format for user ${userId}`, null, 'GoogleFitAdapter');
        throw new AppException(
          'Invalid connection data format',
          ErrorType.TECHNICAL,
          'DATA_FORMAT_ERROR',
          { userId }
        );
      }
      
      if (!connectionData || !connectionData.accessToken) {
        this.logger.error(`Missing connection data for Google Fit user ${userId}`, null, 'GoogleFitAdapter');
        throw new AppException(
          'Missing connection data',
          ErrorType.BUSINESS,
          'INVALID_CONNECTION',
          { userId }
        );
      }
      
      // Revoke token with retry logic
      await this.makeRequestWithRetry(() => 
        firstValueFrom(
          this.httpService.post(
            'https://oauth2.googleapis.com/revoke',
            `token=${connectionData.accessToken}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          )
        )
      );
      
      // Update device connection status
      deviceConnection.status = 'DISCONNECTED';
      deviceConnection.metadata = {
        ...deviceConnection.metadata,
        connectionData: null
      };
      
      this.logger.log(`Successfully disconnected from Google Fit for user ${userId}`, 'GoogleFitAdapter');
      return true;
    } catch (error: any) {
      if (error instanceof AppException) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to disconnect from Google Fit: ${errorMessage}`, error instanceof Error ? error.stack : null, 'GoogleFitAdapter');
      
      throw new AppException(
        'Failed to disconnect from Google Fit',
        ErrorType.TECHNICAL,
        'API_INTEGRATION_ERROR',
        { userId },
        error
      );
    }
  }
  
  /**
   * Get auth URL for Google Fit
   */
  getAuthUrl(userId: string): string {
    if (!userId) {
      return '';
    }
    
    const clientId = this.configService.get<string>('GOOGLE_FIT_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GOOGLE_FIT_REDIRECT_URI');
    
    if (!clientId || !redirectUri) {
      this.logger.error(`Missing Google Fit API credentials`, null, 'GoogleFitAdapter');
      return '';
    }
    
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=https://www.googleapis.com/auth/fitness.activity.read ` +
      `https://www.googleapis.com/auth/fitness.blood_glucose.read ` +
      `https://www.googleapis.com/auth/fitness.blood_pressure.read ` +
      `https://www.googleapis.com/auth/fitness.body.read ` +
      `https://www.googleapis.com/auth/fitness.heart_rate.read ` +
      `https://www.googleapis.com/auth/fitness.sleep.read`;
  }
  
  /**
   * Refresh token for Google Fit connection
   */
  private async refreshToken(refreshToken: string): Promise<string> {
    try {
      const clientId = this.configService.get<string>('GOOGLE_FIT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('GOOGLE_FIT_CLIENT_SECRET');
      
      if (!clientId || !clientSecret) {
        this.logger.error(`Missing Google Fit API credentials`, null, 'GoogleFitAdapter');
        throw new AppException(
          'Missing Google Fit API credentials',
          ErrorType.TECHNICAL,
          'CONFIG_ERROR',
          { service: 'GoogleFitAdapter' }
        );
      }
      
      const refreshResponse = await this.makeRequestWithRetry(() => 
        firstValueFrom(
          this.httpService.post('https://oauth2.googleapis.com/token', {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
          })
        )
      );
      
      return refreshResponse.data.access_token;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to refresh access token: ${errorMessage}`, error instanceof Error ? error.stack : null, 'GoogleFitAdapter');
      
      // Check for specific OAuth errors
      if (error.response && error.response.data) {
        const { error: errorType, error_description } = error.response.data;
        
        if (errorType === 'invalid_grant') {
          throw new AppException(
            'Invalid refresh token, reauthentication required',
            ErrorType.BUSINESS,
            'AUTH_ERROR',
            { error: errorType, description: error_description }
          );
        }
      }
      
      throw new AppException(
        'Failed to refresh access token',
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        null,
        error
      );
    }
  }
  
  /**
   * Maps Google Fit data types to standardized metric types used in the application.
   */
  private mapGoogleFitTypeToMetricType(googleFitType: string): MetricType | null {
    if (googleFitType.includes('step_count')) {
      return 'STEPS' as MetricType;
    } else if (googleFitType.includes('heart_rate')) {
      return 'HEART_RATE' as MetricType;
    } else if (googleFitType.includes('weight')) {
      return 'WEIGHT' as MetricType;
    } else if (googleFitType.includes('blood_pressure')) {
      // Return systolic by default, we'll handle diastolic in data processing
      return 'BLOOD_PRESSURE_SYSTOLIC' as MetricType;
    } else if (googleFitType.includes('blood_glucose')) {
      return 'BLOOD_GLUCOSE' as MetricType;
    } else if (googleFitType.includes('sleep')) {
      return 'SLEEP' as MetricType;
    }
    return null;
  }
  
  /**
   * Extract systolic blood pressure from Google Fit data
   */
  private extractSystolicBP(value: any): number {
    if (value?.mapVal && Array.isArray(value.mapVal)) {
      const systolicEntry = value.mapVal.find((m: any) => m.key === 'systolic');
      if (systolicEntry?.value?.fpVal) {
        return systolicEntry.value.fpVal;
      }
    }
    return 0;
  }
  
  /**
   * Extract diastolic blood pressure from Google Fit data
   */
  private extractDiastolicBP(value: any): number {
    if (value?.mapVal && Array.isArray(value.mapVal)) {
      const diastolicEntry = value.mapVal.find((m: any) => m.key === 'diastolic');
      if (diastolicEntry?.value?.fpVal) {
        return diastolicEntry.value.fpVal;
      }
    }
    return 0;
  }
  
  /**
   * Refreshes the access token if it's expired or about to expire
   */
  private async refreshTokenIfNeeded(deviceConnection: DeviceConnection): Promise<void> {
    try {
      // Extract connection data from metadata
      let connectionData: GoogleFitConnectionData | null = null;
      try {
        connectionData = JSON.parse(deviceConnection.metadata?.connectionData || '{}') as GoogleFitConnectionData;
      } catch (e) {
        this.logger.error('Invalid connection data format', null, 'GoogleFitAdapter');
        throw new AppException(
          'Invalid connection data format',
          ErrorType.TECHNICAL,
          'DATA_FORMAT_ERROR',
          { userId: deviceConnection.userId }
        );
      }
      
      if (!connectionData || !connectionData.expiresAt || !connectionData.refreshToken) {
        throw new AppException(
          'Missing connection data',
          ErrorType.BUSINESS,
          'INVALID_CONNECTION',
          { userId: deviceConnection.userId }
        );
      }
      
      const expiresAt = new Date(connectionData.expiresAt);
      const now = new Date();
      
      // Refresh if token expires in less than 5 minutes
      if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
        this.logger.log(`Refreshing access token for Google Fit connection`, 'GoogleFitAdapter');
        
        try {
          const newAccessToken = await this.refreshToken(connectionData.refreshToken);
          
          // Update connection data with new access token (1 hour expiry)
          const updatedConnectionData: GoogleFitConnectionData = {
            ...connectionData,
            accessToken: newAccessToken,
            expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
            retryCount: 0 // Reset retry count on successful token refresh
          };
          
          // Update metadata
          deviceConnection.metadata = {
            ...deviceConnection.metadata,
            connectionData: JSON.stringify(updatedConnectionData)
          };
        } catch (error: any) {
          // If token refresh fails, mark the connection as requiring reauthentication
          deviceConnection.status = 'AUTHENTICATION_REQUIRED';
          
          // Update retry count
          connectionData.retryCount = (connectionData.retryCount || 0) + 1;
          deviceConnection.metadata = {
            ...deviceConnection.metadata,
            connectionData: JSON.stringify(connectionData)
          };
          
          throw error;
        }
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error refreshing token: ${errorMessage}`, error instanceof Error ? error.stack : null, 'GoogleFitAdapter');
      
      if (error instanceof AppException) {
        throw error;
      }
      
      throw new AppException(
        'Token refresh failed, reauthentication required',
        ErrorType.BUSINESS,
        'AUTH_ERROR',
        { userId: deviceConnection.userId },
        error
      );
    }
  }
}