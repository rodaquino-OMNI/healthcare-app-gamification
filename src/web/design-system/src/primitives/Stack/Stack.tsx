import React from 'react';

import { StackContainer } from './Stack.styles';

/**
 * Props for the Stack component
 * Defines how items should be arranged in the stack
 */
export interface StackProps {
    /**
     * Direction of the stack - vertical (column) or horizontal (row)
     * Can be responsive with different values at different breakpoints
     */
    direction?: 'column' | 'row' | { [breakpoint: string]: 'column' | 'row' };

    /**
     * Spacing between items in the stack
     * Can be a token (xs, sm, md, lg, xl, 2xl, 3xl, 4xl) or a specific value
     * Can be responsive with different values at different breakpoints
     */
    spacing?: string | number | { [breakpoint: string]: string | number };

    /**
     * Whether items should wrap to the next line when there's not enough space
     * Can be responsive with different values at different breakpoints
     */
    wrap?: boolean | { [breakpoint: string]: boolean };

    /**
     * Alignment of items in the stack
     * Can be responsive with different values at different breakpoints
     */
    align?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'stretch'
        | 'baseline'
        | { [breakpoint: string]: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' };

    /**
     * Padding around the stack content
     * Can be a spacing token (xs, sm, md, lg, xl, 2xl) or a specific value
     */
    padding?: string | number | { [breakpoint: string]: string | number };

    /**
     * Test ID for component testing
     */
    testID?: string;
}

/**
 * Stack component
 *
 * A primitive layout component that arranges its children in a vertical or horizontal stack
 * with configurable spacing between items. It provides a flexible way to create consistent
 * layouts throughout the application.
 *
 * @example
 * // Vertical stack with medium spacing
 * <Stack spacing="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 *
 * @example
 * // Horizontal stack with responsive spacing
 * <Stack direction="row" spacing={{ xs: "sm", md: "lg" }} align="center">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ direction = 'column', spacing, wrap, align, padding, testID, children, ...rest }, ref) => {
        // Resolve responsive values to simple values for StackContainer
        const resolvedDirection = typeof direction === 'object' ? 'column' : direction;
        const resolvedSpacing = typeof spacing === 'object' ? undefined : spacing;
        const resolvedWrap = typeof wrap === 'object' ? false : wrap;
        const resolvedAlign = typeof align === 'object' ? 'stretch' : align;
        // Resolve responsive padding to a simple string for Box
        const resolvedPadding =
            typeof padding === 'object' ? undefined : padding !== undefined ? String(padding) : undefined;

        return (
            <StackContainer
                ref={ref}
                direction={resolvedDirection}
                spacing={resolvedSpacing}
                wrap={resolvedWrap}
                align={resolvedAlign}
                padding={resolvedPadding}
                data-testid={testID}
                {...rest}
            >
                {children}
            </StackContainer>
        );
    }
);

// Set display name for better debugging
Stack.displayName = 'Stack';
