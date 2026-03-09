import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { BarChart } from './BarChart';

describe('BarChart', () => {
    const mockData = [10, 20, 15, 30];
    const mockLabels = ['Jan', 'Feb', 'Mar', 'Apr'];

    it('renders correctly with basic props', () => {
        render(<BarChart data={mockData} labels={mockLabels} colors={[]} journey="health" title="Monthly Activity" />);
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('displays the chart title', () => {
        render(<BarChart data={mockData} labels={mockLabels} colors={[]} journey="health" title="Monthly Activity" />);
        expect(screen.getByText('Monthly Activity')).toBeInTheDocument();
    });

    it('renders with different journey themes', () => {
        const { rerender } = render(
            <BarChart data={mockData} labels={mockLabels} colors={[]} journey="health" title="Test" />
        );
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

        rerender(<BarChart data={mockData} labels={mockLabels} colors={[]} journey="care" title="Test" />);
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

        rerender(<BarChart data={mockData} labels={mockLabels} colors={[]} journey="plan" title="Test" />);
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('provides accessible description', () => {
        render(<BarChart data={mockData} labels={mockLabels} colors={[]} journey="health" title="Monthly Activity" />);
        expect(screen.getByText(/Bar chart titled Monthly Activity/)).toBeInTheDocument();
    });

    it('uses custom colors when provided', () => {
        render(<BarChart data={mockData} labels={mockLabels} colors={['#FF0000']} journey="health" title="Custom" />);
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
});
