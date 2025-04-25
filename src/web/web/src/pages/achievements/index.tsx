import React, { useEffect, useState } from 'react'; // React v18.0+
import { useRouter } from 'next/router'; // Next.js v13.0+
import { GameProfile } from 'src/web/shared/types/gamification.types.ts';
import { useGameProfile } from 'src/web/web/src/hooks/useGamification.ts';
import AchievementBadge from 'src/web/design-system/src/gamification/AchievementBadge/index.ts';
import { Stack } from 'src/web/design-system/src/primitives/Stack';
import { Text } from 'src/web/design-system/src/components/index.ts';
import { Card } from 'src/web/design-system/src/components/Card';
import { JourneyContext, useJourney } from 'src/web/web/src/context/JourneyContext.tsx';
import { WEB_HEALTH_ROUTES, WEB_CARE_ROUTES, WEB_PLAN_ROUTES } from 'src/web/shared/constants/routes.ts';

/**
 * Achievements: Renders a gallery of achievements, grouped by journey.
 *
 * @returns A React component displaying the achievements.
 */
const Achievements: React.FC = () => {
  // LD1: Retrieves the user ID from the authentication context.
  const userId = 'user-123'; // Replace with actual user ID from auth context

  // LD1: Fetches the user's game profile using the `useGameProfile` hook.
  const { data: gameProfileData, isLoading, error } = useGameProfile(userId);

  // LD1: If the game profile is loading, renders a loading indicator.
  if (isLoading) {
    return <Text>Loading achievements...</Text>;
  }

  // LD1: If there is an error fetching the game profile, renders an error message.
  if (error) {
    return <Text>Error loading achievements.</Text>;
  }

  // LD1: If the game profile data is available, groups the achievements by journey.
  const achievementsByJourney = gameProfileData?.gameProfile?.achievements.reduce((acc: { [key: string]: any }, achievement) => {
    if (!acc[achievement.journey]) {
      acc[achievement.journey] = [];
    }
    acc[achievement.journey].push(achievement);
    return acc;
  }, {});

  // LD1: Renders a `Stack` component to layout the achievements.
  return (
    <Stack direction="column" gap="md">
      {/* LD1: For each journey, renders a `Card` component with the journey title and a list of `AchievementBadge` components. */}
      {Object.entries(achievementsByJourney || {}).map(([journey, achievements]: [string, any]) => (
        <Card key={journey} journey={journey}>
          <Text fontWeight="bold" fontSize="xl">{journey.toUpperCase()} Achievements</Text>
          <Stack direction="row" gap="md" flexWrap="wrap">
            {achievements.map((achievement: any) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </Stack>
        </Card>
      ))}

      {/* LD1: If there are no achievements for a journey, renders a message indicating that no achievements have been earned yet. */}
      {achievementsByJourney && Object.keys(achievementsByJourney).length === 0 && (
        <Text>No achievements earned yet.</Text>
      )}
    </Stack>
  );
};

// LD1: Exports the Achievements component as the default export.
export default Achievements;