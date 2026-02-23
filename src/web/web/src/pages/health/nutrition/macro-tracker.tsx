import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

type Period = '7d' | '30d';

const MACROS = [
  { label: 'Carbs', actual: 210, target: 250, unit: 'g', color: colors.semantic.warning },
  { label: 'Protein', actual: 82, target: 100, unit: 'g', color: colors.journeys.health.primary },
  { label: 'Fat', actual: 55, target: 70, unit: 'g', color: colors.journeys.health.secondary },
];

const WEEKLY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKLY_CALORIES = [1820, 2100, 1650, 1940, 1780, 2200, 1840];

const MacroTrackerPage: React.FC = () => {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('7d');

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/health/nutrition')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to nutrition home"
      >
        Back
      </button>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text} style={{ marginTop: spacing.md }}>
        Macro Tracker
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Monitor your macronutrient intake against daily targets
      </Text>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Today's Macros
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
        {MACROS.map((macro) => {
          const pct = Math.round((macro.actual / macro.target) * 100);
          return (
            <Card key={macro.label} journey="health" elevation="sm" padding="md">
              <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.xs }}>
                <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text}>{macro.label}</Text>
                <Text fontSize="sm" color={colors.gray[50]}>{macro.actual}{macro.unit} / {macro.target}{macro.unit}</Text>
              </Box>
              <div style={{ height: 8, borderRadius: '4px', backgroundColor: colors.gray[10], overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, borderRadius: '4px', backgroundColor: macro.color }} />
              </div>
              <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>{pct}% of goal</Text>
            </Card>
          );
        })}
      </div>

      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.sm }}>
        <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text}>
          Overview
        </Text>
        <Box display="flex" style={{ gap: spacing.xs }}>
          {(['7d', '30d'] as Period[]).map((p) => (
            <Button key={p} variant={period === p ? 'primary' : 'secondary'} journey="health" onPress={() => setPeriod(p)} accessibilityLabel={`${p} view`}>
              {p}
            </Button>
          ))}
        </Box>
      </Box>
      <Card journey="health" elevation="sm" padding="md">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: spacing.xs }}>
          {WEEKLY_DAYS.map((day, i) => (
            <div key={day} style={{ textAlign: 'center' }}>
              <Text fontSize="xs" color={colors.gray[40]}>{day}</Text>
              <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary} style={{ marginTop: spacing['3xs'] }}>
                {WEEKLY_CALORIES[i]}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MacroTrackerPage;
