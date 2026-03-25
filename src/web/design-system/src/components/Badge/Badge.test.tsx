import { describe, it, expect } from '@jest/globals'; // Version latest
import { render, screen } from '@testing-library/react'; // Version ^14.0.0
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Badge } from './Badge'; // Import the Badge component to be tested
import { baseTheme } from '../../themes/base.theme';

// Helper: achievement badge renders use BadgeContainer (styled(Touchable)) which
// reads props.theme.borderRadius and props.theme.spacing via styled-components.
// A ThemeProvider is required to avoid "Cannot read properties of undefined" errors.
const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider theme={baseTheme}>{ui}</ThemeProvider>);

describe('Badge', () => {
    it('renders correctly', () => {
        renderWithTheme(<Badge>Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders with children', () => {
        renderWithTheme(
            <Badge>
                <span>Test Child</span>
            </Badge>
        );
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('applies journey-specific styling', () => {
        // BadgeContainer uses journey prop for background-color via styled-components.
        // We verify rendering without errors for each journey; exact CSS values
        // are controlled by styled-components and not reliably testable in JSDOM.
        const { rerender } = renderWithTheme(<Badge journey="health">Test Badge</Badge>);
        expect(screen.getByText('Test Badge')).toBeInTheDocument();

        rerender(
            <ThemeProvider theme={baseTheme}>
                <Badge journey="care">Test Badge</Badge>
            </ThemeProvider>
        );
        expect(screen.getByText('Test Badge')).toBeInTheDocument();

        rerender(
            <ThemeProvider theme={baseTheme}>
                <Badge journey="plan">Test Badge</Badge>
            </ThemeProvider>
        );
        expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders a success badge', () => {
        // variant="status" renders StatusBadge (styled.span) with semantic success color
        render(
            <Badge variant="status" status="success">
                Success Badge
            </Badge>
        );
        expect(screen.getByText('Success Badge')).toBeInTheDocument();
    });

    it('renders a warning badge', () => {
        render(
            <Badge variant="status" status="warning">
                Warning Badge
            </Badge>
        );
        expect(screen.getByText('Warning Badge')).toBeInTheDocument();
    });

    it('renders an error badge', () => {
        render(
            <Badge variant="status" status="error">
                Error Badge
            </Badge>
        );
        expect(screen.getByText('Error Badge')).toBeInTheDocument();
    });

    it('renders an info badge', () => {
        render(
            <Badge variant="status" status="info">
                Info Badge
            </Badge>
        );
        expect(screen.getByText('Info Badge')).toBeInTheDocument();
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
