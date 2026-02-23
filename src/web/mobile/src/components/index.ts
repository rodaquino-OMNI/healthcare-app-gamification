// src/web/mobile/src/components/index.ts
/**
 * @file src/web/mobile/src/components/index.ts
 * @description Aggregates and exports commonly used UI components for easy access throughout the mobile application.
 */

// Import necessary components from their respective modules
import { Button } from 'src/web/design-system/src/components/Button/Button.tsx'; // Imports the Button component for use in the mobile app.
import { Card } from 'src/web/design-system/src/components/Card/Card.tsx'; // Imports the Card component for use in the mobile app.
import { Input } from 'src/web/design-system/src/components/Input/Input.tsx'; // Imports the Input component for use in the mobile app.
import { Select } from 'src/web/design-system/src/components/Select/Select.tsx'; // Imports the Select component for use in the mobile app.
import { Modal } from 'src/web/design-system/src/components/Modal/Modal.tsx'; // Imports the Modal component for use in the mobile app.
import { ProgressCircle } from 'src/web/design-system/src/components/ProgressCircle/ProgressCircle.tsx'; // Imports the ProgressCircle component for use in the mobile app.
import { ProgressBar } from 'src/web/design-system/src/components/ProgressBar/ProgressBar.tsx'; // Imports the ProgressBar component for use in the mobile app.
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader.tsx'; // Imports the JourneyHeader component for use in the mobile app.
import { LoadingIndicator } from 'src/web/mobile/src/components/shared/LoadingIndicator.tsx'; // Imports the LoadingIndicator component for use in the mobile app.
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