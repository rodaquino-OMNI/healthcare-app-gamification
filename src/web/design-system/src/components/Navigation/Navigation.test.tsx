import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header, TabBar, BottomNav } from './Navigation';

describe('Header', () => {
  it('renders title', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByTestId('nav-header-title')).toHaveTextContent('Dashboard');
  });

  it('renders left and right actions', () => {
    render(
      <Header
        title="Page"
        leftAction={<button>Back</button>}
        rightAction={<button>Menu</button>}
      />
    );
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByTestId('nav-header')).toHaveAttribute('role', 'banner');
  });
});

describe('TabBar', () => {
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Details', value: 'details' },
    { label: 'Settings', value: 'settings', disabled: true },
  ];

  it('renders all tabs', () => {
    render(<TabBar tabs={tabs} activeTab="overview" onTabChange={jest.fn()} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('marks active tab', () => {
    render(<TabBar tabs={tabs} activeTab="overview" onTabChange={jest.fn()} />);
    expect(screen.getByTestId('tab-overview')).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onTabChange when tab is clicked', () => {
    const onTabChange = jest.fn();
    render(<TabBar tabs={tabs} activeTab="overview" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByTestId('tab-details'));
    expect(onTabChange).toHaveBeenCalledWith('details');
  });

  it('does not call onTabChange for disabled tabs', () => {
    const onTabChange = jest.fn();
    render(<TabBar tabs={tabs} activeTab="overview" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByTestId('tab-settings'));
    expect(onTabChange).not.toHaveBeenCalled();
  });
});

describe('BottomNav', () => {
  const items = [
    { label: 'Home', value: 'home' },
    { label: 'Health', value: 'health' },
    { label: 'Profile', value: 'profile' },
  ];

  it('renders all items', () => {
    render(<BottomNav items={items} activeItem="home" onItemPress={jest.fn()} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('marks active item', () => {
    render(<BottomNav items={items} activeItem="home" onItemPress={jest.fn()} />);
    expect(screen.getByTestId('bottom-nav-home')).toHaveAttribute('aria-current', 'page');
  });

  it('calls onItemPress when item is pressed', () => {
    const onItemPress = jest.fn();
    render(<BottomNav items={items} activeItem="home" onItemPress={onItemPress} />);
    fireEvent.click(screen.getByTestId('bottom-nav-health'));
    expect(onItemPress).toHaveBeenCalledWith('health');
  });
});
