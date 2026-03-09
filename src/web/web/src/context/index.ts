/**
 * Context Exports
 *
 * This file exports all context providers and hooks from the context directory
 * to simplify imports throughout the application. It serves as the central
 * export point for authentication, gamification, journey, and notification contexts.
 */

// Authentication Context - Provides secure auth with OAuth 2.0, MFA, biometric
export { AuthProvider, AuthContext } from './AuthContext';
export { useAuth } from '@/hooks/useAuth';

// Gamification Context - Processes user actions and assigns points/achievements based on rules
export { GamificationProvider, useGamification } from './GamificationContext';

// Journey Context - Manages navigation between different user journeys
export { JourneyProvider, useJourney } from './JourneyContext';

// Notification Context - Handles communication and notifications across the application
export { NotificationProvider, useNotificationContext } from './NotificationContext';

// Theme Context - Manages light/dark/system theme preferences with persistence
export { AppThemeProvider, useAppTheme, ThemeContext } from './ThemeContext';
export type { ThemeMode } from './ThemeContext';
