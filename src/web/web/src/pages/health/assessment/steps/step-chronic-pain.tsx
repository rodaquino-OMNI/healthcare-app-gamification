import { Card } from 'design-system/components/Card/Card';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

interface StepProps {
    data: Record<string, unknown>;
    onUpdate: (field: string, value: unknown) => void;
}

const LOCATIONS = ['Head', 'Neck', 'Back', 'Shoulders', 'Knees', 'Hips', 'Hands', 'Feet'];
const FREQUENCIES = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'rarely', label: 'Rarely' },
];
const IMPACTS = [
    { key: 'none', label: 'None' },
    { key: 'mild', label: 'Mild' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'severe', label: 'Severe' },
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

const getSeverityColor = (level: number): string => {
    if (level <= 3) {
        return colors.semantic.success;
    }
    if (level <= 6) {
        return colors.semantic.warning;
    }
    return colors.semantic.error;
};

const StepChronicPainPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const hasPain = data.hasPain as string | undefined;
    const selectedLocations: string[] = (data.painLocations as string[]) || [];

    const toggleLocation = (location: string): void => {
        const updated = selectedLocations.includes(location)
            ? selectedLocations.filter((l) => l !== location)
            : [...selectedLocations, location];
        onUpdate('painLocations', updated);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Chronic Pain Assessment
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Tell us about any recurring or chronic pain you experience.
            </Text>

            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Do you experience chronic or recurring pain?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {['yes', 'no'].map((opt) => {
                        const isActive = hasPain === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => onUpdate('hasPain', opt)}
                                style={{
                                    flex: 1,
                                    padding: spacing.sm,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                    color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 400,
                                }}
                                aria-pressed={isActive}
                                aria-label={opt === 'yes' ? 'Yes' : 'No'}
                            >
                                {opt === 'yes' ? 'Yes' : 'No'}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {hasPain === 'yes' && (
                <>
                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="semiBold"
                            color={colors.journeys.health.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Pain Locations (select all that apply)
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                            {LOCATIONS.map((location) => {
                                const selected = selectedLocations.includes(location);
                                return (
                                    <button
                                        key={location}
                                        onClick={() => toggleLocation(location)}
                                        style={chipStyle(selected)}
                                        aria-pressed={selected}
                                        aria-label={`${location} ${selected ? 'selected' : 'not selected'}`}
                                    >
                                        {selected ? '\u2713 ' : ''}
                                        {location}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="semiBold"
                            color={colors.journeys.health.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Pain Severity (1-10)
                        </Text>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
                                const isActive = (data.painSeverity as number) === level;
                                const activeColor = getSeverityColor(level);
                                return (
                                    <button
                                        key={level}
                                        onClick={() => onUpdate('painSeverity', level)}
                                        style={{
                                            flex: 1,
                                            padding: spacing['3xs'],
                                            borderRadius: 4,
                                            border: `1px solid ${isActive ? activeColor : colors.neutral.gray300}`,
                                            backgroundColor: isActive ? activeColor : colors.neutral.white,
                                            color: isActive ? colors.neutral.white : colors.neutral.gray700,
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            fontWeight: isActive ? 700 : 400,
                                            textAlign: 'center' as const,
                                        }}
                                        aria-pressed={isActive}
                                        aria-label={`Pain severity ${level}`}
                                    >
                                        {level}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="semiBold"
                            color={colors.journeys.health.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            How often do you experience this pain?
                        </Text>
                        <div style={{ display: 'flex', gap: spacing.xs }}>
                            {FREQUENCIES.map(({ key, label }) => {
                                const isActive = (data.painFrequency as string) === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => onUpdate('painFrequency', key)}
                                        style={{
                                            flex: 1,
                                            padding: spacing.xs,
                                            borderRadius: 8,
                                            border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                            backgroundColor: isActive
                                                ? colors.journeys.health.primary
                                                : colors.neutral.white,
                                            color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                        aria-pressed={isActive}
                                        aria-label={label}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <Card journey="health" elevation="sm" padding="lg">
                        <Text
                            fontSize="sm"
                            fontWeight="semiBold"
                            color={colors.journeys.health.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Impact on daily activities
                        </Text>
                        <div style={{ display: 'flex', gap: spacing.xs }}>
                            {IMPACTS.map(({ key, label }) => {
                                const isActive = (data.painImpact as string) === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => onUpdate('painImpact', key)}
                                        style={{
                                            flex: 1,
                                            padding: spacing.xs,
                                            borderRadius: 8,
                                            border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                            backgroundColor: isActive
                                                ? colors.journeys.health.primary
                                                : colors.neutral.white,
                                            color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                        aria-pressed={isActive}
                                        aria-label={label}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </>
            )}

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ borderLeft: `3px solid ${colors.journeys.health.primary}` }}
            >
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    Tip
                </Text>
                <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                    Chronic pain management often benefits from a multidisciplinary approach. We can help connect you
                    with specialists based on your responses.
                </Text>
            </Card>
        </div>
    );
};

export default StepChronicPainPage;
