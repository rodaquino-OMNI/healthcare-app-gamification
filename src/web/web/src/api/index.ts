/**
 * API Module Index
 *
 * This file serves as a central module for exporting all API functions used in the web application.
 * It aggregates the API functions from different modules (auth, care, health, plan, gamification,
 * and notifications) into a single location, making it easier to import and use them throughout
 * the application.
 */

// Authentication API functions
export { login, logout, getProfile } from './auth';

// Care Journey API functions
export { getAppointments, getAppointment, getProviders, bookAppointment, cancelAppointment } from './care';

// Health Journey API functions
export { getHealthMetrics, getHealthGoals, getMedicalHistory, getConnectedDevices, createHealthMetric } from './health';

// Plan Journey API functions
export {
    getPlan,
    getClaims,
    getCoverage,
    getBenefits,
    submitClaim,
    updateClaim,
    cancelClaim,
    uploadClaimDocument,
    simulateCost,
    getDigitalCard,
} from './plan';

// Gamification API functions
export { getGameProfile } from './gamification';

// Notification API functions
export { getNotifications, markNotificationAsRead } from './notifications';

// Settings API functions
export * from './settings';
