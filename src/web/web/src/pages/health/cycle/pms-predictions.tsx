import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

import { useCycle } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const PMS_TIMELINE = [
    { day: 'Day 22', status: 'current', label: 'Today' },
    { day: 'Day 23', status: 'upcoming', label: 'Mild symptoms may begin' },
    { day: 'Day 24-25', status: 'upcoming', label: 'PMS window starts' },
    { day: 'Day 26-27', status: 'upcoming', label: 'Peak PMS symptoms' },
    { day: 'Day 28', status: 'upcoming', label: 'Period expected' },
];

const PREDICTED_SYMPTOMS = [
    { symptom: 'Cramps', likelihood: 'High', color: colors.semantic.error },
    { symptom: 'Bloating', likelihood: 'Medium', color: colors.semantic.warning },
    { symptom: 'Mood Changes', likelihood: 'High', color: colors.semantic.error },
    { symptom: 'Headache', likelihood: 'Low', color: colors.journeys.health.primary },
    { symptom: 'Fatigue', likelihood: 'Medium', color: colors.semantic.warning },
];

const SELF_CARE = [
    { title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water daily to reduce bloating.' },
    { title: 'Light Exercise', description: 'Gentle walks or yoga can help alleviate cramps and mood swings.' },
    { title: 'Balanced Diet', description: 'Eat foods rich in calcium, magnesium, and complex carbohydrates.' },
    { title: 'Rest Well', description: 'Aim for 7-9 hours of sleep to manage fatigue and irritability.' },
];

const PmsPredictionsPage: React.FC = () => {
    const router = useRouter();
    const { data: cycleData, loading, error, refetch } = useCycle();

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void cycleData;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/cycle')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to cycle home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                PMS Predictions
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Predicted symptoms based on your cycle history
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Timeline
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                {PMS_TIMELINE.map((item, idx) => (
                    <Box
                        key={item.day}
                        display="flex"
                        alignItems="flex-start"
                        style={{ gap: spacing.sm, paddingBottom: idx < PMS_TIMELINE.length - 1 ? spacing.sm : 0 }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor:
                                        item.status === 'current' ? colors.journeys.health.primary : colors.gray[20],
                                    border:
                                        item.status === 'current'
                                            ? `2px solid ${colors.journeys.health.secondary}`
                                            : 'none',
                                }}
                            />
                            {idx < PMS_TIMELINE.length - 1 && (
                                <div style={{ width: 2, height: 24, backgroundColor: colors.gray[10] }} />
                            )}
                        </div>
                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="semiBold"
                                color={item.status === 'current' ? colors.journeys.health.primary : colors.gray[60]}
                            >
                                {item.day}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {item.label}
                            </Text>
                        </Box>
                    </Box>
                ))}
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Predicted Symptoms
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {PREDICTED_SYMPTOMS.map((item) => (
                    <Card key={item.symptom} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontSize="md" color={colors.journeys.health.text}>
                                {item.symptom}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={item.color}>
                                {item.likelihood}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Self-Care Recommendations
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {SELF_CARE.map((item) => (
                    <Card key={item.title} journey="health" elevation="sm" padding="md">
                        <Text fontWeight="semiBold" fontSize="md" color={colors.journeys.health.text}>
                            {item.title}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                            {item.description}
                        </Text>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default PmsPredictionsPage;
