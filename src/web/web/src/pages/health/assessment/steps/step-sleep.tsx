import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const SLEEP_HOURS = [
    { label: 'Less than 5h', value: '<5' },
    { label: '5-6 hours', value: '5-6' },
    { label: '6-7 hours', value: '6-7' },
    { label: '7-8 hours', value: '7-8' },
    { label: '8-9 hours', value: '8-9' },
    { label: '9+ hours', value: '9+' },
];

const QUALITY_OPTIONS = [
    { label: 'Very poor', value: 'very-poor' },
    { label: 'Poor', value: 'poor' },
    { label: 'Fair', value: 'fair' },
    { label: 'Good', value: 'good' },
    { label: 'Excellent', value: 'excellent' },
];

const SLEEP_ISSUES = [
    'Difficulty falling asleep',
    'Waking up frequently',
    'Waking up too early',
    'Snoring',
    'Sleep apnea (suspected or diagnosed)',
    'Restless legs',
    'Nightmares',
    'Sleepwalking',
    'None of the above',
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

const StepSleepPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const selectedIssues: string[] = data.sleepIssues || [];

    const toggleIssue = (issue: string) => {
        if (issue === 'None of the above') {
            onUpdate('sleepIssues', selectedIssues.includes(issue) ? [] : [issue]);
            return;
        }
        const withoutNone = selectedIssues.filter((i) => i !== 'None of the above');
        const updated = withoutNone.includes(issue) ? withoutNone.filter((i) => i !== issue) : [...withoutNone, issue];
        onUpdate('sleepIssues', updated);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Sleep Habits
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                Quality sleep is essential for physical and mental well-being.
            </Text>

            {/* Sleep hours */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Average hours of sleep per night
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {SLEEP_HOURS.map((opt) => {
                        const isActive = data.sleepHours === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('sleepHours', opt.value)}
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

            {/* Sleep quality */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    How would you rate your sleep quality?
                </Text>
                <div style={{ display: 'flex', gap: spacing.xs }}>
                    {QUALITY_OPTIONS.map((opt) => {
                        const isActive = data.sleepQuality === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => onUpdate('sleepQuality', opt.value)}
                                style={{
                                    flex: 1,
                                    padding: spacing.xs,
                                    borderRadius: 8,
                                    border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                    backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                    color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    fontWeight: isActive ? 600 : 400,
                                }}
                                aria-pressed={isActive}
                                aria-label={`Quality: ${opt.label}`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Sleep issues */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    color={colors.journeys.health.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Do you experience any sleep issues?
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {SLEEP_ISSUES.map((issue) => {
                        const selected = selectedIssues.includes(issue);
                        return (
                            <button
                                key={issue}
                                onClick={() => toggleIssue(issue)}
                                style={chipStyle(selected)}
                                aria-pressed={selected}
                                aria-label={`${issue} ${selected ? 'selected' : 'not selected'}`}
                            >
                                {selected ? '\u2713 ' : ''}
                                {issue}
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default StepSleepPage;
