import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { ProgressBar } from 'src/web/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_CARE_ROUTES } from 'src/web/shared/constants/routes';

/** Condition assessment result type */
interface ConditionResult {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'moderate' | 'high';
    description: string;
}

/** Mock condition results for demonstration */
const MOCK_RESULTS: ConditionResult[] = [
    {
        id: 'c1',
        name: 'Upper Respiratory Infection',
        probability: 72,
        severity: 'low',
        description: 'Common viral infection affecting the nose, throat, and airways.',
    },
    {
        id: 'c2',
        name: 'Seasonal Allergies',
        probability: 58,
        severity: 'low',
        description: 'Immune response to environmental allergens such as pollen or dust.',
    },
    {
        id: 'c3',
        name: 'Sinusitis',
        probability: 34,
        severity: 'moderate',
        description: 'Inflammation of the sinuses, often following a cold or allergies.',
    },
];

const getSeverityStatus = (severity: string): 'success' | 'warning' | 'error' => {
    switch (severity) {
        case 'high':
            return 'error';
        case 'moderate':
            return 'warning';
        default:
            return 'success';
    }
};

/**
 * Symptom analysis result page showing possible conditions
 * with probability scores and severity badges.
 */
const SymptomResultPage: React.FC = () => {
    const router = useRouter();

    const handleViewRecommendations = () => {
        router.push({
            pathname: WEB_CARE_ROUTES.SYMPTOM_RECOMMENDATION,
            query: router.query,
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Assessment Results
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xs }}>
                Based on your symptoms, here are possible conditions.
            </Text>
            <Text fontSize="sm" color={colors.semantic.warning} style={{ marginBottom: spacing.xl }}>
                This is not a medical diagnosis. Please consult a healthcare professional.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {MOCK_RESULTS.map((condition) => (
                    <Card key={condition.id} journey="care" elevation="md" padding="lg">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginBottom: spacing.sm }}
                        >
                            <Text fontWeight="bold" fontSize="lg">
                                {condition.name}
                            </Text>
                            <Badge variant="status" status={getSeverityStatus(condition.severity)}>
                                {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                            </Badge>
                        </Box>

                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.md }}>
                            {condition.description}
                        </Text>

                        <Box style={{ marginBottom: spacing.xs }}>
                            <Text fontSize="sm" fontWeight="medium">
                                Match probability: {condition.probability}%
                            </Text>
                        </Box>
                        <ProgressBar
                            current={condition.probability}
                            total={100}
                            journey="care"
                            size="sm"
                            ariaLabel={`${condition.name} probability ${condition.probability}%`}
                        />
                    </Card>
                ))}
            </div>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button variant="secondary" journey="care" onPress={() => router.back()} accessibilityLabel="Go back">
                    Back
                </Button>
                <Button journey="care" onPress={handleViewRecommendations} accessibilityLabel="View recommendations">
                    View Recommendations
                </Button>
            </Box>
        </div>
    );
};

export default SymptomResultPage;
