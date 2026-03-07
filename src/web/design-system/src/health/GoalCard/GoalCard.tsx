import React from 'react';
import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

// Styled components for the GoalCard
const Card = styled.div<{ completed?: boolean }>`
    display: flex;
    flex-direction: column;
    padding: ${spacing.md};
    border-radius: ${borderRadius.md};
    background-color: ${(props) => props.theme.colors.neutral.white};
    box-shadow: ${(props) => props.theme.shadows.sm};
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    border-left: 4px solid
        ${(props) =>
            props.completed ? props.theme.colors.semantic.success : props.theme.colors.journeys.health.primary};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${(props) => props.theme.shadows.md};
    }
`;

const Title = styled.h3`
    margin: 0 0 ${spacing.xs} 0;
    font-size: ${(props) => props.theme.typography.fontSize.lg};
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
    color: ${(props) => props.theme.colors.neutral.gray900};
`;

const Description = styled.p`
    margin: 0 0 ${spacing.md} 0;
    font-size: ${(props) => props.theme.typography.fontSize.md};
    color: ${(props) => props.theme.colors.neutral.gray700};
    display: ${(props) => (props.children ? 'block' : 'none')};
`;

const ProgressContainer = styled.div`
    width: 100%;
    height: 8px;
    background-color: ${(props) => props.theme.colors.neutral.gray200};
    border-radius: ${borderRadius.xs};
    overflow: hidden;
    margin-top: auto;
`;

const ProgressBar = styled.div<{ completed?: boolean; progress?: number }>`
    height: 100%;
    border-radius: ${borderRadius.xs};
    background-color: ${(props) =>
        props.completed ? props.theme.colors.semantic.success : props.theme.colors.journeys.health.primary};
    width: ${(props) => props.progress ?? 0}%;
    transition: width 0.3s ease;
`;

const StatusIndicator = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: ${spacing.sm};
`;

const CompletedBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: ${spacing['3xs']} ${spacing.xs};
    background-color: ${(props) => props.theme.colors.semantic.success};
    color: ${(props) => props.theme.colors.neutral.white};
    border-radius: ${borderRadius.lg};
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    margin-right: ${spacing.xs};

    &::before {
        content: '✓';
        margin-right: ${spacing['3xs']};
    }
`;

const ProgressText = styled.span`
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    color: ${(props) => props.theme.colors.neutral.gray600};
    margin-left: auto;
`;

/**
 * Props for the GoalCard component
 */
export interface GoalCardProps {
    /** The title of the goal */
    title: string;
    /** A description of the goal */
    description?: string;
    /** The progress towards completing the goal (0-100) */
    progress?: number;
    /** Whether the goal has been completed */
    completed?: boolean;
}

/**
 * GoalCard - A component for displaying goal information
 */
const GoalCard: React.FC<GoalCardProps> = ({ title, description, progress = 0, completed = false }) => {
    // Ensure progress is within valid range
    const normalizedProgress = completed ? 100 : Math.min(Math.max(progress, 0), 100);

    return (
        <Card
            completed={completed}
            aria-label={`Goal: ${title}${completed ? ', completed' : `, ${normalizedProgress}% complete`}`}
            data-testid="goal-card"
        >
            <StatusIndicator>
                {completed && <CompletedBadge>Completed</CompletedBadge>}
                <ProgressText>{completed ? '100%' : `${normalizedProgress}%`}</ProgressText>
            </StatusIndicator>

            <Title>{title}</Title>

            {description && <Description>{description}</Description>}

            <ProgressContainer>
                <ProgressBar
                    progress={normalizedProgress}
                    completed={completed}
                    role="progressbar"
                    aria-valuenow={normalizedProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </ProgressContainer>
        </Card>
    );
};

export default GoalCard;
