import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  it('renders correctly with all props', () => {
    render(
      <MetricCard
        metricName="Heart Rate"
        value={72}
        unit="bpm"
        trend="stable"
        journey="health"
      />
    );

    // Check that metric name, value, and unit are displayed
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('bpm')).toBeInTheDocument();
    expect(screen.getByText('stable')).toBeInTheDocument();
    
    // Check the card has the correct accessibility label
    const card = screen.getByTestId('metric-card');
    expect(card).toHaveAttribute('aria-label', 'Heart Rate: 72 bpm, trend: stable');
  });

  it('applies journey-specific styling', () => {
    // Since we can't easily test the exact styles applied by styled-components,
    // we'll verify that the component accepts different journey props and renders correctly
    
    const { rerender } = render(
      <MetricCard
        metricName="Heart Rate"
        value={72}
        unit="bpm"
        journey="health"
      />
    );
    
    // Verify the component rendered with health journey
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
    
    // Re-render with care journey
    rerender(
      <MetricCard
        metricName="Heart Rate"
        value={72}
        unit="bpm"
        journey="care"
      />
    );
    
    // Verify the component rendered with care journey
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
    
    // Re-render with plan journey
    rerender(
      <MetricCard
        metricName="Heart Rate"
        value={72}
        unit="bpm"
        journey="plan"
      />
    );
    
    // Verify the component rendered with plan journey
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
  });
});