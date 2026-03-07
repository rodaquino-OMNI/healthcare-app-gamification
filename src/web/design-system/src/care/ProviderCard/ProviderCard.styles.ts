import styled from 'styled-components';
import type { ThemeProps } from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { typography } from '../../tokens/typography';

export const ProviderCardContainer = styled.div`
    background-color: ${colors.neutral.white};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    margin-bottom: ${spacing.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
    border-left: 4px solid ${(props) => props.theme.colors.journeys.care.primary};
`;

export const ProviderName = styled.h3`
    font-size: ${typography.fontSize.lg};
    font-weight: 500;
    color: ${colors.neutral.gray800};
`;

export const ProviderSpecialty = styled.p`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
`;

export const ProviderLocation = styled.p`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
`;

export const AvailabilityInfo = styled.p`
    font-size: ${typography.fontSize.xs};
    color: ${colors.neutral.gray500};
`;

export const AppointmentButton = styled.button`
    background-color: ${(props) => props.theme.colors.journeys.care.primary};
    color: ${colors.neutral.white};
    border: none;
    padding: ${spacing.xs} ${spacing.md};
    border-radius: ${borderRadius.xs};
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.colors.journeys.care.accent};
    }
`;
