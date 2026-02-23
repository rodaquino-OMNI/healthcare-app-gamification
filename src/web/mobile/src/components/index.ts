// src/web/mobile/src/components/index.ts
/**
 * @file src/web/mobile/src/components/index.ts
 * @description Aggregates and exports commonly used UI components for easy access throughout the mobile application.
 */

// Import necessary components from their respective modules
import { Button } from '@design-system/components/Button/Button'; // Imports the Button component for use in the mobile app.
import { Card } from '@design-system/components/Card/Card'; // Imports the Card component for use in the mobile app.
import { Input } from '@design-system/components/Input'; // Imports the Input component for use in the mobile app.
import { Select } from '@design-system/components/Select/Select'; // Imports the Select component for use in the mobile app.
import { Modal } from '@design-system/components/Modal/Modal'; // Imports the Modal component for use in the mobile app.
import { ProgressCircle } from '@design-system/components/ProgressCircle/ProgressCircle'; // Imports the ProgressCircle component for use in the mobile app.
import { ProgressBar } from '@design-system/components/ProgressBar/ProgressBar'; // Imports the ProgressBar component for use in the mobile app.
import { JourneyHeader } from '@components/shared/JourneyHeader'; // Imports the JourneyHeader component for use in the mobile app.
import { LoadingIndicator } from '@components/shared/LoadingIndicator'; // Imports the LoadingIndicator component for use in the mobile app.
import { ErrorState } from './shared/ErrorState';
import { ErrorBoundary } from './shared/ErrorBoundary';
import EmptyState from './shared/EmptyState';

// Export all imported components to make them accessible throughout the application
export {
    Button, // Exports the Button component for use in the mobile app.
    Card, // Exports the Card component for use in the mobile app.
    Input, // Exports the Input component for use in the mobile app.
    Select, // Exports the Select component for use in the mobile app.
    Modal, // Exports the Modal component for use in the mobile app.
    ProgressCircle, // Exports the ProgressCircle component for use in the mobile app.
    ProgressBar, // Exports the ProgressBar component for use in the mobile app.
    JourneyHeader, // Exports the JourneyHeader component for use in the mobile app.
    LoadingIndicator, // Exports the LoadingIndicator component for use in the mobile app.
    ErrorState, // Exports the ErrorState component for use in the mobile app.
    ErrorBoundary, // Exports the ErrorBoundary component for use in the mobile app.
    EmptyState, // Exports the EmptyState component for use in the mobile app.
};