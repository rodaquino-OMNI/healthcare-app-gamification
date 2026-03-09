import React from 'react';

import { BoxContainer } from './Box.styles';
import { borderRadius as borderRadiusTokens } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { shadows } from '../../tokens/shadows';
import { sizing } from '../../tokens/sizing';
import { spacing } from '../../tokens/spacing';

/**
 * Props for the Box component, extending the BoxContainer props
 * with additional functionality like journey theming.
 */
export interface BoxProps extends React.ComponentPropsWithoutRef<typeof BoxContainer> {
    /**
     * Journey context for automatic theming
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * Component size from sizing tokens
     */
    size?: keyof typeof sizing.component;

    /**
     * React children
     */
    children?: React.ReactNode;
}

/**
 * Box is a versatile layout component that serves as a building block for UI components.
 * It provides extensive styling capabilities through props and supports journey-specific theming.
 *
 * The Box component resolves token values (like 'md', 'lg' for spacing or 'primary', 'secondary'
 * for colors) to their actual values defined in the design system tokens.
 *
 * @example
 * // Basic usage
 * <Box padding="md" backgroundColor="gray100">Content</Box>
 *
 * @example
 * // With journey theming
 * <Box journey="health">Health Journey Content</Box>
 *
 * @example
 * // With specific styles
 * <Box
 *   display="flex"
 *   flexDirection="column"
 *   padding="lg"
 *   boxShadow="md"
 *   borderRadius="lg"
 * >
 *   Styled Content
 * </Box>
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
    (
        {
            // Extract props that need special handling
            journey,
            backgroundColor,
            color,
            padding,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            margin,
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            boxShadow,
            borderRadius,
            size,
            children,
            ...rest
        },
        ref
    ) => {
        // Apply journey-specific background if specified
        let bgColor = backgroundColor;
        if (journey && !backgroundColor) {
            bgColor = colors.journeys[journey].background;
        }

        // Helper function to resolve token values to their actual values
        const resolveToken = (value: string | undefined, tokenMap: Record<string, unknown>): string | undefined => {
            if (!value) {
                return undefined;
            }
            const resolved = tokenMap[value];
            return typeof resolved === 'string' ? resolved : value;
        };

        // Resolve tokens for various properties
        const resolvedProps = {
            // Colors
            backgroundColor: bgColor ? resolveToken(bgColor, colors as Record<string, unknown>) : undefined,
            color: color ? resolveToken(color, colors as Record<string, unknown>) : undefined,

            // Spacing - padding
            padding: padding ? resolveToken(padding, spacing) : undefined,
            paddingTop: paddingTop ? resolveToken(paddingTop, spacing) : undefined,
            paddingRight: paddingRight ? resolveToken(paddingRight, spacing) : undefined,
            paddingBottom: paddingBottom ? resolveToken(paddingBottom, spacing) : undefined,
            paddingLeft: paddingLeft ? resolveToken(paddingLeft, spacing) : undefined,

            // Spacing - margin
            margin: margin ? resolveToken(margin, spacing) : undefined,
            marginTop: marginTop ? resolveToken(marginTop, spacing) : undefined,
            marginRight: marginRight ? resolveToken(marginRight, spacing) : undefined,
            marginBottom: marginBottom ? resolveToken(marginBottom, spacing) : undefined,
            marginLeft: marginLeft ? resolveToken(marginLeft, spacing) : undefined,

            // Visual properties
            boxShadow: boxShadow ? resolveToken(boxShadow, shadows) : undefined,
            borderRadius: borderRadius ? resolveToken(borderRadius, borderRadiusTokens) : undefined,

            // Sizing
            ...(size ? { width: sizing.component[size], height: sizing.component[size] } : {}),
        };

        return (
            <BoxContainer ref={ref} {...resolvedProps} {...rest}>
                {children}
            </BoxContainer>
        );
    }
);

// Set display name for better debugging
Box.displayName = 'Box';
