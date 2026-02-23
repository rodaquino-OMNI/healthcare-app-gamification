import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const FLOW_OPTIONS = [
  { id: 'light', label: 'Light', description: 'Spotting or light flow' },
  { id: 'medium', label: 'Medium', description: 'Regular flow' },
  { id: 'heavy', label: 'Heavy', description: 'Heavy or very heavy flow' },
];

const LogPeriodPage: React.FC = () => {
  const router = useRouter();
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [flowIntensity, setFlowIntensity] = useState('medium');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    window.alert(`Period logged: ${startDate}, Flow: ${flowIntensity}`);
    router.push('/health/cycle');
  };

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
        Log Period
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Record the start of your period
      </Text>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Start Date
      </Text>
      <Card journey="health" elevation="sm" padding="md">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="Period start date"
          style={{
            width: '100%',
            padding: spacing.sm,
            border: `1px solid ${colors.gray[20]}`,
            borderRadius: '8px',
            fontSize: '16px',
            color: colors.gray[60],
            outline: 'none',
          }}
        />
      </Card>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginTop: spacing['2xl'], marginBottom: spacing.sm }}>
        Flow Intensity
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {FLOW_OPTIONS.map((option) => (
          <div
            key={option.id}
            onClick={() => setFlowIntensity(option.id)}
            role="radio"
            aria-checked={flowIntensity === option.id}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlowIntensity(option.id); }}
            style={{ cursor: 'pointer' }}
          >
            <Card journey="health" elevation="sm" padding="md">
              <Box display="flex" alignItems="center" style={{ gap: spacing.sm }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${colors.journeys.health.primary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {flowIntensity === option.id && (
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colors.journeys.health.primary }} />
                  )}
                </div>
                <Box>
                  <Text fontWeight="semiBold" fontSize="md">{option.label}</Text>
                  <Text fontSize="sm" color={colors.gray[50]}>{option.description}</Text>
                </Box>
              </Box>
            </Card>
          </div>
        ))}
      </div>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginTop: spacing['2xl'], marginBottom: spacing.sm }}>
        Notes
      </Text>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any additional notes..."
        aria-label="Period notes"
        rows={3}
        style={{
          width: '100%',
          padding: spacing.sm,
          border: `1px solid ${colors.gray[20]}`,
          borderRadius: '8px',
          fontSize: '14px',
          color: colors.gray[60],
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />

      <Box display="flex" style={{ flexDirection: 'column', gap: spacing.sm, marginTop: spacing['2xl'] }}>
        <Button journey="health" onPress={handleSave} accessibilityLabel="Save period log">
          Save
        </Button>
        <Button variant="secondary" journey="health" onPress={() => router.push('/health/cycle')} accessibilityLabel="Cancel">
          Cancel
        </Button>
      </Box>
    </div>
  );
};

export default LogPeriodPage;
