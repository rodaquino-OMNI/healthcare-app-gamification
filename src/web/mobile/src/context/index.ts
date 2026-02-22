/**
 * Context index file
 * 
 * This file exports all context providers and hooks from the context directory,
 * providing a centralized import location for the application's contexts.
 * This simplifies importing context-related components throughout the app.
 */

// Authentication context exports
export { AuthContext, AuthProvider, useAuth } from './AuthContext';

// Gamification context exports
export { GamificationContext, GamificationProvider, useGamification } from './GamificationContext';

// Journey context exports
export { JourneyContext, JourneyProvider } from './JourneyContext';

// Notification context exports
export { NotificationContext, NotificationProvider, useNotificationContext } from './NotificationContext';

// Theme context exports
export { AppThemeProvider, useAppTheme, ThemeContext } from './ThemeContext';
export type { ThemeMode } from './ThemeContext';