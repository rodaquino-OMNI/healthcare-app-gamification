// Barrel export for all components in the web application.

import React, { createElement } from 'react';

// Dashboard components
export { AchievementsWidget, AppointmentsWidget, ClaimsWidget, MetricsWidget, RecentActivityWidget } from './dashboard';

// Form components
export { AppointmentForm } from './forms/AppointmentForm';
export { ClaimForm } from './forms/ClaimForm';
export { HealthGoalForm } from './forms/HealthGoalForm';
export { HealthMetricForm } from './forms/HealthMetricForm';
export { ProfileForm } from './forms/ProfileForm';

// Navigation components
export { Breadcrumbs, JourneyNav, MobileNav, Sidebar, TopBar } from './navigation';

// Shared components
export { EmptyState, ErrorState, FileUploader, GamificationPopup, JourneyHeader, LoadingIndicator } from './shared';

// Modal components
export { AchievementModal } from './modals/AchievementModal';
export { ConfirmationModal } from './modals/ConfirmationModal';
export { FilterModal } from './modals/FilterModal';

// Re-export hooks for consumers that import from @/components/index
export { useAuth } from '@/hooks/useAuth';
export { useHealthMetrics } from '@/hooks/useHealthMetrics';
export { useAppointments } from '@/hooks/useAppointments';
export { useClaims } from '@/hooks/useClaims';
export { useGamification } from '@/hooks/useGamification';
export { useJourney } from '@/hooks/useJourney';

// Re-export layouts for consumers that import from @/components/index
export { MainLayout } from '@/layouts/MainLayout';

/**
 * Placeholder JourneyCard component -- renders a styled container for journey information.
 */
export const JourneyCard: React.FC<{
    id?: string;
    title?: string;
    description?: string;
    color?: string;
    background?: string;
    href?: string;
    children?: React.ReactNode;
}> = ({ children, ...props }) => createElement('div', { 'data-testid': 'journey-card', ...props }, children);
