import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { AchievementNotification } from './AchievementNotification';

describe('AchievementNotification', () => {
    it('renders correctly with achievement details', () => {
        // Define an achievement object with sample data.
        const achievement = {
            id: '123',
            title: 'Test Achievement',
            description: 'This is a test achievement description.',
            journey: 'health' as const,
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
        // AchievementBadge aria-label template: "${title} achievement. ${description}. ${status}"
        // The description already ends with "." so the aria-label contains ".." before "Unlocked"
        expect(
            screen.getByLabelText('Test Achievement achievement. This is a test achievement description.. Unlocked')
        ).toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        // Define an achievement object with sample data.
        const achievement = {
            id: '123',
            title: 'Test Achievement',
            description: 'This is a test achievement description.',
            journey: 'health' as const,
            icon: 'test-icon',
            progress: 100,
            total: 100,
            unlocked: true,
        };

        // Create a mock onClose function.
        const onCloseMock = jest.fn();

        // Render the AchievementNotification with the achievement and mock onClose.
        render(<AchievementNotification achievement={achievement} onClose={onCloseMock} />);

        // Simulate a click on the close button.
        const closeButton = screen.getByRole('button', { name: 'OK' });
        fireEvent.click(closeButton);

        // Assertion: Verify that the onClose function is called.
        expect(onCloseMock).toHaveBeenCalled();
    });
});
