/**
 * Routes Constants
 * 
 * This file defines all route constants for the AUSTA SuperApp.
 * These constants ensure consistency in routing across both web and mobile clients.
 */

/**
 * Web authentication routes
 */
export const WEB_AUTH_ROUTES = {
  WELCOME: '/auth/welcome',
  ONBOARDING: '/auth/onboarding',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  EMAIL_VERIFY: '/auth/email-verify',
  SET_PASSWORD: '/auth/set-password',
};

/**
 * Web profile routes
 */
export const WEB_PROFILE_ROUTES = {
  SETUP: '/profile/setup',
  ADDRESS: '/profile/address',
  DOCUMENTS: '/profile/documents',
  PHOTO: '/profile/photo',
  CONFIRMATION: '/profile/confirmation',
};

/**
 * Web health journey routes
 */
export const WEB_HEALTH_ROUTES = {
  DASHBOARD: '/health/dashboard',
  METRICS: '/health/metrics',
  GOALS: '/health/goals',
  DEVICES: '/health/devices',
  HISTORY: '/health/history',
  MEDICATIONS: '/health/medications',
  MEDICATION_ADD: '/health/medications/add',
  MEDICATION_DETAIL: '/health/medications/:id',
  MEDICATION_REMINDER: '/health/medications/reminder',
};

/**
 * Web care journey routes
 */
export const WEB_CARE_ROUTES = {
  APPOINTMENTS: '/care/appointments',
  BOOK_APPOINTMENT: '/care/appointments/book',
  TELEMEDICINE: '/care/telemedicine',
  SYMPTOM_CHECKER: '/care/symptom-checker',
  SYMPTOM_BODY_MAP: '/care/symptom-checker/body-map',
  SYMPTOM_DETAIL: '/care/symptom-checker/detail',
  SYMPTOM_SEVERITY: '/care/symptom-checker/severity',
  SYMPTOM_QUESTIONS: '/care/symptom-checker/questions',
  SYMPTOM_RESULT: '/care/symptom-checker/result',
  SYMPTOM_RECOMMENDATION: '/care/symptom-checker/recommendation',
  MEDICATIONS: '/care/medications',
  TREATMENT_PLANS: '/care/treatment-plans',
  DOCTOR_SEARCH: '/care/appointments/search',
  DOCTOR_FILTERS: '/care/appointments/filters',
  DOCTOR_PROFILE: '/care/appointments/doctor/:id',
  DOCTOR_AVAILABILITY: '/care/appointments/doctor/availability',
  BOOKING_CONFIRMATION: '/care/appointments/confirm',
  WAITING_ROOM: '/care/appointments/waiting-room',
  DOCTOR_REVIEWS: '/care/appointments/reviews',
  APPOINTMENT_TYPE: '/care/appointments/appointment-type',
  BOOKING_REASON: '/care/appointments/reason-for-visit',
  BOOKING_DOCUMENTS: '/care/appointments/documents',
  BOOKING_INSURANCE: '/care/appointments/insurance',
  BOOKING_SUCCESS: '/care/appointments/success',
  APPOINTMENTS_LIST: '/care/appointments/list',
  APPOINTMENT_RESCHEDULE: '/care/appointments/reschedule',
  APPOINTMENT_CANCEL: '/care/appointments/cancel',
  APPOINTMENT_CANCELLED: '/care/appointments/cancelled',
  APPOINTMENT_NO_SHOW: '/care/appointments/no-show',
  PRE_VISIT_CHECKLIST: '/care/appointments/pre-visit',
  RATE_VISIT: '/care/appointments/rate-visit',
  SAVED_DOCTORS: '/care/appointments/saved-doctors',
};

/**
 * Web plan journey routes
 */
export const WEB_PLAN_ROUTES = {
  DASHBOARD: '/plan',
  COVERAGE: '/plan/coverage',
  DIGITAL_CARD: '/plan/card',
  CLAIMS: '/plan/claims',
  COST_SIMULATOR: '/plan/simulator',
  BENEFITS: '/plan/benefits'
};

/**
 * Mobile authentication routes
 * 
 * Note: Mobile routes use screen names for navigation rather than paths
 */
export const MOBILE_AUTH_ROUTES = {
  WELCOME: 'WelcomeSplash',
  ONBOARDING: 'Onboarding',
  WELCOME_CTA: 'WelcomeCTA',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  MFA: 'MFA',
  EMAIL_VERIFY: 'EmailVerify',
  SET_PASSWORD: 'SetPassword',
};

/**
 * Mobile profile routes
 */
