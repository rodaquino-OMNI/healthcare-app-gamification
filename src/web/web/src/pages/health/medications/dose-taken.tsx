import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Checkbox } from 'design-system/components/Checkbox/Checkbox';
import { Input } from 'design-system/components/Input/Input';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

import { useMedications } from '@/hooks';

/**
 * Format the current time as HH:MM.
 */
const formatCurrentTime = (): string => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

/**
 * Dose taken form page. Allows users to log a medication dose
 * with timestamp, notes, and optional side effects flag.
 */
const MedicationDoseTakenPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const { name, dosage, scheduledTime } = router.query;

    const medicationName = (name as string) || 'Medication';
    const medicationDosage = (dosage as string) || '';
    const scheduled = (scheduledTime as string) || '';

    const [timestamp, setTimestamp] = useState(formatCurrentTime());
    const [notes, setNotes] = useState('');
    const [hasSideEffects, setHasSideEffects] = useState(false);

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

    void medications;

    const handleConfirm = (): void => {
        // In a real app, persist the dose record via API
        void router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
    };

    const handleCancel = (): void => {
        router.back();
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Log Dose Taken
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Record that you have taken your medication
            </Text>

            {/* Medication Info */}
            <Card journey="health" elevation="md" padding="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Text fontWeight="semiBold" fontSize="xl">
                            {medicationName}
                        </Text>
                        {scheduled && (
                            <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                                Scheduled: {scheduled}
                            </Text>
                        )}
                    </Box>
                    {medicationDosage && (
                        <Badge variant="status" status="info">
                            {medicationDosage}
                        </Badge>
                    )}
                </Box>
            </Card>

            {/* Timestamp */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.md }}>
                <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    Time Taken
                </Text>
                <Input
                    label="Time"
                    value={timestamp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimestamp(e.target.value)}
                    placeholder="HH:MM"
                    journey="health"
                    testID="timestamp-input"
                />
            </Card>

            {/* Notes */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.md }}>
                <Text fontWeight="medium" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    Notes (optional)
                </Text>
                <Input
                    label="Notes"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                    placeholder="Any observations about this dose..."
                    journey="health"
                    testID="notes-input"
                />
            </Card>

            {/* Side Effects Toggle */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.md }}>
                <Checkbox
                    id="side-effects-checkbox"
                    name="sideEffects"
                    value="sideEffects"
                    label="I experienced side effects"
                    checked={hasSideEffects}
                    onChange={() => setHasSideEffects(!hasSideEffects)}
                    journey="health"
                    testID="side-effects-checkbox"
                />
                {hasSideEffects && (
                    <Text
                        fontSize="sm"
                        color={colors.journeys.health.primary}
                        style={{ marginTop: spacing.sm, cursor: 'pointer' }}
                    >
                        Report side effects in detail
                    </Text>
                )}
            </Card>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={handleCancel} accessibilityLabel="Cancel">
                    Cancel
                </Button>
                <Button journey="health" onPress={handleConfirm} accessibilityLabel="Confirm dose taken">
                    Confirm Dose Taken
                </Button>
            </Box>
        </div>
    );
};

export default MedicationDoseTakenPage;
