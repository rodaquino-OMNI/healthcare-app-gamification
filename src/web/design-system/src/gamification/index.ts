// Barrel file that exports all gamification-related components from the design system.
// This file serves as the central entry point for importing gamification UI elements throughout the application.

import { AchievementBadge } from './AchievementBadge'; // Imports the AchievementBadge component for re-export.
import type { AchievementBadgeProps } from './AchievementBadge'; // Imports the AchievementBadgeProps interface for re-export.
import { AchievementNotification } from './AchievementNotification'; // Imports the AchievementNotification component for re-export.
import type { AchievementNotificationProps } from './AchievementNotification'; // Imports the AchievementNotificationProps interface for re-export.
import { Leaderboard } from './Leaderboard'; // Imports the Leaderboard component for re-export.
import type { LeaderboardProps } from './Leaderboard'; // Imports the props interface for the Leaderboard component.
import { LevelIndicator } from './LevelIndicator'; // Imports the LevelIndicator component for re-export.
import type { LevelIndicatorProps } from './LevelIndicator'; // Imports the props interface for the LevelIndicator component.
import { QuestCard } from './QuestCard'; // Imports the QuestCard component for re-export.
import type { QuestCardProps } from './QuestCard'; // Imports the props interface for the QuestCard component.
import { RewardCard } from './RewardCard'; // Imports the RewardCard component for re-export.
import type { RewardCardProps } from './RewardCard'; // Imports the props interface for the RewardCard component.
import { XPCounter } from './XPCounter'; // Imports the XPCounter component for re-export.
import type { XPCounterProps } from './XPCounter'; // Imports the props interface for the XPCounter component.

// LD1: Exports the AchievementBadge component for use in other components.
// IE3: Exports the AchievementBadge component with members exposed: achievement, size, showProgress, onPress
export { AchievementBadge };

// LD1: Exports the props interface for the AchievementBadge component.
// IE3: Exports the AchievementBadgeProps interface with members exposed: achievement, size, showProgress, onPress
export type { AchievementBadgeProps };

// LD1: Exports the AchievementNotification component for displaying achievement unlock notifications
// IE3: Exports the AchievementNotification component with members exposed: achievement, onClose
export { AchievementNotification };

// LD1: Exports the props interface for the AchievementNotification component.
// IE3: Exports the AchievementNotificationProps interface with members exposed: achievement, onClose
export type { AchievementNotificationProps };

// LD1: Exports the Leaderboard component for displaying user rankings
// IE3: Exports the Leaderboard component with members exposed: users, currentUserId, journey, title
export { Leaderboard };

// LD1: Exports the props interface for the Leaderboard component.
// IE3: Exports the LeaderboardProps interface with members exposed: users, currentUserId, journey, title
export type { LeaderboardProps };

// LD1: Exports the LevelIndicator component for displaying user level and progress
// IE3: Exports the LevelIndicator component with members exposed: level, currentXp, nextLevelXp, journey
export { LevelIndicator };

// LD1: Exports the props interface for the LevelIndicator component
// IE3: Exports the LevelIndicatorProps interface with members exposed: level, currentXp, nextLevelXp, journey
export type { LevelIndicatorProps };

// LD1: Exports the QuestCard component for displaying quests and challenges
// IE3: Exports the QuestCard component with members exposed: quest, progress, journey, onPress
export { QuestCard };

// LD1: Exports the props interface for the QuestCard component
// IE3: Exports the QuestCardProps interface with members exposed: quest, progress, journey, onPress
export type { QuestCardProps };

// LD1: Exports the RewardCard component for displaying available and earned rewards
// IE3: Exports the RewardCard component with members exposed: reward, isEarned, journey, onClaim
export { RewardCard };

// LD1: Exports the props interface for the RewardCard component
// IE3: Exports the RewardCardProps interface with members exposed: reward, isEarned, journey, onClaim
export type { RewardCardProps };

// LD1: Exports the XPCounter component for displaying experience points
// IE3: Exports the XPCounter component with members exposed: value, size, journey, animated
export { XPCounter };

// LD1: Exports the props interface for the XPCounter component
// IE3: Exports the XPCounterProps interface with members exposed: value, size, journey, animated
export type { XPCounterProps };
