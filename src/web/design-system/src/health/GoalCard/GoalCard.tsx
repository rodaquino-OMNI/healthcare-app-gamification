import React from 'react';
import styled from 'styled-components';

// Styled components for the GoalCard
const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.neutral.white};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid ${props => props.completed 
    ? props.theme.colors.semantic.success 
    : props.theme.colors.journeys.health.primary};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.neutral.gray900};
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.neutral.gray700};
  display: ${props => props.children ? 'block' : 'none'};
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.neutral.gray200};
  border-radius: 4px;
  overflow: hidden;
  margin-top: auto;
`;

const ProgressBar = styled.div`
  height: 100%;
  border-radius: 4px;
  background-color: ${props => props.completed 
    ? props.theme.colors.semantic.success 
    : props.theme.colors.journeys.health.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const CompletedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${props => props.theme.colors.semantic.success};
  color: ${props => props.theme.colors.neutral.white};
  border-radius: 16px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-right: 8px;

  &::before {
    content: '✓';
    margin-right: 4px;
  }
`;

const ProgressText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.neutral.gray600};
  margin-left: auto;
`;

/**
 * GoalCard - A component for displaying goal information
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the goal
 * @param {string} [props.description] - A description of the goal
 * @param {number} [props.progress=0] - The progress towards completing the goal (0-100)
 * @param {boolean} [props.completed=false] - Whether the goal has been completed
 * @returns {React.ReactElement} The GoalCard component
 */
const GoalCard = ({ 
  title, 
  description, 
  progress = 0, 
  completed = false 
}) => {
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
        <ProgressText>
          {completed ? '100%' : `${normalizedProgress}%`}
        </ProgressText>
      </StatusIndicator>
      
      <Title>{title}</Title>
      
      {description && (
        <Description>{description}</Description>
      )}
      
      <ProgressContainer>
        <ProgressBar 
          progress={normalizedProgress} 
          completed={completed}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </ProgressContainer>
    </Card>
  );
};

export default GoalCard;