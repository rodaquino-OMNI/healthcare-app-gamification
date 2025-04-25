import { registerAs, ConfigModule } from '@nestjs/config'; // ConfigModule v2.0+, registerAs v2.0+

/**
 * Defines the configuration function for the Care Service.
 * This configuration provides all environment-specific settings and parameters
 * needed for the Care Journey components.
 * 
 * @returns A configuration object containing various settings for the Care Service.
 */
export const configuration = registerAs('care', () => ({
  // Core application settings
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.CARE_SERVICE_PORT || '3002', 10),
  apiPrefix: process.env.CARE_SERVICE_API_PREFIX || 'api/v1',
  
  // Database configuration
  database: {
    url: process.env.CARE_SERVICE_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/austa_care',
    maxConnections: parseInt(process.env.CARE_SERVICE_DB_MAX_CONNECTIONS || '10', 10),
    idleTimeoutMillis: parseInt(process.env.CARE_SERVICE_DB_IDLE_TIMEOUT || '30000', 10),
    ssl: process.env.CARE_SERVICE_DB_SSL === 'true' || false,
  },

  // Redis configuration (for caching and real-time features)
  redis: {
    url: process.env.CARE_SERVICE_REDIS_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.CARE_SERVICE_REDIS_TTL || '3600', 10),
    prefix: process.env.CARE_SERVICE_REDIS_PREFIX || 'care:',
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.CARE_SERVICE_JWT_SECRET || 'development-secret',
    jwtExpiresIn: process.env.CARE_SERVICE_JWT_EXPIRES || '1h',
    oauth: {
      authority: process.env.CARE_SERVICE_OAUTH_AUTHORITY || 'https://auth.austa.com.br',
      clientId: process.env.CARE_SERVICE_OAUTH_CLIENT_ID || 'care-service',
      clientSecret: process.env.CARE_SERVICE_OAUTH_CLIENT_SECRET || 'development-secret',
      audience: process.env.CARE_SERVICE_OAUTH_AUDIENCE || 'api://care-service',
    },
  },

  // Provider systems integration
  providers: {
    apiUrl: process.env.CARE_SERVICE_PROVIDERS_API_URL || 'https://providers-api.austa.com.br',
    apiKey: process.env.CARE_SERVICE_PROVIDERS_API_KEY || 'development-api-key',
    timeout: parseInt(process.env.CARE_SERVICE_PROVIDERS_TIMEOUT || '5000', 10),
    cacheEnabled: process.env.CARE_SERVICE_PROVIDERS_CACHE_ENABLED === 'true' || false,
    cacheTtl: parseInt(process.env.CARE_SERVICE_PROVIDERS_CACHE_TTL || '300', 10), // 5 minutes default
    retryAttempts: parseInt(process.env.CARE_SERVICE_PROVIDERS_RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.CARE_SERVICE_PROVIDERS_RETRY_DELAY || '1000', 10),
  },

  // Appointment scheduling
  appointments: {
    maxAdvanceDays: parseInt(process.env.CARE_SERVICE_MAX_ADVANCE_DAYS || '90', 10),
    reminderSchedule: process.env.CARE_SERVICE_APPOINTMENT_REMINDER_SCHEDULE || '24h,1h',
    defaultDuration: parseInt(process.env.CARE_SERVICE_DEFAULT_APPOINTMENT_DURATION || '30', 10), // minutes
    cancellationPolicy: {
      enabled: process.env.CARE_SERVICE_CANCELLATION_POLICY_ENABLED === 'true' || true,
      minimumNoticeHours: parseInt(process.env.CARE_SERVICE_MIN_CANCELLATION_HOURS || '24', 10),
      penaltyXpLoss: parseInt(process.env.CARE_SERVICE_CANCELLATION_XP_LOSS || '50', 10),
    },
    availabilityBuffer: parseInt(process.env.CARE_SERVICE_AVAILABILITY_BUFFER || '15', 10), // minutes between appointments
  },

  // Telemedicine configuration
  telemedicine: {
    enabled: process.env.CARE_SERVICE_TELEMEDICINE_ENABLED === 'true' || true,
    provider: process.env.CARE_SERVICE_TELEMEDICINE_PROVIDER || 'agora',
    agora: {
      appId: process.env.CARE_SERVICE_AGORA_APP_ID || 'development-app-id',
      appCertificate: process.env.CARE_SERVICE_AGORA_APP_CERTIFICATE || 'development-certificate',
      tokenExpirationTimeInSeconds: parseInt(process.env.CARE_SERVICE_AGORA_TOKEN_EXPIRATION || '3600', 10),
    },
    recordingEnabled: process.env.CARE_SERVICE_TELEMEDICINE_RECORDING === 'true' || false,
    recordingStorage: {
      bucket: process.env.CARE_SERVICE_TELEMEDICINE_RECORDING_BUCKET || 'austa-telemedicine-recordings',
      region: process.env.CARE_SERVICE_TELEMEDICINE_RECORDING_REGION || 'sa-east-1',
      retentionDays: parseInt(process.env.CARE_SERVICE_RECORDING_RETENTION_DAYS || '90', 10),
    },
    qualityThresholds: {
      minimumBitrate: parseInt(process.env.CARE_SERVICE_TELEMEDICINE_MIN_BITRATE || '350000', 10), // 350 kbps
      minimumFramerate: parseInt(process.env.CARE_SERVICE_TELEMEDICINE_MIN_FRAMERATE || '15', 10),
      connectionTimeout: parseInt(process.env.CARE_SERVICE_TELEMEDICINE_CONNECTION_TIMEOUT || '30000', 10),
    },
    sessionDuration: {
      default: parseInt(process.env.CARE_SERVICE_TELEMEDICINE_DEFAULT_DURATION || '20', 10), // minutes
      maximum: parseInt(process.env.CARE_SERVICE_TELEMEDICINE_MAX_DURATION || '60', 10), // minutes
      warningTime: parseInt(process.env.CARE_SERVICE_TELEMEDICINE_WARNING_TIME || '5', 10), // minutes before end
    },
  },

  // Medication tracking
  medications: {
    reminderEnabled: process.env.CARE_SERVICE_MEDICATION_REMINDERS === 'true' || true,
    reminderDefaultTime: process.env.CARE_SERVICE_MEDICATION_DEFAULT_REMINDER_TIME || '1h,0h',
    adherenceThreshold: parseFloat(process.env.CARE_SERVICE_MEDICATION_ADHERENCE_THRESHOLD || '0.8'),
    refillReminderDays: parseInt(process.env.CARE_SERVICE_REFILL_REMINDER_DAYS || '7', 10),
    maxMissedDoses: parseInt(process.env.CARE_SERVICE_MAX_MISSED_DOSES || '3', 10),
    doseWindowMinutes: parseInt(process.env.CARE_SERVICE_DOSE_WINDOW_MINUTES || '60', 10),
  },

  // Treatment plans
  treatmentPlans: {
    reminderEnabled: process.env.CARE_SERVICE_TREATMENT_REMINDERS === 'true' || true,
    progressUpdateFrequency: process.env.CARE_SERVICE_TREATMENT_PROGRESS_FREQUENCY || 'daily',
    progressThresholds: {
      atRisk: parseFloat(process.env.CARE_SERVICE_TREATMENT_AT_RISK_THRESHOLD || '0.6'),
      onTrack: parseFloat(process.env.CARE_SERVICE_TREATMENT_ON_TRACK_THRESHOLD || '0.8'),
    },
    interventionTriggers: {
      missedActivities: parseInt(process.env.CARE_SERVICE_TREATMENT_MISSED_ACTIVITIES || '3', 10),
      missedAppointments: parseInt(process.env.CARE_SERVICE_TREATMENT_MISSED_APPOINTMENTS || '1', 10),
    },
  },

  // Symptom checker
  symptomsChecker: {
    enabled: process.env.CARE_SERVICE_SYMPTOMS_CHECKER_ENABLED === 'true' || true,
    provider: process.env.CARE_SERVICE_SYMPTOMS_CHECKER_PROVIDER || 'internal',
    externalApi: {
      url: process.env.CARE_SERVICE_SYMPTOMS_CHECKER_API_URL || 'https://symptoms-api.austa.com.br',
      apiKey: process.env.CARE_SERVICE_SYMPTOMS_CHECKER_API_KEY || 'development-api-key',
      timeout: parseInt(process.env.CARE_SERVICE_SYMPTOMS_CHECKER_TIMEOUT || '10000', 10),
    },
    emergencySymptoms: process.env.CARE_SERVICE_EMERGENCY_SYMPTOMS || 'chest_pain,difficulty_breathing,severe_bleeding',
    updateFrequency: process.env.CARE_SERVICE_SYMPTOMS_UPDATE_FREQUENCY || 'weekly',
  },

  // Notification service integration
  notifications: {
    serviceUrl: process.env.CARE_SERVICE_NOTIFICATIONS_URL || 'http://notification-service:3006',
    apiKey: process.env.CARE_SERVICE_NOTIFICATIONS_API_KEY || 'development-api-key',
    defaultChannel: process.env.CARE_SERVICE_DEFAULT_NOTIFICATION_CHANNEL || 'push,email',
    throttling: {
      enabled: process.env.CARE_SERVICE_NOTIFICATION_THROTTLING === 'true' || true,
      maxPerHour: parseInt(process.env.CARE_SERVICE_MAX_NOTIFICATIONS_HOUR || '5', 10),
      maxPerDay: parseInt(process.env.CARE_SERVICE_MAX_NOTIFICATIONS_DAY || '20', 10),
    },
    templates: {
      appointmentReminder: process.env.CARE_SERVICE_APPOINTMENT_REMINDER_TEMPLATE || 'care-appointment-reminder',
      appointmentConfirmation: process.env.CARE_SERVICE_APPOINTMENT_CONFIRMATION_TEMPLATE || 'care-appointment-confirmation',
      medicationReminder: process.env.CARE_SERVICE_MEDICATION_REMINDER_TEMPLATE || 'care-medication-reminder',
      treatmentUpdate: process.env.CARE_SERVICE_TREATMENT_UPDATE_TEMPLATE || 'care-treatment-update',
    },
  },

  // Gamification integration
  gamification: {
    enabled: process.env.CARE_SERVICE_GAMIFICATION_ENABLED === 'true' || true,
    serviceUrl: process.env.CARE_SERVICE_GAMIFICATION_URL || 'http://gamification-service:3005',
    apiKey: process.env.CARE_SERVICE_GAMIFICATION_API_KEY || 'development-api-key',
    defaultEvents: {
      appointmentBooked: 'APPOINTMENT_BOOKED',
      appointmentAttended: 'APPOINTMENT_ATTENDED',
      appointmentCancelled: 'APPOINTMENT_CANCELLED',
      telemedicineCompleted: 'TELEMEDICINE_COMPLETED',
      medicationAdherence: 'MEDICATION_ADHERENCE',
      treatmentProgress: 'TREATMENT_PROGRESS',
      symptomCheckerCompleted: 'SYMPTOM_CHECKER_COMPLETED',
    },
    pointValues: {
      appointmentBooked: parseInt(process.env.CARE_SERVICE_POINTS_APPOINTMENT_BOOKED || '10', 10),
      appointmentAttended: parseInt(process.env.CARE_SERVICE_POINTS_APPOINTMENT_ATTENDED || '50', 10),
      telemedicineCompleted: parseInt(process.env.CARE_SERVICE_POINTS_TELEMEDICINE_COMPLETED || '50', 10),
      medicationPerfectWeek: parseInt(process.env.CARE_SERVICE_POINTS_MEDICATION_PERFECT_WEEK || '100', 10),
      treatmentMilestone: parseInt(process.env.CARE_SERVICE_POINTS_TREATMENT_MILESTONE || '75', 10),
    },
  },

  // External integrations
  integrations: {
    pharmacyNetworks: {
      enabled: process.env.CARE_SERVICE_PHARMACY_INTEGRATION === 'true' || false,
      apiUrl: process.env.CARE_SERVICE_PHARMACY_API_URL || 'https://pharmacy-api.austa.com.br',
      apiKey: process.env.CARE_SERVICE_PHARMACY_API_KEY || 'development-api-key',
      timeout: parseInt(process.env.CARE_SERVICE_PHARMACY_TIMEOUT || '5000', 10),
      cacheEnabled: process.env.CARE_SERVICE_PHARMACY_CACHE_ENABLED === 'true' || true,
      cacheTtl: parseInt(process.env.CARE_SERVICE_PHARMACY_CACHE_TTL || '3600', 10), // 1 hour
    },
    emergencyServices: {
      enabled: process.env.CARE_SERVICE_EMERGENCY_INTEGRATION === 'true' || false,
      apiUrl: process.env.CARE_SERVICE_EMERGENCY_API_URL || 'https://emergency-api.austa.com.br',
      apiKey: process.env.CARE_SERVICE_EMERGENCY_API_KEY || 'development-api-key',
      emergencyNumber: process.env.CARE_SERVICE_EMERGENCY_NUMBER || '192',
    },
  },

  // Logging and monitoring
  logging: {
    level: process.env.CARE_SERVICE_LOG_LEVEL || 'info',
    format: process.env.CARE_SERVICE_LOG_FORMAT || 'json',
    requestLogging: process.env.CARE_SERVICE_REQUEST_LOGGING === 'true' || true,
    sensitiveDataFields: process.env.CARE_SERVICE_SENSITIVE_DATA_FIELDS || 'password,token,healthData',
    journeyContext: 'care',
  },

  // Feature flags
  features: {
    enableSymptomsChecker: process.env.CARE_SERVICE_ENABLE_SYMPTOMS_CHECKER === 'true' || true,
    enableTreatmentTracking: process.env.CARE_SERVICE_ENABLE_TREATMENT_TRACKING === 'true' || true,
    enableEmergencyAccess: process.env.CARE_SERVICE_ENABLE_EMERGENCY_ACCESS === 'true' || false,
    enableVirtualWaitingRoom: process.env.CARE_SERVICE_ENABLE_VIRTUAL_WAITING_ROOM === 'true' || false,
    enableProviderRatings: process.env.CARE_SERVICE_ENABLE_PROVIDER_RATINGS === 'true' || true,
    enableDocumentSharing: process.env.CARE_SERVICE_ENABLE_DOCUMENT_SHARING === 'true' || true,
    enableFollowUpSuggestions: process.env.CARE_SERVICE_ENABLE_FOLLOW_UP_SUGGESTIONS === 'true' || true,
  },
}));