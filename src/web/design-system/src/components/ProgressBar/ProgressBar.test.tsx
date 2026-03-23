import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import ProgressBar from './ProgressBar';
import { healthTheme, careTheme, planTheme } from '../../themes';

/**
 * Helper function to render components with a specific theme
 */
const renderWithTheme = (ui: React.ReactElement, theme: any) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('ProgressBar', () => {
    it('renders correctly with default props', () => {
        renderWithTheme(<ProgressBar current={50} total={100} testId="progress-bar" />, healthTheme);

        const progressBar = screen.getByTestId('progress-bar');
        expect(progressBar).toBeInTheDocument();

        // Check that the progress fill element exists and has the correct width
        const fill = progressBar.firstChild as HTMLElement;
        expect(fill).toHaveStyle('width: 50%');
    });

    it('calculates percentage correctly', () => {
        renderWithTheme(<ProgressBar current={25} total={200} testId="progress-bar" />, healthTheme);

        const progressBar = screen.getByTestId('progress-bar');
        const fill = progressBar.firstChild as HTMLElement;

        // 25/200 = 12.5%
        expect(fill).toHaveStyle('width: 12.5%');
    });

    it('clamps progress to 0-100% range', () => {
        // Test with current > total (should clamp to 100%)
        renderWithTheme(<ProgressBar current={150} total={100} testId="progress-bar-over" />, healthTheme);

        const progressBarOver = screen.getByTestId('progress-bar-over');
        const fillOver = progressBarOver.firstChild as HTMLElement;
        expect(fillOver).toHaveStyle('width: 100%');

        // Test with negative current (should clamp to 0%)
        renderWithTheme(<ProgressBar current={-10} total={100} testId="progress-bar-under" />, healthTheme);

        const progressBarUnder = screen.getByTestId('progress-bar-under');
        const fillUnder = progressBarUnder.firstChild as HTMLElement;
        expect(fillUnder).toHaveStyle('width: 0%');
    });

    it('applies correct journey-specific styling', () => {
        // Health journey
        renderWithTheme(
            <ProgressBar current={50} total={100} journey="health" testId="health-progress" />,
            healthTheme
        );

        const healthProgress = screen.getByTestId('health-progress');
        const healthFill = healthProgress.firstChild as HTMLElement;
        expect(healthFill).toHaveStyle(`background-color: ${healthTheme.colors.journeys.health.primary}`);

        // Care journey
        renderWithTheme(<ProgressBar current={50} total={100} journey="care" testId="care-progress" />, careTheme);

        const careProgress = screen.getByTestId('care-progress');
        const careFill = careProgress.firstChild as HTMLElement;
        expect(careFill).toHaveStyle(`background-color: ${careTheme.colors.journeys.care.primary}`);

        // Plan journey
        renderWithTheme(<ProgressBar current={50} total={100} journey="plan" testId="plan-progress" />, planTheme);

        const planProgress = screen.getByTestId('plan-progress');
        const planFill = planProgress.firstChild as HTMLElement;
        expect(planFill).toHaveStyle(`background-color: ${planTheme.colors.journeys.plan.primary}`);
    });

    it('renders level indicators when showLevels is true', () => {
        renderWithTheme(
            <ProgressBar
                current={60}
                total={100}
                showLevels={true}
                levelMarkers={[25, 50, 75]}
                testId="levels-progress"
            />,
            healthTheme
        );

        const progressBar = screen.getByTestId('levels-progress');

        // Should have 3 level markers
        const markers = progressBar.querySelectorAll('[aria-hidden="true"]');
        expect(markers.length).toBe(3);

        // Check marker positions
        expect(markers[0]).toHaveStyle('left: 25%');
        expect(markers[1]).toHaveStyle('left: 50%');
        expect(markers[2]).toHaveStyle('left: 75%');
    });

    it('applies correct ARIA attributes', () => {
        renderWithTheme(
            <ProgressBar current={30} total={100} ariaLabel="Test progress" testId="aria-progress" />,
            healthTheme
        );

        const progressBar = screen.getByTestId('aria-progress');

        expect(progressBar).toHaveAttribute('role', 'progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '30');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        expect(progressBar).toHaveAttribute('aria-label', 'Test progress');
    });

    it('applies custom className when provided', () => {
        renderWithTheme(
            <ProgressBar current={50} total={100} className="custom-progress" testId="class-progress" />,
            healthTheme
        );

        const progressBar = screen.getByTestId('class-progress');
        expect(progressBar).toHaveClass('custom-progress');
    });

    it('renders with different sizes', () => {
        // Small size
        renderWithTheme(<ProgressBar current={50} total={100} size="sm" testId="sm-progress" />, healthTheme);

        const smProgress = screen.getByTestId('sm-progress');
        expect(smProgress).toHaveStyle(`height: ${healthTheme.spacing.xs}`);

        // Medium size (default)
        renderWithTheme(<ProgressBar current={50} total={100} size="md" testId="md-progress" />, healthTheme);

        const mdProgress = screen.getByTestId('md-progress');
        expect(mdProgress).toHaveStyle(`height: ${healthTheme.spacing.sm}`);

        // Large size
        renderWithTheme(<ProgressBar current={50} total={100} size="lg" testId="lg-progress" />, healthTheme);

        const lgProgress = screen.getByTestId('lg-progress');
        expect(lgProgress).toHaveStyle(`height: ${healthTheme.spacing.md}`);
    });

    it('handles zero total value', () => {
        renderWithTheme(<ProgressBar current={50} total={0} testId="zero-progress" />, healthTheme);

        const progressBar = screen.getByTestId('zero-progress');
        const fill = progressBar.firstChild as HTMLElement;

        // When total is 0, progress should be 0%
        expect(fill).toHaveStyle('width: 0%');
    });

    describe('labelPosition', () => {
        it('renders label above the bar when labelPosition is above', () => {
            renderWithTheme(
                <ProgressBar current={45} total={100} testId="label-progress" labelPosition="above" />,
                healthTheme
            );

            const label = screen.getByTestId('label-progress-label');
            expect(label).toBeInTheDocument();
            expect(label).toHaveTextContent('45%');

            // Label should appear before the bar in the DOM (above)
            const outer = screen.getByTestId('label-progress-outer');
            const children = Array.from(outer.children);
            const labelIndex = children.indexOf(label);
            const barIndex = children.indexOf(screen.getByTestId('label-progress'));
            expect(labelIndex).toBeLessThan(barIndex);
        });

        it('renders label below the bar when labelPosition is below', () => {
            renderWithTheme(
                <ProgressBar current={60} total={100} testId="label-progress" labelPosition="below" />,
                healthTheme
            );

            const label = screen.getByTestId('label-progress-label');
            expect(label).toBeInTheDocument();
            expect(label).toHaveTextContent('60%');

            // Label should appear after the bar in the DOM (below)
            const outer = screen.getByTestId('label-progress-outer');
            const children = Array.from(outer.children);
            const labelIndex = children.indexOf(label);
            const barIndex = children.indexOf(screen.getByTestId('label-progress'));
            expect(labelIndex).toBeGreaterThan(barIndex);
        });

        it('renders label inline inside the bar when labelPosition is inline', () => {
            renderWithTheme(
                <ProgressBar current={75} total={100} testId="label-progress" labelPosition="inline" />,
                healthTheme
            );

            const label = screen.getByTestId('label-progress-label');
            expect(label).toBeInTheDocument();
            expect(label).toHaveTextContent('75%');

            // Inline label should be a child of the bar container
            const bar = screen.getByTestId('label-progress');
            expect(bar.contains(label)).toBe(true);
        });

        it('shows no visible label when labelPosition is none (default)', () => {
            renderWithTheme(<ProgressBar current={50} total={100} testId="label-progress" />, healthTheme);

            expect(screen.queryByTestId('label-progress-label')).not.toBeInTheDocument();
        });

        it('renders custom label text when label prop is provided', () => {
            renderWithTheme(
                <ProgressBar
                    current={50}
                    total={100}
                    testId="label-progress"
                    labelPosition="above"
                    label="Halfway there"
                />,
                healthTheme
            );

            const label = screen.getByTestId('label-progress-label');
            expect(label).toHaveTextContent('Halfway there');
        });

        it('renders default percentage label when no custom label provided', () => {
            renderWithTheme(
                <ProgressBar current={33} total={100} testId="label-progress" labelPosition="below" />,
                healthTheme
            );

            const label = screen.getByTestId('label-progress-label');
            expect(label).toHaveTextContent('33%');
        });
    });
});
