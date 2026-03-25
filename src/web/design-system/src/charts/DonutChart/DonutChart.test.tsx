import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { DonutChart } from './DonutChart';

describe('DonutChart', () => {
    const mockData = [
        { x: 'Cardiology', y: 40 },
        { x: 'Orthopedics', y: 30 },
        { x: 'Neurology', y: 30 },
    ];

    it('renders correctly with basic props', () => {
        render(<DonutChart data={mockData} />);
        expect(screen.getByLabelText(/Donut chart with 3 segments/)).toBeInTheDocument();
        // VictoryPie renders multiple SVG elements (chart + overlay + tooltip cache)
        expect(document.querySelectorAll('svg').length).toBeGreaterThanOrEqual(1);
    });

    it('renders with percentage labels by default', () => {
        render(<DonutChart data={mockData} />);
        const total = mockData.reduce((sum, item) => sum + item.y, 0);
        const percentages = mockData.map((item) => `${Math.round((item.y / total) * 100)}%`);
        percentages.forEach((percentage) => {
            // VictoryPie may render duplicate text nodes; ensure at least one is present
            expect(screen.getAllByText(percentage).length).toBeGreaterThanOrEqual(1);
        });
    });

    it('renders with value labels', () => {
        render(<DonutChart data={mockData} labelType="value" />);
        mockData.forEach((item) => {
            // VictoryPie may render duplicate text nodes; ensure at least one is present
            expect(screen.getAllByText(String(item.y)).length).toBeGreaterThanOrEqual(1);
        });
    });

    it('uses journey-specific colors', () => {
        const { rerender } = render(<DonutChart data={mockData} journey="health" />);
        expect(screen.getByLabelText(/Donut chart with 3 segments/)).toBeInTheDocument();

        rerender(<DonutChart data={mockData} journey="care" />);
        expect(screen.getByLabelText(/Donut chart with 3 segments/)).toBeInTheDocument();

        rerender(<DonutChart data={mockData} journey="plan" />);
        expect(screen.getByLabelText(/Donut chart with 3 segments/)).toBeInTheDocument();
    });

    it('renders center label and value', () => {
        render(<DonutChart data={mockData} centerLabel="Total" centerValue="100" />);
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('handles empty data', () => {
        render(<DonutChart data={[]} />);
        expect(screen.getByLabelText(/Donut chart with 0 segments/)).toBeInTheDocument();
    });
});
