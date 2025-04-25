import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; // Version ^14.0.0
import { describe, it, expect } from '@jest/globals'; // Version ^29.0.0
import { AchievementNotification } from './AchievementNotification';
import { AchievementNotificationProps } from './AchievementNotification'; // Component being tested.

describe('AchievementNotification', () => {
  it('renders correctly with achievement details', () => {
    // Define an achievement object with sample data.
    const achievement = {
      id: '123',
      title: 'Test Achievement',
      description: 'This is a test achievement description.',
      journey: 'health',
      icon: 'test-icon',
      progress: 100,
      total: 100,
      unlocked: true,
    };

    // Action: Render the AchievementNotification component with the achievement object.
    render(<AchievementNotification achievement={achievement} onClose={() => {}} />);

    // Assertion: Verify that the achievement title is displayed.
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();

    // Assertion: Verify that the achievement description is displayed.
    expect(screen.getByText('This is a test achievement description.')).toBeInTheDocument();

    // Assertion: Verify that the AchievementBadge component is rendered with the correct achievement data.
    expect(screen.getByLabelText('Test Achievement achievement. This is a test achievement description. Unlocked')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    // Define an achievement object with sample data.
    const achievement = {
      id: '123',
      title: 'Test Achievement',
      description: 'This is a test achievement description.',
      journey: 'health',
      icon: 'test-icon',
      progress: 100,
      total: 100,
      unlocked: true,
    };

    // Create a mock onClose function.
    const onCloseMock = jest.fn();

    // Action: Render the AchievementNotification component with the achievement object and the mock onClose function.
    render(<AchievementNotification achievement={achievement} onClose={onCloseMock} />);

    // Simulate a click on the close button.
    const closeButton = screen.getByRole('button', { name: 'OK' });
    fireEvent.press(closeButton);

    // Assertion: Verify that the onClose function is called.
    expect(onCloseMock).toHaveBeenCalled();
  });
});