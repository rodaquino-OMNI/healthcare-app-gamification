import styled from 'styled-components';
import { tokens } from '../../tokens';

export const BenefitCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${tokens.spacing.md};
    border-radius: ${tokens.borderRadius.md};
    background-color: ${tokens.colors.journeys.plan.background};
    border-left: 4px solid ${tokens.colors.journeys.plan.primary};
    box-shadow: ${tokens.shadows.sm};
    transition:
        transform ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut},
        box-shadow ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut};
    margin-bottom: ${tokens.spacing.md};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${tokens.shadows.md};
    }

    @media (min-width: ${tokens.breakpoints.md}) {
        padding: ${tokens.spacing.lg};
    }
`;

export const BenefitCardTitle = styled.h3`
    font-family: ${tokens.typography.fontFamily.base};
    font-weight: ${tokens.typography.fontWeight.bold};
    font-size: ${tokens.typography.fontSize.lg};
    color: ${tokens.colors.journeys.plan.primary};
    margin: 0 0 ${tokens.spacing.xs} 0;

    @media (min-width: ${tokens.breakpoints.md}) {
        font-size: ${tokens.typography.fontSize.xl};
    }
`;

export const BenefitCardDescription = styled.p`
    font-family: ${tokens.typography.fontFamily.base};
    font-weight: ${tokens.typography.fontWeight.regular};
    font-size: ${tokens.typography.fontSize.md};
    color: ${tokens.colors.neutral.gray800};
    margin: 0 0 ${tokens.spacing.md} 0;
    line-height: ${tokens.typography.lineHeight.relaxed};
`;

export const BenefitCardUsage = styled.span`
    font-family: ${tokens.typography.fontFamily.base};
    font-weight: ${tokens.typography.fontWeight.medium};
    font-size: ${tokens.typography.fontSize.sm};
    color: ${tokens.colors.journeys.plan.secondary};
    margin-top: auto;
    padding-top: ${tokens.spacing.sm};
    border-top: 1px solid ${tokens.colors.neutral.gray200};
    display: flex;
    align-items: center;

    svg {
        margin-right: ${tokens.spacing.xs};
        color: ${tokens.colors.journeys.plan.accent};
    }
`;
