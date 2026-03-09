import styled, { type ThemeType } from 'styled-components';

export const ChartContainer = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }: { theme: ThemeType }) => theme.colors.neutral.white};
    border-radius: ${({ theme }: { theme: ThemeType }) => theme.borderRadius.md};
    box-shadow: ${({ theme }: { theme: ThemeType }) => theme.shadows.sm};
    padding: ${({ theme }: { theme: ThemeType }) => theme.spacing.md};
    margin-bottom: ${({ theme }: { theme: ThemeType }) => theme.spacing.md};
    overflow: hidden;

    @media (min-width: ${({ theme }: { theme: ThemeType }) => theme.breakpoints?.md ?? '992px'}) {
        padding: ${({ theme }: { theme: ThemeType }) => theme.spacing.lg};
    }
`;

export const ChartWrapper = styled.div`
    width: 100%;
    height: 100%;
    min-height: 200px;
    position: relative;

    @media (min-width: ${({ theme }: { theme: ThemeType }) => theme.breakpoints?.md ?? '992px'}) {
        min-height: 250px;
    }

    @media (min-width: ${({ theme }: { theme: ThemeType }) => theme.breakpoints?.lg ?? '1200px'}) {
        min-height: 300px;
    }

    /* Ensure the SVG fills the container */
    svg {
        width: 100%;
        height: 100%;
    }

    /* Style for the chart lines */
    .chart-line {
        fill: none;
        stroke-width: 2;
        stroke-linejoin: round;
        stroke-linecap: round;
    }

    /* Style for the chart points */
    .chart-point {
        fill: ${({ theme }: { theme: ThemeType }) => theme.colors.neutral.white};
        stroke-width: 2;
        cursor: pointer;
        transition: r 0.2s ease;

        &:hover {
            r: 6;
        }
    }

    /* Style for the axes */
    .chart-axis {
        font-size: 12px;
        font-family: ${({ theme }: { theme: ThemeType }) => theme.typography.fontFamily.base};
        color: ${({ theme }: { theme: ThemeType }) => theme.colors.neutral.gray600};
    }

    /* Style for the grid lines */
    .chart-grid {
        stroke: ${({ theme }: { theme: ThemeType }) => theme.colors.neutral.gray200};
        stroke-dasharray: 4;
        stroke-width: 1;
    }
`;
