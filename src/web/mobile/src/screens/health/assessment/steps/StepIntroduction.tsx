import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { borderRadiusValues } from '@austa/design-system/src/tokens/borderRadius';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

const BENEFITS_KEYS = [
    'healthAssessment.introduction.benefit1',
    'healthAssessment.introduction.benefit2',
    'healthAssessment.introduction.benefit3',
    'healthAssessment.introduction.benefit4',
] as const;

/**
 * StepIntroduction displays a welcome screen for the health assessment.
 * Informational only with no form fields.
 */
export const StepIntroduction: React.FC<StepProps> = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.container} testID="step-introduction">
            {/* Icon */}
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Text fontSize="3xl" textAlign="center">
                        {'\uD83D\uDCCB'}
                    </Text>
                </View>
            </View>

            {/* Title */}
            <Text variant="heading" fontSize="heading-xl" journey="health" textAlign="center">
                {t('healthAssessment.introduction.title')}
            </Text>

            {/* Description */}
            <Text fontSize="md" color={colors.neutral.gray600} textAlign="center" style={styles.description}>
                {t('healthAssessment.introduction.description')}
            </Text>

            {/* Benefits */}
            <Card journey="health" elevation="sm" padding="md">
                <Text fontWeight="semiBold" fontSize="md" style={styles.benefitsTitle}>
                    {t('healthAssessment.introduction.benefitsTitle')}
                </Text>
                {BENEFITS_KEYS.map((key, index) => (
                    <View key={`benefit-${index}`} style={styles.benefitRow} testID={`benefit-${index}`}>
                        <View style={styles.bulletDot} />
                        <Text fontSize="sm" color={colors.neutral.gray700} style={styles.benefitText}>
                            {t(key)}
                        </Text>
                    </View>
                ))}
            </Card>

            {/* Estimated Time */}
            <View style={styles.timeContainer}>
                <Text fontSize="sm" color={colors.neutral.gray600} textAlign="center">
                    {t('healthAssessment.introduction.estimatedTime')}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: spacingValues.xl,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: spacingValues.xl,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.journeys.health.background,
        borderWidth: 2,
        borderColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    description: {
        marginTop: spacingValues.sm,
        marginBottom: spacingValues.xl,
        paddingHorizontal: spacingValues.md,
    },
    benefitsTitle: {
        marginBottom: spacingValues.sm,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacingValues.xs,
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: borderRadiusValues.full,
        backgroundColor: colors.journeys.health.primary,
        marginTop: 7,
        marginRight: spacingValues.xs,
    },
    benefitText: {
        flex: 1,
    },
    timeContainer: {
        marginTop: spacingValues.xl,
        paddingVertical: spacingValues.sm,
        backgroundColor: colors.neutral.gray200,
        borderRadius: borderRadiusValues.md,
        alignItems: 'center',
    },
});

export default StepIntroduction;
