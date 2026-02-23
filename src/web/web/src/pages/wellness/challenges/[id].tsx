import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface ChallengeDetail {
  title: string;
  category: string;
  description: string;
  rules: string[];
  participants: number;
  daysLeft: number;
  progress: number;
  reward: string;
  joined: boolean;
}

const CHALLENGES_DB: Record<string, ChallengeDetail> = {
  '1': {
    title: '7-Day Meditation Streak',
    category: 'Mindfulness',
    description: 'Meditate for at least 10 minutes every day for 7 consecutive days. This challenge helps build a consistent meditation habit that can reduce stress and improve focus.',
    rules: [
      'Meditate for a minimum of 10 minutes each day',
      'Sessions must be logged in the app',
      'Missing a day resets the streak',
      'Any meditation style counts',
    ],
    participants: 234,
    daysLeft: 4,
    progress: 43,
    reward: 'Zen Master Badge',
    joined: true,
  },
  '2': {
    title: '10K Steps Daily',
    category: 'Fitness',
    description: 'Walk at least 10,000 steps every day for 14 days. Regular walking improves cardiovascular health, boosts mood, and helps maintain a healthy weight.',
    rules: [
      'Reach 10,000 steps each day',
      'Steps tracked via phone or fitness device',
      'Challenge runs for 14 consecutive days',
      'Must complete at least 12 of 14 days to earn reward',
    ],
    participants: 567,
    daysLeft: 12,
    progress: 60,
    reward: 'Step Champion Badge',
    joined: true,
  },
};

const DEFAULT_CHALLENGE: ChallengeDetail = {
  title: 'Challenge Not Found',
  category: 'General',
  description: 'This challenge could not be found.',
  rules: [],
  participants: 0,
  daysLeft: 0,
  progress: 0,
  reward: 'N/A',
  joined: false,
};

const ChallengeDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const challengeId = typeof id === 'string' ? id : '';
  const data = CHALLENGES_DB[challengeId] ?? DEFAULT_CHALLENGE;
  const [joined, setJoined] = useState(data.joined);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/wellness/challenges')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to challenges"
      >
        Back
      </button>

      <div style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        <Text fontSize="xs" color={colors.journeys.health.primary} fontWeight="semiBold">{data.category}</Text>
      </div>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
        {data.title}
      </Text>

      <Box display="flex" style={{ gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xl }}>
        <Text fontSize="sm" color={colors.gray[50]}>{data.participants} participants</Text>
        {data.daysLeft > 0 && (
          <Text fontSize="sm" color={colors.semantic.warning}>{data.daysLeft} days left</Text>
        )}
      </Box>

      {data.progress > 0 && (
        <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
          <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.xs }}>
            <Text fontWeight="semiBold" fontSize="md">Your Progress</Text>
            <Text fontWeight="bold" fontSize="lg" color={colors.journeys.health.primary}>{data.progress}%</Text>
          </Box>
          <div style={{ width: '100%', height: 8, backgroundColor: colors.gray[10], borderRadius: 4 }}>
            <div style={{ width: `${data.progress}%`, height: 8, backgroundColor: colors.journeys.health.primary, borderRadius: 4 }} />
          </div>
        </Card>
      )}

      <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
        <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.sm }}>Description</Text>
        <Text fontSize="sm" color={colors.gray[60]} style={{ lineHeight: '1.7' }}>
          {data.description}
        </Text>
      </Card>

      {data.rules.length > 0 && (
        <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
          <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.sm }}>Rules</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
            {data.rules.map((rule, i) => (
              <Box key={i} display="flex" style={{ gap: spacing.xs }}>
                <Text fontSize="sm" color={colors.journeys.health.primary}>*</Text>
                <Text fontSize="sm" color={colors.gray[60]}>{rule}</Text>
              </Box>
            ))}
          </div>
        </Card>
      )}

      <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
        <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.xs }}>Reward</Text>
        <Text fontSize="sm" color={colors.gray[60]}>{data.reward}</Text>
      </Card>

      <Box display="flex" justifyContent="center">
        <Button
          variant={joined ? 'secondary' : 'primary'}
          journey="health"
          onPress={() => setJoined(!joined)}
          accessibilityLabel={joined ? 'Leave challenge' : 'Join challenge'}
        >
          {joined ? 'Leave Challenge' : 'Join Challenge'}
        </Button>
      </Box>
    </div>
  );
};

export default ChallengeDetailPage;
