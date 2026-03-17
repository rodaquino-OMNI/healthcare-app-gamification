import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const CONDITIONS = [
    'Diabetes (Type 1)',
    'Diabetes (Type 2)',
    'Hypertension',
    'Heart Disease',
    'Asthma',
    'COPD',
    'Arthritis',
    'Depression',
    'Anxiety',
    'Thyroid Disorder',
    'Chronic Kidney Disease',
    'Cancer (current or history)',
    'Epilepsy',
    'Anemia',
];

const checkboxStyle = (checked: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
    border: `1px solid ${checked ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: checked ? colors.journeys.health.background : colors.neutral.white,
    cursor: 'pointer',
});

const StepExistingConditionsPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const selectedConditions: string[] = (data.existingConditions as string[]) || [];
    const otherText: string = (data.otherCondition as string) || '';

    const toggleCondition = (condition: string): void => {
        const updated = selectedConditions.includes(condition)
            ? selectedConditions.filter((c) => c !== condition)
            : [...selectedConditions, condition];
        onUpdate('existingConditions', updated);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Existing Medical Conditions
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Select any conditions you have been diagnosed with. This helps us provide better recommendations.
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {CONDITIONS.map((condition) => {
                        const checked = selectedConditions.includes(condition);
                        return (
                            <button
                                key={condition}
                                onClick={() => toggleCondition(condition)}
                                style={checkboxStyle(checked)}
                                aria-label={`${condition} ${checked ? 'selected' : 'not selected'}`}
                                aria-pressed={checked}
                            >
                                <div
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 4,
                                        border: `2px solid ${checked ? colors.journeys.health.primary : colors.neutral.gray400}`,
                                        backgroundColor: checked
                                            ? colors.journeys.health.primary
                                            : colors.neutral.white,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {checked && (
                                        <Text fontSize="xs" color={colors.neutral.white}>
                                            {'\u2713'}
                                        </Text>
                                    )}
                                </div>
                                <Text fontSize="sm" color={colors.neutral.gray900}>
                                    {condition}
                                </Text>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Other condition */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={colors.gray[60]}
                    style={{ marginBottom: spacing['3xs'] }}
                >
                    Other condition (if not listed above)
                </Text>
                <input
                    style={{
                        width: '100%',
                        padding: spacing.sm,
                        border: `1px solid ${colors.neutral.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        color: colors.neutral.gray900,
                        backgroundColor: colors.neutral.white,
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                    type="text"
                    placeholder="Type any additional conditions"
                    value={otherText}
                    onChange={(e) => onUpdate('otherCondition', e.target.value)}
                    aria-label="Other medical condition"
                />
            </Card>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepExistingConditionsPage;
