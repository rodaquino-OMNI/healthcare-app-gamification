import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, Share, Alert } from 'react-native';

interface PossibleCondition {
    id: string;
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
}

type SymptomShareReportRouteParams = {
    symptoms: Array<{ id: string; name: string }>;
    regions: Array<{ id: string; label: string }>;
    conditions: PossibleCondition[];
    overallSeverity: number;
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

const getSeverityBadgeStatus = (severity: number): 'success' | 'warning' | 'error' => {
    if (severity <= 3) {
        return 'success';
    }
    if (severity <= 6) {
        return 'warning';
    }
    return 'error';
};

const buildReportText = (
    symptoms: Array<{ id: string; name: string }>,
    regions: Array<{ id: string; label: string }>,
    conditions: PossibleCondition[],
    overallSeverity: number
): string => {
    const date = new Date().toLocaleDateString();
    const parts = [
        `AUSTA Health - Symptom Check Report`,
        `Date: ${date}`,
        `Severity: ${getSeverityLabel(overallSeverity)} (${overallSeverity}/10)`,
        '',
        'Symptoms:',
        ...symptoms.map((s) => `- ${s.name}`),
    ];

    if (regions.length > 0) {
        parts.push('', 'Body Regions:', ...regions.map((r) => `- ${r.label}`));
    }

    if (conditions.length > 0) {
        parts.push('', 'Possible Conditions:', ...conditions.slice(0, 3).map((c) => `- ${c.name} (${c.probability}%)`));
    }

    parts.push(
        '',
        'Disclaimer: This report is for informational purposes only and does not constitute a medical diagnosis.'
    );

    return parts.join('\n');
};

/**
 * Share symptom check report via email, WhatsApp, or other share methods.
 * Uses React Native Share API for cross-platform sharing.
 */
const SymptomShareReport: React.FC = () => {
    const route = useRoute<RouteProp<{ params: SymptomShareReportRouteParams }, 'params'>>();
    const { t } = useTranslation();

    const { symptoms = [], regions = [], conditions = [], overallSeverity = 5 } = route.params || {};

    const reportText = buildReportText(symptoms, regions, conditions, overallSeverity);
    const currentDate = new Date().toLocaleDateString();

    const handleShare = async (_method: string): Promise<void> => {
        try {
            await Share.share({
                title: t('journeys.care.symptomChecker.shareReport.shareTitle'),
                message: reportText,
            });
        } catch (error) {
            Alert.alert(
                t('journeys.care.symptomChecker.shareReport.errorTitle'),
                t('journeys.care.symptomChecker.shareReport.errorMessage')
            );
        }
    };

    const handleShareWithDoctor = async (): Promise<void> => {
        try {
            await Share.share({
                title: t('journeys.care.symptomChecker.shareReport.doctorShareTitle'),
                message: `${t('journeys.care.symptomChecker.shareReport.doctorPrefix')}\n\n${reportText}`,
            });
        } catch (error) {
            Alert.alert(
                t('journeys.care.symptomChecker.shareReport.errorTitle'),
                t('journeys.care.symptomChecker.shareReport.errorMessage')
            );
        }
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="share-report-title">
                    {t('journeys.care.symptomChecker.shareReport.title')}
                </Text>

                {/* Report preview card */}
                <Card journey="care" elevation="md">
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.shareReport.reportPreview')}
                    </Text>

                    <View style={styles.previewRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.symptomChecker.shareReport.date')}
                        </Text>
                        <Text fontSize="text-sm" fontWeight="semiBold" journey="care" testID="report-date">
                            {currentDate}
                        </Text>
                    </View>

                    <View style={styles.previewRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.symptomChecker.shareReport.severity')}
                        </Text>
                        <Badge
                            variant="status"
                            status={getSeverityBadgeStatus(overallSeverity)}
                            testID="severity-badge"
                            accessibilityLabel={`${t('journeys.care.symptomChecker.shareReport.severity')}: ${getSeverityLabel(overallSeverity)}`}
                        >
                            {getSeverityLabel(overallSeverity)}
                        </Badge>
                    </View>

                    <View style={styles.previewRow}>
                        <Text fontSize="text-sm" color={colors.neutral.gray600}>
                            {t('journeys.care.symptomChecker.shareReport.symptomsCount')}
                        </Text>
                        <Text fontSize="text-sm" fontWeight="semiBold" journey="care">
                            {symptoms.length}
                        </Text>
                    </View>

                    {conditions.length > 0 && (
                        <View style={styles.previewRow}>
                            <Text fontSize="text-sm" color={colors.neutral.gray600}>
                                {t('journeys.care.symptomChecker.shareReport.topCondition')}
                            </Text>
                            <Text fontSize="text-sm" fontWeight="semiBold" journey="care">
                                {conditions[0].name}
                            </Text>
                        </View>
                    )}
                </Card>

                {/* Share options */}
                <Text variant="body" fontWeight="semiBold" journey="care" style={styles.sectionTitle}>
                    {t('journeys.care.symptomChecker.shareReport.shareOptions')}
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        onPress={() => handleShare('email')}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.shareReport.shareEmail')}
                        testID="share-email-button"
                    >
                        {t('journeys.care.symptomChecker.shareReport.shareEmail')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={() => handleShare('whatsapp')}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.shareReport.shareWhatsApp')}
                        testID="share-whatsapp-button"
                    >
                        {t('journeys.care.symptomChecker.shareReport.shareWhatsApp')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={() => handleShare('print')}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.shareReport.printReport')}
                        testID="share-print-button"
                    >
                        {t('journeys.care.symptomChecker.shareReport.printReport')}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={handleShareWithDoctor}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.shareReport.shareWithDoctor')}
                        testID="share-doctor-button"
                    >
                        {t('journeys.care.symptomChecker.shareReport.shareWithDoctor')}
                    </Button>
                </View>

                {/* Disclaimer */}
                <Text variant="caption" color={colors.neutral.gray600} testID="disclaimer" style={styles.disclaimer}>
                    {t('journeys.care.symptomChecker.shareReport.disclaimer')}
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
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    sectionTitle: {
        marginTop: spacingValues.xl,
        marginBottom: spacingValues.sm,
    },
    buttonContainer: {
        gap: spacingValues.sm,
    },
    disclaimer: {
        marginTop: spacingValues.xl,
    },
});

export { SymptomShareReport };
export default SymptomShareReport;
