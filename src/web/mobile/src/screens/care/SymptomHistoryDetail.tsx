import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ROUTES } from '@constants/routes';

import type { CareNavigationProp, CareStackParamList } from '../../navigation/types';

interface MockCheckDetail {
    id: string;
    date: string;
    symptoms: Array<{ id: string; name: string }>;
    regions: Array<{ id: string; label: string }>;
    overallSeverity: number;
    conditions: Array<{
        id: string;
        name: string;
        probability: number;
        severity: 'low' | 'medium' | 'high';
    }>;
    recommendations: string[];
}

const MOCK_CHECK_DETAILS: Record<string, MockCheckDetail> = {
    'check-1': {
        id: 'check-1',
        date: '2026-02-20',
        symptoms: [
            { id: 's1', name: 'Headache' },
            { id: 's2', name: 'Neck Stiffness' },
            { id: 's3', name: 'Light Sensitivity' },
        ],
        regions: [
            { id: 'r1', label: 'Head - Frontal' },
            { id: 'r2', label: 'Neck' },
        ],
        overallSeverity: 4,
        conditions: [
            { id: 'c1', name: 'Tension Headache', probability: 72, severity: 'low' },
            { id: 'c2', name: 'Migraine', probability: 45, severity: 'medium' },
            { id: 'c3', name: 'Cervical Strain', probability: 30, severity: 'low' },
        ],
        recommendations: [
            'Rest in a quiet, dark room',
            'Apply cold compress to forehead',
            'Stay hydrated',
            'Take OTC pain relievers as needed',
            'Monitor symptoms for 48 hours',
        ],
    },
    'check-2': {
        id: 'check-2',
        date: '2026-02-18',
        symptoms: [
            { id: 's1', name: 'Sore Throat' },
            { id: 's2', name: 'Runny Nose' },
            { id: 's3', name: 'Cough' },
            { id: 's4', name: 'Low Fever' },
        ],
        regions: [
            { id: 'r1', label: 'Throat' },
            { id: 'r2', label: 'Chest' },
        ],
        overallSeverity: 5,
        conditions: [
            { id: 'c1', name: 'Common Cold', probability: 68, severity: 'low' },
            { id: 'c2', name: 'Influenza', probability: 35, severity: 'medium' },
            { id: 'c3', name: 'Strep Throat', probability: 20, severity: 'medium' },
        ],
        recommendations: [
            'Get plenty of rest',
            'Drink warm fluids',
            'Gargle with salt water',
            'Use throat lozenges',
            'See a doctor if fever persists >3 days',
        ],
    },
};

const DEFAULT_CHECK: MockCheckDetail = {
    id: 'default',
    date: '2026-02-15',
    symptoms: [{ id: 's1', name: 'General Discomfort' }],
    regions: [{ id: 'r1', label: 'General' }],
    overallSeverity: 3,
    conditions: [{ id: 'c1', name: 'Mild Illness', probability: 50, severity: 'low' }],
    recommendations: ['Rest and monitor symptoms', 'Stay hydrated'],
};

const getSeverityBadgeStatus = (severity: number | string): 'success' | 'warning' | 'error' => {
    if (typeof severity === 'string') {
        if (severity === 'low') {
            return 'success';
        }
        if (severity === 'medium') {
            return 'warning';
        }
        return 'error';
    }
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
 * Detail view of a past symptom check.
 * Shows full summary including symptoms, body regions, severity,
 * conditions, and recommendations.
 */
const SymptomHistoryDetail: React.FC = () => {
    const navigation = useNavigation<CareNavigationProp>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareSymptomHistoryDetail'>>();
    const { t } = useTranslation();

    const sessionId = route.params?.sessionId ?? '';
    const checkDetail = MOCK_CHECK_DETAILS[sessionId] ?? DEFAULT_CHECK;

    const handleCompare = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_COMPARISON);
    };

    const handleRateAccuracy = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_ACCURACY_RATING, {
            sessionId: checkDetail.id,
        });
    };

    const handleShareReport = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_SHARE_REPORT, { sessionId });
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="detail-title">
                    {t('journeys.care.symptomChecker.historyDetail.title')}
                </Text>

                {/* Date and severity header */}
                <Card journey="care" elevation="md">
                    <View style={styles.headerRow}>
                        <View>
                            <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                {t('journeys.care.symptomChecker.historyDetail.date')}
                            </Text>
                            <Text fontSize="heading-md" fontWeight="semiBold" journey="care" testID="check-date">
                                {checkDetail.date}
                            </Text>
                        </View>
                        <Badge
                            variant="status"
                            status={getSeverityBadgeStatus(checkDetail.overallSeverity)}
                            testID="severity-badge"
                            accessibilityLabel={`${t('journeys.care.symptomChecker.historyDetail.severity')}: ${getSeverityLabel(checkDetail.overallSeverity)}`}
                        >
                            {getSeverityLabel(checkDetail.overallSeverity)} ({checkDetail.overallSeverity}/10)
                        </Badge>
                    </View>
                </Card>

                {/* Symptoms */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.historyDetail.symptoms')}
                    </Text>
                    {checkDetail.symptoms.map((symptom, index) => (
                        <Text key={symptom.id} variant="body" journey="care" testID={`symptom-${index}`}>
                            {'\u2022'} {symptom.name}
                        </Text>
                    ))}
                </Card>

                {/* Body regions */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.historyDetail.bodyRegions')}
                    </Text>
                    {checkDetail.regions.map((region, index) => (
                        <Text key={region.id} variant="body" journey="care" testID={`region-${index}`}>
                            {'\u2022'} {region.label}
                        </Text>
                    ))}
                </Card>

                {/* Conditions */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.historyDetail.conditions')}
                    </Text>
                    {checkDetail.conditions.map((condition, index) => (
                        <View key={condition.id} style={styles.conditionRow}>
                            <View style={styles.conditionInfo}>
                                <Text variant="body" journey="care" testID={`condition-${index}`}>
                                    {condition.name}
                                </Text>
                                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                    {condition.probability}%
                                </Text>
                            </View>
                            <Badge
                                variant="status"
                                status={getSeverityBadgeStatus(condition.severity)}
                                testID={`condition-badge-${index}`}
                                accessibilityLabel={`${condition.severity} severity`}
                            >
                                {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                            </Badge>
                        </View>
                    ))}
                </Card>

                {/* Recommendations */}
                <Card journey="care" elevation="sm">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.historyDetail.recommendations')}
                    </Text>
                    {checkDetail.recommendations.map((rec, index) => (
                        <Text key={`rec-${index}`} variant="body" journey="care" testID={`recommendation-${index}`}>
                            {'\u2022'} {rec}
                        </Text>
                    ))}
                </Card>

                {/* Action buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        onPress={handleCompare}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.historyDetail.compare')}
                        testID="compare-button"
                    >
                        {t('journeys.care.symptomChecker.historyDetail.compare')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleRateAccuracy}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.historyDetail.rateAccuracy')}
                        testID="rate-accuracy-button"
                    >
                        {t('journeys.care.symptomChecker.historyDetail.rateAccuracy')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleShareReport}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.historyDetail.shareReport')}
                        testID="share-report-button"
                    >
                        {t('journeys.care.symptomChecker.historyDetail.shareReport')}
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    conditionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    conditionInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    buttonContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
});

export { SymptomHistoryDetail };
export default SymptomHistoryDetail;
