/**
 * Routes constant definitions for the AUSTA SuperApp web application.
 * Organized by user journey to maintain clear navigation structure.
 */

import { JOURNEY_NAMES } from 'shared/constants/journeys';

/**
 * Application routes for navigation and routing configuration
 */
export const ROUTES = {
    // Universal routes
    HOME: '/',
    AUTH: '/auth',
    ACHIEVEMENTS: '/achievements',
    NOTIFICATIONS: '/notifications',
    PROFILE: '/profile',
    SETTINGS: '/settings',

    // Health Journey routes
    HEALTH: {
        ROOT: '/health',
        DASHBOARD: '/health/dashboard',
        MEDICAL_HISTORY: '/health/history',
        HEALTH_GOALS: '/health/goals',
        DEVICE_CONNECTION: '/health/devices',
        METRIC_DETAIL: '/health/metrics/:id',
        HEALTH_INSIGHTS: '/health/insights',
    },

    // Care Journey routes
    CARE: {
        ROOT: '/care',
        SYMPTOM_CHECKER: '/care/symptoms',
        APPOINTMENTS: '/care/appointments',
        APPOINTMENT_DETAIL: '/care/appointments/:id',
        APPOINTMENT_BOOKING: '/care/appointments/book',
        TELEMEDICINE: '/care/telemedicine',
        TELEMEDICINE_SESSION: '/care/telemedicine/:id',
        MEDICATIONS: '/care/medications',
        MEDICATION_DETAIL: '/care/medications/:id',
        TREATMENT_PLANS: '/care/treatment-plans',
        TREATMENT_PLAN_DETAIL: '/care/treatment-plans/:id',
    },

    // Plan Journey routes
    PLAN: {
        ROOT: '/plan',
        COVERAGE: '/plan/coverage',
        DIGITAL_CARD: '/plan/card',
        CLAIMS: '/plan/claims',
        CLAIM_SUBMISSION: '/plan/claims/submit',
        CLAIM_DETAIL: '/plan/claims/:id',
        COST_SIMULATOR: '/plan/simulator',
        BENEFITS: '/plan/benefits',
        BENEFIT_DETAIL: '/plan/benefits/:id',
    },

    // Helper function to generate fully qualified route paths with parameters
    getRoutePath: (route: string, params?: Record<string, string>) => {
        if (!params) return route;

        let path = route;
        Object.entries(params).forEach(([key, value]) => {
            path = path.replace(`:${key}`, value);
        });

        return path;
    },

    // Get journey title by route path
    getJourneyTitle: (path: string): string => {
        if (path.startsWith('/health')) return JOURNEY_NAMES.HEALTH;
        if (path.startsWith('/care')) return JOURNEY_NAMES.CARE;
        if (path.startsWith('/plan')) return JOURNEY_NAMES.PLAN;
        return 'AUSTA SuperApp';
    },
};
