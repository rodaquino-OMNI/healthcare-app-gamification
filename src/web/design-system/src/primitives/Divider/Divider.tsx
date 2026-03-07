import React from 'react';
import { StyledDivider } from './Divider.styles';

/**
 * Props for the Divider component
 */
export interface DividerProps {
    /**
     * Orientation of the divider
     * @default 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical';

    /**
     * Thickness of the divider line
     * @default '1px'
     */
    thickness?: '1px' | '2px';

    /**
     * Color of the divider — uses colors.gray[20] by default (border color)
     */
    color?: string;

    /**
     * Spacing around the divider — maps to spacing tokens
     */
    spacing?: string;

    /**
     * Journey context for theming
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * Test ID for component testing
     */
    testID?: string;
}

/**
 * Divider component for visually separating content sections.
 * Supports horizontal and vertical orientations with configurable thickness and color.
 *
 * @example
 * <Divider />
 *
 * @example
 * <Divider orientation="vertical" thickness="2px" />
 *
 * @example
 * <Divider journey="health" spacing="md" />
 */
export const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    thickness = '1px',
    color,
    spacing: spacingProp,
    journey,
    testID,
    ...rest
}) => {
    return (
        <StyledDivider
            orientation={orientation}
            thickness={thickness}
            color={color}
            spacing={spacingProp}
            journey={journey}
            data-testid={testID}
            role="separator"
            aria-orientation={orientation}
            {...rest}
        />
    );
};

Divider.displayName = 'Divider';

export default Divider;
