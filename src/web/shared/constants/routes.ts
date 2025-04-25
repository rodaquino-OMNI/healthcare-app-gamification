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
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password'
};

/**
 * Web health journey routes
 */
export const WEB_HEALTH_ROUTES = {
  DASHBOARD: '/health/dashboard',
  METRICS: '/health/metrics',
  GOALS: '/health/goals',
  DEVICES: '/health/devices',
  HISTORY: '/health/history'
};

/**
 * Web care journey routes
 */
export const WEB_CARE_ROUTES = {
  APPOINTMENTS: '/care/appointments',
  BOOK_APPOINTMENT: '/care/appointments/book',
  TELEMEDICINE: '/care/telemedicine',
  SYMPTOM_CHECKER: '/care/symptom-checker',
  MEDICATIONS: '/care/medications',
  TREATMENT_PLANS: '/care/treatment-plans'
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
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  MFA: 'MFA'
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
  METRIC_DETAIL: 'MetricDetail'
};

/**
 * Mobile care journey routes
 */
export const MOBILE_CARE_ROUTES = {
  APPOINTMENTS: 'Appointments',
  BOOK_APPOINTMENT: 'AppointmentBooking',
  TELEMEDICINE: 'Telemedicine',
  SYMPTOM_CHECKER: 'SymptomChecker',
  MEDICATIONS: 'MedicationTracking',
  TREATMENT_PLANS: 'TreatmentPlan'
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