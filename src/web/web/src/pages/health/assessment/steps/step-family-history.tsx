import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const FAMILY_CONDITIONS = [
  'Heart Disease',
  'Stroke',
  'Diabetes (Type 2)',
  'Cancer (Breast)',
  'Cancer (Colon)',
  'Cancer (Lung)',
  'High Blood Pressure',
  'Alzheimer\'s / Dementia',
  'Osteoporosis',
  'Mental Health Disorders',
  'Autoimmune Diseases',
  'Kidney Disease',
];

const RELATIONS = ['Mother', 'Father', 'Sibling', 'Grandparent'];

interface FamilyConditionEntry {
  condition: string;
  relation: string;
}

const selectStyle: React.CSSProperties = {
  padding: spacing.xs,
  border: `1px solid ${colors.neutral.gray300}`,
  borderRadius: 8,
  fontSize: 13,
  color: colors.neutral.gray900,
  backgroundColor: colors.neutral.white,
  outline: 'none',
};

const StepFamilyHistoryPage: React.FC<StepProps> = ({ data, onUpdate }) => {
  const familyHistory: FamilyConditionEntry[] = data.familyHistory || [];

  const toggleCondition = (condition: string) => {
    const exists = familyHistory.find((fh) => fh.condition === condition);
    if (exists) {
      onUpdate('familyHistory', familyHistory.filter((fh) => fh.condition !== condition));
    } else {
      onUpdate('familyHistory', [...familyHistory, { condition, relation: '' }]);
    }
  };

  const updateRelation = (condition: string, relation: string) => {
    const updated = familyHistory.map((fh) =>
      fh.condition === condition ? { ...fh, relation } : fh,
    );
    onUpdate('familyHistory', updated);
  };

  const isSelected = (condition: string) => familyHistory.some((fh) => fh.condition === condition);
  const getRelation = (condition: string) =>
    familyHistory.find((fh) => fh.condition === condition)?.relation || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
        Family Medical History
      </Text>
      <Text fontSize="sm" color={colors.gray[50]}>
        Knowing your family history helps identify potential health risks early.
      </Text>

      <Card journey="health" elevation="sm" padding="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          {FAMILY_CONDITIONS.map((condition) => {
            const selected = isSelected(condition);
            return (
              <div key={condition}>
                <button
                  onClick={() => toggleCondition(condition)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: spacing.sm,
                    borderRadius: 8,
                    border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
                    backgroundColor: selected ? colors.journeys.health.background : colors.neutral.white,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  aria-pressed={selected}
                  aria-label={`${condition} ${selected ? 'selected' : 'not selected'}`}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      border: `2px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray400}`,
                      backgroundColor: selected ? colors.journeys.health.primary : colors.neutral.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {selected && (
                      <Text fontSize="xs" color={colors.neutral.white}>{'\u2713'}</Text>
                    )}
                  </div>
                  <Text fontSize="sm" color={colors.neutral.gray900}>{condition}</Text>
                </button>

                {/* Relation selector */}
                {selected && (
                  <div style={{ marginLeft: spacing['2xl'], marginTop: spacing['3xs'] }}>
                    <select
                      style={selectStyle}
                      value={getRelation(condition)}
                      onChange={(e) => updateRelation(condition, e.target.value)}
                      aria-label={`Relation for ${condition}`}
                    >
                      <option value="">Select relation</option>
                      {RELATIONS.map((rel) => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default StepFamilyHistoryPage;
