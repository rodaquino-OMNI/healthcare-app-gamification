import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

// Mock the styled component to render as a plain div with passed props
jest.mock('./Divider.styles', () => ({
  StyledDivider: ({ orientation, thickness, color, spacing, journey, ...props }: any) => (
    <div
      data-orientation={orientation}
      data-thickness={thickness}
      data-color={color}
      data-spacing={spacing}
      data-journey={journey}
      {...props}
    />
  ),
}));

describe('Divider', () => {
  it('renders with default props', () => {
    render(<Divider testID="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('role', 'separator');
  });

  it('defaults to horizontal orientation', () => {
    render(<Divider testID="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('data-orientation', 'horizontal');
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders with vertical orientation', () => {
    render(<Divider orientation="vertical" testID="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('data-orientation', 'vertical');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies custom thickness', () => {
    render(<Divider thickness="2px" testID="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('data-thickness', '2px');
  });

  it('applies custom color', () => {
    render(<Divider color="#FF0000" testID="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('data-color', '#FF0000');
  });

  it('applies journey prop', () => {
    render(<Divider journey="health" testID="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('data-journey', 'health');
  });

  it('applies spacing prop', () => {
    render(<Divider spacing="md" testID="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('data-spacing', 'md');
  });

  it('has correct displayName', () => {
    expect(Divider.displayName).toBe('Divider');
  });
});
