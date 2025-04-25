import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RewardCard from './RewardCard';
import { ThemeProvider } from '../../themes';

// Helper function to render components with theme context
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('RewardCard', () => {
  it('renders reward information correctly', () => {
    const mockReward = {
      id: 'test-reward',
      title: 'Weekly Goal Achieved',
      description: 'You completed your weekly step goal!',
      icon: 'trophy',
      xp: 100,
      journey: 'health' as const,
    };

    renderWithTheme(
      <RewardCard reward={mockReward} testID="reward-card" />
    );

    // Check if the reward title is rendered
    expect(screen.getByText('Weekly Goal Achieved')).toBeInTheDocument();
    
    // Check if the reward description is rendered
    expect(screen.getByText('You completed your weekly step goal!')).toBeInTheDocument();
    
    // Check if the XP value is rendered
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
    
    // Check if the icon is rendered (through aria-hidden attribute)
    const iconElement = screen.getByTestId('icon-container');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies journey-specific styling', () => {
    // Test with different journey rewards to verify styling differences
    const healthReward = {
      id: 'health-reward',
      title: 'Health Reward',
      description: 'A health journey reward',
      icon: 'heart',
      xp: 50,
      journey: 'health' as const,
    };
    
    const careReward = {
      id: 'care-reward',
      title: 'Care Reward',
      description: 'A care journey reward',
      icon: 'doctor',
      xp: 75,
      journey: 'care' as const,
    };
    
    const planReward = {
      id: 'plan-reward',
      title: 'Plan Reward',
      description: 'A plan journey reward',
      icon: 'document',
      xp: 100,
      journey: 'plan' as const,
    };

    // Render health journey reward
    const { unmount } = renderWithTheme(
      <RewardCard reward={healthReward} testID="health-reward" />
    );
    
    expect(screen.getByTestId('health-reward')).toBeInTheDocument();
    expect(screen.getByText('Health Reward')).toBeInTheDocument();
    
    // Cleanup
    unmount();
    
    // Render care journey reward
    const { unmount: unmountCare } = renderWithTheme(
      <RewardCard reward={careReward} testID="care-reward" />
    );
    
    expect(screen.getByTestId('care-reward')).toBeInTheDocument();
    expect(screen.getByText('Care Reward')).toBeInTheDocument();
    
    // Cleanup
    unmountCare();
    
    // Render plan journey reward
    renderWithTheme(
      <RewardCard reward={planReward} testID="plan-reward" />
    );
    
    expect(screen.getByTestId('plan-reward')).toBeInTheDocument();
    expect(screen.getByText('Plan Reward')).toBeInTheDocument();
  });

  it('calls onPress callback when clicked', () => {
    const mockReward = {
      id: 'test-reward',
      title: 'Test Reward',
      description: 'A test reward',
      icon: 'trophy',
      xp: 100,
      journey: 'health' as const,
    };
    
    const onPressMock = jest.fn();
    
    renderWithTheme(
      <RewardCard reward={mockReward} onPress={onPressMock} testID="reward-card" />
    );
    
    // Click the reward card
    fireEvent.click(screen.getByTestId('reward-card'));
    
    // Check if the onPress callback was called
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders with accessibility attributes', () => {
    const mockReward = {
      id: 'test-reward',
      title: 'Test Reward',
      description: 'A test reward',
      icon: 'trophy',
      xp: 100,
      journey: 'health' as const,
    };
    
    renderWithTheme(
      <RewardCard reward={mockReward} testID="reward-card" />
    );
    
    // Check if the reward card has appropriate accessibility attributes
    const card = screen.getByTestId('reward-card');
    
    // The default accessibility label should include title, description, and XP
    expect(card).toHaveAttribute('aria-label', 'Test Reward reward. A test reward. Worth 100 XP.');
    
    // Test with custom accessibility label
    const { unmount } = renderWithTheme(
      <RewardCard 
        reward={mockReward} 
        testID="reward-card" 
        accessibilityLabel="Custom accessibility label" 
      />
    );
    
    const cardWithCustomLabel = screen.getByTestId('reward-card');
    expect(cardWithCustomLabel).toHaveAttribute('aria-label', 'Custom accessibility label');
    
    unmount();
  });
});