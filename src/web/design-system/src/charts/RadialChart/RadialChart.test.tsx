import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { RadialChart } from './RadialChart';
import { tokens } from '../../tokens';
import { healthTheme } from '../../themes';

describe('RadialChart', () => {
    const mockData = [
        { x: 'A', y: 30 },
        { x: 'B', y: 20 },
        { x: 'C', y: 50 },
    ];

    it('renders correctly with basic props', () => {
        render(<RadialChart data={mockData} />);

        // Check if the chart container is rendered
        expect(screen.getByLabelText(/Radial chart with 3 segments/)).toBeInTheDocument();

        // VictoryPie renders SVG elements, we can check for those
        expect(document.querySelectorAll('svg')).toHaveLength(1);
        expect(document.querySelectorAll('path')).toHaveLength(mockData.length);
    });

    it('renders with percentage labels by default', () => {
        render(<RadialChart data={mockData} />);

        // Calculate expected percentages
        const total = mockData.reduce((sum, item) => sum + item.y, 0);
        const percentages = mockData.map((item) => `${Math.round((item.y / total) * 100)}%`);

        // Check if the percentage labels are rendered
        percentages.forEach((percentage) => {
            expect(screen.getByText(percentage)).toBeInTheDocument();
        });
    });

    it('renders with value labels when labelType is "value"', () => {
        render(<RadialChart data={mockData} labelType="value" />);

        // Check if the value labels are rendered
        mockData.forEach((item) => {
            expect(screen.getByText(String(item.y))).toBeInTheDocument();
        });
    });

    it('renders with label text when labelType is "label"', () => {
        render(<RadialChart data={mockData} labelType="label" />);

        // Check if the label texts are rendered
        mockData.forEach((item) => {
            expect(screen.getByText(item.x)).toBeInTheDocument();
        });
    });

    it('renders without labels when labelType is "none"', () => {
        render(<RadialChart data={mockData} labelType="none" />);

        // When labelType is "none", the component should pass empty strings as labels to VictoryPie
        // We can't easily check this directly, so we'll just ensure the component renders without crashing
        expect(screen.getByLabelText(/Radial chart with 3 segments/)).toBeInTheDocument();
    });

    it('uses custom color scale when provided', () => {
        const customColors = ['#FF0000', '#00FF00', '#0000FF'];

        // We can't easily test the exact colors applied to SVG paths,
        // but we can check that the component doesn't crash with custom colors
        render(<RadialChart data={mockData} colorScale={customColors} />);

        expect(screen.getByLabelText(/Radial chart with 3 segments/)).toBeInTheDocument();
    });

    it('uses journey-specific colors based on the journey prop', () => {
        // Render with different journey props and ensure it doesn't crash
        const { rerender } = render(<RadialChart data={mockData} journey="health" />);
        expect(screen.getByLabelText(/Radial chart with 3 segments/)).toBeInTheDocument();

        rerender(<RadialChart data={mockData} journey="care" />);
        expect(screen.getByLabelText(/Radial chart with 3 segments/)).toBeInTheDocument();

        rerender(<RadialChart data={mockData} journey="plan" />);
        expect(screen.getByLabelText(/Radial chart with 3 segments/)).toBeInTheDocument();
    });

    it('applies correct aria-label for accessibility', () => {
        render(<RadialChart data={mockData} />);

        expect(screen.getByLabelText('Radial chart with 3 segments')).toBeInTheDocument();
    });

    it('handles empty data gracefully', () => {
        render(<RadialChart data={[]} />);

        // Check if the chart container is rendered without errors
        expect(screen.getByLabelText(/Radial chart with 0 segments/)).toBeInTheDocument();
    });
});