export const MOBILE_PROFILE_ROUTES = {
  SETUP: 'ProfileSetup',
  HEALTH: 'ProfileHealth',
  INSURANCE: 'ProfileInsurance',
  ADDRESS: 'ProfileAddress',
  DOCUMENTS: 'ProfileDocuments',
  PHOTO: 'ProfilePhoto',
  CONFIRMATION: 'ProfileConfirmation',
};

/**
 * Mobile health journey routes
 */
export const MOBILE_HEALTH_ROUTES = {
  DASHBOARD: 'HealthDashboard',
  METRICS: 'HealthMetrics',
  GOALS: 'HealthGoals',
  DEVICES: 'DeviceConnection',
  HISTORY: 'MedicalHistory',
  ADD_METRIC: 'AddMetric',
  METRIC_DETAIL: 'MetricDetail',
  MEDICATION_LIST: 'HealthMedicationList',
  MEDICATION_ADD: 'HealthMedicationAdd',
  MEDICATION_DETAIL: 'HealthMedicationDetail',
  MEDICATION_SEARCH: 'HealthMedicationSearch',
  MEDICATION_REMINDER: 'HealthMedicationReminder',
  MEDICATION_ALARM: 'HealthMedicationAlarm',
};

/**
 * Mobile care journey routes
 */
export const MOBILE_CARE_ROUTES = {
  APPOINTMENTS: 'Appointments',
  BOOK_APPOINTMENT: 'AppointmentBooking',
  TELEMEDICINE: 'Telemedicine',
  SYMPTOM_CHECKER: 'SymptomChecker',
  SYMPTOM_BODY_MAP: 'CareSymptomBodyMap',
  SYMPTOM_DETAIL: 'CareSymptomDetail',
  SYMPTOM_SEVERITY: 'CareSymptomSeverity',
  SYMPTOM_QUESTIONS: 'CareSymptomQuestions',
  SYMPTOM_RESULT: 'CareSymptomResult',
  SYMPTOM_RECOMMENDATION: 'CareSymptomRecommendation',
  MEDICATIONS: 'MedicationTracking',
  TREATMENT_PLANS: 'TreatmentPlan',
  DOCTOR_SEARCH: 'CareDoctorSearch',
  DOCTOR_FILTERS: 'CareDoctorFilters',
  DOCTOR_PROFILE: 'CareDoctorProfile',
  DOCTOR_AVAILABILITY: 'CareDoctorAvailability',
  BOOKING_SCHEDULE: 'CareBookingSchedule',
  BOOKING_CONFIRMATION: 'CareBookingConfirmation',
  WAITING_ROOM: 'CareWaitingRoom',
};

/**
 * Mobile plan journey routes
 */
/**
 * Mobile cross-journey / global routes
 */
export const MOBILE_GLOBAL_ROUTES = {
  NOTIFICATION_DETAIL: 'NotificationDetail',
  SEARCH: 'Search',
  SEARCH_RESULTS: 'SearchResults',
  SETTINGS: 'Settings',
  SETTINGS_EDIT: 'SettingsEdit',
  SETTINGS_NOTIFICATIONS: 'SettingsNotifications',
  SETTINGS_PRIVACY: 'SettingsPrivacy',
};

/**
 * Web cross-journey / global routes
 */
export const WEB_GLOBAL_ROUTES = {
  NOTIFICATION_DETAIL: '/notifications/detail',
  SEARCH: '/search',
  SEARCH_RESULTS: '/search/results',
  SETTINGS_EDIT: '/profile/edit',
  SETTINGS_NOTIFICATIONS: '/profile/notifications',
  SETTINGS_PRIVACY: '/profile/privacy',
};

/**
 * Mobile plan journey routes
 */
export const MOBILE_PLAN_ROUTES = {
  DASHBOARD: 'PlanDashboard',
  COVERAGE: 'Coverage',
  DIGITAL_CARD: 'DigitalCard',
  CLAIMS: 'ClaimHistory',
  CLAIM_SUBMISSION: 'ClaimSubmission',
  COST_SIMULATOR: 'CostSimulator',
  BENEFITS: 'Benefits'
};

/**
 * Constructs a web route with the given parameters.
 * 
 * @param route - The route template with placeholders (e.g., '/users/:id')
 * @param params - An object with parameter values to substitute in the route
 * @returns The constructed route with parameters
 * 
 * @example
 * // Returns '/users/123'
 * getWebRouteWithParams('/users/:id', { id: 123 })
 */
export const getWebRouteWithParams = (route: string, params: Record<string, string | number>): string => {
  let result = route;
  Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, params[key].toString());
  });
  return result;
};