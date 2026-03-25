import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Stack } from './Stack';

// Mock Stack.styles to render a plain div
jest.mock('./Stack.styles', () => {
    const React = require('react');
    const MockStackContainer = React.forwardRef(
        ({ direction, spacing, wrap, align, children, ...props }: any, ref: any) => {
            // Spread props first, then override data-testid so a passed undefined doesn't win
            const { 'data-testid': passedTestId, ...restProps } = props;
            return React.createElement(
                'div',
                {
                    ref,
                    'data-direction': direction,
                    'data-spacing': typeof spacing === 'object' ? JSON.stringify(spacing) : spacing,
                    'data-wrap': String(wrap),
                    'data-align': align,
                    ...restProps,
                    'data-testid':
                        passedTestId !== null && passedTestId !== undefined ? passedTestId : 'stack-container',
                },
                children
            );
        }
    );
    MockStackContainer.displayName = 'MockStackContainer';
    return { StackContainer: MockStackContainer };
});

// Mock Box (used by Stack.styles internally, but since we mock Stack.styles fully this is a safety net)
jest.mock('../Box/Box', () => {
    const React = require('react');
    const MockBox = React.forwardRef(({ children, ...props }: any, ref: any) =>
        React.createElement('div', { ref, ...props }, children)
    );
    MockBox.displayName = 'MockBox';
    return { Box: MockBox };
});

jest.mock('../../tokens/spacing', () => ({
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    spacingValues: { xs: 4, sm: 8, md: 16, lg: 24 },
}));

jest.mock('../../tokens/breakpoints', () => ({
    breakpoints: { sm: '640px', md: '768px', lg: '1024px' },
}));

describe('Stack', () => {
    it('renders children correctly', () => {
        render(
            <Stack>
                <div data-testid="item-1">Item 1</div>
                <div data-testid="item-2">Item 2</div>
            </Stack>
        );
        expect(screen.getByTestId('stack-container')).toBeInTheDocument();
        expect(screen.getByTestId('item-1')).toHaveTextContent('Item 1');
        expect(screen.getByTestId('item-2')).toHaveTextContent('Item 2');
    });

    it('defaults to column direction', () => {
        render(
            <Stack>
                <div>Item</div>
            </Stack>
        );
        const container = screen.getByTestId('stack-container');
        expect(container).toHaveAttribute('data-direction', 'column');
    });

    it('applies row direction', () => {
        render(
            <Stack direction="row">
                <div>Item</div>
            </Stack>
        );
        const container = screen.getByTestId('stack-container');
        expect(container).toHaveAttribute('data-direction', 'row');
    });

    it('applies spacing prop', () => {
        render(
            <Stack spacing="md">
                <div>Item</div>
            </Stack>
        );
        const container = screen.getByTestId('stack-container');
        expect(container).toHaveAttribute('data-spacing', 'md');
    });

    it('applies alignment prop', () => {
        render(
            <Stack align="center">
                <div>Item</div>
            </Stack>
        );
        const container = screen.getByTestId('stack-container');
        expect(container).toHaveAttribute('data-align', 'center');
    });

    it('applies wrap prop', () => {
        render(
            <Stack wrap>
                <div>Item</div>
            </Stack>
        );
        const container = screen.getByTestId('stack-container');
        expect(container).toHaveAttribute('data-wrap', 'true');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Stack ref={ref}>
                <div>Item</div>
            </Stack>
        );
        expect(ref.current).toBeTruthy();
    });

    it('has correct displayName', () => {
        expect(Stack.displayName).toBe('Stack');
    });
});
