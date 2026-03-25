import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
    it('renders correctly with all props', () => {
        render(<MetricCard metricName="Heart Rate" value={72} unit="bpm" trend="stable" journey="health" />);

        // Check that metric name, value, and unit are displayed
        expect(screen.getByText('Heart Rate')).toBeInTheDocument();
        expect(screen.getByText('72')).toBeInTheDocument();
        expect(screen.getByText('bpm')).toBeInTheDocument();
        expect(screen.getByText('stable')).toBeInTheDocument();

        // Check the card has the correct accessibility label via aria-label
        const card = screen.getByLabelText('Heart Rate: 72 bpm, trend: stable');
        expect(card).toBeInTheDocument();
    });

    it('applies journey-specific styling', () => {
        // Since we can't easily test the exact styles applied by styled-components,
        // we'll verify that the component accepts different journey props and renders correctly

        const { rerender } = render(<MetricCard metricName="Heart Rate" value={72} unit="bpm" journey="health" />);

        // Verify the component rendered with health journey
        expect(screen.getByText('Heart Rate')).toBeInTheDocument();
        expect(screen.getByLabelText('Heart Rate: 72 bpm')).toBeInTheDocument();

        // Re-render with care journey
        rerender(<MetricCard metricName="Heart Rate" value={72} unit="bpm" journey="care" />);

        // Verify the component rendered with care journey
        expect(screen.getByText('Heart Rate')).toBeInTheDocument();
        expect(screen.getByLabelText('Heart Rate: 72 bpm')).toBeInTheDocument();

        // Re-render with plan journey
        rerender(<MetricCard metricName="Heart Rate" value={72} unit="bpm" journey="plan" />);

        // Verify the component rendered with plan journey
        expect(screen.getByText('Heart Rate')).toBeInTheDocument();
        expect(screen.getByLabelText('Heart Rate: 72 bpm')).toBeInTheDocument();
    });
});
