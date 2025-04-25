import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Avatar } from './Avatar';
import { colors } from '../../tokens/colors';
import { baseTheme } from '../../themes/base.theme';

// Helper function to render components with the theme provider
const renderWithTheme = (ui: React.ReactNode, theme = baseTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('Avatar', () => {
  it('renders with an image', () => {
    renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        alt="User avatar" 
      />
    );
    
    const img = screen.getByAltText('User avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });
  
  it('renders with fallback icon when no image is provided', () => {
    renderWithTheme(
      <Avatar 
        fallbackType="icon"
      />
    );
    
    // The Icon should be rendered when using icon fallback
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
  
  it('renders with initials when no image or icon is provided', () => {
    renderWithTheme(
      <Avatar 
        name="John Doe"
      />
    );
    
    const initials = screen.getByTestId('avatar-initials');
    expect(initials).toBeInTheDocument();
    expect(initials).toHaveTextContent('JD');
  });
  
  it('renders with different sizes', () => {
    // Small size
    const { rerender } = renderWithTheme(
      <Avatar 
        size="24px"
        name="John Doe"
      />
    );
    
    let container = screen.getByTestId('avatar');
    expect(container).toHaveStyle('width: 24px');
    expect(container).toHaveStyle('height: 24px');
    
    // Medium size (default)
    rerender(
      <ThemeProvider theme={baseTheme}>
        <Avatar 
          size="40px"
          name="John Doe"
        />
      </ThemeProvider>
    );
    
    container = screen.getByTestId('avatar');
    expect(container).toHaveStyle('width: 40px');
    expect(container).toHaveStyle('height: 40px');
    
    // Large size
    rerender(
      <ThemeProvider theme={baseTheme}>
        <Avatar 
          size="56px"
          name="John Doe"
        />
      </ThemeProvider>
    );
    
    container = screen.getByTestId('avatar');
    expect(container).toHaveStyle('width: 56px');
    expect(container).toHaveStyle('height: 56px');
  });
  
  it('handles image loading errors', () => {
    const onImageError = jest.fn();
    
    renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        name="John Doe"
        onImageError={onImageError}
      />
    );
    
    const img = screen.getByAltText('Avatar for John Doe');
    fireEvent.error(img);
    
    expect(onImageError).toHaveBeenCalled();
    
    // After the error, we should see the fallback (initials by default)
    const initials = screen.getByTestId('avatar-initials');
    expect(initials).toBeInTheDocument();
    expect(initials).toHaveTextContent('JD');
  });
  
  it('uses journey colors when provided', () => {
    renderWithTheme(
      <Avatar 
        name="John Doe"
        journey="health"
      />
    );
    
    const container = screen.getByTestId('avatar');
    // The Avatar component uses inline styles for journey colors
    expect(container).toHaveStyle(`background-color: ${colors.journeys.health.primary}`);
  });
  
  it('shows fallback when showFallback is true, even with src', () => {
    renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        name="John Doe"
        showFallback={true}
      />
    );
    
    // We should not see the image
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
    
    // We should see the initials
    const initials = screen.getByTestId('avatar-initials');
    expect(initials).toBeInTheDocument();
  });
  
  it('uses custom testID when provided', () => {
    renderWithTheme(
      <Avatar 
        name="John Doe"
        testID="custom-avatar"
      />
    );
    
    expect(screen.getByTestId('custom-avatar')).toBeInTheDocument();
  });
  
  it('extracts correct initials from name', () => {
    // Test full name
    const { rerender } = renderWithTheme(
      <Avatar 
        name="John Doe"
      />
    );
    
    expect(screen.getByTestId('avatar-initials')).toHaveTextContent('JD');
    
    // Test single name
    rerender(
      <ThemeProvider theme={baseTheme}>
        <Avatar 
          name="John"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('avatar-initials')).toHaveTextContent('J');
    
    // Test name with multiple parts
    rerender(
      <ThemeProvider theme={baseTheme}>
        <Avatar 
          name="John Middle Doe"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('avatar-initials')).toHaveTextContent('JD');
  });
});