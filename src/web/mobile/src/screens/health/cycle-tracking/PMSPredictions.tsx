import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';

/**
 * Severity level for PMS predictions.
 */
type Severity = 'mild' | 'moderate' | 'severe';

/**
 * Predicted symptom entry.
 */
interface PredictedSymptom {
    id: string;
    nameKey: string;
    severity: Severity;
    probability: number;
    selfCareKey: string;
}

/**
 * Timeline day entry for PMS window.
 */
interface TimelineDay {
    date: string;
    dayLabel: string;
    isActive: boolean;
    isPeak: boolean;
}

const SEVERITY_COLORS: Record<Severity, string> = {
    mild: colors.semantic.success,
    moderate: colors.semantic.warning,
    severe: colors.semantic.error,
};

const MOCK_PMS_WINDOW: TimelineDay[] = [
    { date: '2026-03-10', dayLabel: 'Tue', isActive: true, isPeak: false },
    { date: '2026-03-11', dayLabel: 'Wed', isActive: true, isPeak: false },
    { date: '2026-03-12', dayLabel: 'Thu', isActive: true, isPeak: true },
    { date: '2026-03-13', dayLabel: 'Fri', isActive: true, isPeak: true },
    { date: '2026-03-14', dayLabel: 'Sat', isActive: true, isPeak: false },
];

const MOCK_PREDICTIONS: PredictedSymptom[] = [
    {
        id: 'pms-cramps',
        nameKey: 'journeys.health.cycle.pms.symptoms.cramps',
        severity: 'moderate',
        probability: 78,
        selfCareKey: 'journeys.health.cycle.pms.selfCare.cramps',
    },
    {
        id: 'pms-bloating',
        nameKey: 'journeys.health.cycle.pms.symptoms.bloating',
        severity: 'mild',
        probability: 85,
        selfCareKey: 'journeys.health.cycle.pms.selfCare.bloating',
    },
    {
        id: 'pms-mood',
        nameKey: 'journeys.health.cycle.pms.symptoms.moodSwings',
        severity: 'moderate',
        probability: 72,
        selfCareKey: 'journeys.health.cycle.pms.selfCare.moodSwings',
    },
    {
        id: 'pms-headache',
        nameKey: 'journeys.health.cycle.pms.symptoms.headache',
        severity: 'mild',
        probability: 55,
        selfCareKey: 'journeys.health.cycle.pms.selfCare.headache',
    },
    {
        id: 'pms-fatigue',
        nameKey: 'journeys.health.cycle.pms.symptoms.fatigue',
        severity: 'severe',
        probability: 90,
        selfCareKey: 'journeys.health.cycle.pms.selfCare.fatigue',
    },
];

const MOCK_ACCURACY = 76;

/**
 * PMSPredictions shows the predicted PMS window timeline, symptom forecasts
 * with severity and self-care recommendations based on history.
 */
