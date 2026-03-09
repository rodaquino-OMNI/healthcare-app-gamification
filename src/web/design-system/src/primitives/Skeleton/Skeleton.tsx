import React from 'react';

import { StyledSkeleton } from './Skeleton.styles';

/**
 * Props for the Skeleton component
 */
export interface SkeletonProps {
    /**
     * Width of the skeleton — CSS value or 'full' for 100%
     * @default '100%'
     */
    width?: string;

    /**
     * Height of the skeleton — CSS value
     * @default '16px'
     */
    height?: string;

    /**
     * Border radius — maps to borderRadius tokens or custom value
     * @default 'sm'
     */
    borderRadius?: string;

    /**
     * Whether the skeleton is animated with a pulse effect
     * @default true
     */
    animated?: boolean;

    /**
     * Visual variant of the skeleton
     * @default 'rectangular'
     */
    variant?: 'rectangular' | 'circular' | 'text';

    /**
     * Test ID for component testing
     */
    testID?: string;
}

/**
 * Skeleton component for displaying loading placeholders.
 * Provides a pulsing animation to indicate content is being loaded.
 *
 * @example
 * <Skeleton width="200px" height="20px" />
 *
 * @example
 * <Skeleton variant="circular" width="48px" height="48px" />
 *
 * @example
 * <Skeleton variant="text" width="80%" />
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = '16px',
    borderRadius = 'sm',
    animated = true,
    variant = 'rectangular',
    testID,
    ...rest
}) => {
    // Derive dimensions based on variant
    const resolvedWidth = variant === 'circular' ? width || height : width;
    const resolvedHeight = variant === 'text' ? '1em' : height;
    const resolvedBorderRadius = variant === 'circular' ? 'full' : borderRadius;

    return (
        <StyledSkeleton
            width={resolvedWidth}
            height={resolvedHeight}
            borderRadius={resolvedBorderRadius}
            animated={animated}
            data-testid={testID}
            aria-hidden="true"
            role="presentation"
            {...rest}
        />
    );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
