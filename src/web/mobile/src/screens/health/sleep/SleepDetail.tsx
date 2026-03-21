import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Sleep stage type for the pie chart and timeline.
 */
type SleepStage = 'deep' | 'light' | 'rem' | 'awake';

/**
 * A single stage segment in the sleep timeline.
 */
interface TimelineSegment {
    id: string;
    stage: SleepStage;
    startTime: string;
    endTime: string;
    widthPercent: number;
}

/**
 * Environment reading for the sleep session.
 */
interface EnvironmentReading {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    labelKey: string;
    value: string;
}

const STAGE_COLORS: Record<SleepStage, string> = {
    deep: colors.journeys.health.secondary,
    light: colors.journeys.health.primary,
    rem: colors.semantic.info,
    awake: colors.semantic.warning,
};

const STAGE_PERCENTAGES: { stage: SleepStage; percent: number; labelKey: string }[] = [
    { stage: 'deep', percent: 25, labelKey: 'journeys.health.sleep.detail.stageDeep' },
    { stage: 'light', percent: 40, labelKey: 'journeys.health.sleep.detail.stageLight' },
    { stage: 'rem', percent: 20, labelKey: 'journeys.health.sleep.detail.stageRem' },
    { stage: 'awake', percent: 15, labelKey: 'journeys.health.sleep.detail.stageAwake' },
];

const MOCK_TIMELINE: TimelineSegment[] = [
    { id: 'seg-1', stage: 'light', startTime: '22:30', endTime: '23:15', widthPercent: 10 },
    { id: 'seg-2', stage: 'deep', startTime: '23:15', endTime: '00:45', widthPercent: 18 },
    { id: 'seg-3', stage: 'rem', startTime: '00:45', endTime: '01:30', widthPercent: 10 },
    { id: 'seg-4', stage: 'light', startTime: '01:30', endTime: '03:00', widthPercent: 18 },
    { id: 'seg-5', stage: 'deep', startTime: '03:00', endTime: '04:00', widthPercent: 12 },
    { id: 'seg-6', stage: 'awake', startTime: '04:00', endTime: '04:15', widthPercent: 3 },
    { id: 'seg-7', stage: 'rem', startTime: '04:15', endTime: '05:00', widthPercent: 10 },
    { id: 'seg-8', stage: 'light', startTime: '05:00', endTime: '06:30', widthPercent: 19 },
];

const MOCK_ENVIRONMENT: EnvironmentReading[] = [
    {
        id: 'env-temp',
        icon: 'thermometer-outline',
        labelKey: 'journeys.health.sleep.detail.temperature',
        value: '21°C',
    },
    { id: 'env-humidity', icon: 'water-outline', labelKey: 'journeys.health.sleep.detail.humidity', value: '45%' },
    {
        id: 'env-noise',
        icon: 'volume-medium-outline',
        labelKey: 'journeys.health.sleep.detail.noiseLevel',
        value: '32 dB',
    },
];

const MOCK_SCORE = 85;
const MOCK_TIME_IN_BED = '8h 00m';
const MOCK_TIME_ASLEEP = '7h 15m';
const MOCK_DATE = '2026-02-22';

/**
 * SleepDetail displays a comprehensive view of a single night's sleep data,
 * including sleep score, stage breakdown, timeline, and environment readings.
 */
export const SleepDetail: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const scoreColor = useMemo(() => {
        if (MOCK_SCORE >= 80) {
            return colors.semantic.success;
        }
        if (MOCK_SCORE >= 60) {
            return colors.semantic.warning;
        }
        return colors.semantic.error;
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.sleep.detail.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="sleep-detail-scroll"
            >
                {/* Date */}
                <Text fontSize="sm" color={colors.gray[50]} style={styles.dateText}>
                    {MOCK_DATE}
                </Text>

                {/* Sleep Score Ring */}
                <View style={styles.scoreContainer} testID="sleep-detail-score">
                    <View style={[styles.scoreRing, { borderColor: scoreColor }]}>
                        <Ionicons name="moon-outline" size={24} color={scoreColor} />
                        <Text fontSize="heading-2xl" fontWeight="bold" color={scoreColor}>
                            {MOCK_SCORE}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[50]}>
                            {t('journeys.health.sleep.detail.outOf100')}
                        </Text>
                    </View>
                </View>

                {/* Time Stats */}
                <Card journey="health" elevation="md" padding="md">
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="bed-outline" size={20} color={colors.journeys.health.primary} />
                            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                                {MOCK_TIME_IN_BED}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.sleep.detail.timeInBed')}
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="moon-outline" size={20} color={colors.journeys.health.secondary} />
                            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.secondary}>
                                {MOCK_TIME_ASLEEP}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.sleep.detail.timeAsleep')}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Sleep Stages Pie Chart */}
                <View style={styles.sectionContainer} testID="sleep-detail-stages">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.detail.sleepStages')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.pieContainer}>
                            {STAGE_PERCENTAGES.map((item) => (
                                <View
                                    key={item.stage}
                                    style={[
                                        styles.pieSlice,
                                        {
                                            width: `${item.percent}%`,
                                            backgroundColor: STAGE_COLORS[item.stage],
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                        <View style={styles.legendContainer}>
                            {STAGE_PERCENTAGES.map((item) => (
                                <View key={item.stage} style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: STAGE_COLORS[item.stage] }]} />
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t(item.labelKey)} ({item.percent}%)
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                </View>

                {/* Sleep Timeline */}
                <View style={styles.sectionContainer} testID="sleep-detail-timeline">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.detail.timeline')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.timelineBar}>
                            {MOCK_TIMELINE.map((segment) => (
                                <View
                                    key={segment.id}
                                    style={[
                                        styles.timelineSegment,
                                        {
                                            flex: segment.widthPercent,
                                            backgroundColor: STAGE_COLORS[segment.stage],
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                        <View style={styles.timelineLabels}>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {MOCK_TIMELINE[0].startTime}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {MOCK_TIMELINE[MOCK_TIMELINE.length - 1].endTime}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Environment */}
                <View style={styles.sectionContainer} testID="sleep-detail-environment">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.detail.environment')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        {MOCK_ENVIRONMENT.map((reading, index) => (
                            <View key={reading.id}>
                                <View style={styles.envRow}>
                                    <View style={styles.envIconContainer}>
                                        <Ionicons
                                            name={reading.icon}
                                            size={20}
                                            color={colors.journeys.health.primary}
                                        />
                                    </View>
                                    <Text fontSize="md" style={styles.envLabel}>
                                        {t(reading.labelKey)}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semiBold" color={colors.gray[60]}>
                                        {reading.value}
                                    </Text>
                                </View>
                                {index < MOCK_ENVIRONMENT.length - 1 && <View style={styles.divider} />}
                            </View>
                        ))}
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    dateText: {
        textAlign: 'center',
        marginTop: spacingValues.sm,
    },
    scoreContainer: {
        alignItems: 'center',
        marginVertical: spacingValues.xl,
    },
    scoreRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: colors.gray[20],
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    pieContainer: {
        flexDirection: 'row',
        height: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    pieSlice: {
        height: 24,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacingValues.md,
        gap: spacingValues.md,
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
    timelineBar: {
        flexDirection: 'row',
        height: 32,
        borderRadius: 8,
        overflow: 'hidden',
    },
    timelineSegment: {
        height: 32,
    },
    timelineLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacingValues.xs,
    },
    envRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
    },
    envIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    envLabel: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
    },
});

export default SleepDetail;
