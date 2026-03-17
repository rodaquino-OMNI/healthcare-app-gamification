import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useMemo } from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: 8,
    fontSize: 14,
    color: colors.neutral.gray900,
    backgroundColor: colors.neutral.white,
    outline: 'none',
    boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
    marginBottom: spacing['3xs'],
    display: 'block',
};

const getBmiCategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) {
        return { label: 'Underweight', color: colors.semantic.warning };
    }
    if (bmi < 25) {
        return { label: 'Normal', color: colors.semantic.success };
    }
    if (bmi < 30) {
        return { label: 'Overweight', color: colors.semantic.warning };
    }
    return { label: 'Obese', color: colors.semantic.error };
};

const StepHeightWeightPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const useImperial = (data.useImperial as boolean) || false;

    const bmi = useMemo(() => {
        const heightCm = useImperial
            ? (Number(data.heightFt as string) || 0) * 30.48 + (Number(data.heightIn as string) || 0) * 2.54
            : Number(data.heightCm as string) || 0;
        const weightKg = useImperial
            ? (Number(data.weightLbs as string) || 0) * 0.453592
            : Number(data.weightKg as string) || 0;
        if (heightCm > 0 && weightKg > 0) {
            const heightM = heightCm / 100;
            return weightKg / (heightM * heightM);
        }
        return null;
    }, [data.heightCm, data.weightKg, data.heightFt, data.heightIn, data.weightLbs, useImperial]);

    const bmiInfo = bmi ? getBmiCategory(bmi) : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Height & Weight
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Used to calculate your BMI and track changes over time.
            </Text>

            {/* Unit Toggle */}
            <div style={{ display: 'flex', gap: spacing.xs }}>
                {['Metric', 'Imperial'].map((label, idx) => {
                    const isActive = idx === 0 ? !useImperial : useImperial;
                    return (
                        <button
                            key={label}
                            onClick={() => onUpdate('useImperial', idx === 1)}
                            style={{
                                flex: 1,
                                padding: spacing.xs,
                                borderRadius: 8,
                                border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 400,
                            }}
                            aria-label={`Use ${label.toLowerCase()} units`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <Card journey="health" elevation="sm" padding="lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {useImperial ? (
                        <div style={{ display: 'flex', gap: spacing.sm }}>
                            <div style={{ flex: 1 }}>
                                <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
                                    Height (ft)
                                </Text>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    placeholder="5"
                                    value={(data.heightFt as string) || ''}
                                    onChange={(e) => onUpdate('heightFt', e.target.value)}
                                    aria-label="Height in feet"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
                                    Height (in)
                                </Text>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    placeholder="10"
                                    value={(data.heightIn as string) || ''}
                                    onChange={(e) => onUpdate('heightIn', e.target.value)}
                                    aria-label="Height in inches"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
                                Height (cm)
                            </Text>
                            <input
                                style={inputStyle}
                                type="number"
                                placeholder="170"
                                value={(data.heightCm as string) || ''}
                                onChange={(e) => onUpdate('heightCm', e.target.value)}
                                aria-label="Height in centimeters"
                            />
                        </div>
                    )}

                    <div>
                        <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
                            Weight ({useImperial ? 'lbs' : 'kg'})
                        </Text>
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder={useImperial ? '160' : '70'}
                            value={useImperial ? (data.weightLbs as string) || '' : (data.weightKg as string) || ''}
                            onChange={(e) => onUpdate(useImperial ? 'weightLbs' : 'weightKg', e.target.value)}
                            aria-label={`Weight in ${useImperial ? 'pounds' : 'kilograms'}`}
                        />
                    </div>
                </div>
            </Card>

            {/* BMI Result */}
            {bmi !== null && bmiInfo && (
                <Card journey="health" elevation="sm" padding="md">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                Your BMI
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                                {bmi.toFixed(1)}
                            </Text>
                        </div>
                        <div
                            style={{
                                padding: `${spacing['3xs']} ${spacing.sm}`,
                                borderRadius: 20,
                                backgroundColor: `${bmiInfo.color}15`,
                                border: `1px solid ${bmiInfo.color}`,
                            }}
                        >
                            <Text fontSize="sm" fontWeight="semiBold" color={bmiInfo.color}>
                                {bmiInfo.label}
                            </Text>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default StepHeightWeightPage;
