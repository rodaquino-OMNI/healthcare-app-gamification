import styled from 'styled-components';

import { Card } from '../../components/Card';
import { Icon } from '../../primitives/Icon';
import { Text } from '../../primitives/Text';
import { colors, spacing, shadows, animation, typography, borderRadius, sizing } from '../../tokens';

/**
 * Utility function to get journey-specific colors for theming
 *
 * @param journey The journey identifier ('health', 'care', 'plan')
 * @returns The color palette for the specified journey, or a default if not found
 */
interface JourneyColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

export const useJourneyColor = (journey?: string): JourneyColorPalette => {
    if (journey && journey in colors.journeys) {
        return colors.journeys[journey as keyof typeof colors.journeys];
    }
    // Default to neutral colors if journey is not recognized
    return {
        primary: colors.neutral.gray700,
        secondary: colors.neutral.gray600,
        accent: colors.neutral.gray800,
        background: colors.neutral.white,
        text: colors.neutral.gray900,
    };
};

/**
 * Styled container for the reward card, extending the Card component
 * with reward-specific styling
 */
export const RewardCardContainer = styled(Card)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${spacing.md};
    margin-bottom: ${spacing.md};
    transition: transform ${animation.duration.fast} ${animation.easing.easeOut};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${shadows.md};
    }
`;

/**
 * Styled icon component for displaying the reward icon
 * with appropriate sizing and colors
 */
export const RewardIcon = styled(Icon)`
    flex-shrink: 0;
    width: ${sizing.component.lg};
    height: ${sizing.component.lg};
    margin-right: ${spacing.md};
`;

/**
 * Styled container for the reward content (title, description, XP)
 */
export const RewardContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

/**
 * Styled text component for the reward title with appropriate typography
 */
export const RewardTitle = styled(Text)`
    font-weight: ${typography.fontWeight.medium};
    margin-bottom: ${spacing.xs};
`;

/**
 * Styled text component for the reward description with appropriate typography
 */
export const RewardDescription = styled(Text)`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray700};
    margin-bottom: ${spacing.xs};
`;

/**
 * Styled component for displaying the XP value of the reward
 */
export const XPBadge = styled.div<{ color?: string; textColor?: string }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.color || colors.neutral.gray200};
    color: ${(props) => props.textColor || colors.neutral.gray900};
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: ${borderRadius.sm};
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    align-self: flex-start;
`;
