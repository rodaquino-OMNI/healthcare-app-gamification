import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Slider } from 'design-system/components/Slider/Slider';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/** Severity level thresholds and their labels */
const SEVERITY_LABELS = [
    {
        min: 1,
        max: 3,
        label: 'Mild',
        description: 'Noticeable but does not interfere with daily activities',
        color: colors.semantic.success,
    },
    {
        min: 4,
        max: 6,
        label: 'Moderate',
        description: 'Interferes with some daily activities',
        color: colors.semantic.warning,
    },
    {
        min: 7,
        max: 8,
        label: 'Severe',
        description: 'Significantly limits daily activities',
        color: colors.semantic.error,
    },
    {
        min: 9,
        max: 10,
        label: 'Critical',
        description: 'Requires immediate medical attention',
        color: colors.semantic.error,
    },
];

const getSeverityInfo = (
    value: number
): { min: number; max: number; label: string; description: string; color: string } => {
    return SEVERITY_LABELS.find((s) => value >= s.min && value <= s.max) || SEVERITY_LABELS[0];
};

/**
 * Overall severity assessment page.
 * Users rate the overall impact of their symptoms before analysis.
 */
const SymptomSeverityPage: React.FC = () => {
    const router = useRouter();
    const {
        symptoms: _symptoms,
        currentStep: _currentStep,
        setCurrentStep: _setCurrentStep,
        isLoading,
        error,
    } = useSymptomChecker();
    const { t } = useTranslation();
    const [overallSeverity, setOverallSeverity] = useState(5);

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {error.message}
                </Text>
            </div>
        );
    }

    const severityInfo = getSeverityInfo(overallSeverity);

    const handleAnalyze = (): void => {
        void router.push({
            pathname: WEB_CARE_ROUTES.SYMPTOM_RESULT,
            query: {
                ...router.query,
                overallSeverity: overallSeverity.toString(),
            },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Overall Severity
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Rate the overall impact of your symptoms on a scale of 1 to 10.
            </Text>

            <Card journey="care" elevation="md" padding="lg">
                <Box style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                    <Text fontSize="4xl" fontWeight="bold" color={severityInfo.color}>
                        {overallSeverity}
                    </Text>
                    <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color={severityInfo.color}
                        style={{ marginTop: spacing.xs }}
                    >
                        {severityInfo.label}
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                        {severityInfo.description}
                    </Text>
                </Box>

                <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={overallSeverity}
                    onChange={setOverallSeverity}
                    journey="care"
                    accessibilityLabel="Overall symptom severity from 1 to 10"
                />

                <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing.sm }}>
                    <Text fontSize="xs" color={colors.semantic.success}>
                        1 - Mild
                    </Text>
                    <Text fontSize="xs" color={colors.semantic.warning}>
                        5 - Moderate
                    </Text>
                    <Text fontSize="xs" color={colors.semantic.error}>
                        10 - Critical
                    </Text>
                </Box>
            </Card>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button variant="secondary" journey="care" onPress={() => router.back()} accessibilityLabel="Go back">
                    Back
                </Button>
                <Button journey="care" onPress={handleAnalyze} accessibilityLabel="Analyze symptoms">
                    Analyze Symptoms
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default SymptomSeverityPage;
