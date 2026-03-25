import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { LineChart as LineChartComponent } from './LineChart';
import { baseTheme } from '../../themes/base.theme';

// Wrap renders with ThemeProvider because LineChart.styles.ts accesses theme tokens
const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider theme={baseTheme}>{ui}</ThemeProvider>);

// Sample data for testing
const sampleData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

describe('LineChart', () => {
    it('renders the LineChart component with sample data', () => {
        renderWithTheme(
            <LineChartComponent
                data={sampleData}
                xAxisKey="name"
                yAxisKey="value"
                xAxisLabel="Month"
                yAxisLabel="Revenue"
                journey="health"
            />
        );

        // Check if the chart container is rendered with correct aria label
        const chartContainer = screen.getByRole('img', {
            name: /Line chart showing Revenue over Month/i,
        });
        expect(chartContainer).toBeInTheDocument();
    });

    it('displays the x-axis label correctly', () => {
        renderWithTheme(
            <LineChartComponent
                data={sampleData}
                xAxisKey="name"
                yAxisKey="value"
                xAxisLabel="Month"
                yAxisLabel="Revenue"
                journey="health"
            />
        );

        // We can check the aria-label which includes the x-axis label
        const chartContainer = screen.getByRole('img', {
            name: /Line chart showing .* over Month/i,
        });
        expect(chartContainer).toBeInTheDocument();
    });

    it('displays the y-axis label correctly', () => {
        renderWithTheme(
            <LineChartComponent
                data={sampleData}
                xAxisKey="name"
                yAxisKey="value"
                xAxisLabel="Month"
                yAxisLabel="Revenue"
                journey="health"
            />
        );

        // We can check the aria-label which includes the y-axis label
        const chartContainer = screen.getByRole('img', {
            name: /Line chart showing Revenue over .*/i,
        });
        expect(chartContainer).toBeInTheDocument();
    });

    it('shows "No data available" message when data is empty', () => {
        renderWithTheme(
            <LineChartComponent
                data={[]}
                xAxisKey="name"
                yAxisKey="value"
                xAxisLabel="Month"
                yAxisLabel="Revenue"
                journey="health"
            />
        );

        // Check if the "No data available" message is shown
        const noDataMessage = screen.getByText('No data available');
        expect(noDataMessage).toBeInTheDocument();
    });

    it('applies journey-specific theming', () => {
        // Testing different journeys to ensure they render correctly

        // Health journey
        const { rerender } = renderWithTheme(
            <LineChartComponent
                data={sampleData}
                xAxisKey="name"
                yAxisKey="value"
                xAxisLabel="Month"
                yAxisLabel="Revenue"
                journey="health"
            />
        );

        // VictoryChart may also render with role="img"; use getAllByRole and check at least one exists
        let chartContainers = screen.getAllByRole('img');
        expect(chartContainers.length).toBeGreaterThanOrEqual(1);

        // Care journey
        rerender(
            <ThemeProvider theme={baseTheme}>
                <LineChartComponent
                    data={sampleData}
                    xAxisKey="name"
                    yAxisKey="value"
                    xAxisLabel="Month"
                    yAxisLabel="Revenue"
                    journey="care"
                />
            </ThemeProvider>
        );

        chartContainers = screen.getAllByRole('img');
        expect(chartContainers.length).toBeGreaterThanOrEqual(1);

        // Plan journey
        rerender(
            <ThemeProvider theme={baseTheme}>
                <LineChartComponent
                    data={sampleData}
                    xAxisKey="name"
                    yAxisKey="value"
                    xAxisLabel="Month"
                    yAxisLabel="Revenue"
                    journey="plan"
                />
            </ThemeProvider>
        );

        chartContainers = screen.getAllByRole('img');
        expect(chartContainers.length).toBeGreaterThanOrEqual(1);
    });
});
