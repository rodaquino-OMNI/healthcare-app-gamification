import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';

import type { HealthStackParamList } from '../../navigation/types';

type DrugInteractionRouteParams = {
    MedicationDrugInteraction: {
        medicationId: string;
        medicationName: string;
    };
};

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
    minor: {
        badgeStatus: 'info',
        label: 'Minor',
        color: colors.semantic.info,
    },
    moderate: {
        badgeStatus: 'warning',
        label: 'Moderate',
        color: colors.semantic.warning,
    },
    severe: {
        badgeStatus: 'error',
        label: 'Severe',
        color: colors.semantic.error,
    },
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
 * MedicationDrugInteraction displays drug interaction warnings with severity
 * indicators and recommendations for each interaction.
 */
export const MedicationDrugInteraction: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const route = useRoute<RouteProp<DrugInteractionRouteParams, 'MedicationDrugInteraction'>>();
    const { t } = useTranslation();

    const { medicationName = 'Metformin' } = route.params ?? {};

    const highestSeverity: SeverityLevel = MOCK_INTERACTIONS.reduce<SeverityLevel>((highest, interaction) => {
        const order: SeverityLevel[] = ['minor', 'moderate', 'severe'];
        return order.indexOf(interaction.severity) > order.indexOf(highest) ? interaction.severity : highest;
    }, 'minor');

    const severityConfig = SEVERITY_CONFIG[highestSeverity];

    const handleTalkToDoctor = useCallback(() => {
        Alert.alert(t('medication.talkToDoctor'), t('medication.talkToDoctorMessage'));
    }, [t]);

    const handleDismiss = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('medication.goBack')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('medication.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.drugInteractions')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Severity Indicator */}
                <View style={styles.severityContainer}>
                    <Text fontWeight="semiBold" fontSize="lg" textAlign="center" color={colors.neutral.gray700}>
                        {medicationName}
                    </Text>
                    <View style={styles.severityBadge}>
                        <Badge
                            variant="status"
                            status={severityConfig.badgeStatus}
                            accessibilityLabel={`${t('medication.overallSeverity')}: ${severityConfig.label}`}
                        >
                            {severityConfig.label} {t('medication.riskLevel')}
                        </Badge>
                    </View>
                    <Text fontSize="sm" color={colors.neutral.gray600} textAlign="center">
                        {MOCK_INTERACTIONS.length} {t('medication.interactionsFound')}
                    </Text>
                </View>

                {/* Interaction Cards */}
                {MOCK_INTERACTIONS.map((interaction) => {
                    const config = SEVERITY_CONFIG[interaction.severity];
                    return (
                        <Card
                            key={interaction.id}
                            journey="health"
                            elevation="sm"
                            padding="md"
                            style={styles.interactionCard}
                        >
                            {/* Drug Pair Names */}
                            <View style={styles.drugPairRow}>
                                <Text fontWeight="semiBold" fontSize="md">
                                    {interaction.drugA}
                                </Text>
                                <Text fontSize="sm" color={colors.neutral.gray500}>
                                    {' + '}
                                </Text>
                                <Text fontWeight="semiBold" fontSize="md">
                                    {interaction.drugB}
                                </Text>
                            </View>

                            {/* Severity Badge */}
                            <View style={styles.interactionBadge}>
                                <Badge
                                    variant="status"
                                    status={config.badgeStatus}
                                    accessibilityLabel={`${t('medication.severity')}: ${config.label}`}
                                >
                                    {config.label}
                                </Badge>
                            </View>

                            {/* Description */}
                            <Text fontSize="sm" color={colors.neutral.gray700} style={styles.descriptionText}>
                                {interaction.description}
                            </Text>

                            {/* Recommendation */}
                            <View style={[styles.recommendationBox, { borderLeftColor: config.color }]}>
                                <Text fontSize="xs" fontWeight="semiBold" color={colors.neutral.gray700}>
                                    {t('medication.recommendation')}
                                </Text>
                                <Text fontSize="xs" color={colors.neutral.gray600}>
                                    {interaction.recommendation}
                                </Text>
                            </View>
                        </Card>
                    );
                })}

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleTalkToDoctor}
                        accessibilityLabel={t('medication.talkToDoctor')}
                        testID="talk-to-doctor-button"
                    >
                        {t('medication.talkToDoctor')}
                    </Button>
                    <View style={styles.actionSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleDismiss}
                        accessibilityLabel={t('medication.dismiss')}
                        testID="dismiss-button"
                    >
                        {t('medication.dismiss')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    severityContainer: {
        alignItems: 'center',
        paddingVertical: spacingValues.lg,
    },
    severityBadge: {
        marginVertical: spacingValues.sm,
    },
    interactionCard: {
        marginBottom: spacingValues.md,
    },
    drugPairRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: spacingValues.xs,
    },
    interactionBadge: {
        marginBottom: spacingValues.sm,
        alignSelf: 'flex-start',
    },
    descriptionText: {
        marginBottom: spacingValues.sm,
        lineHeight: 20,
    },
    recommendationBox: {
        borderLeftWidth: 3,
        paddingLeft: spacingValues.sm,
        paddingVertical: spacingValues.xs,
        backgroundColor: colors.neutral.gray100,
        borderRadius: 4,
        paddingRight: spacingValues.sm,
    },
    actionsContainer: {
        marginTop: spacingValues.xl,
        paddingBottom: spacingValues.xl,
    },
    actionSpacer: {
        height: spacingValues.sm,
    },
});

export default MedicationDrugInteraction;
