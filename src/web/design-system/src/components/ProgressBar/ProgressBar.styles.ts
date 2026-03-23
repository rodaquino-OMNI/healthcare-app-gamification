import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';

export const ProgressBarOuterContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const ProgressBarLabel = styled.span<{ position: 'above' | 'below' | 'inline' }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${({ position }) =>
        position === 'inline' ? typography.fontSize['text-2xs'] : typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${({ position }) => (position === 'inline' ? colors.neutral.white : colors.gray[60])};
    line-height: 1;
    ${({ position }) =>
        position === 'inline'
            ? `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        white-space: nowrap;
        pointer-events: none;
    `
            : `
        margin-${position === 'above' ? 'bottom' : 'top'}: 4px;
    `}
`;

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
        journey
            ? theme.colors.journeys[journey as keyof typeof theme.colors.journeys].primary
            : theme.colors.brand.primary};
    border-radius: ${borderRadius.full};
    transition: width 0.3s ease-in-out;
`;
