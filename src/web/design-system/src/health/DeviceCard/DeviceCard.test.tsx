import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { baseTheme } from '../../themes';
import { DeviceCard } from './DeviceCard';

// Mock the Icon component
jest.mock('../../primitives/Icon', () => ({
  Icon: ({ name, size, color, ...props }) => (
    <div data-testid="icon" data-icon-name={name} data-icon-color={color} {...props} />
  )
}));

describe('DeviceCard', () => {
  // Helper function to render component with ThemeProvider
  const renderWithTheme = (ui) => {
    return render(
      <ThemeProvider theme={baseTheme}>
        {ui}
      </ThemeProvider>
    );
  };

  it('renders device information correctly', () => {
    renderWithTheme(
      <DeviceCard
        deviceName="Fitbit Charge 4"
        deviceType="Smartwatch"
        lastSync="5 minutes ago"
        status="Connected"
        data-testid="device-card"
      />
    );
    
    expect(screen.getByText('Fitbit Charge 4')).toBeInTheDocument();
    expect(screen.getByText('Smartwatch')).toBeInTheDocument();
    expect(screen.getByText('Last sync: 5 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });
  
  it('uses correct icon based on device type', () => {
    const { rerender } = renderWithTheme(
      <DeviceCard
        deviceName="Fitbit Charge 4"
        deviceType="Smartwatch"
        lastSync="5 minutes ago"
        status="Connected"
        data-testid="device-card"
      />
    );
    
    // Check that smartwatch uses steps icon
    let icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon-name', 'steps');
    
    // Test heart rate monitor
    rerender(
      <ThemeProvider theme={baseTheme}>
        <DeviceCard
          deviceName="Polar H10"
          deviceType="Heart Rate Monitor"
          lastSync="10 minutes ago"
          status="Connected"
          data-testid="device-card"
        />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon-name', 'heart');
    
    // Test blood pressure monitor
    rerender(
      <ThemeProvider theme={baseTheme}>
        <DeviceCard
          deviceName="Omron BP Monitor"
          deviceType="Blood Pressure"
          lastSync="15 minutes ago"
          status="Connected"
          data-testid="device-card"
        />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon-name', 'pulse');
  });
  
  it('applies appropriate styling for connected device', () => {
    renderWithTheme(
      <DeviceCard
        deviceName="Fitbit Charge 4"
        deviceType="Smartwatch"
        lastSync="5 minutes ago"
        status="Connected"
        data-testid="device-card"
      />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon-color', 'semantic.success');
  });
  
  it('applies appropriate styling for disconnected device', () => {
    renderWithTheme(
      <DeviceCard
        deviceName="Fitbit Charge 4"
        deviceType="Smartwatch"
        lastSync="1 hour ago"
        status="Disconnected"
        data-testid="device-card"
      />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon-color', 'neutral.gray400');
  });
  
  it('calls onPress callback when card is pressed', () => {
    const mockOnPress = jest.fn();
    renderWithTheme(
      <DeviceCard
        deviceName="Fitbit Charge 4"
        deviceType="Smartwatch"
        lastSync="5 minutes ago"
        status="Connected"
        onPress={mockOnPress}
        data-testid="device-card"
      />
    );
    
    const card = screen.getByLabelText('Fitbit Charge 4, Smartwatch, Connected, Last synced 5 minutes ago');
    fireEvent.click(card);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
  
  it('has correct accessibility attributes', () => {
    renderWithTheme(
      <DeviceCard
        deviceName="Fitbit Charge 4"
        deviceType="Smartwatch"
        lastSync="5 minutes ago"
        status="Connected"
        data-testid="device-card"
      />
    );
    
    const card = screen.getByLabelText('Fitbit Charge 4, Smartwatch, Connected, Last synced 5 minutes ago');
    expect(card).toBeInTheDocument();
  });
});