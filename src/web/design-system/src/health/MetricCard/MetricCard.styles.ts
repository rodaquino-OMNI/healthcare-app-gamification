import styled, { css } from 'styled-components';
import { Card } from '../../components/Card/Card';
import { Box } from '../../primitives/Box/Box';
import Text from '../../primitives/Text/Text';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadius } from '../../tokens/borderRadius';

/**
 * The main container for the MetricCard component, extending the Card component.
 * Applies Health journey specific styling with proper spacing and visual treatment.
 */
export const MetricCardContainer = styled(Card)`
    padding: ${(props) => props.theme.spacing.md};
    margin-bottom: ${(props) => props.theme.spacing.md};
    border-left: 4px solid ${(props) => props.theme.colors.journeys.health.primary};
    background-color: ${(props) => props.theme.colors.journeys.health.background};
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-2px);
    }
`;

/**
 * Container for the metric icon with appropriate styling.
 * Uses the Health journey primary color for the background.
 */
export const MetricIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.journeys.health.primary};
    color: ${(props) => props.theme.colors.neutral.white};
    margin-right: ${(props) => props.theme.spacing.sm};
`;

/**
 * Styled text component for the metric title.
 */
export const MetricTitle = styled(Text)`
    font-size: ${(props) => props.theme.typography.fontSize.md};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    color: ${(props) => props.theme.colors.neutral.gray800};
    margin-bottom: ${(props) => props.theme.spacing.xs};
`;

/**
 * Styled text component for the metric value.
 */
export const MetricValue = styled(Text)`
    font-size: ${(props) => props.theme.typography.fontSize.xl};
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
    color: ${(props) => props.theme.colors.neutral.gray900};
    margin-right: ${(props) => props.theme.spacing.xs};
    display: inline-flex;
    align-items: baseline;
`;

/**
 * Styled text component for the metric unit.
 */
export const MetricUnit = styled(Text)`
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    font-weight: ${(props) => props.theme.typography.fontWeight.regular};
    color: ${(props) => props.theme.colors.neutral.gray600};
    margin-left: ${(props) => props.theme.spacing.xs};
`;

/**
 * Styled container for the trend indicator with conditional styling based on trend direction.
 */
export const TrendIndicatorContainer = styled.div<{ trend?: 'up' | 'down' | 'stable' }>`
    display: flex;
    align-items: center;
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    margin-top: ${(props) => props.theme.spacing.xs};
    color: ${(props) =>
        props.trend === 'up'
            ? props.theme.colors.semantic.success
            : props.trend === 'down'
              ? props.theme.colors.semantic.error
              : props.theme.colors.neutral.gray600};
`;

/**
 * Styled container for achievement badges displayed on the metric card.
 */
export const AchievementContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: ${(props) => props.theme.spacing.sm};
    padding: ${(props) => props.theme.spacing.xs};
    background-color: ${(props) => `${props.theme.colors.journeys.health.primary}10`};
    border-radius: ${(props) => props.theme.borderRadius.sm};
`;
