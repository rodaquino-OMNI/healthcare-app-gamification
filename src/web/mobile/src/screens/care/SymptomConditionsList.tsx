import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareNavigationProp, CareStackParamList } from '../../navigation/types';

interface PossibleCondition {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
}

const getSeverityBadgeStatus = (severity: 'low' | 'medium' | 'high'): 'success' | 'warning' | 'error' => {
    switch (severity) {
        case 'low':
            return 'success';
        case 'medium':
            return 'warning';
        case 'high':
            return 'error';
    }
};

const getRiskLevel = (overallSeverity: number): { label: string; badgeStatus: 'success' | 'warning' | 'error' } => {
    if (overallSeverity <= 3) {
        return { label: 'Low Risk', badgeStatus: 'success' };
    }
    if (overallSeverity <= 6) {
        return { label: 'Moderate Risk', badgeStatus: 'warning' };
    }
    return { label: 'High Risk', badgeStatus: 'error' };
};

/**
 * Ranked list of possible conditions with confidence percentages.
 * Each condition card is tappable to navigate to its detail screen.
 * Provides quick actions for self-care or booking an appointment.
 */
const SymptomConditionsList: React.FC = () => {
    const navigation = useNavigation<CareNavigationProp>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareSymptomConditionsList'>>();
    const { t } = useTranslation();
    const sessionId = route.params?.sessionId ?? '';
    const overallSeverity = 5;
    const conditions: PossibleCondition[] = [];

    const riskLevel = getRiskLevel(overallSeverity);
    const sortedConditions = [...conditions].sort((a, b) => b.probability - a.probability);

    const handleConditionPress = (condition: PossibleCondition): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_CONDITION_DETAIL, {
            conditionId: condition.id,
            sessionId,
        });
    };

    const handleSelfCare = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_SELF_CARE, {
            sessionId,
        });
    };

    const handleBookAppointment = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_BOOK_APPOINTMENT, {
            sessionId,
        });
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="conditions-list-title">
                    {t('journeys.care.symptomChecker.conditionsList.title', {
                        defaultValue: 'Possible Conditions',
                    })}
                </Text>

                <Card journey="care" elevation="md">
                    <View style={styles.riskHeader}>
                        <Text variant="body" fontWeight="semiBold" journey="care">
                            {t('journeys.care.symptomChecker.conditionsList.riskAssessment', {
                                defaultValue: 'Risk Assessment',
                            })}
                        </Text>
                        <Badge
                            variant="status"
                            status={riskLevel.badgeStatus}
                            testID="risk-badge"
                            accessibilityLabel={t('journeys.care.symptomChecker.conditionsList.riskLevel', {
                                defaultValue: `Risk level: ${riskLevel.label}`,
                                level: riskLevel.label,
                            })}
                        >
                            {riskLevel.label}
                        </Badge>
                    </View>
                    <Text variant="body" journey="care">
                        {t('journeys.care.symptomChecker.conditionsList.summary', {
                            defaultValue: `We identified ${sortedConditions.length} possible conditions based on your symptoms. Tap any condition for more details.`,
                            count: sortedConditions.length,
                        })}
                    </Text>
                </Card>

                {sortedConditions.map((condition, index) => (
                    <Touchable
                        key={condition.id}
                        onPress={() => handleConditionPress(condition)}
                        accessibilityLabel={t('journeys.care.symptomChecker.conditionsList.conditionCard', {
                            defaultValue: `${condition.name}, ${condition.probability}% match, ${condition.severity} severity. Tap for details.`,
                            name: condition.name,
                            probability: condition.probability,
                            severity: condition.severity,
                        })}
                        accessibilityRole="button"
                        testID={`condition-card-${index}`}
                    >
                        <Card journey="care" elevation="sm">
                            <View style={styles.conditionHeader}>
                                <View style={styles.conditionNameRow}>
                                    <View style={styles.rankBadge}>
                                        <Text
                                            fontSize="text-xs"
                                            fontWeight="bold"
                                            color={colors.neutral.white}
                                            textAlign="center"
                                        >
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <Text
                                        fontSize="heading-md"
                                        fontWeight="semiBold"
                                        journey="care"
                                        testID={`condition-name-${index}`}
                                    >
                                        {condition.name}
                                    </Text>
                                </View>
                                <Badge
                                    variant="status"
                                    status={getSeverityBadgeStatus(condition.severity)}
                                    testID={`condition-severity-${index}`}
                                    accessibilityLabel={`${condition.severity} severity`}
                                >
                                    {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                                </Badge>
                            </View>

                            <View style={styles.probabilityRow}>
                                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                    {t('journeys.care.symptomChecker.conditionsList.matchProbability', {
                                        defaultValue: 'Match probability',
                                    })}
                                </Text>
                                <Text
                                    fontSize="text-sm"
                                    fontWeight="semiBold"
                                    color={colors.journeys.care.primary}
                                    testID={`condition-probability-${index}`}
                                >
                                    {condition.probability}%
                                </Text>
                            </View>

                            <ProgressBar
                                current={condition.probability}
                                total={100}
                                journey="care"
                                size="sm"
                                testId={`condition-progress-${index}`}
                                ariaLabel={`${condition.name} probability: ${condition.probability}%`}
                            />

                            <View style={styles.conditionDescription}>
                                <Text variant="body" journey="care">
                                    {condition.description}
                                </Text>
                            </View>

                            <View style={styles.tapHint}>
                                <Text fontSize="text-xs" color={colors.neutral.gray500}>
                                    {t('journeys.care.symptomChecker.conditionsList.tapForDetails', {
                                        defaultValue: 'Tap for details',
                                    })}
                                </Text>
                            </View>
                        </Card>
                    </Touchable>
                ))}

                <View style={styles.actionButtons}>
                    <Button
                        variant="secondary"
                        onPress={handleSelfCare}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.conditionsList.viewSelfCare', {
                            defaultValue: 'View self-care tips',
                        })}
                        testID="self-care-button"
                    >
                        {t('journeys.care.symptomChecker.conditionsList.selfCareButton', {
                            defaultValue: 'View Self-Care',
                        })}
                    </Button>
                    <Button
                        onPress={handleBookAppointment}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.conditionsList.bookAppointment', {
                            defaultValue: 'Book an appointment',
                        })}
                        testID="book-appointment-button"
                    >
                        {t('journeys.care.symptomChecker.conditionsList.bookButton', {
                            defaultValue: 'Book Appointment',
                        })}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    riskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    conditionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    conditionNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: spacingValues.xs,
    },
    rankBadge: {
        width: spacingValues.xl,
        height: spacingValues.xl,
        borderRadius: spacingValues.sm,
        backgroundColor: colors.journeys.care.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    probabilityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues['3xs'],
    },
    conditionDescription: {
        marginTop: spacingValues.sm,
    },
    tapHint: {
        marginTop: spacingValues.xs,
        alignItems: 'flex-end',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacingValues.xl,
        gap: spacingValues.md,
    },
});

export { SymptomConditionsList };
export default SymptomConditionsList;
