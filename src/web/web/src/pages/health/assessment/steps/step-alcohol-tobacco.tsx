import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const SMOKING_STATUS = [
    { label: 'Never smoked', value: 'never' },
    { label: 'Former smoker', value: 'former' },
    { label: 'Current smoker (occasional)', value: 'occasional' },
    { label: 'Current smoker (daily)', value: 'daily' },
    { label: 'E-cigarette / Vape user', value: 'vape' },
];

const ALCOHOL_FREQUENCY = [
    { label: 'Never', value: 'never' },
    { label: 'Rarely (special occasions)', value: 'rarely' },
    { label: '1-2 drinks/week', value: '1-2/week' },
    { label: '3-6 drinks/week', value: '3-6/week' },
    { label: 'Daily', value: 'daily' },
];

const SUBSTANCE_SCREENING = [
    { label: 'None', value: 'none' },
    { label: 'Recreational cannabis', value: 'cannabis' },
    { label: 'Other substances', value: 'other' },
    { label: 'Prefer not to answer', value: 'prefer-not' },
];

const radioButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: spacing.sm,
    borderRadius: 8,
    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: isActive ? colors.journeys.health.background : colors.neutral.white,
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    color: colors.neutral.gray900,
    fontSize: 14,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

const StepAlcoholTobaccoPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Tobacco, Alcohol & Substances
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                This information is confidential and helps provide accurate health assessments.
            </Text>

            {/* Smoking */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Smoking status
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {SMOKING_STATUS.map((opt) => {
                        const isActive = data.smokingStatus === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('smokingStatus', opt.value)}
                                style={radioButtonStyle(isActive)}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                <span>{opt.label}</span>
                                {isActive && (
                                    <Text fontSize="md" color={colors.journeys.health.primary}>
                                        {'\u2713'}
                                    </Text>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Years smoked (conditional) */}
            {(data.smokingStatus === 'former' ||
                data.smokingStatus === 'occasional' ||
                data.smokingStatus === 'daily') && (
                <Card journey="health" elevation="sm" padding="md">
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={colors.gray[60]}
                        style={{ marginBottom: spacing['3xs'] }}
                    >
                        {data.smokingStatus === 'former'
                            ? 'How many years did you smoke?'
                            : 'How many years have you smoked?'}
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
                        type="number"
                        placeholder="Number of years"
                        value={data.smokingYears || ''}
                        onChange={(e) => onUpdate('smokingYears', e.target.value)}
                        aria-label="Years of smoking"
                    />
                </Card>
            )}

            {/* Alcohol */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Alcohol consumption
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {ALCOHOL_FREQUENCY.map((opt) => {
                        const isActive = data.alcoholFrequency === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('alcoholFrequency', opt.value)}
                                style={radioButtonStyle(isActive)}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                <span>{opt.label}</span>
                                {isActive && (
                                    <Text fontSize="md" color={colors.journeys.health.primary}>
                                        {'\u2713'}
                                    </Text>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Substance screening */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Substance use screening
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {SUBSTANCE_SCREENING.map((opt) => {
                        const isActive = data.substanceUse === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('substanceUse', opt.value)}
                                style={radioButtonStyle(isActive)}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                <span>{opt.label}</span>
                                {isActive && (
                                    <Text fontSize="md" color={colors.journeys.health.primary}>
                                        {'\u2713'}
                                    </Text>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default StepAlcoholTobaccoPage;
