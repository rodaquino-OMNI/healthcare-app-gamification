/**
 * Mobile application configuration constants for the AUSTA SuperApp.
 * Contains environment-specific settings, feature flags, API configurations,
 * and platform detection utilities.
 */

import { Platform } from 'react-native'; // react-native version 0.71+
import { JOURNEY_NAMES } from 'src/web/shared/constants/journeys.ts';

// Environment detection
export const isDevEnv = __DEV__; // React Native global variable
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

// Application metadata
export const APP_NAME = 'AUSTA SuperApp';

// API Configuration
export const API_BASE_URL = isDevEnv 
  ? 'https://dev-api.austa.com.br' 
  : 'https://api.austa.com.br';

// Feature flags
const FEATURES = {
  gamification: true,
  telemedicine: true,
  wearableDevices: true,
  offlineMode: true,
  aiAssistant: false, // Not enabled yet
  socialFeatures: false, // Not enabled yet
};

// Journey-specific settings
const JOURNEY_CONFIG = {
  HEALTH: {
    name: JOURNEY_NAMES.HEALTH,
    metricUpdateFrequency: 5 * 60 * 1000, // Update health metrics every 5 minutes
    cacheTimeout: 5 * 60 * 1000, // Cache health data for 5 minutes
  },
  CARE: {
    name: JOURNEY_NAMES.CARE,
    appointmentReminderWindow: 24 * 60 * 60 * 1000, // Remind 24 hours before appointment
    telemedicineQualityThreshold: 'medium', // Minimum acceptable video quality
  },
  PLAN: {
    name: JOURNEY_NAMES.PLAN,
    claimsCacheTimeout: 15 * 60 * 1000, // Cache claims data for 15 minutes
    documentUploadMaxSize: 10 * 1024 * 1024, // 10 MB maximum file size
  },
};

// Full configuration object
export const config = {
  appName: APP_NAME,
  environment: isDevEnv ? 'development' : 'production',
  api: {
    baseUrl: API_BASE_URL,
    timeout: 30000, // 30 seconds
  },
  features: FEATURES,
  journeys: JOURNEY_CONFIG,
  platform: isAndroid ? 'android' : isIOS ? 'ios' : 'unknown',
};