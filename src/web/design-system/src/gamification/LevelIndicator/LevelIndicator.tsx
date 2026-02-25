import React from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { XPCounter } from '../XPCounter/XPCounter';
import { AchievementBadge } from '../AchievementBadge/AchievementBadge';
// Local type stub for Achievement (shared package not available at build time)
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  journey: 'health' | 'care' | 'plan';
}

/**
 * Props for the LevelIndicator component
 */
export interface LevelIndicatorProps {
  /**
   * The user's current level.
   */
  level: number;
  
  /**
   * The user's current XP.
   */
  currentXp: number;
  
  /**
   * The XP required to reach the next level.
   */
  nextLevelXp: number;
  
  /**
   * The journey context (e.g., 'health', 'care', 'plan').
   */
  journey: string;
  
  /**
   * The most recent achievement unlocked by the user.
   */
  recentAchievement?: Achievement;
}

/**
 * Helper function to safely get journey color
 */
const getJourneyColor = (journey: string, colorKey: keyof typeof colors.journeys.health): string => {
  const validJourneys = ['health', 'care', 'plan'];
  const journeyKey = validJourneys.includes(journey) ? journey : 'health';
  return colors.journeys[journeyKey as keyof typeof colors.journeys][colorKey];
};

/**
 * Styled container for the level indicator with journey-specific styling
 */
const LevelIndicatorContainer = styled.div<{ journey: string }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ journey }) => getJourneyColor(journey, 'background')};
  border-radius: 8px;
  padding: ${spacing.md};
  border-left: 4px solid ${({ journey }) => getJourneyColor(journey, 'primary')};
  margin-bottom: ${spacing.md};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

/**
 * Styling for the level text display
 */
const LevelText = styled.div<{ journey: string }>`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.sm};
  color: ${({ journey }) => getJourneyColor(journey, 'primary')};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.xl};
`;

/**
 * Styling for the level numeric value
 */
const LevelValue = styled.span<{ journey: string }>`
  font-weight: ${typography.fontWeight.bold};
  margin-left: ${spacing.sm};
  color: ${({ journey }) => getJourneyColor(journey, 'primary')};
`;

/**
 * Styled container for the recent achievement section
 */
const RecentAchievementContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacing.sm};
`;

/**
 * Styled text for the achievement title
 */
const AchievementText = styled.span`
  margin-left: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  color: ${colors.neutral.gray700};
`;

/**
 * A component that displays the user's current level and progress towards the next level,
 * incorporating journey-specific theming.
 * 
 * @example
 * ```tsx
 * <LevelIndicator
 *   level={5}
 *   currentXp={1500}
 *   nextLevelXp={2000}
 *   journey="health"
 *   recentAchievement={{
 *     id: 'daily-goal',
 *     title: 'Meta Diária Completa',
 *     description: 'Complete sua meta diária',
 *     icon: 'trophy',
 *     progress: 1,
 *     total: 1,
 *     unlocked: true,
 *     journey: 'health'
 *   }}
 * />
 * ```
 */
export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  level,
  currentXp,
  nextLevelXp,
  journey,
  recentAchievement,
}) => {
  // Get level title based on level
  const getLevelTitle = (level: number): string => {
    if (level < 5) return 'Iniciante';
    if (level < 10) return 'Aventureiro';
    if (level < 15) return 'Explorador';
    if (level < 20) return 'Especialista';
    if (level < 25) return 'Mestre';
    return 'Lendário';
  };
  
  const levelTitle = getLevelTitle(level);
  
  // Calculate XP needed for next level, ensuring it's not negative
  const xpNeeded = Math.max(0, nextLevelXp - currentXp);
  
  return (
    <LevelIndicatorContainer 
      journey={journey}
      aria-label={`Nível ${level} - ${levelTitle}. ${currentXp} XP atual. ${xpNeeded} XP para o próximo nível.`}
    >
      <LevelText journey={journey}>
        Nível <LevelValue journey={journey}>{level}</LevelValue> - {levelTitle}
      </LevelText>
      
      <XPCounter
        currentXP={currentXp}
        nextLevelXP={nextLevelXp}
        levelXP={0} // Assuming the start of the current level is 0 XP
        journey={journey}
      />
      
      {recentAchievement && (
        <RecentAchievementContainer>
          <AchievementBadge
            achievement={recentAchievement}
            size="sm"
          />
          <AchievementText>
            Nova conquista: {recentAchievement.title}
          </AchievementText>
        </RecentAchievementContainer>
      )}
    </LevelIndicatorContainer>
  );
};

export default LevelIndicator;