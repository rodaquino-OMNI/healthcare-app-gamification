import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { ProviderCard } from './ProviderCard';
import { careTheme } from '../../../themes/care.theme';

// Helper function to render components with the Care journey theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={careTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ProviderCard', () => {
  // Mock provider data for testing
  const mockProvider = {
    id: 'provider-1',
    name: 'Dr. Carlos Silva',
    specialty: 'Cardiologista',
    rating: 4.5,
    reviewCount: 32,
    location: {
      name: 'Hospital São Lucas',
      distance: 3.5
    },
    availability: [
      {
        date: 'Hoje',
        times: ['14:00', '15:30', '16:45']
      }
    ],
    isCoveredByInsurance: true,
    isTelemedicineAvailable: true
  };

  it('renders provider name correctly', () => {
    renderWithTheme(<ProviderCard provider={mockProvider} />);
    expect(screen.getByText('Dr. Carlos Silva')).toBeInTheDocument();
  });

  it('renders provider specialty correctly', () => {
    renderWithTheme(<ProviderCard provider={mockProvider} />);
    expect(screen.getByText('Cardiologista')).toBeInTheDocument();
  });

  it('renders provider location correctly', () => {
    renderWithTheme(<ProviderCard provider={mockProvider} />);
    const locationText = `${mockProvider.location.name} - ${mockProvider.location.distance}km`;
    expect(screen.getByText(locationText)).toBeInTheDocument();
  });

  it('renders provider rating correctly', () => {
    renderWithTheme(<ProviderCard provider={mockProvider} />);
    expect(screen.getByText(`(${mockProvider.reviewCount} avaliações)`)).toBeInTheDocument();
  });

  it('displays telemedicine availability indicator when available', () => {
    renderWithTheme(<ProviderCard provider={mockProvider} />);
    expect(screen.getByText('Telemedicina disponível')).toBeInTheDocument();
  });

  it('does not display telemedicine availability indicator when not available', () => {
    const providerWithoutTelemedicine = {
      ...mockProvider,
      isTelemedicineAvailable: false
    };
    renderWithTheme(<ProviderCard provider={providerWithoutTelemedicine} />);
    expect(screen.queryByText('Telemedicina disponível')).not.toBeInTheDocument();
  });

  it('calls onPress callback when card is clicked', () => {
    const mockOnPress = jest.fn();
    renderWithTheme(<ProviderCard provider={mockProvider} onPress={mockOnPress} />);
    
    const button = screen.getByText('Agendar Consulta');
    fireEvent.click(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies care journey theme correctly', () => {
    renderWithTheme(<ProviderCard provider={mockProvider} />);
    
    // The card should be rendered with the care journey's primary color as the border
    const card = screen.getByLabelText(`Prestador: ${mockProvider.name}, ${mockProvider.specialty}`);
    expect(card).toBeInTheDocument();
    
    // Note: Testing actual styles would require additional test utilities
    // This test is primarily confirming the component renders within the theme context
  });

  it('renders with accessible attributes', () => {
    renderWithTheme(<ProviderCard provider={mockProvider} />);
    
    // Check that the card has proper aria attributes
    const cardLabel = `Prestador: ${mockProvider.name}, ${mockProvider.specialty}`;
    expect(screen.getByLabelText(cardLabel)).toBeInTheDocument();
    
    // Check that the button has proper accessibility
    const buttonLabel = `Agendar consulta com ${mockProvider.name}`;
    expect(screen.getByLabelText(buttonLabel)).toBeInTheDocument();
  });
});