import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';
import { borderRadius } from '../../tokens/borderRadius';

export const CoverageInfoCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${colors.journeys.plan.background};
    border-radius: ${borderRadius.lg};
    overflow: hidden;
    margin-bottom: ${spacing.md};
    border-left: 4px solid ${colors.journeys.plan.primary};
    width: 100%;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

export const CoverageInfoCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing.md};
    border-bottom: 1px solid ${colors.neutral.gray300};
    background-color: ${colors.journeys.plan.background};
`;

export const CoverageInfoCardTitle = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.journeys.plan.primary};
    margin: 0;
    padding: 0;
`;

export const CoverageInfoCardContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${spacing.md};
    gap: ${spacing.sm};
`;

export const CoverageInfoCardItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing.sm} 0;
    border-bottom: 1px solid ${colors.neutral.gray200};

    &:last-child {
        border-bottom: none;
    }
`;

export const CoverageInfoCardLabel = styled.span`
    font-family: ${typography.fontFamily.base};
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray700};
    font-weight: ${typography.fontWeight.medium};
`;

export const CoverageInfoCardValue = styled.span`
    font-family: ${typography.fontFamily.base};
    font-size: ${typography.fontSize.md};
    color: ${colors.neutral.gray900};
    font-weight: ${typography.fontWeight.bold};

    &.highlighted {
        color: ${colors.journeys.plan.secondary};
    }

    &.covered {
        color: ${colors.semantic.success};
    }

    &.not-covered {
        color: ${colors.semantic.error};
    }

    &.partially-covered {
        color: ${colors.semantic.warning};
    }
`;
