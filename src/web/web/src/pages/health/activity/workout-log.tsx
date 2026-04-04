import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useActivity } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const WORKOUT_TYPES = ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Walking'];
const INTENSITIES = ['Low', 'Moderate', 'High', 'Very High'];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const WorkoutLogPage: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { data: activityData, loading, error, refetch } = useActivity();
    const [type, setType] = useState('Running');
    const [duration, setDuration] = useState('30');
    const [intensity, setIntensity] = useState('Moderate');
    const [notes, setNotes] = useState('');

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    {t('common.error')} <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void activityData;

    const handleSave = (): void => {
        window.alert(`Workout logged: ${type}, ${duration} min, ${intensity} intensity`);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/activity')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to activity home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Log Workout
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Record your workout session
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Workout Type
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.xs }}>
                    {WORKOUT_TYPES.map((w) => (
                        <div
                            key={w}
                            onClick={() => setType(w)}
                            role="radio"
                            aria-checked={type === w}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setType(w);
                                }
                            }}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                padding: spacing.xs,
                                borderRadius: '8px',
                                backgroundColor: type === w ? colors.journeys.health.primary : colors.gray[5],
                            }}
                        >
                            <Text fontSize="sm" color={type === w ? colors.gray[0] : colors.gray[60]}>
                                {w}
                            </Text>
                        </div>
                    ))}
                </div>
            </Card>

            <Box display="flex" style={{ gap: spacing.md, marginBottom: spacing.lg }}>
                <Box style={{ flex: 1 }}>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                        Duration (min)
                    </Text>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        aria-label="Duration in minutes"
                        style={inputStyle}
                    />
                </Box>
                <Box style={{ flex: 1 }}>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                        Intensity
                    </Text>
                    <select
                        value={intensity}
                        onChange={(e) => setIntensity(e.target.value)}
                        aria-label="Intensity level"
                        style={inputStyle}
                    >
                        {INTENSITIES.map((i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                </Box>
            </Box>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Notes
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did the workout feel? Any highlights?"
                    aria-label="Workout notes"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </Card>

            <Button journey="health" onPress={handleSave} accessibilityLabel="Save workout">
                Save Workout
            </Button>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default WorkoutLogPage;
