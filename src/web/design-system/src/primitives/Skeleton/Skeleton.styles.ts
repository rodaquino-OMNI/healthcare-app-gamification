import styled, { keyframes, css } from 'styled-components';

import { animation } from '../../tokens/animation';
import { borderRadius as borderRadiusTokens } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';

interface StyledSkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    animated?: boolean;
}

/**
 * Pulse animation keyframes for the skeleton loading effect
 */
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

/**
 * Resolves borderRadius from tokens or passes through custom values
 */
const resolveBorderRadius = (radius?: string): string => {
    if (!radius) {
        return borderRadiusTokens.sm;
    }
    if (radius in borderRadiusTokens) {
        return borderRadiusTokens[radius as keyof typeof borderRadiusTokens];
    }
    return radius;
};

/**
 * Styled component for the Skeleton loading placeholder
 */
export const StyledSkeleton = styled.div<StyledSkeletonProps>`
    /* Dimensions */
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '16px'};

    /* Visual */
    background-color: ${colors.gray[10]};
    border-radius: ${(props) => resolveBorderRadius(props.borderRadius)};

    /* Animation */
    ${(props) =>
        props.animated &&
        css`
            animation: ${pulse} ${animation.duration.slow} ${animation.easing.easeInOut} infinite;
        `}

    /* Prevent content */
  overflow: hidden;
    display: block;
`;