export const PMSPredictions: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const sortedPredictions = useMemo(() => [...MOCK_PREDICTIONS].sort((a, b) => b.probability - a.probability), []);

    const renderSymptomItem = ({ item }: ListRenderItemInfo<PredictedSymptom>): React.ReactElement | null => {
        const severityColor = SEVERITY_COLORS[item.severity];
        return (
            <Card journey="health" elevation="sm" padding="md">
                <View
                    style={styles.symptomHeader}
                    accessibilityLabel={`${t(item.nameKey)}, ${item.probability}%, ${t(`journeys.health.cycle.pms.severityLevels.${item.severity}`)}`}
                    accessibilityRole="summary"
                >
                    <View style={styles.symptomTitleRow}>
                        <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
                        <Text fontSize="md" fontWeight="semiBold">
                            {t(item.nameKey)}
                        </Text>
                    </View>
                    <Text fontSize="sm" fontWeight="bold" color={severityColor}>
                        {item.probability}%
                    </Text>
                </View>

                <View style={styles.severityRow}>
                    <Text fontSize="xs" color={colors.gray[50]}>
                        {t('journeys.health.cycle.pms.severity')}:
                    </Text>
                    <Text fontSize="xs" fontWeight="semiBold" color={severityColor}>
                        {t(`journeys.health.cycle.pms.severityLevels.${item.severity}`)}
                    </Text>
                </View>

                <View style={styles.selfCareContainer}>
                    <Text fontSize="xs" color={colors.gray[50]}>
                        {t('journeys.health.cycle.pms.selfCareLabel')}
                    </Text>
                    <Text fontSize="sm" color={colors.gray[60]}>
                        {t(item.selfCareKey)}
                    </Text>
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.cycle.pms.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={sortedPredictions}
                renderItem={renderSymptomItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                testID="pms-predictions-list"
                ListHeaderComponent={
                    <>
                        {/* Timeline */}
                        <View style={styles.sectionContainer}>
                            <Text fontSize="lg" fontWeight="semiBold" journey="health">
                                {t('journeys.health.cycle.pms.timeline')}
                            </Text>
                            <View style={styles.timelineRow}>
                                {MOCK_PMS_WINDOW.map((day, idx) => (
                                    <View
                                        key={`tl-${idx}`}
                                        style={[
                                            styles.timelineDay,
                                            day.isActive && styles.timelineDayActive,
                                            day.isPeak && styles.timelineDayPeak,
                                        ]}
                                        testID={`timeline-day-${idx}`}
                                    >
                                        <Text
                                            fontSize="xs"
                                            color={day.isActive ? colors.neutral.white : colors.gray[50]}
                                        >
                                            {day.dayLabel}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            fontWeight={day.isPeak ? 'bold' : 'medium'}
                                            color={day.isActive ? colors.neutral.white : colors.gray[60]}
                                        >
                                            {day.date.split('-')[2]}
                                        </Text>
                                        {day.isPeak && <View style={styles.peakMarker} />}
                                    </View>
                                ))}
                            </View>
                            <View style={styles.legendRow}>
                                <View style={styles.legendItem}>
                                    <View
                                        style={[
                                            styles.legendDot,
                                            { backgroundColor: colors.journeys.community.primary },
                                        ]}
                                    />
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t('journeys.health.cycle.pms.pmsWindow')}
                                    </Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View
                                        style={[
                                            styles.legendDot,
                                            { backgroundColor: colors.journeys.community.accent },
                                        ]}
                                    />
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t('journeys.health.cycle.pms.peakDays')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Accuracy */}
                        <Card journey="health" elevation="md" padding="md">
                            <View
                                style={styles.accuracyContainer}
                                accessibilityLabel={`${t('journeys.health.cycle.pms.historicalAccuracy')}: ${MOCK_ACCURACY}%`}
                                accessibilityRole="summary"
                            >
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {t('journeys.health.cycle.pms.historicalAccuracy')}
                                </Text>
                                <Text fontSize="heading-2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                    {MOCK_ACCURACY}%
                                </Text>
                                <View style={styles.accuracyBar}>
                                    <View style={[styles.accuracyFill, { width: `${MOCK_ACCURACY}%` }]} />
                                </View>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {t('journeys.health.cycle.pms.accuracyNote')}
                                </Text>
                            </View>
                        </Card>

                        {/* Section Label for Predictions */}
                        <View style={styles.predictionsHeader}>
                            <Text fontSize="lg" fontWeight="semiBold" journey="health">
                                {t('journeys.health.cycle.pms.predictedSymptoms')}
                            </Text>
                        </View>
                    </>
                }
            />
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
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    sectionContainer: {
        gap: spacingValues.sm,
        marginBottom: spacingValues.md,
    },
    timelineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timelineDay: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
        marginHorizontal: 2,
        borderRadius: 8,
        backgroundColor: colors.gray[10],
        gap: spacingValues['4xs'],
    },
    timelineDayActive: {
        backgroundColor: colors.journeys.community.primary,
    },
    timelineDayPeak: {
        backgroundColor: colors.journeys.community.accent,
    },
    peakMarker: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.neutral.white,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacingValues.xl,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['3xs'],
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    accuracyContainer: {
        alignItems: 'center',
        gap: spacingValues['3xs'],
    },
    accuracyBar: {
        width: '100%',
        height: 8,
        backgroundColor: colors.gray[10],
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: spacingValues.xs,
    },
    accuracyFill: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.journeys.health.primary,
    },
    predictionsHeader: {
        marginTop: spacingValues.md,
        marginBottom: spacingValues.xs,
    },
    symptomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    symptomTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.xs,
    },
    severityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    severityRow: {
        flexDirection: 'row',
        gap: spacingValues.xs,
        marginTop: spacingValues.xs,
    },
    selfCareContainer: {
        marginTop: spacingValues.sm,
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.gray[10],
        gap: spacingValues['3xs'],
    },
});

export default PMSPredictions;
