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
  
  // Authentication Routes
  AUTH_LOGIN: 'AuthLogin',
  AUTH_REGISTER: 'AuthRegister',
  AUTH_FORGOT_PASSWORD: 'AuthForgotPassword',
  AUTH_MFA: 'AuthMFA',
  
  // My Health Journey Routes (Green)
  HEALTH_DASHBOARD: 'HealthDashboard',
  HEALTH_MEDICAL_HISTORY: 'HealthMedicalHistory',
  HEALTH_HEALTH_GOALS: 'HealthGoals',
  HEALTH_DEVICE_CONNECTION: 'HealthDeviceConnection',
  HEALTH_METRIC_DETAIL: 'HealthMetricDetail',
  
  // Care Now Journey Routes (Orange)
  CARE_DASHBOARD: 'CareDashboard',
  CARE_APPOINTMENTS: 'CareAppointments',
  CARE_APPOINTMENT_BOOKING: 'CareAppointmentBooking',
  CARE_TELEMEDICINE: 'CareTelemedicine',
  CARE_MEDICATION_TRACKING: 'CareMedicationTracking',
  CARE_SYMPTOM_CHECKER: 'CareSymptomChecker',
  
  // My Plan & Benefits Journey Routes (Blue)
  PLAN_DASHBOARD: 'PlanDashboard',
  PLAN_COVERAGE: 'PlanCoverage',
  PLAN_DIGITAL_CARD: 'PlanDigitalCard',
  PLAN_CLAIMS: 'PlanClaims',
  PLAN_COST_SIMULATOR: 'PlanCostSimulator',
};