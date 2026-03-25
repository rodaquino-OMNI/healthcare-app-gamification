import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Text } from './Text';

// Mock styled-components to render a plain element
jest.mock('styled-components', () => {
    const React = require('react');

    // Build a render component that outputs all the data-* attributes the tests expect
    const makeRenderComponent = () => {
        const Component = ({ children, as: Tag = 'span', ...props }: any) => {
            const { 'data-testid': passedTestId, ...restProps } = props;
            return React.createElement(
                Tag,
                {
                    'data-variant': restProps.variant,
                    'data-journey': restProps.journey,
                    'data-font-size': restProps.fontSize,
                    'data-font-weight': restProps.fontWeight,
                    'data-color': restProps.color,
                    'data-text-align': restProps.textAlign,
                    'data-truncate': restProps.truncate ? 'true' : undefined,
                    ...restProps,
                    'data-testid': passedTestId !== null && passedTestId !== undefined ? passedTestId : 'text-element',
                },
                children
            );
        };
        return Component;
    };

    // A tagged-template function that returns a component when called with template strings.
    // Also exposes .withConfig() that itself returns another tagged-template function.
    // This mirrors the real styled-components API:
    //   styled.span.withConfig({})`css...`  => Component
    const makeTaggedTemplate = () => {
        // tagFn is called as a tagged template: tagFn`css...` => Component
        const tagFn = (_strings: any, ..._args: any[]) => makeRenderComponent();
        // .withConfig returns a NEW tagged-template function so the subsequent `css...` call works
        (tagFn as any).withConfig = (_config: any) => {
            const inner = (_strings: any, ..._args: any[]) => makeRenderComponent();
            (inner as any).withConfig = (_config2: any) => inner;
            return inner;
        };
        return tagFn;
    };

    // styled.span, styled.div, etc. — every HTML-tag access returns a tagged-template fn
    const styled: any = new Proxy(makeTaggedTemplate(), {
        get(_target: any, _prop: string) {
            return makeTaggedTemplate();
        },
    });

    return { __esModule: true, default: styled };
});

// Mock tokens
jest.mock('../../tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans' },
        fontSize: {
            'display-lg': '48px',
            'heading-xl': '32px',
            'text-md': '16px',
            'text-xs': '12px',
            sm: '14px',
            md: '16px',
        },
        fontWeight: { regular: 400, semiBold: 600, bold: 700 },
        lineHeight: { tight: 1.2, heading: 1.3, base: 1.5, relaxed: 1.6 },
    },
}));

jest.mock('../../tokens/colors', () => ({
    colors: {
        neutral: { gray900: '#1A1A1A' },
        journeys: {
            health: { text: '#0ACF83', primary: '#0ACF83' },
            care: { text: '#FF8C42', primary: '#FF8C42' },
            plan: { text: '#3A86FF', primary: '#3A86FF' },
        },
    },
}));

describe('Text', () => {
    it('renders text content correctly', () => {
        render(<Text>Hello World</Text>);
        expect(screen.getByTestId('text-element')).toHaveTextContent('Hello World');
    });

    it('renders as span by default', () => {
        render(<Text>Default span</Text>);
        const element = screen.getByTestId('text-element');
        expect(element.tagName.toLowerCase()).toBe('span');
    });

    it('renders as a different HTML element via the as prop', () => {
        render(<Text as="h1">Heading</Text>);
        const element = screen.getByTestId('text-element');
        expect(element.tagName.toLowerCase()).toBe('h1');
    });

    it('applies testID prop as data-testid', () => {
        render(<Text testID="custom-text">Custom ID</Text>);
        expect(screen.getByTestId('custom-text')).toBeInTheDocument();
    });

    it('applies variant prop', () => {
        render(<Text variant="heading">Heading text</Text>);
        const element = screen.getByTestId('text-element');
        expect(element).toHaveAttribute('data-variant', 'heading');
    });

    it('applies journey prop', () => {
        render(<Text journey="health">Health text</Text>);
        const element = screen.getByTestId('text-element');
        expect(element).toHaveAttribute('data-journey', 'health');
    });

    it('applies fontSize prop', () => {
        render(<Text fontSize="lg">Large text</Text>);
        const element = screen.getByTestId('text-element');
        expect(element).toHaveAttribute('data-font-size', 'lg');
    });

    it('applies fontWeight prop', () => {
        render(<Text fontWeight="bold">Bold text</Text>);
        const element = screen.getByTestId('text-element');
        expect(element).toHaveAttribute('data-font-weight', 'bold');
    });

    it('applies color prop', () => {
        render(<Text color="#FF0000">Red text</Text>);
        const element = screen.getByTestId('text-element');
        expect(element).toHaveAttribute('data-color', '#FF0000');
    });

    it('applies textAlign prop', () => {
        render(<Text textAlign="center">Centered</Text>);
        const element = screen.getByTestId('text-element');
        expect(element).toHaveAttribute('data-text-align', 'center');
    });
});
