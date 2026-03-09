import styled from 'styled-components';

import { typography, colors, mediaQueries } from '../../tokens';

/**
 * Defines the props interface for the StyledText component
 */
export interface TextStyleProps {
    /**
     * Font family for the text
     */
    fontFamily?: string;

    /**
     * Font weight for the text
     */
    fontWeight?: number;

    /**
     * Font size for the text
     */
    fontSize?: string;

    /**
     * Line height for the text
     */
    lineHeight?: number;

    /**
     * Letter spacing for the text
     */
    letterSpacing?: string;

    /**
     * Text color
     * Can be a direct color value or 'journey' to use journey-specific primary color
     * Can also be 'journey.secondary', 'journey.accent', etc. to use specific journey colors
     */
    color?: string;

    /**
     * Text alignment
     */
    align?: string;

    /**
     * Journey context for theming
     * Corresponds to 'health', 'care', or 'plan'
     */
    journey?: string;

    /**
     * Whether to truncate text with ellipsis
     */
    truncate?: boolean;

    /**
     * Whether to apply responsive font sizing
     */
    responsive?: boolean;

    /**
     * Typography variant for predefined configurations
     */
    variant?: 'display' | 'heading' | 'body' | 'caption';
}

/**
 * Helper function to calculate responsive font sizes based on breakpoint
 * @param size Original font size with unit
 * @param breakpoint Breakpoint name (sm, md, lg)
 * @returns Calculated size with unit
 */
const calculateResponsiveSize = (size: string, breakpoint: string): string => {
    // Extract numeric value and unit
    const matches = size.match(/^([\d.]+)(\w+)$/);
    if (!matches) {
        return size;
    }

    const [, valueStr, unit] = matches;
    const value = parseFloat(valueStr);

    // Apply scaling factor based on breakpoint
    let scaleFactor = 1;
    switch (breakpoint) {
        case 'sm':
            scaleFactor = 1;
            break;
        case 'md':
            scaleFactor = 1.125; // 12.5% larger on tablets
            break;
        case 'lg':
            scaleFactor = 1.25; // 25% larger on desktops
            break;
        default:
            scaleFactor = 1;
    }

    // Return new size with original unit
    return `${(value * scaleFactor).toFixed(2)}${unit}`;
};

/**
 * Variant presets for consistent typography styles
 */
const variantStyles = {
    display: {
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.fontSize['display-lg'],
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        letterSpacing: typography.letterSpacing.tight,
    },
    heading: {
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.fontSize['heading-xl'],
        fontWeight: typography.fontWeight.semiBold,
        lineHeight: typography.lineHeight.heading,
        letterSpacing: typography.letterSpacing.tight,
    },
    body: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize['text-md'],
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.lineHeight.base,
        letterSpacing: typography.letterSpacing.normal,
    },
    caption: {
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize['text-xs'],
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.lineHeight.relaxed,
        letterSpacing: typography.letterSpacing.wide,
    },
} as const;

/**
 * Styled component for the Text primitive with configurable typography styling
 * This component provides all necessary typography styling with support for
 * journey-specific theming and accessibility features.
 */
export const StyledText = styled.span<TextStyleProps>`
    font-family: ${(props) =>
        props.variant ? variantStyles[props.variant].fontFamily : props.fontFamily || typography.fontFamily.body};
    font-weight: ${(props) =>
        props.variant ? variantStyles[props.variant].fontWeight : props.fontWeight || typography.fontWeight.regular};
    font-size: ${(props) =>
        props.variant ? variantStyles[props.variant].fontSize : props.fontSize || typography.fontSize.md};
    line-height: ${(props) =>
        props.variant ? variantStyles[props.variant].lineHeight : props.lineHeight || typography.lineHeight.base};
    letter-spacing: ${(props) =>
        props.variant
            ? variantStyles[props.variant].letterSpacing
            : props.letterSpacing || typography.letterSpacing.normal};

    color: ${(props) => {
        if (props.color && props.journey && props.journey in colors.journeys) {
            const journeyColors = colors.journeys[props.journey as keyof typeof colors.journeys];
            if (props.color === 'journey') {
                return journeyColors.primary;
            }
            if (props.color.startsWith('journey.')) {
                const journeyProperty = props.color.split('.')[1] as keyof typeof journeyColors;
                return journeyColors[journeyProperty] || colors.neutral.gray900;
            }
        }
        return props.color || colors.neutral.gray900;
    }};

    text-align: ${(props) => props.align || 'left'};

    ${(props) =>
        props.truncate &&
        `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}

    ${(props) =>
        props.responsive &&
        `
    @media ${mediaQueries.sm} {
      font-size: ${props.fontSize ? calculateResponsiveSize(props.fontSize, 'sm') : typography.fontSize.md};
    }
    @media ${mediaQueries.md} {
      font-size: ${props.fontSize ? calculateResponsiveSize(props.fontSize, 'md') : typography.fontSize.md};
    }
    @media ${mediaQueries.lg} {
      font-size: ${props.fontSize ? calculateResponsiveSize(props.fontSize, 'lg') : typography.fontSize.lg};
    }
  `}
`;
