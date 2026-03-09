import styled from 'styled-components';

import { colors } from '../../tokens/colors';
import { spacing as spacingTokens } from '../../tokens/spacing';

interface StyledDividerProps {
    orientation?: 'horizontal' | 'vertical';
    thickness?: '1px' | '2px';
    color?: string;
    spacing?: string;
    journey?: 'health' | 'care' | 'plan';
}

/**
 * Resolves the divider color from props
 */
const getDividerColor = (props: StyledDividerProps): string => {
    if (props.color) {
        return props.color;
    }
    if (props.journey) {
        return colors.journeys[props.journey].primary;
    }
    return colors.gray[20]; // Default border color
};

/**
 * Resolves spacing token to actual value
 */
const getSpacing = (space?: string): string => {
    if (!space) {
        return '0';
    }
    if (space in spacingTokens) {
        return spacingTokens[space as keyof typeof spacingTokens];
    }
    return space;
};

/**
 * Styled component for the Divider primitive
 */
export const StyledDivider = styled.div<StyledDividerProps>`
    /* Reset */
    border: none;
    flex-shrink: 0;

    /* Color */
    background-color: ${(props) => getDividerColor(props)};

    /* Orientation-specific sizing */
    ${(props) =>
        props.orientation === 'vertical'
            ? `
    width: ${props.thickness || '1px'};
    height: 100%;
    align-self: stretch;
    margin-left: ${getSpacing(props.spacing)};
    margin-right: ${getSpacing(props.spacing)};
  `
            : `
    width: 100%;
    height: ${props.thickness || '1px'};
    margin-top: ${getSpacing(props.spacing)};
    margin-bottom: ${getSpacing(props.spacing)};
  `}
`;
