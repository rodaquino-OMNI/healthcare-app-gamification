import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

// Mock styled-components to render a plain element
jest.mock('styled-components', () => {
  const styled = {
    span: (strings: any, ...args: any[]) => {
      const Component = ({ children, as: Tag = 'span', ...props }: any) => {
        const DomTag = Tag as any;
        return (
          <DomTag
            data-testid="text-element"
            data-variant={props.variant}
            data-journey={props.journey}
            data-font-size={props.fontSize}
            data-font-weight={props.fontWeight}
            data-color={props.color}
            data-text-align={props.textAlign}
            data-truncate={props.truncate ? 'true' : undefined}
            {...props}
          >
            {children}
          </DomTag>
        );
      };
      return Component;
    },
  };
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
