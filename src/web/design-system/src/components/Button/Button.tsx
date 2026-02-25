import React from 'react';
import styled from 'styled-components';
import { ActivityIndicator } from 'react-native'; // v0.71+
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';
import { borderRadius } from '../../tokens/borderRadius';
import { sizing } from '../../tokens/sizing';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { Text } from '../../primitives/Text/Text';
import { Icon } from '../../primitives/Icon/Icon';

/**
 * Props interface for the Button component
 */
export interface ButtonProps {
  /**
   * Button style variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | string;

  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show a loading spinner
   * @default false
   */
  loading?: boolean;

  /**
   * Icon name to display inside the button
   */
  icon?: string;

  /**
   * Function called when the button is pressed
   */
  onPress?: (() => void) | (() => Promise<void>);

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;

  /**
   * Button content
   */
  children?: React.ReactNode;

  /**
   * Journey identifier for journey-specific styling
   * @default 'health'
   */
  journey?: 'health' | 'care' | 'plan';

  /**
   * Whether the button displays only an icon (no text content).
   * Applies equal padding on all sides for a square/circle button.
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Test ID for component testing
   */
  testID?: string;

  /**
   * Additional style overrides
   */
  style?: any;

  /**
   * Button type (for web forms)
   */
  type?: string;

  /** Allow additional passthrough props for RN/web compatibility */
  [key: string]: any;
}

/**
 * Styled button component with journey-specific theming
 */
const StyledButton = styled(Touchable)<{
  variant?: string;
  size?: string;
  journey?: string;
  disabled?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${spacing.xs} ${spacing.sm}`;
      case 'lg': return `${spacing.md} ${spacing.lg}`;
      default: return `${spacing.sm} ${spacing.md}`;
    }
  }};
  border-radius: ${borderRadius.md};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.md};
  box-shadow: ${shadows.md};
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  
  background-color: ${props => {
    const journeyColors = colors.journeys[props.journey];
    switch (props.variant) {
      case 'secondary':
        return colors.neutral.white;
      case 'tertiary':
        return 'transparent';
      default:
        return journeyColors.primary;
    }
  }};
  
  color: ${props => {
    const journeyColors = colors.journeys[props.journey];
    switch (props.variant) {
      case 'secondary':
        return journeyColors.primary;
      case 'tertiary':
        return journeyColors.primary;
      default:
        return colors.neutral.white;
    }
  }};
  
  border: ${props => props.variant === 'secondary' ? 
    `1px solid ${colors.journeys[props.journey].primary}` : 
    'none'};
  
  &:hover {
    ${props => !props.disabled && `box-shadow: ${shadows.lg}`}
  }
`;

/**
 * Spacer component for gap between icon and text
 */
const IconSpacing = styled.span`
  display: inline-block;
  width: ${spacing.sm};
  height: 1px;
`;

/**
 * Button component for the AUSTA SuperApp design system.
 * Provides a consistent button experience across all journeys with
 * appropriate styling, states, and accessibility support.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onPress,
  accessibilityLabel,
  children,
  journey = 'health',
  iconOnly = false,
}) => {
  // Determine if there's content other than just an icon
  const hasContent = React.Children.count(children) > 0;
  
  // Determine icon size based on button size using sizing tokens
  const getIconSize = () => {
    switch (size) {
      case 'sm': return sizing.icon.xs;   // 16px
      case 'lg': return sizing.icon.md;   // 24px
      default: return sizing.icon.sm;     // 20px
    }
  };
  
  // Determine font size based on button size
  const getFontSize = () => {
    switch (size) {
      case 'sm': return 'sm';
      case 'lg': return 'lg';
      default: return 'md';
    }
  };
  
  // Calculate text color for loading indicator
  const getTextColor = () => {
    if (variant === 'primary') {
      return colors.neutral.white;
    }
    return colors.journeys[journey].primary;
  };
  
  return (
    <StyledButton
      variant={variant}
      size={size}
      journey={journey}
      disabled={disabled || loading}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children.toString() : undefined)}
      accessibilityRole="button"
      testID="button"
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'small'}
          color={getTextColor()}
        />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon}
              size={getIconSize()}
              color="currentColor"
              aria-hidden={true}
            />
          )}
          {icon && hasContent && <IconSpacing />}
          {hasContent && (
            <Text
              fontWeight="medium"
              fontSize={getFontSize()}
              color="inherit"
            >
              {children}
            </Text>
          )}
        </>
      )}
    </StyledButton>
  );
};