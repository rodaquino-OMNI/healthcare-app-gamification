import styled from 'styled-components';

import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

type ToggleSize = 'sm' | 'md' | 'lg';

const trackDimensions: Record<ToggleSize, { width: number; height: number }> = {
    sm: { width: 32, height: 18 },
    md: { width: 44, height: 24 },
    lg: { width: 56, height: 30 },
};

const thumbDimensions: Record<ToggleSize, number> = {
    sm: 14,
    md: 20,
    lg: 26,
};

interface TrackProps {
    $toggleSize: ToggleSize;
    $checked: boolean;
    $isDisabled: boolean;
}

interface ThumbProps {
    $toggleSize: ToggleSize;
    $checked: boolean;
}

export const ToggleContainer = styled.div<{ $isDisabled: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
    gap: ${spacing.xs};
`;

export const Track = styled.div<TrackProps>`
    position: relative;
    width: ${(props) => trackDimensions[props.$toggleSize].width}px;
    height: ${(props) => trackDimensions[props.$toggleSize].height}px;
    border-radius: ${(props) => trackDimensions[props.$toggleSize].height}px;
    background-color: ${(props) => (props.$checked ? colors.componentColors.brand : colors.gray[30])};
    transition: background-color 0.2s ease;
    flex-shrink: 0;
`;

export const Thumb = styled.div<ThumbProps>`
    position: absolute;
    top: ${(props) => (trackDimensions[props.$toggleSize].height - thumbDimensions[props.$toggleSize]) / 2}px;
    left: ${(props) =>
        props.$checked
            ? trackDimensions[props.$toggleSize].width -
              thumbDimensions[props.$toggleSize] -
              (trackDimensions[props.$toggleSize].height - thumbDimensions[props.$toggleSize]) / 2
            : (trackDimensions[props.$toggleSize].height - thumbDimensions[props.$toggleSize]) / 2}px;
    width: ${(props) => thumbDimensions[props.$toggleSize]}px;
    height: ${(props) => thumbDimensions[props.$toggleSize]}px;
    border-radius: 50%;
    background-color: ${colors.gray[0]};
    transition: left 0.2s ease;
`;

export const Label = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.regular};
    color: ${colors.gray[70]};
    user-select: none;
`;
