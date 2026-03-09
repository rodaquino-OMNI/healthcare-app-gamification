// Barrel file that exports all gamification-related components from the design system.
// This file serves as the central entry point for importing gamification UI elements.

import { AchievementBadge, type AchievementBadgeProps } from './AchievementBadge';
import { AchievementNotification, type AchievementNotificationProps } from './AchievementNotification';
import { Leaderboard, type LeaderboardProps } from './Leaderboard';
import { LevelIndicator, type LevelIndicatorProps } from './LevelIndicator';
import { QuestCard, type QuestCardProps } from './QuestCard';
import { RewardCard, type RewardCardProps } from './RewardCard';
import { XPCounter, type XPCounterProps } from './XPCounter';

// LD1: Exports the AchievementBadge component for use in other components.
export { AchievementBadge };

// LD1: Exports the props interface for the AchievementBadge component.
export type { AchievementBadgeProps };

// LD1: Exports the AchievementNotification component for displaying achievement unlock notifications
export { AchievementNotification };

// LD1: Exports the props interface for the AchievementNotification component.
export type { AchievementNotificationProps };

// LD1: Exports the Leaderboard component for displaying user rankings
export { Leaderboard };

// LD1: Exports the props interface for the Leaderboard component.
export type { LeaderboardProps };

// LD1: Exports the LevelIndicator component for displaying user level and progress
export { LevelIndicator };

// LD1: Exports the props interface for the LevelIndicator component
export type { LevelIndicatorProps };

// LD1: Exports the QuestCard component for displaying quests and challenges
export { QuestCard };

// LD1: Exports the props interface for the QuestCard component
export type { QuestCardProps };

// LD1: Exports the RewardCard component for displaying available and earned rewards
export { RewardCard };

// LD1: Exports the props interface for the RewardCard component
export type { RewardCardProps };

// LD1: Exports the XPCounter component for displaying experience points
export { XPCounter };

// LD1: Exports the props interface for the XPCounter component
export type { XPCounterProps };
