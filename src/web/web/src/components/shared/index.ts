/**
 * This file serves as a barrel to export all shared components, centralizing component imports for the web application and simplifying module access.
 */

// Internal imports
import { EmptyState } from 'src/web/web/src/components/shared/EmptyState.tsx';
import { ErrorState } from 'src/web/web/src/components/shared/ErrorState.tsx';
import { FileUploader } from 'src/web/web/src/components/shared/FileUploader.tsx';
import { GamificationPopup } from 'src/web/web/src/components/shared/GamificationPopup.tsx';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader.tsx';
import { LoadingIndicator } from 'src/web/web/src/components/shared/LoadingIndicator.tsx';

// Export all shared components
export {
    EmptyState, // A component to display a placeholder UI when there is no data to show
    ErrorState, // A component to display error messages and potential recovery options
    FileUploader, // A reusable file uploader component with drag and drop support
    GamificationPopup, // A popup component to display gamification-related messages
    JourneyHeader, // A reusable header component that displays the title of the current journey
    LoadingIndicator, // A loading indicator component with customizable size and color
};
