import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export const MedicationCardContainer = styled.div`
    background-color: ${colors.neutral.white};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    margin-bottom: ${spacing.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
`;

export const MedicationName = styled.h3`
    font-size: ${typography.fontSize.lg};
    font-weight: 500;
    color: ${colors.neutral.gray800};
`;

export const MedicationDosage = styled.p`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
`;

export const MedicationSchedule = styled.p`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
`;

export const MedicationStatus = styled.p`
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray600};
    margin-top: ${spacing.xs};
`;
