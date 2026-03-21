import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const NEXT_STEPS_KEYS = ['doctorReview', 'personalizedPlan', 'healthInsights'] as const;

/**
 * StepSubmissionConfirm displays the success state after assessment submission,
 * estimated processing time, and next steps.
 */
export const StepSubmissionConfirm: React.FC<StepProps> = ({ data: _data, onUpdate }) => {
    const { t } = useTranslation();

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Success Icon */}
            <View style={styles.iconContainer} testID="submission-success-icon">
                <View style={styles.iconCircle}>
                    <Text fontSize="heading-xl" textAlign="center">
                        {'\u2713'}
                    </Text>
                </View>
            </View>

            {/* Success Message */}
            <Text variant="heading" fontSize="lg" journey="health" textAlign="center" style={styles.title}>
                {t('healthAssessment.submissionConfirm.title')}
            </Text>
            <Text fontSize="sm" color={colors.neutral.gray600} textAlign="center" style={styles.subtitle}>
                {t('healthAssessment.submissionConfirm.subtitle')}
            </Text>

            {/* Processing Time */}
            <Card journey="health" elevation="sm" padding="md" style={styles.card}>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                    {t('healthAssessment.submissionConfirm.processingTitle')}
                </Text>
                <Text fontSize="sm" color={colors.neutral.gray600} style={styles.processingText}>
                    {t('healthAssessment.submissionConfirm.processingTime')}
                </Text>
            </Card>

            {/* Next Steps */}
            <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.text} style={styles.nextStepsTitle}>
                {t('healthAssessment.submissionConfirm.nextStepsTitle')}
            </Text>

            {NEXT_STEPS_KEYS.map((key, index) => (
                <View key={key} style={styles.stepRow} testID={`next-step-${key}`}>
                    <View style={styles.stepNumber}>
                        <Text fontSize="sm" fontWeight="semiBold" color={colors.neutral.white} textAlign="center">
                            {String(index + 1)}
                        </Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text fontSize="sm" fontWeight="medium" color={colors.neutral.gray900}>
                            {t(`healthAssessment.submissionConfirm.nextSteps.${key}.title`)}
                        </Text>
                        <Text fontSize="xs" color={colors.neutral.gray600}>
                            {t(`healthAssessment.submissionConfirm.nextSteps.${key}.description`)}
                        </Text>
                    </View>
                </View>
            ))}

            {/* View Results Button */}
            <Touchable
                onPress={() => onUpdate('viewResults', true)}
                accessibilityLabel={t('healthAssessment.submissionConfirm.viewResults')}
                accessibilityRole="button"
                testID="btn-view-results"
                style={styles.viewResultsButton}
            >
                <Text fontSize="md" fontWeight="semiBold" color={colors.neutral.white} textAlign="center">
                    {t('healthAssessment.submissionConfirm.viewResults')}
                </Text>
            </Touchable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: spacingValues['2xl'],
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.semantic.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginTop: spacingValues.lg,
    },
    subtitle: {
        marginTop: spacingValues.xs,
        marginBottom: spacingValues.xl,
    },
    card: {
        marginBottom: spacingValues.lg,
    },
    processingText: {
        marginTop: spacingValues.xs,
    },
    nextStepsTitle: {
        marginBottom: spacingValues.md,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacingValues.md,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
        marginTop: 2,
    },
    stepContent: {
        flex: 1,
    },
    viewResultsButton: {
        backgroundColor: colors.journeys.health.primary,
        paddingVertical: spacingValues.md,
        borderRadius: borderRadiusValues.md,
        marginTop: spacingValues.lg,
        alignItems: 'center',
    },
});

export default StepSubmissionConfirm;
