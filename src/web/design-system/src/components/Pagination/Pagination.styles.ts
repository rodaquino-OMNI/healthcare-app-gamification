import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export const PaginationContainer = styled.nav`
    display: flex;
    align-items: center;
    gap: ${spacing.xs};
`;

export const PageButton = styled.button<{ isActive: boolean }>`
    min-width: ${spacing['2xl']};
    height: ${spacing['2xl']};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    border: 1px solid ${colors.neutral.gray300};
    border-radius: ${borderRadius.md};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Dot = styled.button<{ isActive: boolean }>`
    width: ${spacing.xs};
    height: ${spacing.xs};
    padding: 0;
    border: none;
    border-radius: ${borderRadius.full};
    background-color: ${colors.neutral.gray300};
    cursor: pointer;
`;
