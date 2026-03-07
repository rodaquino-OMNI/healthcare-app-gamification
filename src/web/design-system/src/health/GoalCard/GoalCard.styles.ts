import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadius } from '../../tokens/borderRadius';

/**
 * Container for the GoalCard component.
 * Provides the main card structure with appropriate spacing, borders, and background.
 */
export const GoalCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${(props) => props.theme.spacing.md};
    border-radius: ${(props) => props.theme.borderRadius.md};
    background-color: ${(props) => props.theme.colors.neutral.white};
    border-left: 4px solid ${(props) => props.theme.colors.journeys.health.primary};
    box-shadow: ${(props) => props.theme.shadows.sm};
    margin-bottom: ${(props) => props.theme.spacing.md};

    /* Add hover effect */
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${(props) => props.theme.shadows.md};
    }

    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

/**
 * Title of the goal.
 * Uses typography tokens for consistent text styling.
 */
export const GoalTitle = styled.h3`
    font-family: ${(props) => props.theme.typography.fontFamily.base};
    font-size: ${(props) => props.theme.typography.fontSize.lg};
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
    color: ${(props) => props.theme.colors.neutral.gray900};
    margin: 0 0 ${(props) => props.theme.spacing.sm} 0;

    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
        margin-bottom: 0;
        margin-right: ${(props) => props.theme.spacing.md};
    }
`;

/**
 * Progress indicator for the goal.
 * Container for progress bar and progress information.
 */
export const GoalProgress = styled.div`
    margin-top: ${(props) => props.theme.spacing.sm};
    width: 100%;

    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
        margin-top: 0;
        flex: 1;
        max-width: 60%;
    }

    /* Style for the progress bar background */
    .progress-track {
        width: 100%;
        height: 8px;
        background-color: ${(props) => props.theme.colors.neutral.gray200};
        border-radius: ${(props) => props.theme.borderRadius.full};
        overflow: hidden;
        margin-bottom: ${(props) => props.theme.spacing.xs};
    }

    /* Style for the progress bar indicator */
    .progress-bar {
        height: 100%;
        background-color: ${(props) => props.theme.colors.journeys.health.primary};
        border-radius: ${(props) => props.theme.borderRadius.full};
        transition: width 0.3s ease;
    }

    /* Style for the progress text */
    .progress-text {
        display: flex;
        justify-content: space-between;
        font-family: ${(props) => props.theme.typography.fontFamily.base};
        font-size: ${(props) => props.theme.typography.fontSize.sm};
        color: ${(props) => props.theme.colors.neutral.gray600};
    }

    /* Style for achievement elements that might appear with the progress */
    .achievement {
        display: flex;
        align-items: center;
        margin-top: ${(props) => props.theme.spacing.sm};

        .achievement-icon {
            margin-right: ${(props) => props.theme.spacing.xs};
            color: ${(props) => props.theme.colors.journeys.health.primary};
        }

        .achievement-text {
            font-family: ${(props) => props.theme.typography.fontFamily.base};
            font-size: ${(props) => props.theme.typography.fontSize.sm};
            font-weight: ${(props) => props.theme.typography.fontWeight.medium};
            color: ${(props) => props.theme.colors.journeys.health.primary};
        }
    }
`;
