import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const inputStyle: React.CSSProperties = {
    width: 80,
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '16px',
    color: colors.gray[60],
    textAlign: 'center',
    outline: 'none',
};

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

const NOTIFICATION_OPTIONS = [
    { id: 'period_reminder', label: 'Period Reminders' },
    { id: 'fertile_alert', label: 'Fertility Alerts' },
    { id: 'symptom_log', label: 'Daily Log Reminder' },
    { id: 'insights', label: 'Weekly Insights' },
];

const SettingsPage: React.FC = () => {
    const router = useRouter();
    const [cycleLength, setCycleLength] = useState('28');
    const [periodLength, setPeriodLength] = useState('5');
    const [notifications, setNotifications] = useState<Record<string, boolean>>({
        period_reminder: true,
        fertile_alert: true,
        symptom_log: false,
        insights: true,
    });

    const toggleNotification = (id: string) => {
        setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = () => {
        window.alert('Settings saved successfully.');
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete all cycle data? This cannot be undone.')) {
            window.alert('Cycle data cleared.');
        }
    };

    const handleExport = () => {
        router.push('/health/cycle/export');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/cycle')}
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
                Cycle Settings
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Customize your cycle tracking preferences
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Cycle Configuration
            </Text>
            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginBottom: spacing.md }}
                >
                    <Box>
                        <Text fontWeight="semiBold" fontSize="md">
                            Average Cycle Length
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Typical range: 21-35 days
                        </Text>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                        <input
                            type="number"
                            value={cycleLength}
                            onChange={(e) => setCycleLength(e.target.value)}
                            min={21}
                            max={45}
                            style={inputStyle}
                            aria-label="Cycle length in days"
                        />
                        <Text fontSize="sm" color={colors.gray[50]}>
                            days
                        </Text>
                    </Box>
                </Box>
                <div style={{ height: 1, backgroundColor: colors.gray[10] }} />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginTop: spacing.md }}
                >
                    <Box>
                        <Text fontWeight="semiBold" fontSize="md">
                            Average Period Length
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Typical range: 3-7 days
                        </Text>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
                        <input
                            type="number"
                            value={periodLength}
                            onChange={(e) => setPeriodLength(e.target.value)}
                            min={1}
                            max={10}
                            style={inputStyle}
                            aria-label="Period length in days"
                        />
                        <Text fontSize="sm" color={colors.gray[50]}>
                            days
                        </Text>
                    </Box>
                </Box>
            </Card>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Notifications
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
                {NOTIFICATION_OPTIONS.map((opt) => (
                    <Card key={opt.id} journey="health" elevation="sm" padding="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontWeight="medium" fontSize="md">
                                {opt.label}
                            </Text>
                            <button
                                onClick={() => toggleNotification(opt.id)}
                                style={toggleStyle(!!notifications[opt.id])}
                                role="switch"
                                aria-checked={!!notifications[opt.id]}
                                aria-label={`Toggle ${opt.label}`}
                            >
                                <div style={toggleKnobStyle(!!notifications[opt.id])} />
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
                Data Management
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={handleExport}
                    accessibilityLabel="Export cycle data"
                >
                    Export Data
                </Button>
                <button
                    onClick={handleClearData}
                    style={{
                        background: 'none',
                        border: `1px solid ${colors.semantic.error}`,
                        color: colors.semantic.error,
                        borderRadius: '8px',
                        padding: `${spacing.sm} ${spacing.md}`,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                    aria-label="Delete all cycle data"
                >
                    Delete All Data
                </button>
            </div>

            <Button journey="health" onPress={handleSave} accessibilityLabel="Save settings">
                Save Settings
            </Button>
        </div>
    );
};

export default SettingsPage;
