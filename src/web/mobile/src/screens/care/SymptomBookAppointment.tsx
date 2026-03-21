import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ROUTES } from '@constants/routes';

interface PossibleCondition {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
}

type SymptomBookAppointmentRouteParams = {
    conditions: PossibleCondition[];
    overallSeverity: number;
};

const getSpecialtySuggestion = (
    conditions: PossibleCondition[],
    severity: number
): { name: string; reason: string } => {
    if (severity >= 7) {
        return {
            name: 'Emergency Medicine',
            reason: 'Your symptom severity is high. Immediate medical attention is recommended.',
        };
    }
    const topCondition = conditions[0];
    if (topCondition && topCondition.severity === 'high') {
        return {
            name: 'Specialist',
            reason: `Based on "${topCondition.name}", a specialist consultation is recommended.`,
        };
    }
    return {
        name: 'General Practitioner',
        reason: 'A general practitioner can evaluate your symptoms and refer you if needed.',
    };
};

const getSeverityBadgeStatus = (severity: number): 'success' | 'warning' | 'error' => {
    if (severity <= 3) {
        return 'success';
    }
    if (severity <= 6) {
        return 'warning';
    }
    return 'error';
};

const getSeverityLabel = (severity: number): string => {
    if (severity <= 3) {
        return 'Low';
    }
    if (severity <= 6) {
        return 'Moderate';
    }
    return 'High';
};

/**
 * Book appointment screen based on symptom checker results.
 * Suggests a specialty and provides navigation to booking or doctor search.
 */
const SymptomBookAppointment: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: SymptomBookAppointmentRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const { conditions = [], overallSeverity = 5 } = route.params || {};
    const specialty = getSpecialtySuggestion(conditions, overallSeverity);

    const handleBookNow = (): void => {
        navigation.navigate(ROUTES.CARE_BOOKING_SCHEDULE);
    };

    const handleViewDoctors = (): void => {
        navigation.navigate(ROUTES.CARE_DOCTOR_SEARCH);
    };

    const handleMaybeLater = (): void => {
        navigation.navigate(ROUTES.CARE_DASHBOARD);
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="book-appointment-title">
                    {t('journeys.care.symptomChecker.bookAppointment.title')}
                </Text>

                {/* Recommendation card */}
                <Card journey="care" elevation="md">
                    <View style={styles.recommendationHeader}>
                        <Text variant="body" fontWeight="semiBold" journey="care">
                            {t('journeys.care.symptomChecker.bookAppointment.recommendation')}
                        </Text>
                        <Badge
                            variant="status"
                            status={getSeverityBadgeStatus(overallSeverity)}
                            testID="severity-badge"
                            accessibilityLabel={`${t('journeys.care.symptomChecker.bookAppointment.severity')}: ${getSeverityLabel(overallSeverity)}`}
                        >
                            {getSeverityLabel(overallSeverity)}
                        </Badge>
                    </View>
                    <Text variant="body" journey="care" testID="recommendation-text">
                        {t('journeys.care.symptomChecker.bookAppointment.recommendationText')}
                    </Text>
                </Card>

                {/* Specialty suggestion card */}
                <Card journey="care" elevation="sm">
                    <Text fontSize="text-sm" color={colors.neutral.gray600} testID="specialty-label">
                        {t('journeys.care.symptomChecker.bookAppointment.suggestedSpecialty')}
                    </Text>
                    <Text fontSize="heading-md" fontWeight="semiBold" journey="care" testID="specialty-name">
                        {specialty.name}
                    </Text>
                    <Text variant="body" journey="care" testID="specialty-reason">
                        {specialty.reason}
                    </Text>
                </Card>

                {/* Top conditions summary */}
                {conditions.length > 0 && (
                    <Card journey="care" elevation="sm">
                        <Text variant="body" fontWeight="semiBold" journey="care">
                            {t('journeys.care.symptomChecker.bookAppointment.basedOn')}
                        </Text>
                        {conditions.slice(0, 3).map((condition, index) => (
                            <View key={condition.id} style={styles.conditionRow}>
                                <Text variant="body" journey="care" testID={`condition-${index}`}>
                                    {condition.name}
                                </Text>
                                <Text
                                    fontSize="text-sm"
                                    color={colors.neutral.gray600}
                                    testID={`condition-prob-${index}`}
                                >
                                    {condition.probability}%
                                </Text>
                            </View>
                        ))}
                    </Card>
                )}

                {/* Action buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={handleBookNow}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.bookAppointment.bookNow')}
                        testID="book-now-button"
                    >
                        {t('journeys.care.symptomChecker.bookAppointment.bookNow')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleViewDoctors}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.bookAppointment.viewDoctors')}
                        testID="view-doctors-button"
                    >
                        {t('journeys.care.symptomChecker.bookAppointment.viewDoctors')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleMaybeLater}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.bookAppointment.maybeLater')}
                        testID="maybe-later-button"
                    >
                        {t('journeys.care.symptomChecker.bookAppointment.maybeLater')}
                    </Button>
                </View>

                {/* Disclaimer */}
                <Text variant="caption" color={colors.neutral.gray600} testID="disclaimer">
                    {t('journeys.care.symptomChecker.bookAppointment.disclaimer')}
                </Text>
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
    recommendationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    conditionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    buttonContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
});

export { SymptomBookAppointment };
export default SymptomBookAppointment;
