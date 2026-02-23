import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface CycleRecord {
  id: string;
  startDate: string;
  endDate: string;
  length: number;
  periodDays: number;
  flow: string;
}

const MOCK_CYCLES: CycleRecord[] = [
  { id: '1', startDate: 'Jan 28, 2026', endDate: 'Feb 24, 2026', length: 28, periodDays: 5, flow: 'Medium' },
  { id: '2', startDate: 'Dec 31, 2025', endDate: 'Jan 27, 2026', length: 28, periodDays: 4, flow: 'Light' },
  { id: '3', startDate: 'Dec 2, 2025', endDate: 'Dec 30, 2025', length: 29, periodDays: 5, flow: 'Heavy' },
  { id: '4', startDate: 'Nov 5, 2025', endDate: 'Dec 1, 2025', length: 27, periodDays: 5, flow: 'Medium' },
  { id: '5', startDate: 'Oct 8, 2025', endDate: 'Nov 4, 2025', length: 28, periodDays: 4, flow: 'Medium' },
  { id: '6', startDate: 'Sep 10, 2025', endDate: 'Oct 7, 2025', length: 28, periodDays: 5, flow: 'Light' },
];

const AVERAGES = {
  cycleLength: '28.0 days',
  periodLength: '4.7 days',
  cyclesTracked: '6',
};

const flowColor = (flow: string): string => {
  if (flow === 'Heavy') return colors.semantic.error;
  if (flow === 'Medium') return colors.semantic.warning;
  return colors.journeys.health.primary;
};

const HistoryPage: React.FC = () => {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/health/cycle')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to cycle home"
      >
        Back
      </button>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text} style={{ marginTop: spacing.md }}>
        Cycle History
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Review your past cycles and trends
      </Text>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm, marginBottom: spacing.xl }}>
        {Object.entries(AVERAGES).map(([key, val]) => (
          <Card key={key} journey="health" elevation="sm" padding="md">
            <Text fontSize="xs" color={colors.gray[50]}>{key === 'cycleLength' ? 'Avg Cycle' : key === 'periodLength' ? 'Avg Period' : 'Tracked'}</Text>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>{val}</Text>
          </Card>
        ))}
      </div>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Past Cycles
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
        {MOCK_CYCLES.map((cycle) => (
          <Card key={cycle.id} journey="health" elevation="sm" padding="md">
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Text fontWeight="semiBold" fontSize="md">{cycle.startDate}</Text>
                <Text fontSize="sm" color={colors.gray[50]}>to {cycle.endDate}</Text>
              </Box>
              <Text fontSize="sm" fontWeight="semiBold" color={flowColor(cycle.flow)}>{cycle.flow}</Text>
            </Box>
            <div style={{ height: 1, backgroundColor: colors.gray[10], margin: `${spacing.xs} 0` }} />
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Text fontSize="xs" color={colors.gray[40]}>Cycle</Text>
                <Text fontSize="sm" fontWeight="medium">{cycle.length} days</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color={colors.gray[40]}>Period</Text>
                <Text fontSize="sm" fontWeight="medium">{cycle.periodDays} days</Text>
              </Box>
            </Box>
          </Card>
        ))}
      </div>

      <Box display="flex" justifyContent="center">
        <Button variant="secondary" journey="health" onPress={() => router.push('/health/cycle/export')} accessibilityLabel="Export history">
          Export History
        </Button>
      </Box>
    </div>
  );
};

export default HistoryPage;
