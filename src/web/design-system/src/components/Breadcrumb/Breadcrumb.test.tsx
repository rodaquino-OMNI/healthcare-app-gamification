import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  const defaultItems = [
    { label: 'Home', href: '/' },
    { label: 'Health', href: '/health' },
    { label: 'Dashboard' },
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={defaultItems} />);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders separators between items', () => {
    render(<Breadcrumb items={defaultItems} />);
    const separators = screen.getAllByTestId('breadcrumb-separator');
    expect(separators).toHaveLength(2);
    expect(separators[0]).toHaveTextContent('/');
  });

  it('renders custom separator', () => {
    render(<Breadcrumb items={defaultItems} separator=">" />);
    const separators = screen.getAllByTestId('breadcrumb-separator');
    expect(separators[0]).toHaveTextContent('>');
  });

  it('marks last item as current page', () => {
    render(<Breadcrumb items={defaultItems} />);
    const lastItem = screen.getByTestId('breadcrumb-item-2');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('calls onItemPress when non-last item is clicked', () => {
    const onItemPress = jest.fn();
    render(<Breadcrumb items={defaultItems} onItemPress={onItemPress} />);
    fireEvent.click(screen.getByTestId('breadcrumb-item-0'));
    expect(onItemPress).toHaveBeenCalledWith(defaultItems[0], 0);
  });

  it('has correct accessibility label', () => {
    render(<Breadcrumb items={defaultItems} accessibilityLabel="Custom nav" />);
    expect(screen.getByTestId('breadcrumb')).toHaveAttribute('aria-label', 'Custom nav');
  });
});
