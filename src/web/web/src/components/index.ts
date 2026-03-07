/* eslint-disable */
// This file serves as the main barrel export for all components in the web application.
// It centralizes component imports from various categories (dashboard, forms, navigation, shared, modals) and exports them for easy access throughout the application, promoting code organization and reusability.

// Requirements Addressed:
// - Design System (F-401): Unified component library with journey-specific theming, gamification components, and accessibility support.

// Dashboard components
import * as DashboardComponents from './dashboard'; // Import all dashboard components
import type { AchievementsWidgetType } from './dashboard';
import type { AppointmentsWidgetType } from './dashboard';
import type { ClaimsWidgetType } from './dashboard';
import type { MetricsWidgetType } from './dashboard';
import type { RecentActivityWidgetType } from './dashboard';

// Form components
import { AppointmentForm } from './forms/AppointmentForm'; // Import appointment form component
import { ClaimForm } from './forms/ClaimForm'; // Import claim form component
import { HealthGoalForm } from './forms/HealthGoalForm'; // Import health goal form component
import { HealthMetricForm } from './forms/HealthMetricForm'; // Import health metric form component
import { ProfileForm } from './forms/ProfileForm'; // Import profile form component

// Navigation components
import * as NavigationComponents from './navigation'; // Import all navigation components

// Shared components
import * as SharedComponents from './shared'; // Import all shared components

// Modal components
import { AchievementModal } from './modals/AchievementModal'; // Import achievement modal component
import { ConfirmationModal } from './modals/ConfirmationModal'; // Import confirmation modal component
import { FilterModal } from './modals/FilterModal'; // Import filter modal component

// Export dashboard components
export const AchievementsWidget: React.FC = DashboardComponents.AchievementsWidget; // Dashboard widget for displaying user achievements
export const AppointmentsWidget: React.FC = DashboardComponents.AppointmentsWidget; // Dashboard widget for displaying upcoming appointments
export const ClaimsWidget: React.FC = DashboardComponents.ClaimsWidget; // Dashboard widget for displaying claims information
export const MetricsWidget: React.FC = DashboardComponents.MetricsWidget; // Dashboard widget for displaying health metrics
export const RecentActivityWidget: React.FC = DashboardComponents.RecentActivityWidget; // Dashboard widget for displaying recent user activity

// Export form components
export { AppointmentForm }; // Form for booking appointments in the Care Now journey
export { ClaimForm }; // Form for submitting insurance claims in the Plan journey
export { HealthGoalForm }; // Form for setting health goals in the Health journey
export { HealthMetricForm }; // Form for recording health metrics in the Health journey
export { ProfileForm }; // Form for updating user profile information

// Export navigation components
export const Breadcrumbs: React.FC = NavigationComponents.Breadcrumbs; // Navigation component for displaying the current location in the app
export const JourneyNav: React.FC = NavigationComponents.JourneyNav; // Navigation component for switching between journeys
export const MobileNav: React.FC = NavigationComponents.MobileNav; // Mobile-specific navigation component
export const Sidebar: React.FC = NavigationComponents.Sidebar; // Sidebar navigation component for desktop view
export const TopBar: React.FC = NavigationComponents.TopBar; // Top navigation bar component

// Export shared components
export const EmptyState: React.FC = SharedComponents.EmptyState; // Component for displaying empty state placeholders
export const ErrorState: React.FC = SharedComponents.ErrorState; // Component for displaying error messages
export const FileUploader: React.FC<{ claimId: string }> = SharedComponents.FileUploader; // Component for uploading files, used in claims submission
export const GamificationPopup: React.FC<{ visible: boolean; onClose: () => void; achievementId: string }> =
    SharedComponents.GamificationPopup; // Component for displaying gamification notifications
export const JourneyHeader: React.FC<{
    title?: string;
    showBreadcrumbs?: boolean;
    children?: React.ReactNode;
    className?: string;
}> = SharedComponents.JourneyHeader; // Header component with journey-specific styling
export const LoadingIndicator: React.FC<{ size?: string; text?: string; fullScreen?: boolean; testID?: string }> =
    SharedComponents.LoadingIndicator; // Component for displaying loading states

// Export modal components
export { AchievementModal }; // Modal for displaying achievement details
export const ConfirmationModal: React.FC<{
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    journey?: 'health' | 'care' | 'plan';
}> = ConfirmationModal; // Modal for confirming user actions
export const FilterModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    title: string;
    options: { id: string; label: string }[];
    onApply: (selectedOptions: string[]) => void;
}> = FilterModal; // Modal for filtering lists of data
