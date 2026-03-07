import React from 'react';
import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const FREQUENCY_OPTIONS = [
    { label: 'Never', value: 'never' },
    { label: '1-2 days/week', value: '1-2' },
    { label: '3-4 days/week', value: '3-4' },
    { label: '5-6 days/week', value: '5-6' },
    { label: 'Daily', value: 'daily' },
];

const EXERCISE_TYPES = [
    'Walking',
    'Running',
    'Cycling',
    'Swimming',
    'Strength Training',
    'Yoga / Pilates',
    'Team Sports',
    'Dancing',
    'Martial Arts',
    'Hiking',
];

const DURATION_OPTIONS = [
    { label: 'Less than 15 min', value: '<15' },
    { label: '15-30 min', value: '15-30' },
    { label: '30-60 min', value: '30-60' },
    { label: '60+ min', value: '60+' },
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

const StepExercisePage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const selectedTypes: string[] = data.exerciseTypes || [];

    const toggleType = (type: string) => {
        const updated = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type];
        onUpdate('exerciseTypes', updated);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Exercise & Physical Activity
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Your activity level is key to understanding your overall health.
            </Text>

            {/* Frequency */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    How often do you exercise?
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    {FREQUENCY_OPTIONS.map((opt) => {
                        const isActive = data.exerciseFrequency === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('exerciseFrequency', opt.value)}
                                style={{
                                    padding: spacing.sm,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive
                                        ? colors.journeys.health.background
                                        : colors.neutral.white,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontWeight: isActive ? 600 : 400,
                                    color: colors.neutral.gray900,
                                    fontSize: 14,
                                }}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Exercise types */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Types of exercise (select all that apply)
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {EXERCISE_TYPES.map((type) => {
                        const selected = selectedTypes.includes(type);
                        return (
                            <button
                                key={type}
                                onClick={() => toggleType(type)}
                                style={chipStyle(selected)}
                                aria-pressed={selected}
                                aria-label={`${type} ${selected ? 'selected' : 'not selected'}`}
                            >
                                {selected ? '\u2713 ' : ''}
                                {type}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Duration */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Average session duration
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                    {DURATION_OPTIONS.map((opt) => {
                        const isActive = data.exerciseDuration === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('exerciseDuration', opt.value)}
                                style={{
                                    padding: `${spacing.xs} ${spacing.md}`,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                    color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 400,
                                }}
                                aria-pressed={isActive}
                                aria-label={opt.label}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default StepExercisePage;
