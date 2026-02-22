import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

// Mock the styled component to render as a plain div with passed props
jest.mock('./Skeleton.styles', () => ({
  StyledSkeleton: ({ width, height, borderRadius, animated, ...props }: any) => (
    <div
      data-width={width}
      data-height={height}
      data-border-radius={borderRadius}
      data-animated={String(animated)}
      {...props}
    />
  ),
}));

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('data-width', '100%');
    expect(skeleton).toHaveAttribute('data-height', '16px');
    expect(skeleton).toHaveAttribute('data-animated', 'true');
  });

  it('renders with custom dimensions', () => {
    render(<Skeleton width="200px" height="40px" testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-width', '200px');
    expect(skeleton).toHaveAttribute('data-height', '40px');
  });

  it('renders with custom borderRadius', () => {
    render(<Skeleton borderRadius="lg" testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-border-radius', 'lg');
  });

  it('renders circular variant with full borderRadius', () => {
    render(<Skeleton variant="circular" width="48px" height="48px" testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-border-radius', 'full');
    expect(skeleton).toHaveAttribute('data-width', '48px');
  });

  it('renders text variant with 1em height', () => {
    render(<Skeleton variant="text" testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-height', '1em');
  });

  it('renders with animation disabled', () => {
    render(<Skeleton animated={false} testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-animated', 'false');
  });

  it('has aria-hidden true for accessibility', () => {
    render(<Skeleton testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('has presentation role', () => {
    render(<Skeleton testID="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('role', 'presentation');
  });

  it('has correct displayName', () => {
    expect(Skeleton.displayName).toBe('Skeleton');
  });
});
