import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Icon } from './Icon';

// Mock styled-components to render a plain span
jest.mock('styled-components', () => {
    const createSpan = (_strings: any, ..._args: any[]) => {
        const Component = ({
            children,
            size,
            color,
            $size,
            $bgColor: _bgColor,
            $iconColor,
            $borderColor: _borderColor,
            ...props
        }: any) => (
            <span
                data-testid={props['data-testid'] || 'icon-container'}
                data-size={size ?? $size}
                data-color={color ?? $iconColor}
                {...props}
            >
                {children}
            </span>
        );
        Component.displayName = 'StyledSpan';
        Component.withConfig = () => createSpan;
        return Component;
    };
    createSpan.withConfig = () => createSpan;

    const styled = {
        span: Object.assign(createSpan, { withConfig: () => createSpan }),
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
        expect(consoleSpy).toHaveBeenCalledWith('Icon with name "nonexistent-icon" not found in icon registry');
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

    describe('interactive prop (A11Y-002)', () => {
        it('sets aria-hidden to false when interactive is true', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            render(<Icon name="heart" interactive aria-label="Favorite" />);
            const container = screen.getByTestId('icon-container');
            expect(container).toHaveAttribute('aria-hidden', 'false');
            const svg = container.querySelector('svg');
            expect(svg).toHaveAttribute('role', 'img');
            expect(svg).toHaveAttribute('aria-label', 'Favorite');
            consoleSpy.mockRestore();
        });

        it('keeps aria-hidden true when interactive is false (default)', () => {
            render(<Icon name="heart" />);
            const container = screen.getByTestId('icon-container');
            expect(container).toHaveAttribute('aria-hidden', 'true');
        });

        it('explicit aria-hidden overrides interactive prop', () => {
            render(<Icon name="heart" interactive aria-hidden={true} />);
            const container = screen.getByTestId('icon-container');
            expect(container).toHaveAttribute('aria-hidden', 'true');
        });

        it('warns when interactive but no aria-label provided', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            render(<Icon name="heart" interactive />);
            expect(consoleSpy).toHaveBeenCalledWith('Icon requires an aria-label when aria-hidden is false');
            consoleSpy.mockRestore();
        });
    });
});
