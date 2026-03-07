import styled from 'styled-components';
import type { ThemeProps } from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';

export const AppointmentCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.colors.neutral.white};
    border-radius: ${(props) => props.theme.borderRadius.md};
    box-shadow: ${(props) => props.theme.shadows.sm};
    padding: ${(props) => props.theme.spacing.md};
    border-left: 4px solid ${(props) => props.theme.colors.journeys.care.primary};
    margin-bottom: ${(props) => props.theme.spacing.md};
    transition: ${(props) => props.theme.animation.duration.normal} ${(props) => props.theme.animation.easing.easeInOut};

    &:hover {
        box-shadow: ${(props) => props.theme.shadows.md};
    }

    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
        padding: ${(props) => props.theme.spacing.sm};
    }
`;

export const AppointmentCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.spacing.sm};
    padding-bottom: ${(props) => props.theme.spacing.sm};
    border-bottom: 1px solid ${(props) => props.theme.colors.neutral.gray200};
`;

export const AppointmentCardBody = styled.div`
    margin-bottom: ${(props) => props.theme.spacing.md};
`;

export const AppointmentCardFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: ${(props) => props.theme.spacing.sm};
    border-top: 1px solid ${(props) => props.theme.colors.neutral.gray200};
`;

export const ProviderInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing.xs};
    font-size: ${(props) => props.theme.typography.fontSize.md};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    color: ${(props) => props.theme.colors.neutral.gray800};

    img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
    }
`;

export const AppointmentDetails = styled.div`
    font-size: ${(props) => props.theme.typography.fontSize.sm};
    color: ${(props) => props.theme.colors.neutral.gray600};
    margin-top: ${(props) => props.theme.spacing.xs};

    & > div {
        display: flex;
        align-items: center;
        gap: ${(props) => props.theme.spacing.xs};
        margin-bottom: ${(props) => props.theme.spacing.xs};
    }

    svg {
        color: ${(props) => props.theme.colors.journeys.care.secondary};
    }
`;

export const AppointmentActions = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing.sm};

    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
        flex-direction: column;
        width: 100%;

        button {
            width: 100%;
        }
    }
`;

export const AppointmentStatus = styled.div<{ status: 'upcoming' | 'completed' | 'cancelled' }>`
    display: flex;
    align-items: center;
    padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
    border-radius: ${(props) => props.theme.borderRadius.full};
    font-size: ${(props) => props.theme.typography.fontSize.xs};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};

    ${(props) => {
        switch (props.status) {
            case 'upcoming':
                return `
          background-color: ${props.theme.colors.journeys.care.background};
          color: ${props.theme.colors.journeys.care.primary};
        `;
            case 'completed':
                return `
          background-color: ${props.theme.colors.semantic.success}20;
          color: ${props.theme.colors.semantic.success};
        `;
            case 'cancelled':
                return `
          background-color: ${props.theme.colors.semantic.error}20;
          color: ${props.theme.colors.semantic.error};
        `;
            default:
                return '';
        }
    }}
`;
