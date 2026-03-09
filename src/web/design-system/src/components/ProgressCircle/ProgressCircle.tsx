import React from 'react';

import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';

export interface ProgressCircleProps {
    /**
     * Progress value (0-100)
     */
    progress: number;

    /**
     * Color of the progress indicator
     * Can be a design system color token or a CSS color value
     */
    color?: string;

    /**
     * Size of the circle
     * Can be a design system size token or a CSS size value
     */
    size?: string;

    /**
     * Whether to show the progress value label
     */
    showLabel?: boolean;

    /**
     * Journey context for theming
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * Accessibility label
     */
    ariaLabel?: string;

    /**
     * Predefined size preset mapped to sizing tokens
     * 'sm' = 32px, 'md' = 48px, 'lg' = 64px
     * When provided, overrides the `size` prop
     */
    sizePreset?: 'sm' | 'md' | 'lg';
}

/**
 * ProgressCircle is a component that displays progress as a circle.
 * It can be used to show completion percentage of tasks, goals, or other progress indicators.
 *
 * @example
 * // Basic usage
 * <ProgressCircle progress={75} />
 *
 * @example
 * // With journey-specific theming
 * <ProgressCircle progress={50} journey="health" />
 *
 * @example
 * // With custom color and size
 * <ProgressCircle progress={50} color="journeys.health.primary" size="lg" />
 *
 * @example
 * // With progress label
 * <ProgressCircle progress={85} showLabel={true} />
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
    progress,
    color,
    size = '64px',
    showLabel = false,
    journey,
    ariaLabel,
    sizePreset,
}) => {
    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.max(0, Math.min(100, progress));

    // Resolve size from preset if provided, otherwise use the size prop
    const resolvedSize = sizePreset ? sizing.component[sizePreset] : size;

    // Resolve color to an actual hex value instead of a token path string
    const getProgressColor = (): string => {
        if (color) {
            return color;
        }
        if (journey && colors.journeys[journey]) {
            return colors.journeys[journey].primary;
        }
        return colors.brand.primary;
    };
    const progressColor = getProgressColor();

    // Calculate SVG parameters
    const viewBoxSize = 36; // viewBox size
    const strokeWidth = 3.6; // 10% of viewBoxSize
    const radius = (viewBoxSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

    // Center position for the circle
    const center = viewBoxSize / 2;

    return (
        <Box
            position="relative"
            width={resolvedSize}
            height={resolvedSize}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            journey={journey}
            aria-valuenow={normalizedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel || `${normalizedProgress}% complete`}
            role="progressbar"
        >
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* Background circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.gray[20]}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Progress circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>

            {showLabel && (
                <Box position="absolute" top="50%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
                    <Text fontSize="sm" fontWeight="medium" journey={journey} aria-hidden="true">
                        {`${Math.round(normalizedProgress)}%`}
                    </Text>
                </Box>
            )}
        </Box>
    );
};
