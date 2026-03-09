import { Badge } from 'design-system/components/Badge/Badge';
import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { ProgressBar } from 'design-system/components/ProgressBar/ProgressBar';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

interface Condition {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'moderate' | 'high';
    summary: string;
}

const MOCK_CONDITIONS: Condition[] = [
    {
        id: 'c1',
        name: 'Upper Respiratory Infection',
        probability: 72,
        severity: 'low',
        summary: 'Common viral infection of the nose and throat.',
    },
    {
        id: 'c2',
        name: 'Seasonal Allergies',
        probability: 58,
        severity: 'low',
        summary: 'Immune response to airborne allergens.',
    },
    {
        id: 'c3',
        name: 'Sinusitis',
        probability: 34,
        severity: 'moderate',
        summary: 'Inflammation of the sinus cavities.',
    },
    {
        id: 'c4',
        name: 'Migraine',
        probability: 22,
        severity: 'moderate',
        summary: 'Recurrent headaches with sensitivity to light and sound.',
    },
    {
        id: 'c5',
        name: 'Tension Headache',
        probability: 18,
        severity: 'low',
        summary: 'Mild to moderate diffuse head pain.',
    },
];

const getSeverityStatus = (s: string): 'success' | 'warning' | 'error' => {
    if (s === 'high') {
        return 'error';
    }
    if (s === 'moderate') {
        return 'warning';
    }
    return 'success';
};

/** Conditions list page showing all matched conditions with probability bars and badges. */
const ConditionsListPage: React.FC = () => {
    const router = useRouter();

    const handleViewDetail = (id: string): void => {
        void router.push({
            pathname: '/care/symptom-checker/condition-detail',
            query: { ...router.query, conditionId: id },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Possible Conditions
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xs }}>
                Based on your symptoms, here are possible matches.
            </Text>
            <Text fontSize="sm" color={colors.semantic.warning} style={{ marginBottom: spacing.xl }}>
                This is not a medical diagnosis. Consult a healthcare professional.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {MOCK_CONDITIONS.map((condition) => (
                    <Card key={condition.id} journey="care" elevation="md" padding="lg">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.xs }}
                        >
                            <Text fontWeight="bold" fontSize="lg">
                                {condition.name}
                            </Text>
                            <Badge variant="status" status={getSeverityStatus(condition.severity)}>
                                {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                            </Badge>
                        </Box>

                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.sm }}>
                            {condition.summary}
                        </Text>

                        <Box style={{ marginBottom: spacing.xs }}>
                            <Text fontSize="sm" fontWeight="medium">
                                Match: {condition.probability}%
                            </Text>
                        </Box>
                        <ProgressBar
                            current={condition.probability}
                            total={100}
                            journey="care"
                            size="sm"
                            ariaLabel={`${condition.name} probability ${condition.probability}%`}
                        />

                        <Box display="flex" justifyContent="flex-end" style={{ marginTop: spacing.sm }}>
                            <Button
                                variant="tertiary"
                                journey="care"
                                onPress={() => handleViewDetail(condition.id)}
                                accessibilityLabel={`View details for ${condition.name}`}
                                data-testid={`condition-detail-${condition.id}`}
                            >
                                View Details
                            </Button>
                        </Box>
                    </Card>
                ))}
            </div>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="conditions-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={() => void router.push('/care/symptom-checker/self-care')}
                    accessibilityLabel="View self-care recommendations"
                    data-testid="conditions-recommendations-btn"
                >
                    View Recommendations
                </Button>
            </Box>
        </div>
    );
};

export default ConditionsListPage;
