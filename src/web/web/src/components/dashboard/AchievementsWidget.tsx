import React from 'react';
import { useRouter } from 'next/router'; // latest
import { useAuth } from 'src/web/web/src/hooks/useAuth.ts';
import { useGameProfile } from 'src/web/web/src/hooks/useGamification.ts';
import {
  Card,
  CardProps,
} from 'src/web/design-system/src/components/Card/Card.tsx';
import { Button } from 'src/web/design-system/src/components/Button/Button.tsx';
import { AchievementBadge } from 'src/web/design-system/src/gamification/AchievementBadge/AchievementBadge.tsx';
import { ALL_JOURNEYS } from 'src/web/shared/constants/journeys.ts';
import { GameProfile } from 'src/web/shared/types/gamification.types.ts';
import { useJourney } from 'src/web/web/src/context/JourneyContext.tsx';

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
      <Button
        variant="tertiary"
        size="sm"
        onPress={() => router.push('/achievements')}
      >
        View All Achievements
      </Button>
    </Card>
  );
};