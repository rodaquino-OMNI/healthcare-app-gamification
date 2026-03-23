import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Arrow } from './Arrow';

// Mock styled-components to render a plain span
jest.mock('styled-components', () => {
    const createSpan = (_strings: any, ..._args: any[]) => {
        const Component = ({ children, $size, $rotation, ...props }: any) => (
            <span data-testid={props['data-testid'] || 'arrow'} data-size={$size} data-rotation={$rotation} {...props}>
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
        componentColors: { brand: '#05AEDB' },
        gray: { 50: '#64748b' },
        neutral: { white: '#FFFFFF' },
    },
}));

describe('Arrow', () => {
    it('renders with default props', () => {
        render(<Arrow />);
        const el = screen.getByTestId('arrow');
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute('data-rotation', '0');
        expect(el).toHaveAttribute('data-size', '24');
        const svg = el.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('renders direction="up" with 180deg rotation', () => {
        render(<Arrow direction="up" />);
        const el = screen.getByTestId('arrow');
        expect(el).toHaveAttribute('data-rotation', '180');
    });

    it('renders direction="down" with 0deg rotation', () => {
        render(<Arrow direction="down" />);
        const el = screen.getByTestId('arrow');
        expect(el).toHaveAttribute('data-rotation', '0');
    });

    it('renders direction="left" with 90deg rotation', () => {
        render(<Arrow direction="left" />);
        const el = screen.getByTestId('arrow');
        expect(el).toHaveAttribute('data-rotation', '90');
    });

    it('renders direction="right" with -90deg rotation', () => {
        render(<Arrow direction="right" />);
        const el = screen.getByTestId('arrow');
        expect(el).toHaveAttribute('data-rotation', '-90');
    });

    it('renders with color="brand" using brand token', () => {
        render(<Arrow color="brand" />);
        const el = screen.getByTestId('arrow');
        const path = el.querySelector('path');
        expect(path).toHaveAttribute('stroke', '#05AEDB');
    });

    it('renders with color="gray" using gray token', () => {
        render(<Arrow color="gray" />);
        const el = screen.getByTestId('arrow');
        const path = el.querySelector('path');
        expect(path).toHaveAttribute('stroke', '#64748b');
    });

    it('renders with color="white" using white token', () => {
        render(<Arrow color="white" />);
        const el = screen.getByTestId('arrow');
        const path = el.querySelector('path');
        expect(path).toHaveAttribute('stroke', '#FFFFFF');
    });

    it('renders with custom size', () => {
        render(<Arrow size={32} />);
        const el = screen.getByTestId('arrow');
        expect(el).toHaveAttribute('data-size', '32');
    });

    it('is aria-hidden by default (no accessibilityLabel)', () => {
        render(<Arrow />);
        const el = screen.getByTestId('arrow');
        expect(el).toHaveAttribute('aria-hidden', 'true');
    });

    it('has correct accessibility attributes when accessibilityLabel is set', () => {
        render(<Arrow accessibilityLabel="Expand section" />);
        const el = screen.getByTestId('arrow');
        expect(el).toHaveAttribute('aria-hidden', 'false');
        expect(el).toHaveAttribute('aria-label', 'Expand section');
        expect(el).toHaveAttribute('role', 'img');
    });

    it('renders with custom testID', () => {
        render(<Arrow testID="custom-arrow" />);
        expect(screen.getByTestId('custom-arrow')).toBeInTheDocument();
    });
});
