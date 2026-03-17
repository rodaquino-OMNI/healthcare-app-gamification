import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

type SeverityLevel = 'mild' | 'moderate' | 'severe';

interface SideEffectEntry {
    id: string;
    date: string;
    effectName: string;
    severity: SeverityLevel;
    notes: string;
}

const SEVERITY_CONFIG: Record<SeverityLevel, { badgeStatus: 'info' | 'warning' | 'error'; label: string }> = {
    mild: { badgeStatus: 'info', label: 'Mild' },
    moderate: { badgeStatus: 'warning', label: 'Moderate' },
    severe: { badgeStatus: 'error', label: 'Severe' },
};

const MOCK_SIDE_EFFECTS: SideEffectEntry[] = [
    {
        id: '1',
        date: '2026-02-20',
        effectName: 'Nausea',
        severity: 'mild',
        notes: 'Slight nausea after morning dose. Resolved within 30 minutes.',
    },
    {
        id: '2',
        date: '2026-02-18',
        effectName: 'Headache',
        severity: 'moderate',
        notes: 'Persistent headache lasting several hours after taking medication.',
    },
    {
        id: '3',
        date: '2026-02-15',
        effectName: 'Dizziness',
        severity: 'mild',
        notes: 'Brief dizziness when standing up quickly.',
    },
    {
        id: '4',
        date: '2026-02-10',
        effectName: 'Fatigue',
        severity: 'severe',
        notes: 'Extreme tiredness throughout the day. Unable to perform normal activities.',
    },
    {
        id: '5',
        date: '2026-02-05',
        effectName: 'Insomnia',
        severity: 'moderate',
        notes: 'Difficulty falling asleep. Stayed awake until 2 AM.',
    },
];

/**
 * Side effects log page displaying a timeline of reported side effects
 * with severity badges, dates, and notes. Links to the report form.
 */
const MedicationSideEffectsPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();

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

    const handleAddSideEffect = (): void => {
        void router.push('/health/medications/side-effect-form');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                        Side Effects Log
                    </Text>
                    <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                        Track and report medication side effects.
                    </Text>
                </div>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={handleAddSideEffect}
                    accessibilityLabel="Report new side effect"
                >
                    + Report
                </Button>
            </Box>

            {/* Side Effects List */}
            <div style={{ marginTop: spacing.xl }}>
                {MOCK_SIDE_EFFECTS.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: `${spacing['3xl']} 0` }}>
                        <Text fontSize="xl" color={colors.neutral.gray500}>
                            No side effects reported
                        </Text>
                        <Text fontSize="sm" color={colors.neutral.gray500} style={{ marginTop: spacing.xs }}>
                            Tap the + Report button to log a new side effect.
                        </Text>
                    </div>
                ) : (
                    MOCK_SIDE_EFFECTS.map((entry) => {
                        const config = SEVERITY_CONFIG[entry.severity];
                        return (
                            <Card
                                key={entry.id}
                                journey="health"
                                elevation="sm"
                                padding="lg"
                                style={{ marginBottom: spacing.sm }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{ marginBottom: spacing.xs }}
                                >
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {entry.date}
                                    </Text>
                                    <Badge variant="status" status={config.badgeStatus}>
                                        {config.label}
                                    </Badge>
                                </Box>
                                <Text
                                    fontWeight="semiBold"
                                    fontSize="md"
                                    color={colors.neutral.gray800}
                                    style={{ marginBottom: spacing['3xs'] }}
                                >
                                    {entry.effectName}
                                </Text>
                                <Text fontSize="sm" color={colors.neutral.gray600}>
                                    {entry.notes}
                                </Text>
                            </Card>
                        );
                    })
                )}
            </div>

            <Box style={{ marginTop: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Go back">
                    Back
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default MedicationSideEffectsPage;
