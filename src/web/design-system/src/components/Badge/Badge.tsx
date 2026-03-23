import React from 'react';
import styled from 'styled-components';

import { Icon } from '../../primitives/Icon/Icon';
import { Touchable } from '../../primitives/Touchable/Touchable';
import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

/**
 * Props interface for the Badge component
 */
export interface BadgeProps {
    /**
     * The size of the badge.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Whether the badge is unlocked.
     * @default false
     */
    unlocked?: boolean;

    /**
     * The journey to which the badge belongs (health, care, or plan).
     * @default 'health'
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * The content of the badge.
     */
    children?: React.ReactNode;

    /**
     * Function called when the badge is pressed
     */
    onPress?: () => void;

    /**
     * Accessibility label for screen readers
     */
    accessibilityLabel?: string;

    /**
     * Test ID for testing purposes
     */
    testID?: string;

    /**
     * Status indicator type for status badge variant.
     * Maps to semantic colors (success, warning, error, info, neutral).
     */
    status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';

    /**
     * When true, renders as a small dot indicator instead of a label badge.
     * Only applicable when variant is 'status'.
     * @default false
     */
    dot?: boolean;

    /**
     * Badge variant type.
     * - 'achievement': The original achievement badge (default for backward compatibility)
     * - 'status': A status indicator badge using semantic colors
     * @default 'achievement'
     */
    variant?: 'achievement' | 'status';

    /**
     * Figma display type for the badge content.
     * - 'dot': Renders a small colored circle indicator
     * - 'icon': Renders with a status icon glyph and optional children text
     * - 'text': Renders with text label (default behavior)
     * When provided, takes precedence over the `dot` prop.
     */
    type?: 'dot' | 'icon' | 'text';
}

/**
 * Determines the size of the badge based on the provided size prop.
 * @param size The size of the badge: 'sm', 'md', or 'lg'
 * @returns The size of the badge in pixels.
 */
export function getBadgeSize(size: 'sm' | 'md' | 'lg'): number {
    switch (size) {
        case 'sm':
            return 24;
        case 'md':
            return 32;
        case 'lg':
            return 40;
        default:
            return 32;
    }
}

/**
 * Container for the achievement badge.
 * Handles sizing, styling, and appearance based on unlocked state and journey.
 */
export const BadgeContainer = styled(Touchable)<{
    size: 'sm' | 'md' | 'lg';
    unlocked: boolean;
    journey: string;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${(props) => props.theme.borderRadius.md};
    padding: ${(props) => props.theme.spacing.sm};
    background-color: ${(props) =>
        props.unlocked
            ? colors.journeys[props.journey as keyof typeof colors.journeys].primary
            : colors.neutral.gray200};
    color: ${(props) => (props.unlocked ? colors.neutral.white : colors.neutral.gray700)};
`;

/**
 * Icon component for the achievement badge.
 * Displays the achievement icon with appropriate color and size.
 */
export const BadgeIcon = styled(Icon)<{
    color: string;
    size: number;
}>`
    margin-right: ${(props) => props.theme.spacing.xs};
`;

/**
 * Returns the appropriate semantic color for a given status.
 */
const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral'): string => {
    switch (status) {
        case 'success':
            return colors.semantic.success;
        case 'warning':
            return colors.semantic.warning;
        case 'error':
            return colors.semantic.error;
        case 'info':
            return colors.semantic.info;
        case 'neutral':
            return colors.neutral.gray500;
        default:
            return colors.neutral.gray500;
    }
};

/**
 * Returns the appropriate semantic background color for a given status.
 */
const getStatusBgColor = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral'): string => {
    switch (status) {
        case 'success':
            return colors.semantic.successBg;
        case 'warning':
            return colors.semantic.warningBg;
        case 'error':
            return colors.semantic.errorBg;
        case 'info':
            return colors.semantic.infoBg;
        case 'neutral':
            return colors.neutral.gray200;
        default:
            return colors.neutral.gray200;
    }
};

/**
 * Status badge styled component for the 'status' variant.
 * Renders as a dot indicator or label badge with semantic colors.
 */
export const StatusBadge = styled.span<{
    status: string;
    dot: boolean;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${(props) => (props.dot ? borderRadius.full : borderRadius.sm)};
    width: ${(props) => (props.dot ? sizing.component['2xs'] : 'auto')};
    height: ${(props) => (props.dot ? sizing.component['2xs'] : 'auto')};
    min-width: ${(props) => (props.dot ? 'auto' : sizing.component['2xs'])};
    padding: ${(props) => (props.dot ? '0' : `${spacing['3xs']} ${spacing.xs}`)};
    background-color: ${(props) =>
        props.dot
            ? getStatusColor(props.status as 'success' | 'warning' | 'error' | 'info' | 'neutral')
            : getStatusBgColor(props.status as 'success' | 'warning' | 'error' | 'info' | 'neutral')};
    color: ${(props) => getStatusColor(props.status as 'success' | 'warning' | 'error' | 'info' | 'neutral')};
    font-family: ${typography.fontFamily.base};
    font-size: ${typography.fontSize.xs};
    font-weight: ${typography.fontWeight.medium};
    line-height: ${typography.lineHeight.base};
`;

/**
 * A versatile Badge component for displaying status, notifications, or achievements.
 * It supports different sizes, styles, and theming based on the AUSTA SuperApp's design system.
 */
/**
 * Returns a status icon glyph matching the Toast component pattern.
 */
const getStatusIcon = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral'): string => {
    switch (status) {
        case 'success':
            return '\u2713'; // checkmark
        case 'error':
            return '\u2717'; // ballot x
        case 'warning':
            return '\u26A0'; // warning sign
        case 'info':
            return '\u2139'; // info symbol
        case 'neutral':
        default:
            return '\u2014'; // em dash
    }
};

export const Badge: React.FC<BadgeProps> = ({
    size = 'md',
    unlocked = false,
    journey = 'health',
    children,
    onPress,
    accessibilityLabel,
    testID,
    status,
    dot = false,
    variant = 'achievement',
    type,
}) => {
    getBadgeSize(size);

    // Determine effective dot state: type prop takes precedence over dot prop
    const isDot = type === 'dot' || (type === undefined && dot);

    // Render status variant when explicitly set
    if (variant === 'status' && status) {
        const showIcon = type === 'icon';

        return (
            <StatusBadge
                status={status}
                dot={isDot}
                data-testid={testID}
                aria-label={accessibilityLabel || `${status} status`}
            >
                {!isDot && showIcon && (
                    <span aria-hidden="true" style={{ marginRight: spacing['3xs'] }}>
                        {getStatusIcon(status)}
                    </span>
                )}
                {!isDot && children}
            </StatusBadge>
        );
    }

    // Default: render the original achievement badge
    return (
        <BadgeContainer
            size={size}
            unlocked={unlocked}
            journey={journey}
            onPress={onPress}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole={onPress ? 'button' : undefined}
            testID={testID}
        >
            {children}
        </BadgeContainer>
    );
};
