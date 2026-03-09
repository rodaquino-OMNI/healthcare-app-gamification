import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Icon } from './Icon';

// Mock styled-components to render a plain span
jest.mock('styled-components', () => {
    const styled = {
        span: (_strings: any, ..._args: any[]) => {
            return ({ children, size, color, ...props }: any) => (
                <span data-testid="icon-container" data-size={size} data-color={color} {...props}>
                    {children}
                </span>
            );
        },
    };
    return { __esModule: true, default: styled };
});

// Mock tokens
jest.mock('../../tokens/colors', () => ({
    colors: {
        neutral: { gray700: '#616161' },
        journeys: {
            health: { primary: '#0ACF83' },
            care: { primary: '#FF8C42' },
            plan: { primary: '#3A86FF' },
        },
    },
}));

jest.mock('../../tokens/sizing', () => ({
    sizing: {
        icon: { xs: '12px', sm: '16px', md: '20px', lg: '24px', xl: '32px' },
    },
}));

describe('Icon', () => {
    it('renders an icon by name', () => {
        render(<Icon name="heart" />);
        const container = screen.getByTestId('icon-container');
        expect(container).toBeInTheDocument();
        // SVG should be rendered inside
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('renders SVG with correct path for known icon', () => {
        render(<Icon name="heart" />);
        const container = screen.getByTestId('icon-container');
        const path = container.querySelector('path');
        expect(path).toBeInTheDocument();
        expect(path?.getAttribute('d')).toBeTruthy();
    });

    it('returns null for unknown icon name', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const { container } = render(<Icon name="nonexistent-icon" />);
        expect(container.innerHTML).toBe('');
        expect(consoleSpy).toHaveBeenCalledWith('Icon with name "nonexistent-icon" not found');
        consoleSpy.mockRestore();
    });

    it('applies custom color prop', () => {
        render(<Icon name="heart" color="#FF0000" />);
        const container = screen.getByTestId('icon-container');
        expect(container).toHaveAttribute('data-color', '#FF0000');
    });

    it('applies size prop', () => {
        render(<Icon name="heart" size="lg" />);
        const container = screen.getByTestId('icon-container');
        expect(container).toHaveAttribute('data-size', 'lg');
    });

    it('is aria-hidden by default', () => {
        render(<Icon name="heart" />);
        const container = screen.getByTestId('icon-container');
        expect(container).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders with img role and aria-label when not hidden', () => {
        render(<Icon name="heart" aria-hidden={false} aria-label="Favorite" />);
        const container = screen.getByTestId('icon-container');
        expect(container).toHaveAttribute('aria-hidden', 'false');
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('role', 'img');
        expect(svg).toHaveAttribute('aria-label', 'Favorite');
    });

    it('warns when aria-hidden is false but no aria-label provided', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        render(<Icon name="heart" aria-hidden={false} />);
        expect(consoleSpy).toHaveBeenCalledWith('Icon requires an aria-label when aria-hidden is false');
        consoleSpy.mockRestore();
    });
});
