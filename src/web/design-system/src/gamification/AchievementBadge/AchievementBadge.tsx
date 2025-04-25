import * as React from 'react';
import {
  BadgeContainer,
  BadgeIcon,
  ProgressRing,
  UnlockedIndicator,
  getBadgeSize,
  useJourneyColor
} from './AchievementBadge.styles';
import type { Achievement } from 'src/web/shared/types/gamification.types';
import { colors } from '../../tokens/colors';

/**
 * Props for the AchievementBadge component
 */
interface AchievementBadgeProps {
  /**
   * The achievement object containing details like id, title, description, icon, progress, total, unlocked, and journey.
   */
  achievement: Achievement;
  
  /**
   * The size of the badge.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to show the progress indicator for locked achievements.
   * @default true
   */
  showProgress?: boolean;
  
  /**
   * Callback function to execute when the badge is pressed.
   */
  onPress?: () => void;
}

/**
 * A component that displays an achievement badge with appropriate styling based on its state (locked/unlocked) and journey.
 */
export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showProgress = true,
  onPress
}) => {
  const { title, description, icon, progress, total, unlocked, journey } = achievement;
  const journeyColor = useJourneyColor(journey);
  
  // Calculate progress percentage for accessibility
  const progressPercentage = total > 0 ? Math.round((progress / total) * 100) : 0;
  
  return (
    <BadgeContainer
      size={size}
      unlocked={unlocked}
      journey={journey}
      onPress={onPress}
      accessibilityLabel={`${title} achievement. ${description}. ${
        unlocked ? 'Unlocked' : `Progress: ${progress} of ${total}`
      }`}
      testID="badge-container"
    >
      <BadgeIcon
        name={icon}
        color={unlocked ? journeyColor.primary : colors.neutral.gray400}
        size={getBadgeSize(size)}
        aria-hidden="true"
        testID="badge-icon"
      />
      
      {showProgress && !unlocked && (
        <ProgressRing
          progress={progress}
          total={total}
          color={journeyColor.primary}
          size={getBadgeSize(size)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          testID="progress-ring"
        />
      )}
      
      {unlocked && (
        <UnlockedIndicator
          color={journeyColor.primary}
          aria-hidden="true"
          testID="unlocked-indicator"
        />
      )}
    </BadgeContainer>
  );
};