import styled from 'styled-components'; // styled-components@6.1.8

import { tokens } from '../../tokens';

export const InsuranceCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: ${tokens.borderRadius.md};
    background-color: ${tokens.colors.journeys.plan.background};
    border-left: 4px solid ${tokens.colors.journeys.plan.primary};
    box-shadow: ${tokens.shadows.md};
    overflow: hidden;
    margin-bottom: ${tokens.spacing.md};
    transition:
        transform ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut},
        box-shadow ${tokens.animation.duration.normal} ${tokens.animation.easing.easeInOut};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${tokens.shadows.lg};
    }

    @media (min-width: ${tokens.breakpoints.md}) {
        max-width: 600px;
    }
`;

export const InsuranceCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${tokens.spacing.md};
    background-color: ${tokens.colors.journeys.plan.primary};
    color: ${tokens.colors.neutral.white};
    font-weight: ${tokens.typography.fontWeight.bold};
    font-size: ${tokens.typography.fontSize.lg};

    @media (min-width: ${tokens.breakpoints.md}) {
        padding: ${tokens.spacing.md} ${tokens.spacing.lg};
        font-size: ${tokens.typography.fontSize.xl};
    }
`;

export const InsuranceCardBody = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${tokens.spacing.md};
    gap: ${tokens.spacing.sm};

    @media (min-width: ${tokens.breakpoints.md}) {
        padding: ${tokens.spacing.lg};
        gap: ${tokens.spacing.md};
    }
`;

export const InsuranceCardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${tokens.spacing.md};
    background-color: ${tokens.colors.neutral.gray100};
    border-top: 1px solid ${tokens.colors.neutral.gray300};

    @media (min-width: ${tokens.breakpoints.md}) {
        padding: ${tokens.spacing.md} ${tokens.spacing.lg};
    }
`;
