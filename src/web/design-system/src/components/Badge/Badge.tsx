import React from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { Text, TextProps } from '../../primitives/Text/Text';
import { Touchable, TouchableProps } from '../../primitives/Touchable/Touchable';
import { Icon, IconProps } from '../../primitives/Icon/Icon';

/**
 * Props interface for the Badge component
 */
export interface BadgeProps {
  /**
   * The size of the badge.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the badge is unlocked.
   * @default false
   */
  unlocked?: boolean;

  /**
   * The journey to which the badge belongs (health, care, or plan).
   * @default 'health'
   */
  journey?: 'health' | 'care' | 'plan';

  /**
   * The content of the badge.
   */
  children?: React.ReactNode;

  /**
   * Function called when the badge is pressed
   */
  onPress?: () => void;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;

  /**
   * Test ID for testing purposes
   */
  testID?: string;
}

/**
 * Determines the size of the badge based on the provided size prop.
 * @param size The size of the badge: 'sm', 'md', or 'lg'
 * @returns The size of the badge in pixels.
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
 * Container for the achievement badge.
 * Handles sizing, styling, and appearance based on unlocked state and journey.
 */
export const BadgeContainer = styled(Touchable)<{
  size: 'sm' | 'md' | 'lg';
  unlocked: boolean;
  journey: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.sm};
  background-color: ${(props) =>
    props.unlocked
      ? colors.journeys[props.journey].primary
      : colors.neutral.gray200};
  color: ${(props) =>
    props.unlocked ? colors.neutral.white : colors.neutral.gray700};
`;

/**
 * Icon component for the achievement badge.
 * Displays the achievement icon with appropriate color and size.
 */
export const BadgeIcon = styled(Icon)<{
  color: string;
  size: number;
}>`
  margin-right: ${(props) => props.theme.spacing.xs};
`;

/**
 * A versatile Badge component for displaying status, notifications, or achievements.
 * It supports different sizes, styles, and theming based on the AUSTA SuperApp's design system.
 */
export const Badge: React.FC<BadgeProps> = ({
  size = 'md',
  unlocked = false,
  journey = 'health',
  children,
  onPress,
  accessibilityLabel,
  testID,
}) => {
  const badgeSize = getBadgeSize(size);

  return (
    <BadgeContainer
      size={size}
      unlocked={unlocked}
      journey={journey}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </BadgeContainer>
  );
};