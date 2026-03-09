import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

/**
 * Container for the entire LevelIndicator component.
 * Applies journey-specific styling via border color.
 */
export const LevelContainer = styled.div<{ journey?: 'health' | 'care' | 'plan' }>`
    display: flex;
    flex-direction: column;
    padding: ${spacing.md};
    border-radius: ${borderRadius.md};
    background-color: ${(props) => (props.journey ? colors.journeys[props.journey].background : colors.neutral.white)};
    border-left: 4px solid
        ${(props) => (props.journey ? colors.journeys[props.journey].primary : colors.neutral.gray400)};
    margin-bottom: ${spacing.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

/**
 * Displays the current level of the user with journey-specific styling.
 * Combines level badge and level title in a horizontal layout.
 */
export const LevelText = styled.div<{ journey?: 'health' | 'care' | 'plan' }>`
    display: flex;
    align-items: center;
    margin-bottom: ${spacing.md};
    font-size: ${typography.fontSize.xl};
    font-weight: ${typography.fontWeight.bold};
    color: ${(props) => (props.journey ? colors.journeys[props.journey].primary : colors.neutral.gray800)};
`;

/**
 * Container for the progress bar and XP counter components.
 */
export const LevelProgress = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: ${spacing.sm};
`;

/**
 * Circular badge displaying the user's current level number with journey-specific styling.
 */
export const LevelBadge = styled.div<{ journey?: 'health' | 'care' | 'plan' }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${sizing.component.md};
    height: ${sizing.component.md};
    border-radius: ${borderRadius.full};
    background-color: ${(props) => (props.journey ? colors.journeys[props.journey].primary : colors.neutral.gray400)};
    color: ${colors.neutral.white};
    font-weight: ${typography.fontWeight.bold};
    font-size: ${typography.fontSize.lg};
    margin-right: ${spacing.sm};
    flex-shrink: 0;
`;

/**
 * Container for level text and title information.
 */
export const LevelInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

/**
 * Displays the 'Level' title text.
 */
export const LevelTitle = styled.span`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
    margin-bottom: ${spacing.xs};
`;
