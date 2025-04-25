/**
 * Context Exports
 * 
 * This file exports all context providers and hooks from the context directory
 * to simplify imports throughout the application. It serves as the central
 * export point for authentication, gamification, journey, and notification contexts.
 */

// Authentication Context - Provides secure authentication with OAuth 2.0, MFA, and biometric support
export { AuthProvider, useAuth } from './AuthContext';

// Gamification Context - Processes user actions and assigns points/achievements based on rules
export { GamificationProvider, useGamification } from './GamificationContext';

// Journey Context - Manages navigation between different user journeys
export { JourneyProvider, useJourney } from './JourneyContext';

// Notification Context - Handles communication and notifications across the application
export { NotificationProvider, useNotificationContext } from './NotificationContext';