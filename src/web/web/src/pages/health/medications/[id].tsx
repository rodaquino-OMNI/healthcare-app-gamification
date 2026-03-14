import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { ProgressBar } from 'design-system/components/ProgressBar/ProgressBar';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

import { useMedications } from '@/hooks';

/** Mock medication detail data */
interface MedicationDetail {
    id: string;
    name: string;
    dosage: string;
    form: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    instructions: string;
    adherenceRate: number;
    totalDoses: number;
    takenDoses: number;
    refillDate?: string;
    prescribedBy: string;
    doseHistory: Array<{ date: string; taken: boolean; time?: string }>;
}

/** Mock detail for demonstration */
const MOCK_DETAIL: MedicationDetail = {
    id: '1',
    name: 'Losartan',
    dosage: '50mg',
    form: 'Tablet',
    frequency: 'Once daily, morning',
    startDate: '2025-12-01',
    instructions: 'Take with or without food. Avoid potassium supplements.',
    adherenceRate: 92,
    totalDoses: 82,
    takenDoses: 75,
    refillDate: '2026-03-15',
    prescribedBy: 'Dr. Maria Silva',
    doseHistory: [
        { date: '2026-02-21', taken: true, time: '08:15' },
        { date: '2026-02-20', taken: true, time: '08:30' },
        { date: '2026-02-19', taken: false },
        { date: '2026-02-18', taken: true, time: '07:45' },
        { date: '2026-02-17', taken: true, time: '08:00' },
    ],
};

/**
 * Medication detail page showing comprehensive information about a medication
 * including dose history, adherence progress, and refill information.
 */
const MedicationDetailPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    // In a real app, fetch medication detail by id
    const medication = MOCK_DETAIL;

    const handleBack = (): void => {
        void router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
    };

    const handleDelete = (): void => {
        // In a real app, call API to delete
        void router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                        {medication.name}
                    </Text>
                    <Text fontSize="md" color={colors.gray[50]}>
                        {medication.dosage} - {medication.form}
                    </Text>
                </div>
                <Badge variant="status" status="success">
                    Active
                </Badge>
            </Box>

            {/* Adherence Card */}
            <Card journey="health" elevation="md" padding="lg" style={{ marginTop: spacing.xl }}>
                <Text fontWeight="medium" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Adherence
                </Text>
                <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.sm }}>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        {medication.takenDoses} of {medication.totalDoses} doses taken
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color={colors.journeys.health.primary}>
                        {medication.adherenceRate}%
                    </Text>
                </Box>
                <ProgressBar
                    current={medication.adherenceRate}
                    total={100}
                    journey="health"
                    size="md"
                    ariaLabel={`Adherence rate ${medication.adherenceRate}%`}
                />
            </Card>

            {/* Details Card */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.md }}>
                <Text fontWeight="medium" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Details
                </Text>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                    <Box>
                        <Text fontSize="xs" color={colors.gray[40]}>
                            Frequency
                        </Text>
                        <Text fontSize="sm">{medication.frequency}</Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color={colors.gray[40]}>
                            Start Date
                        </Text>
                        <Text fontSize="sm">{medication.startDate}</Text>
                    </Box>
                    <Box>
                        <Text fontSize="xs" color={colors.gray[40]}>
                            Prescribed By
                        </Text>
                        <Text fontSize="sm">{medication.prescribedBy}</Text>
                    </Box>
                    {medication.refillDate && (
                        <Box>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                Next Refill
                            </Text>
                            <Text fontSize="sm">{medication.refillDate}</Text>
                        </Box>
                    )}
                </div>
                {medication.instructions && (
                    <Box style={{ marginTop: spacing.md }}>
                        <Text fontSize="xs" color={colors.gray[40]}>
                            Instructions
                        </Text>
                        <Text fontSize="sm">{medication.instructions}</Text>
                    </Box>
                )}
            </Card>

            {/* Dose History Card */}
            <Card journey="health" elevation="sm" padding="lg" style={{ marginTop: spacing.md }}>
                <Text fontWeight="medium" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Recent Dose History
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {medication.doseHistory.map((dose, idx) => (
                        <Box
                            key={idx}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{
                                paddingBottom: spacing.sm,
                                borderBottom:
                                    idx < medication.doseHistory.length - 1
                                        ? `1px solid ${colors.neutral.gray300}`
                                        : 'none',
                            }}
                        >
                            <Box>
                                <Text fontSize="sm">{dose.date}</Text>
                                {dose.time && (
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {dose.time}
                                    </Text>
                                )}
                            </Box>
                            <Badge variant="status" status={dose.taken ? 'success' : 'error'}>
                                {dose.taken ? 'Taken' : 'Missed'}
                            </Badge>
                        </Box>
                    ))}
                </div>
            </Card>

            {/* Actions */}
            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={handleBack}
                    accessibilityLabel="Back to medications list"
                >
                    Back
                </Button>
                <Box display="flex" style={{ gap: spacing.sm }}>
                    {!showDeleteConfirm ? (
                        <Button
                            variant="tertiary"
                            journey="health"
                            onPress={() => setShowDeleteConfirm(true)}
                            accessibilityLabel="Delete this medication"
                        >
                            Delete
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="tertiary"
                                journey="health"
                                onPress={() => setShowDeleteConfirm(false)}
                                accessibilityLabel="Cancel deletion"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                journey="health"
                                onPress={handleDelete}
                                accessibilityLabel="Confirm delete medication"
                            >
                                Confirm Delete
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default MedicationDetailPage;
