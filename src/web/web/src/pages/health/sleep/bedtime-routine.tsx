import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface RoutineStep {
  id: string;
  name: string;
  duration: string;
}

const INITIAL_STEPS: RoutineStep[] = [
  { id: '1', name: 'Dim the lights', duration: '5 min' },
  { id: '2', name: 'Herbal tea or warm drink', duration: '10 min' },
  { id: '3', name: 'Light stretching', duration: '10 min' },
  { id: '4', name: 'Read a book', duration: '15 min' },
  { id: '5', name: 'Meditation or breathing', duration: '10 min' },
];

const BedtimeRoutinePage: React.FC = () => {
  const router = useRouter();
  const [steps] = useState<RoutineStep[]>(INITIAL_STEPS);
  const [dndMode, setDndMode] = useState(false);
  const [reminder, setReminder] = useState(true);

  const totalMinutes = steps.reduce((sum, s) => sum + parseInt(s.duration, 10), 0);

  const handleSave = () => {
    window.alert(`Routine saved: ${steps.length} steps, ${totalMinutes} min total`);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/health/sleep')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to sleep home"
      >
        Back
      </button>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text} style={{ marginTop: spacing.md }}>
        Bedtime Routine
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Build a consistent wind-down routine ({totalMinutes} min total)
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.lg }}>
        {steps.map((step, index) => (
          <Card key={step.id} journey="health" elevation="sm" padding="md">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: `${colors.journeys.health.primary}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.primary}>{index + 1}</Text>
                </div>
                <Text fontSize="md" fontWeight="medium">{step.name}</Text>
              </Box>
              <Text fontSize="sm" color={colors.gray[50]}>{step.duration}</Text>
            </Box>
          </Card>
        ))}
      </div>

      <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.xl }}>
        <Button variant="secondary" journey="health" onPress={() => window.alert('Add step dialog')} accessibilityLabel="Add step">
          + Add Step
        </Button>
      </Box>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
        {[
          { label: 'Do Not Disturb', desc: 'Silence notifications during routine', value: dndMode, toggle: () => setDndMode(!dndMode) },
          { label: 'Routine Reminder', desc: 'Notify when it is time to start', value: reminder, toggle: () => setReminder(!reminder) },
        ].map((toggle) => (
          <Card key={toggle.label} journey="health" elevation="sm" padding="md">
            <div onClick={toggle.toggle} role="checkbox" aria-checked={toggle.value} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle.toggle(); }} style={{ cursor: 'pointer' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Text fontSize="md" fontWeight="semiBold">{toggle.label}</Text>
                  <Text fontSize="sm" color={colors.gray[50]}>{toggle.desc}</Text>
                </Box>
                <div style={{
                  width: 44, height: 24, borderRadius: '12px', padding: '2px',
                  backgroundColor: toggle.value ? colors.journeys.health.primary : colors.gray[30],
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', backgroundColor: colors.gray[0],
                    transform: toggle.value ? 'translateX(20px)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                  }} />
                </div>
              </Box>
            </div>
          </Card>
        ))}
      </div>

      <Button journey="health" onPress={handleSave} accessibilityLabel="Save bedtime routine">
        Save Routine
      </Button>
    </div>
  );
};

export default BedtimeRoutinePage;
