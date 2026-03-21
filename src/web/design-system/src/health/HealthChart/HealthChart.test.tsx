import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import HealthChart from './HealthChart';
// @ts-expect-error Module path resolved at runtime via jest.mock
// eslint-disable-next-line import/no-unresolved -- resolved at runtime via jest.mock
import { JourneyProvider } from '../../../mobile/src/context/JourneyContext';

const JOURNEY_IDS = { HEALTH: 'health', CARE: 'care', PLAN: 'plan' } as const;

// Mock health data for testing
const mockHealthData = [
    { date: '2023-01-01', value: 72, min: 60, max: 100 },
    { date: '2023-01-02', value: 75, min: 60, max: 100 },
    { date: '2023-01-03', value: 70, min: 60, max: 100 },
];

// Mock the chart components
jest.mock('../../charts/LineChart/LineChart', () => ({
    __esModule: true,
    default: jest.fn((props: any) => (
        <div
            data-testid="line-chart"
            data-journey={props.journey}
            aria-label={`Line chart for ${props.yAxisLabel || 'health metrics'}`}
        >
            <div data-testid="line-chart-data">{JSON.stringify(props.data)}</div>
            <div data-testid="line-chart-x-axis">{props.xAxisKey}</div>
            <div data-testid="line-chart-y-axis">{props.yAxisKey}</div>
            <div data-testid="line-chart-x-label">{props.xAxisLabel}</div>
            <div data-testid="line-chart-y-label">{props.yAxisLabel}</div>
            <div data-testid="line-chart-color">{props.lineColor}</div>
        </div>
    )),
}));

jest.mock('../../charts/BarChart/BarChart', () => ({
    __esModule: true,
    default: jest.fn((props: any) => (
        <div data-testid="bar-chart" data-journey={props.journey} aria-label={`Bar chart for ${props.title}`}>
            <div data-testid="bar-chart-data">{JSON.stringify(props.data)}</div>
            <div data-testid="bar-chart-labels">{JSON.stringify(props.labels)}</div>
            <div data-testid="bar-chart-title">{props.title}</div>
            <div data-testid="bar-chart-colors">{JSON.stringify(props.colors)}</div>
        </div>
    )),
}));

jest.mock('../../charts/RadialChart/RadialChart', () => ({
    __esModule: true,
    default: jest.fn((props: any) => (
        <div data-testid="radial-chart" data-journey={props.journey} aria-label="Radial chart showing health data">
            <div data-testid="radial-chart-data">{JSON.stringify(props.data)}</div>
            <div data-testid="radial-chart-label-type">{props.labelType}</div>
        </div>
    )),
}));

// Mock the useJourneyContext hook
/* eslint-disable @typescript-eslint/no-unsafe-return -- Mock factory returns untyped test double */
jest.mock('../../../mobile/src/context/JourneyContext', () => {
    const original = jest.requireActual('../../../mobile/src/context/JourneyContext');
    return {
        ...original,
        useJourneyContext: jest.fn().mockReturnValue({
            journey: 'health',
            setJourney: jest.fn(),
        }),
    };
});
/* eslint-enable @typescript-eslint/no-unsafe-return */

// Helper function to render a component with the JourneyProvider
const renderWithJourney = (ui: React.ReactElement, journeyId: string = JOURNEY_IDS.HEALTH) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- test helper with dynamic props
    return render(<JourneyProvider>{React.cloneElement(ui, { journey: journeyId } as any)}</JourneyProvider>);
};

