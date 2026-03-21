import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';

import { ROUTES } from '../../../constants/routes';

/**
 * Cycle phase identifier.
 */
type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

interface PhaseConfig {
    labelKey: string;
    color: string;
    descriptionKey: string;
}

const PHASE_CONFIGS: Record<CyclePhase, PhaseConfig> = {
    menstrual: {
        labelKey: 'journeys.health.cycle.phases.menstrual',
        color: colors.semantic.error,
        descriptionKey: 'journeys.health.cycle.calendar.menstrualDesc',
    },
    follicular: {
        labelKey: 'journeys.health.cycle.phases.follicular',
        color: colors.journeys.health.primary,
        descriptionKey: 'journeys.health.cycle.calendar.follicularDesc',
    },
    ovulation: {
        labelKey: 'journeys.health.cycle.phases.ovulation',
        color: colors.semantic.info,
        descriptionKey: 'journeys.health.cycle.calendar.ovulationDesc',
    },
    luteal: {
        labelKey: 'journeys.health.cycle.phases.luteal',
        color: colors.journeys.community.primary,
        descriptionKey: 'journeys.health.cycle.calendar.lutealDesc',
    },
};

/**
 * Mock cycle data for demonstration.
 */
const MOCK_CYCLE = {
    currentDay: 8,
    totalLength: 28,
    phase: 'follicular' as CyclePhase,
    nextPeriod: '2026-03-14',
    fertileWindowStart: '2026-03-04',
    fertileWindowEnd: '2026-03-09',
    ovulationDate: '2026-03-07',
};

const CIRCLE_SIZE = 200;
const STROKE_WIDTH = 12;

/**
 * CycleCalendar shows the "Today" view with a circular progress indicator
 * displaying the current position in the cycle, predicted dates, and quick actions.
 */
export const CycleCalendar: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [cycle] = useState(MOCK_CYCLE);

    const phaseConfig = useMemo(() => PHASE_CONFIGS[cycle.phase], [cycle.phase]);

    const progressPercent = useMemo(
        () => Math.round((cycle.currentDay / cycle.totalLength) * 100),
        [cycle.currentDay, cycle.totalLength]
    );

    const handleLogPeriod = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_CYCLE_LOG_PERIOD);
    }, [navigation]);

    const handleLogSymptoms = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_CYCLE_LOG_SYMPTOMS);
    }, [navigation]);

    const predictions = [
        {
            labelKey: 'journeys.health.cycle.calendar.nextPeriod',
            value: cycle.nextPeriod,
            color: colors.semantic.error,
        },
        {
            labelKey: 'journeys.health.cycle.calendar.fertileWindow',
            value: `${cycle.fertileWindowStart} - ${cycle.fertileWindowEnd}`,
            color: colors.semantic.success,
        },
        {
            labelKey: 'journeys.health.cycle.calendar.ovulationDate',
            value: cycle.ovulationDate,
            color: colors.semantic.info,
        },
    ];

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
                    {t('journeys.health.cycle.calendar.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Circular Progress */}
                <View style={styles.circleContainer}>
                    <View style={[styles.circleOuter, { borderColor: colors.gray[20] }]}>
                        <View
                            style={[
                                styles.circleProgress,
                                {
                                    borderColor: phaseConfig.color,
                                    borderTopColor: 'transparent',
                                    transform: [{ rotate: `${(progressPercent / 100) * 360}deg` }],
                                },
                            ]}
                        />
                        <View style={styles.circleInner}>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.calendar.day')}
                            </Text>
                            <Text fontSize="heading-2xl" fontWeight="bold" color={phaseConfig.color}>
                                {cycle.currentDay}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.calendar.of')} {cycle.totalLength}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Phase Label */}
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.phaseContainer}>
                        <View style={[styles.phaseIndicator, { backgroundColor: phaseConfig.color }]} />
                        <View style={styles.phaseInfo}>
                            <Text fontSize="lg" fontWeight="semiBold">
                                {t(phaseConfig.labelKey)}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t(phaseConfig.descriptionKey)}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Predictions */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.calendar.predictions')}
                    </Text>
                    {predictions.map((pred, idx) => (
                        <Card key={`pred-${idx}`} journey="health" elevation="sm" padding="md">
                            <View style={styles.predictionRow}>
                                <View style={[styles.predDot, { backgroundColor: pred.color }]} />
                                <View style={styles.predContent}>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t(pred.labelKey)}
                                    </Text>
                                    <Text fontSize="md" fontWeight="medium">
                                        {pred.value}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleLogPeriod}
                        accessibilityLabel={t('journeys.health.cycle.calendar.logPeriod')}
                        testID="log-period-button"
                    >
                        {t('journeys.health.cycle.calendar.logPeriod')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleLogSymptoms}
                        accessibilityLabel={t('journeys.health.cycle.calendar.logSymptoms')}
                        testID="log-symptoms-button"
                    >
                        {t('journeys.health.cycle.calendar.logSymptoms')}
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
    circleContainer: {
        alignItems: 'center',
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
    circleOuter: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: STROKE_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleProgress: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: STROKE_WIDTH,
    },
    circleInner: {
        alignItems: 'center',
    },
    phaseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phaseIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: spacingValues.sm,
    },
    phaseInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    predictionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    predDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: spacingValues.sm,
    },
    predContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default CycleCalendar;
