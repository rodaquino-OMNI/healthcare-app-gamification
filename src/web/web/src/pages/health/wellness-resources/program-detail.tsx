import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const STEPS = [
  { id: 1, title: 'Introduction & Goal Setting', done: true },
  { id: 2, title: 'Understanding the Basics', done: true },
  { id: 3, title: 'Building Your Foundation', done: true },
  { id: 4, title: 'Developing Core Habits', done: false },
  { id: 5, title: 'Intermediate Techniques', done: false },
  { id: 6, title: 'Advanced Practices', done: false },
  { id: 7, title: 'Integration & Review', done: false },
];

const ProgramDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [steps, setSteps] = useState(STEPS);

  const completed = steps.filter((s) => s.done).length;
  const progress = Math.round((completed / steps.length) * 100);

  const toggleStep = (stepId: number) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)));
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/health/wellness-resources/programs')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to programs"
      >
        Back
      </button>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text} style={{ marginTop: spacing.md }}>
        Program #{id || '\u2014'}
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
        A structured path to better wellness
      </Text>

      <Card journey="health" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.xs }}>
          <Text fontSize="sm" color={colors.gray[50]}>Progress</Text>
          <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.primary}>{progress}%</Text>
        </Box>
        <div style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: colors.gray[10] }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: 4, backgroundColor: colors.journeys.health.primary, transition: 'width 0.3s ease' }} />
        </div>
        <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing.sm }}>
          <Text fontSize="xs" color={colors.gray[40]}>{completed} of {steps.length} steps</Text>
          <Text fontSize="xs" color={colors.gray[40]}>342 participants</Text>
        </Box>
      </Card>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Steps
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginBottom: spacing['2xl'] }}>
        {steps.map((step) => (
          <Card key={step.id} journey="health" elevation="sm" padding="sm" style={{ cursor: 'pointer' }} onClick={() => toggleStep(step.id)}>
            <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: step.done ? colors.journeys.health.primary : colors.gray[10],
                border: step.done ? 'none' : `2px solid ${colors.gray[20]}`,
              }}>
                {step.done && <Text fontSize="sm" color={colors.white}>&#10003;</Text>}
                {!step.done && <Text fontSize="xs" color={colors.gray[40]}>{step.id}</Text>}
              </div>
              <Text fontSize="sm" fontWeight={step.done ? 'semiBold' : 'regular'} color={step.done ? colors.journeys.health.text : colors.gray[50]} style={{ textDecoration: step.done ? 'line-through' : 'none' }}>
                {step.title}
              </Text>
            </Box>
          </Card>
        ))}
      </div>

      <Button journey="health" onPress={() => window.alert('Continuing program...')} accessibilityLabel={progress > 0 ? 'Continue program' : 'Start program'}>
        {progress > 0 ? 'Continue Program' : 'Start Program'}
      </Button>
    </div>
  );
};

export default ProgramDetailPage;
