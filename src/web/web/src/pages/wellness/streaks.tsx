import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const CURRENT_STREAK = 12;
const BEST_STREAK = 28;

interface Milestone {
  label: string;
  days: number;
  earned: boolean;
}

const MILESTONES: Milestone[] = [
  { label: '7 Day Streak', days: 7, earned: true },
  { label: '30 Day Streak', days: 30, earned: false },
  { label: '90 Day Streak', days: 90, earned: false },
];

interface Reward {
  id: string;
  title: string;
  earnedDate: string;
}

const REWARDS: Reward[] = [
  { id: '1', title: 'First Week Champion', earnedDate: 'Feb 18, 2026' },
  { id: '2', title: 'Consistent Tracker', earnedDate: 'Feb 15, 2026' },
  { id: '3', title: 'Early Bird', earnedDate: 'Feb 12, 2026' },
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateCalendarHeatmap = (): { day: number; active: boolean }[][] => {
  const weeks: { day: number; active: boolean }[][] = [];
  let dayCounter = 1;
  for (let w = 0; w < 4; w++) {
    const week: { day: number; active: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({ day: dayCounter, active: dayCounter <= 23 && Math.random() > 0.2 });
      dayCounter++;
    }
    weeks.push(week);
  }
  return weeks;
};

const StreaksPage: React.FC = () => {
  const router = useRouter();
  const calendarWeeks = generateCalendarHeatmap();

  const handleShare = () => {
    window.alert('Share feature coming soon.');
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/wellness')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to wellness home"
      >
        Back
      </button>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text} style={{ marginTop: spacing.md }}>
        Streaks &amp; Rewards
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Stay consistent and earn rewards
      </Text>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, marginBottom: spacing.lg }}>
        <Card journey="health" elevation="sm" padding="md">
          <Text fontSize="xs" color={colors.gray[50]}>Current Streak</Text>
          <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.primary}>{CURRENT_STREAK} days</Text>
        </Card>
        <Card journey="health" elevation="sm" padding="md">
          <Text fontSize="xs" color={colors.gray[50]}>Best Streak</Text>
          <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.secondary}>{BEST_STREAK} days</Text>
        </Card>
      </div>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Milestones
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
        {MILESTONES.map((milestone) => (
          <Card key={milestone.label} journey="health" elevation="sm" padding="md">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontWeight="semiBold" fontSize="md">{milestone.label}</Text>
                <Text fontSize="xs" color={colors.gray[40]}>{milestone.days} consecutive days</Text>
              </Box>
              <Text
                fontSize="sm"
                fontWeight="semiBold"
                color={milestone.earned ? colors.journeys.health.primary : colors.gray[30]}
              >
                {milestone.earned ? 'Earned' : `${milestone.days - CURRENT_STREAK} days away`}
              </Text>
            </Box>
            <div style={{ width: '100%', height: 4, backgroundColor: colors.gray[10], borderRadius: 2, marginTop: spacing.xs }}>
              <div style={{ width: `${Math.min((CURRENT_STREAK / milestone.days) * 100, 100)}%`, height: 4, backgroundColor: milestone.earned ? colors.journeys.health.primary : colors.semantic.warning, borderRadius: 2 }} />
            </div>
          </Card>
        ))}
      </div>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Activity Calendar
      </Text>
      <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: spacing['3xs'], textAlign: 'center' }}>
          {DAY_LABELS.map((d) => (
            <Text key={d} fontSize="xs" fontWeight="semiBold" color={colors.gray[40]}>{d}</Text>
          ))}
          {calendarWeeks.flat().map((cell, i) => (
            <div
              key={i}
              style={{
                height: 28,
                borderRadius: 4,
                backgroundColor: cell.active ? `${colors.journeys.health.primary}` : colors.gray[10],
                opacity: cell.active ? 0.3 + (cell.day / 28) * 0.7 : 1,
              }}
            />
          ))}
        </div>
      </Card>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Rewards Earned
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
        {REWARDS.map((reward) => (
          <Card key={reward.id} journey="health" elevation="sm" padding="md">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text fontWeight="semiBold" fontSize="md">{reward.title}</Text>
              <Text fontSize="xs" color={colors.gray[40]}>{reward.earnedDate}</Text>
            </Box>
          </Card>
        ))}
      </div>

      <Box display="flex" justifyContent="center">
        <Button variant="secondary" journey="health" onPress={handleShare} accessibilityLabel="Share streak">
          Share Streak
        </Button>
      </Box>
    </div>
  );
};

export default StreaksPage;
