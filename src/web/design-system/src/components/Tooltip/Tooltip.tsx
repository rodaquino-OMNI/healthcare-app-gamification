import React, { useState, useRef } from 'react';
import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export type TooltipColor = 'black' | 'brand' | 'white';

export interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: 'hover' | 'click';
    arrow?: boolean;
    delay?: number;
    accessibilityLabel?: string;
    /**
     * The color variant of the tooltip
     * @default 'black'
     */
    color?: TooltipColor;
}

const getTooltipColors = (tooltipColor: TooltipColor): { bg: string; text: string; border: string } => {
    switch (tooltipColor) {
        case 'brand':
            return { bg: colors.componentColors.brand, text: colors.neutral.white, border: 'none' };
        case 'white':
            return { bg: colors.neutral.white, text: colors.gray[80], border: `1px solid ${colors.gray[20]}` };
        case 'black':
        default:
            return { bg: colors.gray[80], text: colors.neutral.white, border: 'none' };
    }
};

const TooltipContainer = styled.div`
    position: relative;
    display: inline-flex;
`;

const TooltipContent = styled.div<{ $placement: string; $visible: boolean; $tooltipColor: TooltipColor }>`
    position: absolute;
    z-index: 100;
    padding: ${spacing.xs} ${spacing.sm};
    background-color: ${(props) => getTooltipColors(props.$tooltipColor).bg};
    color: ${(props) => getTooltipColors(props.$tooltipColor).text};
    border: ${(props) => getTooltipColors(props.$tooltipColor).border};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.xs};
    line-height: ${typography.lineHeight.base};
    border-radius: ${borderRadius.sm};
    box-shadow: ${shadows.md};
    white-space: nowrap;
    pointer-events: none;
    opacity: ${(props) => (props.$visible ? 1 : 0)};
    transition: opacity 0.15s ease-in-out;

    ${(props) => {
        switch (props.$placement) {
            case 'top':
                return `bottom: calc(100% + ${spacing.xs}); left: 50%; transform: translateX(-50%);`;
            case 'bottom':
                return `top: calc(100% + ${spacing.xs}); left: 50%; transform: translateX(-50%);`;
            case 'left':
                return `right: calc(100% + ${spacing.xs}); top: 50%; transform: translateY(-50%);`;
            case 'right':
                return `left: calc(100% + ${spacing.xs}); top: 50%; transform: translateY(-50%);`;
            default:
                return `bottom: calc(100% + ${spacing.xs}); left: 50%; transform: translateX(-50%);`;
        }
    }}
`;

const Arrow = styled.div<{ $placement: string; $tooltipColor: TooltipColor }>`
    position: absolute;
    width: ${spacing.xs};
    height: ${spacing.xs};
    background-color: ${(props) => getTooltipColors(props.$tooltipColor).bg};
    transform: rotate(45deg);

    ${(props) => {
        switch (props.$placement) {
            case 'top':
                return `bottom: -${spacing['3xs']}; left: 50%; margin-left: -${spacing['3xs']};`;
            case 'bottom':
                return `top: -${spacing['3xs']}; left: 50%; margin-left: -${spacing['3xs']};`;
            case 'left':
                return `right: -${spacing['3xs']}; top: 50%; margin-top: -${spacing['3xs']};`;
            case 'right':
                return `left: -${spacing['3xs']}; top: 50%; margin-top: -${spacing['3xs']};`;
            default:
                return `bottom: -${spacing['3xs']}; left: 50%; margin-left: -${spacing['3xs']};`;
        }
    }}
`;

const TriggerWrapper = styled.div`
    display: inline-flex;
`;

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    placement = 'top',
    trigger = 'hover',
    arrow: showArrow = true,
    delay = 200,
    accessibilityLabel,
    color = 'black',
}) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = (): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hide = (): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setVisible(false);
    };

    const toggle = (): void => {
        setVisible((prev) => !prev);
    };

    const triggerProps =
        trigger === 'hover'
            ? { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide }
            : { onClick: toggle };

    return (
        <TooltipContainer data-testid="tooltip-container">
            <TriggerWrapper
                {...triggerProps}
                aria-describedby={visible ? 'tooltip-content' : undefined}
                data-testid="tooltip-trigger"
            >
                {children}
            </TriggerWrapper>
            <TooltipContent
                id="tooltip-content"
                role="tooltip"
                $placement={placement}
                $visible={visible}
                $tooltipColor={color}
                aria-label={accessibilityLabel}
                data-testid="tooltip-content"
            >
                {content}
                {showArrow && <Arrow $placement={placement} $tooltipColor={color} data-testid="tooltip-arrow" />}
            </TooltipContent>
        </TooltipContainer>
    );
};
