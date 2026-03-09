import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const MOOD_LEVELS = [
    { key: 1, emoji: '\uD83D\uDE04', label: 'Very Happy' },
    { key: 2, emoji: '\uD83D\uDE42', label: 'Happy' },
    { key: 3, emoji: '\uD83D\uDE10', label: 'Neutral' },
    { key: 4, emoji: '\uD83D\uDE1E', label: 'Sad' },
    { key: 5, emoji: '\uD83D\uDE22', label: 'Very Sad' },
];

const FREQUENCIES = [
    { key: 'always', label: 'Always' },
    { key: 'often', label: 'Often' },
    { key: 'sometimes', label: 'Sometimes' },
    { key: 'rarely', label: 'Rarely' },
];

const SLEEP_IMPACT = [
    { key: 'yes', label: 'Yes' },
    { key: 'sometimes', label: 'Sometimes' },
    { key: 'no', label: 'No' },
];

const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: 20,
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.neutral.gray300}`,
    backgroundColor: selected ? colors.journeys.health.primary : colors.neutral.white,
    color: selected ? colors.neutral.white : colors.neutral.gray900,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: selected ? 600 : 400,
});

const StepMoodAssessmentPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Mood Assessment
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Understanding your emotional well-being helps us provide holistic health recommendations.
            </Text>

            {/* Mood Rating */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    How would you rate your overall mood lately?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs, justifyContent: 'space-between' }}>
                    {MOOD_LEVELS.map(({ key, emoji, label }) => {
                        const isActive = (data.moodRating as number) === key;
                        return (
                            <button
                                key={key}
                                onClick={() => onUpdate('moodRating', key)}
                                style={{
                                    flex: 1,
                                    padding: spacing.sm,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive
                                        ? colors.journeys.health.background
                                        : colors.neutral.white,
                                    cursor: 'pointer',
                                    textAlign: 'center' as const,
                                }}
                                aria-pressed={isActive}
                                aria-label={label}
                            >
                                <div style={{ fontSize: 24 }}>{emoji}</div>
                                <Text
                                    fontSize="xs"
                                    fontWeight={isActive ? 'semiBold' : 'regular'}
                                    color={colors.neutral.gray700}
                                >
                                    {label}
                                </Text>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Mood Frequency */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    How often do you experience this mood?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {FREQUENCIES.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onUpdate('moodFrequency', key)}
                            style={chipStyle((data.moodFrequency as string) === key)}
                            aria-pressed={(data.moodFrequency as string) === key}
                            aria-label={label}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Recent Changes */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Have you noticed recent changes in your mood?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {['yes', 'no'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onUpdate('recentMoodChanges', opt)}
                            style={chipStyle((data.recentMoodChanges as string) === opt)}
                            aria-pressed={(data.recentMoodChanges as string) === opt}
                            aria-label={opt === 'yes' ? 'Yes' : 'No'}
                        >
                            {opt === 'yes' ? 'Yes' : 'No'}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Sleep Impact */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Does your mood affect your sleep quality?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {SLEEP_IMPACT.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onUpdate('sleepImpact', key)}
                            style={chipStyle((data.sleepImpact as string) === key)}
                            aria-pressed={(data.sleepImpact as string) === key}
                            aria-label={label}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default StepMoodAssessmentPage;