describe('HealthChart', () => {
    it('renders with title and data', () => {
        renderWithJourney(
            <HealthChart
                type="line"
                data={mockHealthData}
                xAxisKey="date"
                yAxisKey="value"
                xAxisLabel="Date"
                yAxisLabel="Heart Rate (BPM)"
            />
        );

        // Check if the line chart is rendered with the correct data
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart-data')).toHaveTextContent(JSON.stringify(mockHealthData));
        expect(screen.getByTestId('line-chart-x-axis')).toHaveTextContent('date');
        expect(screen.getByTestId('line-chart-y-axis')).toHaveTextContent('value');
        expect(screen.getByTestId('line-chart-x-label')).toHaveTextContent('Date');
        expect(screen.getByTestId('line-chart-y-label')).toHaveTextContent('Heart Rate (BPM)');
    });

    it('applies correct theming based on journey', () => {
        renderWithJourney(<HealthChart type="line" data={mockHealthData} xAxisKey="date" yAxisKey="value" />, 'health');

        // Check if the correct journey is applied to the chart
        expect(screen.getByTestId('line-chart')).toHaveAttribute('data-journey', 'health');

        // Render with a different journey
        render(
            <JourneyProvider>
                <HealthChart type="line" data={mockHealthData} xAxisKey="date" yAxisKey="value" journey="care" />
            </JourneyProvider>
        );

        // Check if the journey was updated
        expect(screen.getByTestId('line-chart')).toHaveAttribute('data-journey', 'care');
    });

    it('displays the correct unit in the tooltip', () => {
        renderWithJourney(
            <HealthChart
                type="line"
                data={mockHealthData}
                xAxisKey="date"
                yAxisKey="value"
                xAxisLabel="Date"
                yAxisLabel="Heart Rate (BPM)"
            />
        );

        // Check if the chart receives the correct axis label that would be used in tooltips
        expect(screen.getByTestId('line-chart-y-label')).toHaveTextContent('Heart Rate (BPM)');
    });

    it('handles empty data gracefully', () => {
        renderWithJourney(
            <HealthChart
                type="line"
                data={[]}
                xAxisKey="date"
                yAxisKey="value"
                xAxisLabel="Date"
                yAxisLabel="Heart Rate"
            />
        );

        // When data is empty, there should be a message
        expect(screen.getByTestId('health-chart-empty')).toBeInTheDocument();
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders with accessible labels', () => {
        renderWithJourney(
            <HealthChart
                type="bar"
                data={mockHealthData}
                xAxisKey="date"
                yAxisKey="value"
                xAxisLabel="Date"
                yAxisLabel="Heart Rate"
            />
        );

        // Check if the chart has proper aria attributes
        const chart = screen.getByTestId('bar-chart');
        expect(chart).toHaveAttribute('aria-label', expect.stringContaining('Bar chart'));
    });

    it('renders bar chart correctly', () => {
        renderWithJourney(
            <HealthChart
                type="bar"
                data={mockHealthData}
                xAxisKey="date"
                yAxisKey="value"
                xAxisLabel="Date"
                yAxisLabel="Heart Rate"
            />
        );

        // Check if the bar chart is rendered
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

        // Verify that data is transformed correctly for bar chart
        const labels = JSON.parse(screen.getByTestId('bar-chart-labels').textContent || '[]');
        expect(labels).toEqual(['2023-01-01', '2023-01-02', '2023-01-03']);

        // Check that the title includes the axis labels
        expect(screen.getByTestId('bar-chart-title')).toHaveTextContent('Heart Rate by Date');
    });

    it('renders radial chart correctly', () => {
        renderWithJourney(<HealthChart type="radial" data={mockHealthData} xAxisKey="date" yAxisKey="value" />);

        // Check if the radial chart is rendered with percentage labels by default
        expect(screen.getByTestId('radial-chart')).toBeInTheDocument();
        expect(screen.getByTestId('radial-chart-label-type')).toHaveTextContent('percentage');

        // Verify that data is transformed correctly for radial chart (should have x and y properties)
        const chartData = JSON.parse(screen.getByTestId('radial-chart-data').textContent || '[]');
        expect(chartData[0]).toHaveProperty('x');
        expect(chartData[0]).toHaveProperty('y');
    });

    it('passes lineColor prop to line chart', () => {
        const customColor = '#FF0000';
        renderWithJourney(
            <HealthChart type="line" data={mockHealthData} xAxisKey="date" yAxisKey="value" lineColor={customColor} />
        );

        // Check if the custom color is passed to the chart
        expect(screen.getByTestId('line-chart-color')).toHaveTextContent(customColor);
    });
});
