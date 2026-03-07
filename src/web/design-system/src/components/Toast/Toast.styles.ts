import styled from 'styled-components';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';
import { typography } from '../../tokens/typography';

// Define types for Toast variations
type ToastVariant = 'info' | 'success' | 'warning' | 'error';
type JourneyType = 'health' | 'care' | 'plan';
type ToastPosition = 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ToastContainerProps {
    variant?: ToastVariant;
    journey?: JourneyType;
    position?: ToastPosition;
    visible?: boolean;
}

/**
 * Get background color based on variant and journey
 */
const getBackgroundColor = (variant: ToastVariant = 'info', journey?: JourneyType) => {
    // If journey is provided, use journey colors
    if (journey) {
        return colors.journeys[journey].background;
    }

    // Otherwise use semantic colors with lighter background
    switch (variant) {
        case 'success':
            return '#E6F7ED'; // Lighter shade of success
        case 'error':
            return '#FFEDEB'; // Lighter shade of error
        case 'warning':
            return '#FFF8E6'; // Lighter shade of warning
        case 'info':
        default:
            return '#E6F0FA'; // Lighter shade of info
    }
};

/**
 * Get border color based on variant and journey
 */
const getBorderColor = (variant: ToastVariant = 'info', journey?: JourneyType) => {
    // If journey is provided, use journey colors
    if (journey) {
        return colors.journeys[journey].primary;
    }

    // Otherwise, use semantic colors
    switch (variant) {
        case 'success':
            return colors.semantic.success;
        case 'error':
            return colors.semantic.error;
        case 'warning':
            return colors.semantic.warning;
        case 'info':
        default:
            return colors.semantic.info;
    }
};

/**
 * Get position styles based on position prop
 */
const getPositionStyles = (position: ToastPosition = 'bottom') => {
    switch (position) {
        case 'top':
            return `
        top: ${spacing.lg};
        left: 50%;
        transform: translateX(-50%);
      `;
        case 'top-left':
            return `
        top: ${spacing.lg};
        left: ${spacing.lg};
      `;
        case 'top-right':
            return `
        top: ${spacing.lg};
        right: ${spacing.lg};
      `;
        case 'bottom-left':
            return `
        bottom: ${spacing.lg};
        left: ${spacing.lg};
      `;
        case 'bottom-right':
            return `
        bottom: ${spacing.lg};
        right: ${spacing.lg};
      `;
        case 'bottom':
        default:
            return `
        bottom: ${spacing.lg};
        left: 50%;
        transform: translateX(-50%);
      `;
    }
};

/**
 * Get animation styles based on position and visibility
 */
const getAnimationStyles = (position: ToastPosition = 'bottom', visible: boolean = false) => {
    // Determine the initial transform direction based on position
    const yDirection = position.startsWith('top') ? '-20px' : '20px';

    // If not visible, apply the translate transform
    if (!visible) {
        // For positions that are centered, preserve the X transform
        if (position === 'top' || position === 'bottom') {
            return `
        opacity: 0;
        transform: translateX(-50%) translateY(${yDirection});
      `;
        }

        return `
      opacity: 0;
      transform: translateY(${yDirection});
    `;
    }

    // If visible, maintain the centered position if applicable
    if (position === 'top' || position === 'bottom') {
        return `
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    `;
    }

    return `
    opacity: 1;
    transform: translateY(0);
  `;
};

/**
 * ToastContainer - A styled container for toast notifications
 * Supports variants (info, success, warning, error), journeys, and positioning
 */
export const ToastContainer = styled.div<ToastContainerProps>`
    position: fixed;
    ${(props) => getPositionStyles(props.position)}
    display: flex;
    align-items: center;
    min-width: 320px;
    max-width: 500px;
    padding: ${spacing.md};
    background-color: ${(props) => getBackgroundColor(props.variant, props.journey)};
    border-left: 4px solid ${(props) => getBorderColor(props.variant, props.journey)};
    border-radius: 4px;
    box-shadow: ${shadows.md};
    z-index: 1000;
    ${(props) => getAnimationStyles(props.position, props.visible)}
    transition: opacity 0.3s ease, transform 0.3s ease;
`;

interface ToastMessageProps {
    variant?: ToastVariant;
    journey?: JourneyType;
}

/**
 * ToastMessage - A styled paragraph for toast content
 * Adapts text styling based on variant and journey
 */
export const ToastMessage = styled.p<ToastMessageProps>`
    font-family: ${typography.fontFamily.base};
    font-size: ${typography.fontSize.md};
    font-weight: ${typography.fontWeight.regular};
    line-height: ${typography.lineHeight.base};
    color: ${(props) => (props.journey ? colors.journeys[props.journey].text : colors.neutral.gray900)};
    margin: 0;
`;
