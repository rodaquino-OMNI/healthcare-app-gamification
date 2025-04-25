// Exports all shared components from the shared components directory,
// providing a single import point for all shared components used throughout the AUSTA SuperApp mobile application.

import EmptyState, { EmptyStateProps } from './EmptyState';
import { FileUploader } from './FileUploader';
import GamificationPopup from './GamificationPopup';
import JourneyHeader, { JourneyHeaderProps } from './JourneyHeader';
import LoadingIndicator from './LoadingIndicator';
import PhotoCapture from './PhotoCapture';

export {
  EmptyState,
  FileUploader,
  GamificationPopup,
  JourneyHeader,
  LoadingIndicator,
  PhotoCapture,
};

export type {
  EmptyStateProps,
  JourneyHeaderProps,
};