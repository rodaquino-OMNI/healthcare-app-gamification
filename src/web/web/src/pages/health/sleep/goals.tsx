import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useSleep } from '@/hooks';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const SleepGoalsPage: React.FC = () => {
    const { data: sleepData, loading, error, refetch } = useSleep();
    const router = useRouter();
    const [targetBedtime, setTargetBedtime] = useState('23:00');
    const [targetWake, setTargetWake] = useState('07:00');
    const [notifications, setNotifications] = useState(true);

    const bedH = parseInt(targetBedtime.split(':')[0], 10);
    const bedM = parseInt(targetBedtime.split(':')[1], 10);
    const wakeH = parseInt(targetWake.split(':')[0], 10);
    const wakeM = parseInt(targetWake.split(':')[1], 10);
    const totalMinutes = (wakeH * 60 + wakeM - (bedH * 60 + bedM) + 1440) % 1440;
    const durationHours = Math.floor(totalMinutes / 60);
    const durationMins = totalMinutes % 60;

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

    void sleepData;

    const handleSave = (): void => {
        window.alert(`Goals saved: ${targetBedtime} - ${targetWake} (${durationHours}h ${durationMins}m)`);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/sleep')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to sleep home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Sleep Goals
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Set your ideal sleep schedule
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Box display="flex" style={{ gap: spacing.md }}>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                            Target Bedtime
                        </Text>
                        <input
                            type="time"
                            value={targetBedtime}
                            onChange={(e) => setTargetBedtime(e.target.value)}
                            aria-label="Target bedtime"
                            style={inputStyle}
                        />
                    </Box>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing['3xs'] }}>
                            Target Wake Time
                        </Text>
                        <input
                            type="time"
                            value={targetWake}
                            onChange={(e) => setTargetWake(e.target.value)}
                            aria-label="Target wake time"
                            style={inputStyle}
                        />
                    </Box>
                </Box>
            </Card>

            <Card
                journey="health"
                elevation="sm"
                padding="lg"
                style={{ marginBottom: spacing.lg, textAlign: 'center' }}
            >
                <Text fontSize="sm" color={colors.gray[50]}>
                    Target Duration
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                    style={{ margin: `${spacing.xs} 0` }}
                >
                    {durationHours}h {durationMins}m
                </Text>
                <Text fontSize="xs" color={colors.gray[40]}>
                    Recommended: 7-9 hours
                </Text>
            </Card>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing['2xl'] }}>
                <div
                    onClick={() => setNotifications(!notifications)}
                    role="checkbox"
                    aria-checked={notifications}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setNotifications(!notifications);
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Text fontSize="md" fontWeight="semiBold">
                                Bedtime Reminders
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                Get notified 30 minutes before bedtime
                            </Text>
                        </Box>
                        <div
                            style={{
                                width: 44,
                                height: 24,
                                borderRadius: '12px',
                                padding: '2px',
                                backgroundColor: notifications ? colors.journeys.health.primary : colors.gray[30],
                                transition: 'background-color 0.2s',
                            }}
                        >
                            <div
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: colors.gray[0],
                                    transform: notifications ? 'translateX(20px)' : 'translateX(0)',
                                    transition: 'transform 0.2s',
                                }}
                            />
                        </div>
                    </Box>
                </div>
            </Card>

            <Button journey="health" onPress={handleSave} accessibilityLabel="Save sleep goals">
                Save Goals
            </Button>
        </div>
    );
};

export default SleepGoalsPage;
