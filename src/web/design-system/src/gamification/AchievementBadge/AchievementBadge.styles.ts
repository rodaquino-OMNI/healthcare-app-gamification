import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';

/**
 * Determines the size of the badge based on the provided size prop.
 * @param size The size of the badge: 'sm', 'md', or 'lg'
 * @returns The size in pixels
 */
export function getBadgeSize(size: 'sm' | 'md' | 'lg'): number {
  switch (size) {
    case 'sm':
      return 24;
    case 'md':
      return 32;
    case 'lg':
      return 40;
    default:
      return 32;
  }
}

/**
 * Hook to return journey-specific colors based on the journey identifier.
 * This would normally use theme context in a real implementation.
 * @param journey The journey identifier ('health', 'care', or 'plan')
 * @returns The color palette for the specified journey
 */
export function useJourneyColor(journey: string) {
  // Default to health journey if invalid journey specified
  const journeyKey = ['health', 'care', 'plan'].includes(journey) ? journey : 'health';
  return colors.journeys[journeyKey as keyof typeof colors.journeys];
}

/**
 * Container for the achievement badge.
 * Handles sizing, styling, and appearance based on unlocked state and journey.
 */
export const BadgeContainer = styled.TouchableOpacity<{
  size: 'sm' | 'md' | 'lg';
  unlocked: boolean;
  journey: string;
}>`
  position: relative;
  width: ${props => getBadgeSize(props.size)}px;
  height: ${props => getBadgeSize(props.size)}px;
  border-radius: ${props => getBadgeSize(props.size) / 2}px;
  background-color: ${props => props.unlocked ? colors.neutral.white : colors.neutral.gray200};
  border-width: 2px;
  border-style: solid;
  border-color: ${props => {
    const journeyColor = useJourneyColor(props.journey);
    return props.unlocked ? journeyColor.primary : colors.neutral.gray400;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: ${props => props.unlocked ? 1 : 0.8};
  margin: ${spacing.xs};
`;

/**
 * Icon component for the achievement badge.
 * Displays the achievement icon with appropriate color and size.
 */
export const BadgeIcon = styled(Icon)<{
  color: string;
  size: number;
}>`
  color: ${props => props.color};
  font-size: ${props => props.size * 0.5}px;
`;

/**
 * Progress ring that shows completion percentage for incomplete achievements.
 * Visualizes how close the user is to unlocking the achievement.
 */
export const ProgressRing = styled.View<{
  progress: number;
  total: number;
  color: string;
  size: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: ${props => props.size / 2}px;
  overflow: hidden;
  background-color: transparent;
  
  /* A circular arc representing progress percentage */
  border-width: 2px;
  border-color: ${props => props.color};
  opacity: 0.6;
`;

/**
 * Visual indicator that appears when an achievement is unlocked.
 * Displays as a small colored dot on the bottom-right of the badge.
 */
export const UnlockedIndicator = styled.View<{
  color: string;
}>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.color};
  border-width: 1px;
  border-style: solid;
  border-color: ${colors.neutral.white};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
`;