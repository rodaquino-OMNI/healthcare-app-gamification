import styled from 'styled-components';
import { ThemeProps } from 'styled-components';
import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';

export const ProgressBarContainer = styled.div`
    position: relative;
    width: 100%;
    height: ${({ theme }) => theme.spacing.sm};
    background-color: ${({ theme }) => theme.colors.neutral.gray200};
    border-radius: ${borderRadius.full};
    overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ progress: number; journey?: string }>`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => `${Math.min(Math.max(progress, 0), 100)}%`};
    background-color: ${({ journey, theme }) =>
        journey ? theme.colors.journeys[journey].primary : theme.colors.brand.primary};
    border-radius: ${borderRadius.full};
    transition: width 0.3s ease-in-out;
`;
