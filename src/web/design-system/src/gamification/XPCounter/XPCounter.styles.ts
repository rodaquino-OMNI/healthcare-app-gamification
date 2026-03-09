import styled from 'styled-components';

type JourneyProps = {
    journey?: 'health' | 'care' | 'plan';
};

export const XPContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: ${({ theme }) => theme.spacing.sm} 0;
`;

export const XPLabel = styled.span<JourneyProps>`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme, journey }) => (journey ? theme.colors.journeys[journey].primary : theme.colors.brand.primary)};
    display: flex;
    align-items: center;
`;

export const XPRemaining = styled.span`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.neutral.gray600};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;
