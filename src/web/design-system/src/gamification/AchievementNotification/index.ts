// Barrel file that exports the AchievementNotification component and its related types for use throughout the application.

import { AchievementNotification } from './AchievementNotification'; // Imports the AchievementNotification component for re-export.
import { AchievementNotificationProps } from './AchievementNotification'; // Imports the AchievementNotificationProps interface for re-export.

// LD1: Exports the AchievementNotification component for use in other components.
export { AchievementNotification };

// LD1: Exports the props interface for the AchievementNotification component.
// IE3: Exports the AchievementNotificationProps interface with members exposed: achievement, onClose
export type { AchievementNotificationProps };
