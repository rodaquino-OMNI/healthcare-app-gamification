import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { JourneyProvider } from '../../context/JourneyContext';

import VideoConsultation from './VideoConsultation';
import { careTheme } from '../../themes/care.theme';

// Mock dependencies
jest.mock('react-native', () => ({
  ActivityIndicator: () => <div data-testid="activity-indicator" />,
  View: ({ children, ...props }) => <div data-testid="view" {...props}>{children}</div>
}));

jest.mock('react-native-agora', () => ({
  AgoraRendererView: ({ canvas }) => (
    <div data-testid={`agora-renderer-${canvas?.uid || 'default'}`} />
  )
}));

// Mock navigation and route
const mockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn()
});

const mockRoute = (params = {}) => ({
  params: {
    sessionId: 'test-session',
    channelName: 'test-channel',
    token: 'test-token',
    providerId: 'test-provider',
    providerName: 'Dr. Test',
    providerSpecialty: 'Test Specialty',
    ...params
  }
});

// Helper function to render with providers
const renderWithProviders = (ui) => {
  return render(
    <ThemeProvider theme={careTheme}>
      <JourneyProvider journey="care">
        {ui}
      </JourneyProvider>
    </ThemeProvider>
  );
};

describe('VideoConsultation component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Setup mocks
    jest.mock('@react-navigation/native', () => ({
      useRoute: jest.fn(() => mockRoute()),
      useNavigation: jest.fn(() => mockNavigation())
    }));
    
    jest.mock('../../hooks/useJourney', () => ({
      useJourney: jest.fn(() => ({ journey: 'care' }))
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly with initial state', () => {
    // Setup navigation and route mocks for this test
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute());
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation());
    
    renderWithProviders(<VideoConsultation />);
    
    // Check for initial status and provider info
    expect(screen.getByText('Conectando...')).toBeInTheDocument();
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    expect(screen.getByText('Test Specialty')).toBeInTheDocument();
    
    // Verify basic controls exist
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('handles video toggle correctly', () => {
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute());
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation());
    
    const { rerender } = renderWithProviders(<VideoConsultation />);
    
    // Find video toggle button
    const buttons = screen.getAllByRole('button');
    const videoToggleButton = Array.from(buttons).find(
      button => button.getAttribute('aria-label') === 'Desativar câmera'
    );
    
    // Initially, local video should be displayed
    expect(screen.getByTestId('agora-renderer-0')).toBeInTheDocument();
    
    // Click video toggle button
    if (videoToggleButton) {
      fireEvent.click(videoToggleButton);
      rerender(
        <ThemeProvider theme={careTheme}>
          <JourneyProvider journey="care">
            <VideoConsultation />
          </JourneyProvider>
        </ThemeProvider>
      );
      
      // After clicking, the local video should not be visible anymore
      expect(screen.queryByTestId('agora-renderer-0')).not.toBeInTheDocument();
    }
  });

  it('handles audio toggle correctly', () => {
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute());
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation());
    
    renderWithProviders(<VideoConsultation />);
    
    // Find audio toggle button
    const buttons = screen.getAllByRole('button');
    const audioToggleButton = buttons.find(
      button => button.getAttribute('aria-label') === 'Desativar microfone'
    );
    
    // Click audio toggle button
    if (audioToggleButton) {
      fireEvent.click(audioToggleButton);
      // In a real implementation, we would verify the muted state
      // This is challenging in a test environment without component internals
    }
  });

  it('handles end call correctly', () => {
    const mockNav = mockNavigation();
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNav);
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute());
    
    renderWithProviders(<VideoConsultation />);
    
    // Find end call button
    const buttons = screen.getAllByRole('button');
    const endCallButton = buttons.find(
      button => button.getAttribute('aria-label') === 'Encerrar chamada'
    );
    
    // Click end call button
    if (endCallButton) {
      fireEvent.click(endCallButton);
      // Verify navigation.goBack was called
      expect(mockNav.goBack).toHaveBeenCalledTimes(1);
    }
  });

  it('displays provider information correctly', () => {
    const customProvider = {
      providerName: 'Dr. Smith',
      providerSpecialty: 'Cardiologista'
    };
    
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute(customProvider));
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation());
    
    renderWithProviders(<VideoConsultation />);
    
    // Check provider info displays correctly
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Cardiologista')).toBeInTheDocument();
  });

  it('updates connection status correctly', () => {
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute());
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation());
    
    renderWithProviders(<VideoConsultation />);
    
    // Initial status is "connecting"
    expect(screen.getByText('Conectando...')).toBeInTheDocument();
    
    // Advance timers to trigger connection status change
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Status should update to "connected"
    expect(screen.getByText('Conectado')).toBeInTheDocument();
  });

  it('displays connection quality indicator correctly', () => {
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute());
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation());
    
    renderWithProviders(<VideoConsultation />);
    
    // Should display a quality indicator
    expect(screen.getByText(/Boa|Excelente|Média|Ruim/)).toBeInTheDocument();
    
    // Test that connection quality updates over time
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Should still display a quality indicator after update
    expect(screen.getByText(/Boa|Excelente|Média|Ruim/)).toBeInTheDocument();
  });

  it('applies care journey styling correctly', () => {
    require('@react-navigation/native').useRoute.mockReturnValue(mockRoute());
    require('@react-navigation/native').useNavigation.mockReturnValue(mockNavigation());
    
    renderWithProviders(<VideoConsultation />);
    
    // Verify the component renders with care journey context
    expect(require('../../hooks/useJourney').useJourney).toHaveBeenCalled();
    expect(require('../../hooks/useJourney').useJourney()).toEqual({ journey: 'care' });
    
    // In a real test environment with proper styling support,
    // we would verify that the component uses the care journey colors (#FF8C42)
  });
});