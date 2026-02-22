import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Box } from './Box';

// Mock the styled BoxContainer to render as a plain div
jest.mock('./Box.styles', () => ({
  BoxContainer: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="box-container" {...props}>
      {children}
    </div>
  )),
}));

// Mock token modules
jest.mock('../../tokens/spacing', () => ({
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
}));

jest.mock('../../tokens/colors', () => ({
  colors: {
    neutral: { gray100: '#F5F5F5', gray900: '#1A1A1A', white: '#FFFFFF' },
    journeys: {
      health: { primary: '#0ACF83', background: '#E6F9F1' },
      care: { primary: '#FF8C42', background: '#FFF3EB' },
      plan: { primary: '#3A86FF', background: '#EBF2FF' },
    },
  },
}));

jest.mock('../../tokens/shadows', () => ({
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.1)' },
}));

jest.mock('../../tokens/breakpoints', () => ({
  breakpoints: { sm: '640px', md: '768px', lg: '1024px' },
}));

jest.mock('../../tokens/borderRadius', () => ({
  borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
}));

jest.mock('../../tokens/sizing', () => ({
  sizing: { component: { sm: '32px', md: '40px', lg: '48px' } },
}));

describe('Box', () => {
  it('renders children correctly', () => {
    render(<Box>Hello Box</Box>);
    expect(screen.getByTestId('box-container')).toBeInTheDocument();
    expect(screen.getByTestId('box-container')).toHaveTextContent('Hello Box');
  });

  it('renders with nested elements', () => {
    render(
      <Box>
        <span data-testid="child-1">Child 1</span>
        <span data-testid="child-2">Child 2</span>
      </Box>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('resolves padding token to actual value', () => {
    render(<Box padding="md">Padded</Box>);
    const box = screen.getByTestId('box-container');
    expect(box).toHaveAttribute('padding', '16px');
  });

  it('resolves margin token to actual value', () => {
    render(<Box margin="lg">Margin</Box>);
    const box = screen.getByTestId('box-container');
    expect(box).toHaveAttribute('margin', '24px');
  });

  it('applies journey-specific background color', () => {
    render(<Box journey="health">Health</Box>);
    const box = screen.getByTestId('box-container');
    expect(box).toHaveAttribute('backgroundcolor', '#E6F9F1');
  });

  it('prefers explicit backgroundColor over journey', () => {
    render(<Box journey="health" backgroundColor="red">Explicit</Box>);
    const box = screen.getByTestId('box-container');
    // backgroundColor is explicit so journey background should not override
    expect(box).toHaveAttribute('backgroundcolor', 'red');
  });

  it('passes through additional HTML props', () => {
    render(<Box data-custom="test-value">Custom</Box>);
    const box = screen.getByTestId('box-container');
    expect(box).toHaveAttribute('data-custom', 'test-value');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Box ref={ref}>Ref</Box>);
    expect(ref.current).toBeTruthy();
  });

  it('has correct displayName', () => {
    expect(Box.displayName).toBe('Box');
  });
});
