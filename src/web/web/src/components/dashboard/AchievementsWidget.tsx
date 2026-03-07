import React from 'react';
import { useRouter } from 'next/router'; // latest
import { useAuth } from '@/hooks/useAuth';
import { useGameProfile } from '@/hooks/useGamification';
import { Card, CardProps } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { AchievementBadge } from 'design-system/gamification/AchievementBadge/AchievementBadge';
import { ALL_JOURNEYS } from 'shared/constants/journeys';
import { GameProfile } from 'shared/types/gamification.types';
import { useJourney } from '@/context/JourneyContext';

/**
 * Displays a list of recent achievements with a link to the full achievement gallery.
 */
export const AchievementsWidget: React.FC = () => {
    // LA1: Uses the `useAuth` hook to get the user ID.
    const { session } = useAuth();
    const userId = session?.userId;

    // LA2: Uses the `useGameProfile` hook to fetch the user's game profile data.
    const { data: gameProfileData, isLoading } = useGameProfile(userId || '');

    // LA3: Filters the achievements to get the most recent 5 achievements.
    const achievements = gameProfileData?.gameProfile?.achievements?.slice(0, 5) || [];

    // LA4: Renders a `Card` component to display the achievements.
    const router = useRouter();
    const { journeyData } = useJourney();

    if (isLoading) {
        return (
            <Card>
                <p>Loading achievements...</p>
            </Card>
        );
    }

    // LA5: Maps over the recent achievements and renders an `AchievementBadge` for each.
    // LA6: Renders a `Button` component to link to the full achievement gallery.
    return (
        <Card title="Recent Achievements">
            {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} size="sm" />
            ))}
            <Button variant="tertiary" size="sm" onPress={() => router.push('/achievements')}>
                View All Achievements
            </Button>
        </Card>
    );
};
