import React from 'react';
import styled from 'styled-components';

import { getIcon, IconName } from './iconRegistry';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';

/**
 * Icon SVG source: strangeicons by Strange Helix (Figma plugin).
 * strangeicons is NOT available on npm — SVG paths are exported from
 * Figma and stored in iconRegistry.ts.
 * HUMAN-ACTION(AUSTA-NNN): Automate SVG export from Figma via scripts/export-figma-illustrations.mjs
 */

/**
 * Props for the Icon component
 */
export interface IconProps {
    /** The name of the icon to display (e.g., 'heart', 'calendar'). */
    name: IconName;
    /** The size of the icon — either a sizing.icon token key or a custom CSS value. */
    size?: string | number;
    /** The color of the icon, using a color token from the design system. */
    color?: string;
    /**
     * Whether the icon is interactive (clickable/tappable).
     * When true, aria-hidden defaults to false (icon is visible to screen readers).
     * When false (default), aria-hidden defaults to true.
     */
    interactive?: boolean;
    /** Whether the icon should be hidden from screen readers. Accepts boolean or string "true"/"false". */
    'aria-hidden'?: boolean | string;
    /** Accessible label for the icon (required when aria-hidden is false or interactive is true) */
    'aria-label'?: string;
}

/**
 * Resolves icon size from sizing.icon tokens or passes through custom values
 */
const resolveIconSize = (size: string | number): string => {
    if (typeof size === 'number') {
        return `${size}px`;
    }
    if (size in sizing.icon) {
        return sizing.icon[size as keyof typeof sizing.icon];
    }
    return String(size);
};

/**
 * Styled container for the SVG icon
 */
const StyledIconWrapper = styled.span<{ size?: string | number; color?: string }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => resolveIconSize(props.size || 'md')};
    height: ${(props) => resolveIconSize(props.size || 'md')};
    color: ${(props) => props.color || colors.neutral.gray700};
    font-size: ${(props) => resolveIconSize(props.size || 'md')};
    line-height: 0;
`;

/**
 * Icon component that renders an SVG icon based on the provided name.
 * Provides consistent styling and accessibility across the application.
 *
 * @example
 * ```tsx
 * <Icon name="heart" size="24px" color={colors.journeys.health.primary} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
    name,
    size = 'md',
    color,
    interactive = false,
    'aria-hidden': ariaHiddenProp,
    'aria-label': ariaLabel,
    ...props
}) => {
    const icon = getIcon(name);

    if (!icon) {
        console.warn(`Icon with name "${name}" not found in icon registry`);
        return null;
    }

    // When interactive, default aria-hidden to false so screen readers announce the icon.
    // Explicit aria-hidden prop always takes precedence.
    const resolvedAriaHidden = ariaHiddenProp !== undefined ? ariaHiddenProp : !interactive;
    const ariaHiddenBool = resolvedAriaHidden !== false && resolvedAriaHidden !== 'false';

    // If the icon isn't hidden from screen readers, it needs an aria-label
    if (!ariaHiddenBool && !ariaLabel) {
        console.warn('Icon requires an aria-label when aria-hidden is false');
    }

    return (
        <StyledIconWrapper
            size={size}
            color={color}
            aria-hidden={ariaHiddenBool}
            data-testid="icon-container"
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={icon.viewBox || '0 0 24 24'}
                width="100%"
                height="100%"
                fill="currentColor"
                role={ariaHiddenBool ? undefined : 'img'}
                aria-label={ariaHiddenBool ? undefined : ariaLabel}
            >
                <path d={icon.path} />
            </svg>
        </StyledIconWrapper>
    );
};

// ---------------------------------------------------------------------------
// FigmaIconContainer — Figma variant-aligned icon wrapper
// ---------------------------------------------------------------------------

/** Figma-aligned icon container sizes */
export type FigmaIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Figma-aligned semantic color categories */
export type FigmaIconColor = 'brand' | 'destructive' | 'gray' | 'success' | 'warning';

