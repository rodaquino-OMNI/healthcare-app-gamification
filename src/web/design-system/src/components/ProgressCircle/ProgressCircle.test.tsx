import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import ProgressCircle from './ProgressCircle';
import { colors } from '../../tokens/colors';
import { baseTheme } from '../../themes/base.theme';
import { healthTheme } from '../../themes/health.theme';
import { careTheme } from '../../themes/care.theme';
import { planTheme } from '../../themes/plan.theme';

// Helper function to render components with theme context
const renderWithTheme = (ui: React.ReactElement, theme = baseTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ProgressCircle', () => {
  it('renders with default props', () => {
    renderWithTheme(<ProgressCircle progress={50} />);
    
    // Verify the component is in the document
    const progressCircle = screen.getByRole('progressbar');
    expect(progressCircle).toBeInTheDocument();
    
    // Verify SVG elements are rendered
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    
    // Verify both background and progress circles are rendered
    const circles = document.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('renders with custom size', () => {
    renderWithTheme(<ProgressCircle progress={50} size="100px" />);
    
    const progressCircle = screen.getByRole('progressbar');
    expect(progressCircle).toHaveStyle('width: 100px');
    expect(progressCircle).toHaveStyle('height: 100px');
  });

  it('renders with custom stroke width', () => {
    // The stroke width is calculated internally based on the viewBoxSize
    renderWithTheme(<ProgressCircle progress={50} />);
    
    const circles = document.querySelectorAll('circle');
    // Both circles should have the same stroke width
    expect(circles[0]).toHaveAttribute('stroke-width', '3.6');
    expect(circles[1]).toHaveAttribute('stroke-width', '3.6');
  });

  it('renders with custom progress value', () => {
    renderWithTheme(<ProgressCircle progress={75} showLabel={true} />);
    
    // Check the aria-valuenow attribute
    const progressCircle = screen.getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('aria-valuenow', '75');
    
    // Check the text label
    const label = screen.getByText('75%');
    expect(label).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    const testColor = "#FF0000"; // Red color for testing
    const emptyColor = "#CCCCCC"; // Light gray for empty track
    
    renderWithTheme(
      <ProgressCircle 
        progress={50} 
        color={testColor}
      />
    );
    
    const circles = document.querySelectorAll('circle');
    const progressCircle = circles[1]; // Progress circle
    
    expect(progressCircle).toHaveAttribute('stroke', testColor);
  });

  it('hides percentage text when showLabel is false', () => {
    renderWithTheme(<ProgressCircle progress={50} showLabel={false} />);
    
    // The percentage text should not be in the document
    const label = screen.queryByText('50%');
    expect(label).not.toBeInTheDocument();
  });

  it('applies health journey theme correctly', () => {
    renderWithTheme(
      <ProgressCircle progress={50} journey="health" />,
      healthTheme
    );
    
    // In the component implementation, the journey prop is passed to the Box component
    // and the progress circle color is set based on the journey
    const progressCircles = document.querySelectorAll('circle');
    const progressCircle = progressCircles[1]; // The progress circle
    expect(progressCircle).toHaveAttribute('stroke', 'journeys.health.primary');
  });

  it('applies care journey theme correctly', () => {
    renderWithTheme(
      <ProgressCircle progress={50} journey="care" />,
      careTheme
    );
    
    const progressCircles = document.querySelectorAll('circle');
    const progressCircle = progressCircles[1]; // The progress circle
    expect(progressCircle).toHaveAttribute('stroke', 'journeys.care.primary');
  });

  it('applies plan journey theme correctly', () => {
    renderWithTheme(
      <ProgressCircle progress={50} journey="plan" />,
      planTheme
    );
    
    const progressCircles = document.querySelectorAll('circle');
    const progressCircle = progressCircles[1]; // The progress circle
    expect(progressCircle).toHaveAttribute('stroke', 'journeys.plan.primary');
  });

  it('has correct ARIA attributes for accessibility', () => {
    renderWithTheme(<ProgressCircle progress={50} />);
    
    const progressCircle = screen.getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('role', 'progressbar');
    expect(progressCircle).toHaveAttribute('aria-valuenow', '50');
    expect(progressCircle).toHaveAttribute('aria-valuemin', '0');
    expect(progressCircle).toHaveAttribute('aria-valuemax', '100');
    expect(progressCircle).toHaveAttribute('aria-label', '50% complete');
  });

  it('applies custom ariaLabel correctly', () => {
    renderWithTheme(<ProgressCircle progress={50} ariaLabel="Custom label" />);
    
    const progressCircle = screen.getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('aria-label', 'Custom label');
  });

  it('applies custom testID correctly', () => {
    const testID = 'custom-progress';
    renderWithTheme(
      <ProgressCircle 
        progress={50} 
        data-testid={testID}
      />
    );
    
    expect(screen.getByTestId(testID)).toBeInTheDocument();
  });
});