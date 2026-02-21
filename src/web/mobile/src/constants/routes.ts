/**
 * Routes constant definitions for the AUSTA SuperApp
 * This file provides a centralized repository of all route names used for navigation
 * throughout the mobile application, organized by journey.
 */

/**
 * Application route constants
 */
export const ROUTES = {
  // Universal/Global Routes
  HOME: 'Home',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  ACHIEVEMENTS: 'Achievements',
  HOME_METRICS: 'HomeMetrics',
  HOME_ALERT: 'HomeAlert',
  HOME_HEADER: 'HomeHeader',

  // Authentication Routes - Welcome & Onboarding
  AUTH_WELCOME: 'AuthWelcome',
  AUTH_ONBOARDING: 'AuthOnboarding',
  AUTH_WELCOME_CTA: 'AuthWelcomeCTA',
  AUTH_LOGIN: 'AuthLogin',
  AUTH_REGISTER: 'AuthRegister',
  AUTH_FORGOT_PASSWORD: 'AuthForgotPassword',
  AUTH_MFA: 'AuthMFA',

  // Authentication Routes - Verification
  AUTH_EMAIL_VERIFY: 'AuthEmailVerify',
  AUTH_SET_PASSWORD: 'AuthSetPassword',

  // Profile Routes
  PROFILE_SETUP: 'ProfileSetup',
  PROFILE_HEALTH: 'ProfileHealth',
  PROFILE_INSURANCE: 'ProfileInsurance',
  PROFILE_ADDRESS: 'ProfileAddress',
  PROFILE_DOCUMENTS: 'ProfileDocuments',
  PROFILE_PHOTO: 'ProfilePhoto',
  PROFILE_CONFIRMATION: 'ProfileConfirmation',
  
  // My Health Journey Routes (Green)
  HEALTH_DASHBOARD: 'HealthDashboard',
  HEALTH_MEDICAL_HISTORY: 'HealthMedicalHistory',
  HEALTH_HEALTH_GOALS: 'HealthGoals',
  HEALTH_DEVICE_CONNECTION: 'HealthDeviceConnection',
  HEALTH_METRIC_DETAIL: 'HealthMetricDetail',
  HEALTH_ADD_METRIC: 'HealthAddMetric',
  HEALTH_MEDICATION_LIST: 'HealthMedicationList',
  HEALTH_MEDICATION_ADD: 'HealthMedicationAdd',
  HEALTH_MEDICATION_DETAIL: 'HealthMedicationDetail',
  HEALTH_MEDICATION_SEARCH: 'HealthMedicationSearch',
  HEALTH_MEDICATION_REMINDER: 'HealthMedicationReminder',
  HEALTH_MEDICATION_ALARM: 'HealthMedicationAlarm',

  // Cross-Journey / Global
  NOTIFICATION_DETAIL: 'NotificationDetail',
  SEARCH: 'Search',
  SEARCH_RESULTS: 'SearchResults',
  SETTINGS_EDIT: 'SettingsEdit',
  SETTINGS_NOTIFICATIONS: 'SettingsNotifications',
  SETTINGS_PRIVACY: 'SettingsPrivacy',

  // Care Now Journey Routes (Orange)
  CARE_DASHBOARD: 'CareDashboard',
  CARE_APPOINTMENTS: 'CareAppointments',
  CARE_APPOINTMENT_BOOKING: 'CareAppointmentBooking',
  CARE_TELEMEDICINE: 'CareTelemedicine',
  CARE_MEDICATION_TRACKING: 'CareMedicationTracking',
  CARE_SYMPTOM_CHECKER: 'CareSymptomChecker',
  CARE_SYMPTOM_BODY_MAP: 'CareSymptomBodyMap',
  CARE_SYMPTOM_DETAIL: 'CareSymptomDetail',
  CARE_SYMPTOM_SEVERITY: 'CareSymptomSeverity',
  CARE_SYMPTOM_QUESTIONS: 'CareSymptomQuestions',
  CARE_SYMPTOM_RESULT: 'CareSymptomResult',
  CARE_SYMPTOM_RECOMMENDATION: 'CareSymptomRecommendation',

  // Care Now — Consultation Flow Routes (Orange)
  CARE_DOCTOR_SEARCH: 'CareDoctorSearch',
  CARE_DOCTOR_FILTERS: 'CareDoctorFilters',
  CARE_DOCTOR_PROFILE: 'CareDoctorProfile',
  CARE_DOCTOR_AVAILABILITY: 'CareDoctorAvailability',
  CARE_BOOKING_SCHEDULE: 'CareBookingSchedule',
  CARE_BOOKING_CONFIRMATION: 'CareBookingConfirmation',
  CARE_WAITING_ROOM: 'CareWaitingRoom',

  // My Plan & Benefits Journey Routes (Blue)
  PLAN_DASHBOARD: 'PlanDashboard',
  PLAN_COVERAGE: 'PlanCoverage',
  PLAN_DIGITAL_CARD: 'PlanDigitalCard',
  PLAN_CLAIMS: 'PlanClaims',
  PLAN_COST_SIMULATOR: 'PlanCostSimulator',

  // Gamification Journey Routes (Purple)
  GAMIFICATION_ACHIEVEMENTS: 'GamificationAchievements',
  GAMIFICATION_DETAIL: 'GamificationAchievementDetail',
  GAMIFICATION_LEADERBOARD: 'GamificationLeaderboard',
  GAMIFICATION_QUESTS: 'GamificationQuests',
  GAMIFICATION_QUEST_DETAIL: 'GamificationQuestDetail',
  GAMIFICATION_REWARDS: 'GamificationRewards',
  GAMIFICATION_REWARD_DETAIL: 'GamificationRewardDetail',
};