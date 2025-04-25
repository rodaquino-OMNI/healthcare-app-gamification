import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { LineChart as LineChartComponent } from './LineChart';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

// Sample data for testing
const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 }
];

describe('LineChart', () => {
  it('renders the LineChart component with sample data', () => {
    render(
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
      name: /Line chart showing Revenue over Month/i 
    });
    expect(chartContainer).toBeInTheDocument();
  });

  it('displays the x-axis label correctly', () => {
    render(
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
      name: /Line chart showing .* over Month/i 
    });
    expect(chartContainer).toBeInTheDocument();
  });

  it('displays the y-axis label correctly', () => {
    render(
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
      name: /Line chart showing Revenue over .*/i 
    });
    expect(chartContainer).toBeInTheDocument();
  });

  it('shows "No data available" message when data is empty', () => {
    render(
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
    const { rerender } = render(
      <LineChartComponent
        data={sampleData}
        xAxisKey="name"
        yAxisKey="value"
        xAxisLabel="Month"
        yAxisLabel="Revenue"
        journey="health"
      />
    );
    
    let chartContainer = screen.getByRole('img');
    expect(chartContainer).toBeInTheDocument();
    
    // Care journey
    rerender(
      <LineChartComponent
        data={sampleData}
        xAxisKey="name"
        yAxisKey="value"
        xAxisLabel="Month"
        yAxisLabel="Revenue"
        journey="care"
      />
    );
    
    chartContainer = screen.getByRole('img');
    expect(chartContainer).toBeInTheDocument();
    
    // Plan journey
    rerender(
      <LineChartComponent
        data={sampleData}
        xAxisKey="name"
        yAxisKey="value"
        xAxisLabel="Month"
        yAxisLabel="Revenue"
        journey="plan"
      />
    );
    
    chartContainer = screen.getByRole('img');
    expect(chartContainer).toBeInTheDocument();
  });
});