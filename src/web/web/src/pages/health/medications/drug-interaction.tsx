import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { useMedications } from '@/hooks';

type SeverityLevel = 'minor' | 'moderate' | 'severe';

interface DrugInteraction {
    id: string;
    drugA: string;
    drugB: string;
    severity: SeverityLevel;
    description: string;
    recommendation: string;
}

const SEVERITY_CONFIG: Record<
    SeverityLevel,
    { badgeStatus: 'info' | 'warning' | 'error'; label: string; color: string }
> = {
    minor: { badgeStatus: 'info', label: 'Minor', color: colors.semantic.info },
    moderate: { badgeStatus: 'warning', label: 'Moderate', color: colors.semantic.warning },
    severe: { badgeStatus: 'error', label: 'Severe', color: colors.semantic.error },
};

const MOCK_INTERACTIONS: DrugInteraction[] = [
    {
        id: '1',
        drugA: 'Metformin',
        drugB: 'Ibuprofen',
        severity: 'moderate',
        description:
            'NSAIDs like Ibuprofen may reduce kidney function, which can increase metformin levels in the blood and raise the risk of lactic acidosis.',
        recommendation: 'Monitor kidney function regularly. Consider acetaminophen as an alternative pain reliever.',
    },
    {
        id: '2',
        drugA: 'Lisinopril',
        drugB: 'Potassium Supplements',
        severity: 'severe',
        description:
            'ACE inhibitors like Lisinopril can increase potassium levels. Combined with potassium supplements, this may cause dangerously high potassium (hyperkalemia).',
        recommendation:
            'Avoid potassium supplements unless directed by your doctor. Monitor potassium levels regularly.',
    },
    {
        id: '3',
        drugA: 'Atorvastatin',
        drugB: 'Grapefruit Juice',
        severity: 'minor',
        description:
            'Grapefruit juice can increase the levels of atorvastatin in the blood, potentially increasing the risk of side effects.',
        recommendation: 'Limit grapefruit juice consumption. One small glass per day is generally safe.',
    },
];

/**
 * Drug interaction warning page showing severity indicators,
 * interaction descriptions, and recommendations for each drug pair.
 */
const MedicationDrugInteractionPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const medicationName = (router.query.name as string) || 'Metformin';

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

    const highestSeverity: SeverityLevel = MOCK_INTERACTIONS.reduce<SeverityLevel>((highest, interaction) => {
        const order: SeverityLevel[] = ['minor', 'moderate', 'severe'];
        return order.indexOf(interaction.severity) > order.indexOf(highest) ? interaction.severity : highest;
    }, 'minor');

    const overallConfig = SEVERITY_CONFIG[highestSeverity];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Drug Interactions
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Known interactions for {medicationName}.
            </Text>

            {/* Overall Severity */}
            <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                <Text fontWeight="semiBold" fontSize="lg" color={colors.neutral.gray700}>
                    {medicationName}
                </Text>
                <div style={{ margin: `${spacing.sm} 0` }}>
                    <Badge variant="status" status={overallConfig.badgeStatus}>
                        {overallConfig.label} Risk Level
                    </Badge>
                </div>
                <Text fontSize="sm" color={colors.gray[50]}>
                    {MOCK_INTERACTIONS.length} interactions found
                </Text>
            </div>

            {/* Interaction Cards */}
            {MOCK_INTERACTIONS.map((interaction) => {
                const config = SEVERITY_CONFIG[interaction.severity];
                return (
                    <Card
                        key={interaction.id}
                        journey="health"
                        elevation="sm"
                        padding="lg"
                        style={{ marginBottom: spacing.md }}
                    >
                        {/* Drug Pair */}
                        <Box display="flex" alignItems="center" style={{ gap: spacing.xs, marginBottom: spacing.xs }}>
                            <Text fontWeight="semiBold" fontSize="md">
                                {interaction.drugA}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                +
                            </Text>
                            <Text fontWeight="semiBold" fontSize="md">
                                {interaction.drugB}
                            </Text>
                        </Box>

                        {/* Severity Badge */}
                        <div style={{ marginBottom: spacing.sm }}>
                            <Badge variant="status" status={config.badgeStatus}>
                                {config.label}
                            </Badge>
                        </div>

                        {/* Description */}
                        <Text
                            fontSize="sm"
                            color={colors.neutral.gray700}
                            style={{ marginBottom: spacing.sm, lineHeight: '20px' }}
                        >
                            {interaction.description}
                        </Text>

                        {/* Recommendation */}
                        <div
                            style={{
                                borderLeft: `3px solid ${config.color}`,
                                paddingLeft: spacing.sm,
                                paddingTop: spacing.xs,
                                paddingBottom: spacing.xs,
                                paddingRight: spacing.sm,
                                backgroundColor: colors.neutral.gray100,
                                borderRadius: '4px',
                            }}
                        >
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.neutral.gray700}>
                                Recommendation
                            </Text>
                            <Text fontSize="xs" color={colors.neutral.gray600}>
                                {interaction.recommendation}
                            </Text>
                        </div>
                    </Card>
                );
            })}

            {/* Actions */}
            <Box style={{ marginTop: spacing.xl }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => alert('Connecting you with your doctor...')}
                    accessibilityLabel="Talk to your doctor"
                >
                    Talk to Your Doctor
                </Button>
            </Box>
            <Box style={{ marginTop: spacing.sm }}>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Dismiss">
                    Dismiss
                </Button>
            </Box>
        </div>
    );
};

export default MedicationDrugInteractionPage;
