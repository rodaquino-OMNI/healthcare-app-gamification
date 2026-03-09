import { render, screen } from '@testing-library/react';
import { expect } from 'expect';
import React from 'react';

import { AchievementBadge } from '../../gamification/AchievementBadge/AchievementBadge';

describe('AchievementBadge', () => {
    it('renders correctly for locked achievement', () => {
        const achievement = {
            id: 'test-achievement',
            title: 'Test Achievement',
            description: 'This is a test achievement',
            icon: 'trophy',
            progress: 5,
            total: 10,
            unlocked: false,
            journey: 'health',
        };

        render(<AchievementBadge achievement={achievement} />);

        // Check the accessibility label contains the achievement title and progress info
        const badge = screen.getByLabelText(/Test Achievement.*Progress: 5 of 10/);
        expect(badge).toBeInTheDocument();

        // Check the progress ring is displayed with correct progress value
        const progressRing = screen.getByTestId('progress-ring');
        expect(progressRing).toBeInTheDocument();
        expect(progressRing).toHaveAttribute('aria-valuenow', '50');
    });

    it('renders correctly for unlocked achievement', () => {
        const achievement = {
            id: 'test-achievement',
            title: 'Test Achievement',
            description: 'This is a test achievement',
            icon: 'trophy',
            progress: 10,
            total: 10,
            unlocked: true,
            journey: 'health',
        };

        render(<AchievementBadge achievement={achievement} />);

        // Check the accessibility label contains the achievement title and unlocked status
        const badge = screen.getByLabelText(/Test Achievement.*Unlocked/);
        expect(badge).toBeInTheDocument();

        // Check the progress ring is not displayed for unlocked achievements
        expect(screen.queryByTestId('progress-ring')).not.toBeInTheDocument();

        // Check the unlocked indicator is displayed
        expect(screen.getByTestId('unlocked-indicator')).toBeInTheDocument();
    });

    it('applies journey-specific styling', () => {
        const healthAchievement = {
            id: 'health-achievement',
            title: 'Health Achievement',
            description: 'This is a health achievement',
            icon: 'heart',
            progress: 10,
            total: 10,
            unlocked: true,
            journey: 'health',
        };

        const careAchievement = {
            id: 'care-achievement',
            title: 'Care Achievement',
            description: 'This is a care achievement',
            icon: 'medical-bag',
            progress: 10,
            total: 10,
            unlocked: true,
            journey: 'care',
        };

        // First render with health journey
        const { rerender } = render(<AchievementBadge achievement={healthAchievement} />);

        // Check health journey specific styling (green color)
        expect(screen.getByTestId('badge-container')).toHaveStyle({
            borderColor: expect.stringMatching(/#0ACF83/i),
        });

        // Re-render with care journey
        rerender(<AchievementBadge achievement={careAchievement} />);

        // Check care journey specific styling (orange color)
        expect(screen.getByTestId('badge-container')).toHaveStyle({
            borderColor: expect.stringMatching(/#FF8C42/i),
        });
    });
});
