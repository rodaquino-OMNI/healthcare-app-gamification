import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/borderRadius';
import { shadows } from '../../tokens/shadows';

export const TooltipContainer = styled.div`
    position: relative;
    display: inline-flex;
`;

export const TooltipContent = styled.div<{ placement: string; visible: boolean }>`
    position: absolute;
    z-index: 100;
    padding: ${spacing.xs} ${spacing.sm};
    background-color: ${colors.neutral.gray900};
    color: ${colors.neutral.white};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    border-radius: ${borderRadius.sm};
    box-shadow: ${shadows.md};
    white-space: nowrap;
    opacity: ${(props) => (props.visible ? 1 : 0)};
    transition: opacity 0.15s ease-in-out;
`;

export const TooltipArrow = styled.div<{ placement: string }>`
    position: absolute;
    width: ${spacing.xs};
    height: ${spacing.xs};
    background-color: ${colors.neutral.gray900};
    transform: rotate(45deg);
`;
