import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const STRESS_LEVELS = [
  { label: 'Low', value: 'low', description: 'Rarely feel stressed' },
  { label: 'Moderate', value: 'moderate', description: 'Occasionally stressed' },
  { label: 'High', value: 'high', description: 'Frequently stressed' },
  { label: 'Very High', value: 'very-high', description: 'Constantly overwhelmed' },
];

const STRESS_SOURCES = [
  'Work / Career',
  'Financial',
  'Relationships',
  'Health concerns',
  'Family responsibilities',
  'Academic / Studies',
  'Social pressure',
  'Loneliness / Isolation',
  'Life changes',
  'Caregiving',
];

const COPING_MECHANISMS = [
  'Exercise',
  'Meditation / Mindfulness',
  'Therapy / Counseling',
  'Deep breathing',
  'Talking to friends / family',
  'Hobbies',
  'Journaling',
  'Music / Art',
  'Time in nature',
  'None / Unsure',
];

const chipStyle = (selected: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${spacing['3xs']} ${spacing.sm}`,
  borderRadius: 20,
  border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
  backgroundColor: selected ? colors.journeys.health.background : colors.neutral.white,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: selected ? 600 : 400,
  color: selected ? colors.journeys.health.accent : colors.neutral.gray900,
});

const StepStressPage: React.FC<StepProps> = ({ data, onUpdate }) => {
  const selectedSources: string[] = data.stressSources || [];
  const selectedCoping: string[] = data.copingMechanisms || [];

  const toggleItem = (field: string, list: string[], item: string) => {
    const updated = list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
    onUpdate(field, updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
        Stress & Mental Well-being
      </Text>
      <Text fontSize="sm" color={colors.gray[50]}>
        Understanding stress helps us recommend holistic health strategies.
      </Text>

      {/* Stress level */}
      <Card journey="health" elevation="sm" padding="lg">
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
          Overall stress level
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          {STRESS_LEVELS.map((level) => {
            const isActive = data.stressLevel === level.value;
            return (
              <button
                key={level.value}
                onClick={() => onUpdate('stressLevel', level.value)}
                style={{
                  padding: spacing.sm,
                  borderRadius: 8,
                  border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                  backgroundColor: isActive ? colors.journeys.health.background : colors.neutral.white,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                aria-pressed={isActive}
                aria-label={`${level.label}: ${level.description}`}
              >
                <div>
                  <Text fontSize="sm" fontWeight={isActive ? 'semiBold' : 'regular'} color={colors.neutral.gray900}>
                    {level.label}
                  </Text>
                  <Text fontSize="xs" color={colors.gray[50]}>{level.description}</Text>
                </div>
                {isActive && (
                  <Text fontSize="md" color={colors.journeys.health.primary}>{'\u2713'}</Text>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Stress sources */}
      <Card journey="health" elevation="sm" padding="lg">
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
          Main sources of stress (select all that apply)
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
          {STRESS_SOURCES.map((source) => {
            const selected = selectedSources.includes(source);
            return (
              <button
                key={source}
                onClick={() => toggleItem('stressSources', selectedSources, source)}
                style={chipStyle(selected)}
                aria-pressed={selected}
                aria-label={`${source} ${selected ? 'selected' : 'not selected'}`}
              >
                {selected ? '\u2713 ' : ''}{source}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Coping mechanisms */}
      <Card journey="health" elevation="sm" padding="lg">
        <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
          How do you cope with stress? (select all that apply)
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
          {COPING_MECHANISMS.map((mechanism) => {
            const selected = selectedCoping.includes(mechanism);
            return (
              <button
                key={mechanism}
                onClick={() => toggleItem('copingMechanisms', selectedCoping, mechanism)}
                style={chipStyle(selected)}
                aria-pressed={selected}
                aria-label={`${mechanism} ${selected ? 'selected' : 'not selected'}`}
              >
                {selected ? '\u2713 ' : ''}{mechanism}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default StepStressPage;
