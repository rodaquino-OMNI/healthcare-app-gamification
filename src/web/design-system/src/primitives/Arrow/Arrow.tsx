import React from 'react';
import styled from 'styled-components';

import { colors } from '../../tokens/colors';

/** Color presets for the Arrow component. */
type ArrowColor = 'brand' | 'gray' | 'white';

/** Cardinal direction the arrow points toward. */
type ArrowDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Props for the Arrow primitive.
 */
export interface ArrowProps {
    /** Direction the arrow points toward. @default 'down' */
    direction?: ArrowDirection;
    /** Color preset using design-system tokens. @default 'gray' */
    color?: ArrowColor;
    /** Size in pixels (width and height of the SVG). @default 24 */
    size?: number;
    /** Test identifier for testing frameworks. */
    testID?: string;
    /** Accessible label describing the arrow purpose. */
    accessibilityLabel?: string;
}

/** Map direction to rotation degrees (chevron path points down at 0deg). */
const ROTATION_MAP: Record<ArrowDirection, number> = {
    down: 0,
    up: 180,
    left: 90,
    right: -90,
};

/** Resolve a color preset to a hex token value. */
const resolveColor = (preset: ArrowColor): string => {
    switch (preset) {
        case 'brand':
            return colors.componentColors.brand;
        case 'white':
            return colors.neutral.white;
        case 'gray':
        default:
            return colors.gray[50];
    }
};

const StyledArrowWrapper = styled.span<{ $size: number; $rotation: number }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${(p) => p.$size}px;
    height: ${(p) => p.$size}px;
    line-height: 0;
    transform: rotate(${(p) => p.$rotation}deg);
`;

/**
 * Arrow primitive — renders a chevron/arrow SVG that can point in four
 * cardinal directions with color presets from the design-system tokens.
 *
 * @example
 * ```tsx
 * <Arrow direction="right" color="brand" size={20} />
 * ```
 */
export const Arrow: React.FC<ArrowProps> = ({
    direction = 'down',
    color = 'gray',
    size = 24,
    testID = 'arrow',
    accessibilityLabel,
}) => {
    const rotation = ROTATION_MAP[direction];
    const fill = resolveColor(color);

    return (
        <StyledArrowWrapper
            $size={size}
            $rotation={rotation}
            data-testid={testID}
            aria-hidden={!accessibilityLabel}
            aria-label={accessibilityLabel}
            role={accessibilityLabel ? 'img' : undefined}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none">
                <path d="M6 9l6 6 6-6" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </StyledArrowWrapper>
    );
};
