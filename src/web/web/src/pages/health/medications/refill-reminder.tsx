import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { ProgressBar } from 'design-system/components/ProgressBar/ProgressBar';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const getCountdownColor = (days: number): string => {
    if (days > 14) {
        return colors.semantic.success;
    }
    if (days >= 7) {
        return colors.semantic.warning;
    }
    return colors.semantic.error;
};

const getSupplyLevel = (daysRemaining: number): number => {
    const maxDays = 30;
    return Math.min(Math.max((daysRemaining / maxDays) * 100, 0), 100);
};

interface SnoozeOption {
    label: string;
    days: number;
}

const SNOOZE_OPTIONS: SnoozeOption[] = [
    { label: '3 days', days: 3 },
    { label: '1 week', days: 7 },
];

/**
 * Refill reminder page showing medication supply countdown,
 * progress bar, and actions to find pharmacy or order refill.
 */
const MedicationRefillReminderPage: React.FC = () => {
    const router = useRouter();
    const medicationName = (router.query.name as string) || 'Metformin';
    const initialDays = parseInt(router.query.days as string, 10) || 10;

    const [daysRemaining] = useState(initialDays);
    const [snoozed, setSnoozed] = useState(false);

    const supplyLevel = getSupplyLevel(daysRemaining);
    const countdownColor = getCountdownColor(daysRemaining);

    const handleSnooze = (option: SnoozeOption): void => {
        setSnoozed(true);
        alert(`Reminder snoozed for ${option.label}`);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Refill Reminder
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Time to refill your medication.
            </Text>

            {/* Medication Name */}
            <Card journey="health" elevation="md" padding="lg">
                <Text
                    fontWeight="semiBold"
                    fontSize="xl"
                    color={colors.journeys.health.primary}
                    style={{ textAlign: 'center' }}
                >
                    {medicationName}
                </Text>
            </Card>

            {/* Countdown */}
            <div
                style={{
                    textAlign: 'center',
                    padding: `${spacing['2xl']} 0`,
                }}
            >
                <Text
                    fontSize="heading-2xl"
                    fontWeight="bold"
                    color={countdownColor}
                    data-testid="days-remaining-count"
                >
                    {daysRemaining}
                </Text>
                <Text fontSize="lg" color={countdownColor}>
                    days remaining
                </Text>
            </div>

            {/* Supply Level */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    Supply Level
                </Text>
                <ProgressBar
                    current={supplyLevel}
                    total={100}
                    journey="health"
                    ariaLabel={`Supply level: ${Math.round(supplyLevel)}%`}
                    testId="supply-progress-bar"
                />
                <Text fontSize="sm" color={colors.gray[50]} style={{ textAlign: 'center', marginTop: spacing.xs }}>
                    {Math.round(supplyLevel)}% remaining
                </Text>
            </Card>

            {/* Actions */}
            <Box style={{ marginTop: spacing.xl }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => alert('Find Pharmacy feature coming soon')}
                    accessibilityLabel="Find a pharmacy"
                >
                    Find Pharmacy
                </Button>
            </Box>
            <Box style={{ marginTop: spacing.sm }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => alert('Order Refill Online coming soon')}
                    accessibilityLabel="Order refill online"
                >
                    Order Refill Online
                </Button>
            </Box>

            {/* Snooze Options */}
            {!snoozed && (
                <div style={{ marginTop: spacing['2xl'], textAlign: 'center' }}>
                    <Text fontWeight="medium" fontSize="md" color={colors.neutral.gray700}>
                        Snooze Reminder
                    </Text>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: spacing.md,
                            marginTop: spacing.sm,
                        }}
                    >
                        {SNOOZE_OPTIONS.map((option) => (
                            <button
                                key={`snooze-${option.days}`}
                                onClick={() => handleSnooze(option)}
                                style={{
                                    padding: `${spacing.sm} ${spacing.lg}`,
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.journeys.health.primary}`,
                                    background: 'none',
                                    color: colors.journeys.health.primary,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                                data-testid={`snooze-${option.days}-button`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Box style={{ marginTop: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Go back">
                    Back
                </Button>
            </Box>
        </div>
    );
};

export default MedicationRefillReminderPage;