/** Figma-aligned icon container visual style */
export type FigmaIconStyle = 'primary' | 'secondary' | 'outlined' | 'noFill';

/**
 * Props for the FigmaIconContainer component.
 * Maps 1:1 to the Figma icon container variant properties.
 */
export interface FigmaIconContainerProps {
    /** Container size: xs(16) sm(20) md(24) lg(32) xl(40) 2xl(48) */
    size: FigmaIconSize;
    /** Semantic color category */
    color: FigmaIconColor;
    /** Visual style variant */
    style: FigmaIconStyle;
    /** Icon element(s) to render inside the container */
    children: React.ReactNode;
}

const FIGMA_SIZE_MAP: Record<FigmaIconSize, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
};

/**
 * Resolve the solid background color for a given semantic color.
 */
const resolveSolidColor = (c: FigmaIconColor): string => {
    switch (c) {
        case 'brand':
            return colors.brand.primary;
        case 'destructive':
            return colors.semantic.error;
        case 'gray':
            return colors.gray[50];
        case 'success':
            return colors.semantic.success;
        case 'warning':
            return colors.semantic.warning;
    }
};

/**
 * Resolve the tinted (15 % opacity) background color for the "secondary" style.
 */
const resolveTintedBg = (c: FigmaIconColor): string => {
    switch (c) {
        case 'brand':
            return colors.brandPalette[50];
        case 'destructive':
            return colors.semantic.errorBg;
        case 'gray':
            return colors.gray[10];
        case 'success':
            return colors.semantic.successBg;
        case 'warning':
            return colors.semantic.warningBg;
    }
};

interface StyledFigmaContainerCssProps {
    $size: number;
    $bgColor: string;
    $iconColor: string;
    $borderColor: string;
}

const StyledFigmaContainer = styled.span<StyledFigmaContainerCssProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${(p) => p.$size}px;
    height: ${(p) => p.$size}px;
    border-radius: ${(p) => Math.round(p.$size * 0.25)}px;
    background-color: ${(p) => p.$bgColor};
    color: ${(p) => p.$iconColor};
    border: ${(p) => (p.$borderColor ? `1px solid ${p.$borderColor}` : 'none')};
    line-height: 0;
`;

/**
 * FigmaIconContainer wraps an Icon (or any SVG child) with the visual
 * container defined in the Figma design system.
 *
 * The four style variants are:
 * - **primary** — solid background, white icon
 * - **secondary** — tinted background (15 %), colored icon
 * - **outlined** — transparent background, 1 px border, colored icon
 * - **noFill** — transparent background, no border, colored icon
 *
 * @example
 * ```tsx
 * <FigmaIconContainer size="lg" color="brand" style="primary">
 *   <Icon name="heart" size={20} color="white" />
 * </FigmaIconContainer>
 * ```
 */
export const FigmaIconContainer: React.FC<FigmaIconContainerProps> = ({
    size,
    color: colorProp,
    style: styleProp,
    children,
}) => {
    const pxSize = FIGMA_SIZE_MAP[size];
    const solidColor = resolveSolidColor(colorProp);

    let bgColor = 'transparent';
    let iconColor = solidColor;
    let borderColor = '';

    switch (styleProp) {
        case 'primary':
            bgColor = solidColor;
            iconColor = colors.neutral.white;
            break;
        case 'secondary':
            bgColor = resolveTintedBg(colorProp);
            iconColor = solidColor;
            break;
        case 'outlined':
            bgColor = 'transparent';
            iconColor = solidColor;
            borderColor = solidColor;
            break;
        case 'noFill':
            bgColor = 'transparent';
            iconColor = solidColor;
            break;
    }

    return (
        <StyledFigmaContainer
            $size={pxSize}
            $bgColor={bgColor}
            $iconColor={iconColor}
            $borderColor={borderColor}
            data-testid="figma-icon-container"
        >
            {children}
        </StyledFigmaContainer>
    );
};
