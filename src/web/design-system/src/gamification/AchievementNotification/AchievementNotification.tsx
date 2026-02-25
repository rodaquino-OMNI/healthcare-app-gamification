import React from 'react';
import { AchievementBadge } from '../AchievementBadge/AchievementBadge';
import {
  NotificationContainer,
  NotificationContent,
  NotificationTitle,
  NotificationMessage,
} from './AchievementNotification.styles';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadius } from '../../tokens/borderRadius';

/**
 * Achievement data structure used by the AchievementNotification component
 */
interface Achievement {
  /** Unique identifier for the achievement */
  id: string;
  /** Display title of the achievement */
  title: string;
  /** Description of the achievement */
  description: string;
  /** Journey this achievement belongs to */
  journey: 'health' | 'care' | 'plan';
  /** Icon name for the achievement badge */
  icon: string;
  /** Current progress toward the achievement */
  progress: number;
  /** Total required for completion */
  total: number;
  /** Whether the achievement has been unlocked */
  unlocked: boolean;
}

/**
 * Props interface for the AchievementNotification component
 */
export interface AchievementNotificationProps {
  /** Achievement data to display in the notification */
  achievement: Achievement;
  /** Callback fired when the notification is dismissed */
  onClose: () => void;
}

/**
 * AchievementNotification component for the AUSTA SuperApp gamification system.
 * Displays a notification overlay when a user unlocks or makes progress on an achievement.
 * Shows the achievement badge, title, description, and an OK button to dismiss.
 *
 * @example
 * <AchievementNotification
 *   achievement={{
 *     id: '1',
 *     title: 'First Steps',
 *     description: 'Complete your first health check',
 *     journey: 'health',
 *     icon: 'heart',
 *     progress: 1,
 *     total: 1,
 *     unlocked: true,
 *   }}
 *   onClose={() => setShowNotification(false)}
 * />
 */
export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
}) => {
  return (
    <NotificationContainer
      role="dialog"
      aria-label={`Achievement notification: ${achievement.title}`}
    >
      <NotificationContent>
        <AchievementBadge
          achievement={achievement}
          size="lg"
          showProgress={!achievement.unlocked}
        />

        <NotificationTitle>
          {achievement.title}
        </NotificationTitle>

        <NotificationMessage>
          {achievement.description}
        </NotificationMessage>

        <button
          role="button"
          onClick={onClose}
          onTouchEnd={onClose}
          aria-label="OK"
          style={{
            marginTop: spacing.md,
            padding: `${spacing.xs} ${spacing.xl}`,
            fontSize: typography.fontSize.md,
            fontWeight: 600,
            border: 'none',
            borderRadius: borderRadius.md,
            backgroundColor: colors.journeys[achievement.journey as keyof typeof colors.journeys]?.primary ?? colors.journeys.health.primary,
            color: colors.neutral.white,
            cursor: 'pointer',
          }}
        >
          OK
        </button>
      </NotificationContent>
    </NotificationContainer>
  );
};
