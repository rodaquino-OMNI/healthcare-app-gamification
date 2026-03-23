import { describe, it, expect } from '@jest/globals'; // Version latest
import { render, screen } from '@testing-library/react'; // Version ^14.0.0
import React from 'react';

import { Badge } from './Badge'; // Import the Badge component to be tested

describe('Badge', () => {
    it('renders correctly', () => {
        render(<Badge>Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders with children', () => {
        render(
            <Badge>
                <span>Test Child</span>
            </Badge>
        );
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('applies journey-specific styling', () => {
        const { rerender } = render(<Badge journey="health">Test Badge</Badge>);
        expect(screen.getByText('Test Badge').closest('div')).toHaveStyle({
            borderLeftColor: '#0ACF83',
        });

        rerender(<Badge journey="care">Test Badge</Badge>);
        expect(screen.getByText('Test Badge').closest('div')).toHaveStyle({
            borderLeftColor: '#FF8C42',
        });

        rerender(<Badge journey="plan">Test Badge</Badge>);
        expect(screen.getByText('Test Badge').closest('div')).toHaveStyle({
            borderLeftColor: '#3A86FF',
        });
    });

    it('renders a success badge', () => {
        render(<Badge status="success">Success Badge</Badge>);
        expect(screen.getByText('Success Badge').closest('div')).toHaveStyle({
            backgroundColor: '#00C853',
        });
    });

    it('renders a warning badge', () => {
        render(<Badge status="warning">Warning Badge</Badge>);
        expect(screen.getByText('Warning Badge').closest('div')).toHaveStyle({
            backgroundColor: '#FFD600',
        });
    });

    it('renders an error badge', () => {
        render(<Badge status="error">Error Badge</Badge>);
        expect(screen.getByText('Error Badge').closest('div')).toHaveStyle({
            backgroundColor: '#FF3B30',
        });
    });

    it('renders an info badge', () => {
        render(<Badge status="info">Info Badge</Badge>);
        expect(screen.getByText('Info Badge').closest('div')).toHaveStyle({
            backgroundColor: '#0066CC',
        });
    });

    describe('type prop (Figma variant)', () => {
        it('type="dot" renders as a dot indicator', () => {
            const { container } = render(
                <Badge variant="status" status="success" type="dot" testID="dot-badge">
                    Hidden Text
                </Badge>
            );
            const badge = container.querySelector('[data-testid="dot-badge"]');
            expect(badge).toBeInTheDocument();
            // Dot mode should not render children text
            expect(badge?.textContent).toBe('');
        });

        it('type="icon" renders with a status icon glyph', () => {
            render(
                <Badge variant="status" status="success" type="icon" testID="icon-badge">
                    Success
                </Badge>
            );
            // Should render the checkmark glyph
            expect(screen.getByText('\u2713')).toBeInTheDocument();
            // Should also render children
            expect(screen.getByText('Success')).toBeInTheDocument();
        });

        it('type="text" renders with text label (default behavior)', () => {
            render(
                <Badge variant="status" status="warning" type="text" testID="text-badge">
                    Warning Label
                </Badge>
            );
            expect(screen.getByText('Warning Label')).toBeInTheDocument();
        });

        it('backward compat: dot=true still works without type prop', () => {
            const { container } = render(
                <Badge variant="status" status="error" dot={true} testID="compat-dot">
                    Should Hide
                </Badge>
            );
            const badge = container.querySelector('[data-testid="compat-dot"]');
            expect(badge).toBeInTheDocument();
            expect(badge?.textContent).toBe('');
        });

        it('type prop takes precedence over dot prop', () => {
            render(
                <Badge variant="status" status="info" type="text" dot={true} testID="precedence-badge">
                    Visible Text
                </Badge>
            );
            // type="text" should override dot=true
            expect(screen.getByText('Visible Text')).toBeInTheDocument();
        });

        it('renders all three sizes correctly with type="icon"', () => {
            const { rerender, container } = render(
                <Badge variant="status" status="success" type="icon" size="sm" testID="size-badge">
                    SM
                </Badge>
            );
            expect(container.querySelector('[data-testid="size-badge"]')).toBeInTheDocument();

            rerender(
                <Badge variant="status" status="success" type="icon" size="md" testID="size-badge">
                    MD
                </Badge>
            );
            expect(container.querySelector('[data-testid="size-badge"]')).toBeInTheDocument();

            rerender(
                <Badge variant="status" status="success" type="icon" size="lg" testID="size-badge">
                    LG
                </Badge>
            );
            expect(container.querySelector('[data-testid="size-badge"]')).toBeInTheDocument();
        });
    });
});
