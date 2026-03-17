import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';

import { useCycle } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface ReminderSetting {
    id: string;
    label: string;
    description: string;
}

const REMINDER_TYPES: ReminderSetting[] = [
    { id: 'period_start', label: 'Period Start', description: 'Get notified when your period is predicted to start' },
    { id: 'fertile_window', label: 'Fertile Window', description: 'Receive alerts when your fertile window begins' },
    { id: 'ovulation', label: 'Ovulation Day', description: 'Reminder on your predicted ovulation day' },
    { id: 'pms', label: 'PMS Alert', description: 'Get a heads-up before predicted PMS symptoms' },
    { id: 'log_reminder', label: 'Daily Log Reminder', description: 'Daily reminder to log symptoms and flow' },
];

const TIMING_OPTIONS = [
    { id: 'same_day', label: 'Same Day' },
    { id: '1_day', label: '1 Day Before' },
    { id: '2_days', label: '2 Days Before' },
    { id: '3_days', label: '3 Days Before' },
];

const toggleStyle = (enabled: boolean): React.CSSProperties => ({
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: enabled ? colors.journeys.health.primary : colors.gray[30],
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    border: 'none',
    flexShrink: 0,
});

const toggleKnobStyle = (enabled: boolean): React.CSSProperties => ({
    width: 22,
    height: 22,
    borderRadius: '50%',
    backgroundColor: colors.gray[0],
    position: 'absolute',
    top: 3,
    left: enabled ? 23 : 3,
    transition: 'left 0.2s ease',
});

const RemindersPage: React.FC = () => {
    const router = useRouter();
    const { data: cycleData, loading, error, refetch } = useCycle();
    const [enabledReminders, setEnabledReminders] = useState<Record<string, boolean>>({
        period_start: true,
        fertile_window: false,
        ovulation: true,
        pms: true,
        log_reminder: false,
    });
    const [timing, setTiming] = useState('1_day');

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

    const toggleReminder = (id: string): void => {
        setEnabledReminders((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleTestNotification = (): void => {
        window.alert('Test notification sent.');
    };

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
                Reminders
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Configure your cycle notifications
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Reminder Types
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {REMINDER_TYPES.map((r) => (
                    <Card key={r.id} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box style={{ flex: 1, marginRight: spacing.md }}>
                                <Text fontWeight="semiBold" fontSize="md">
                                    {r.label}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {r.description}
                                </Text>
                            </Box>
                            <button
                                onClick={() => toggleReminder(r.id)}
                                style={toggleStyle(!!enabledReminders[r.id])}
                                role="switch"
                                aria-checked={!!enabledReminders[r.id]}
                                aria-label={`Toggle ${r.label}`}
                            >
                                <div style={toggleKnobStyle(!!enabledReminders[r.id])} />
                            </button>
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
                Notification Timing
            </Text>
            <div
                style={{
                    display: 'flex',
                    borderRadius: '8px',
                    border: `1px solid ${colors.gray[20]}`,
                    overflow: 'hidden',
                    marginBottom: spacing.xl,
                }}
            >
                {TIMING_OPTIONS.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setTiming(opt.id)}
                        style={{
                            flex: 1,
                            padding: `${spacing.sm} ${spacing.xs}`,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: timing === opt.id ? 600 : 400,
                            color: timing === opt.id ? colors.journeys.health.primary : colors.gray[50],
                            backgroundColor: timing === opt.id ? colors.journeys.health.background : colors.gray[0],
                            transition: 'all 0.15s ease',
                        }}
                        aria-pressed={timing === opt.id}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <Box display="flex" style={{ flexDirection: 'column', gap: spacing.sm }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={handleTestNotification}
                    accessibilityLabel="Send test notification"
                >
                    Send Test Notification
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default RemindersPage;
