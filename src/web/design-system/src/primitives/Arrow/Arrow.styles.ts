import styled from 'styled-components';

/**
 * Styled wrapper for the Arrow SVG.
 *
 * Accepts transient props ($size, $rotation) so they are not forwarded to the
 * DOM element.
 */
export const ArrowWrapper = styled.span<{ $size: number; $rotation: number }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${(p) => p.$size}px;
    height: ${(p) => p.$size}px;
    line-height: 0;
    transform: rotate(${(p) => p.$rotation}deg);
`;
