import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Workout type for the detail view.
 */
type WorkoutType = 'run' | 'walk' | 'cycle' | 'gym' | 'swim';

/**
 * Stat card data for the detail view.
 */
interface DetailStat {
    id: string;
    labelKey: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Icon mapping for workout types.
 */
const WORKOUT_ICONS: Record<WorkoutType, keyof typeof Ionicons.glyphMap> = {
    run: 'walk-outline',
    walk: 'footsteps-outline',
    cycle: 'bicycle-outline',
    gym: 'barbell-outline',
    swim: 'water-outline',
};

/**
 * Mock workout detail data.
 */
const MOCK_WORKOUT = {
    type: 'run' as WorkoutType,
    typeKey: 'journeys.health.activity.workoutDetail.typeRun',
    date: '2026-02-23',
    time: '07:30 AM',
    duration: '45 min',
    calories: '420',
    avgHeartRate: '145 bpm',
    distance: '5.2 km',
    notes: 'Morning run along the park trail. Felt great, maintained steady pace throughout.',
};

/**
 * WorkoutDetail displays a comprehensive view of a single workout session,
 * including type badge, stats, notes, and delete option.
 */
export const WorkoutDetail: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();

    const detailStats: DetailStat[] = useMemo(
        () => [
            {
                id: 'duration',
                labelKey: 'journeys.health.activity.workoutDetail.duration',
                value: MOCK_WORKOUT.duration,
                icon: 'timer-outline' as keyof typeof Ionicons.glyphMap,
            },
            {
                id: 'calories',
                labelKey: 'journeys.health.activity.workoutDetail.calories',
                value: MOCK_WORKOUT.calories,
                icon: 'flame-outline' as keyof typeof Ionicons.glyphMap,
            },
            {
                id: 'heartRate',
                labelKey: 'journeys.health.activity.workoutDetail.avgHeartRate',
                value: MOCK_WORKOUT.avgHeartRate,
                icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
            },
            {
                id: 'distance',
                labelKey: 'journeys.health.activity.workoutDetail.distance',
                value: MOCK_WORKOUT.distance,
                icon: 'walk-outline' as keyof typeof Ionicons.glyphMap,
            },
        ],
        []
    );

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleDelete = useCallback(() => {
        Alert.alert(
            t('journeys.health.activity.workoutDetail.deleteTitle'),
            t('journeys.health.activity.workoutDetail.deleteMessage'),
            [
                { text: t('common.buttons.cancel'), style: 'cancel' },
                {
                    text: t('common.buttons.delete'),
                    style: 'destructive',
                    onPress: () => navigation.goBack(),
                },
            ]
        );
    }, [navigation, t]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.activity.workoutDetail.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Date */}
                <Text fontSize="sm" color={colors.gray[50]} style={styles.dateText}>
                    {MOCK_WORKOUT.date} - {MOCK_WORKOUT.time}
                </Text>

                {/* Workout Type Badge */}
                <View style={styles.badgeContainer}>
                    <View style={styles.typeBadge}>
                        <Ionicons name={WORKOUT_ICONS[MOCK_WORKOUT.type]} size={32} color={colors.neutral.white} />
                    </View>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                        {t(MOCK_WORKOUT.typeKey)}
                    </Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.sectionContainer} testID="activity-workout-detail-stats">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.workoutDetail.summary')}
                    </Text>
                    <View style={styles.statsGrid}>
                        {detailStats.map((stat) => (
                            <Card key={stat.id} journey="health" elevation="sm" padding="md">
                                <View style={styles.statItem}>
                                    <View style={styles.statIconCircle}>
                                        <Ionicons name={stat.icon} size={20} color={colors.journeys.health.primary} />
                                    </View>
                                    <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                                        {stat.value}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t(stat.labelKey)}
                                    </Text>
                                </View>
                            </Card>
                        ))}
                    </View>
                </View>

                {/* Notes Section */}
                <View style={styles.sectionContainer} testID="activity-workout-detail-notes">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.workoutDetail.notes')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.notesContent}>
                            <Ionicons name="document-text-outline" size={20} color={colors.gray[40]} />
                            <Text fontSize="md" color={colors.gray[60]} style={styles.notesText}>
                                {MOCK_WORKOUT.notes}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Workout Info */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.workoutDetail.details')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.infoRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.activity.workoutDetail.typeLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[60]}>
                                {t(MOCK_WORKOUT.typeKey)}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.activity.workoutDetail.dateLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[60]}>
                                {MOCK_WORKOUT.date}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.activity.workoutDetail.timeLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[60]}>
                                {MOCK_WORKOUT.time}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Delete Button */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleDelete}
                        accessibilityLabel={t('journeys.health.activity.workoutDetail.delete')}
                        testID="activity-workout-detail-delete"
                    >
                        {t('journeys.health.activity.workoutDetail.delete')}
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
    dateText: {
        textAlign: 'center',
        marginTop: spacingValues.sm,
    },
    badgeContainer: {
        alignItems: 'center',
        marginVertical: spacingValues.xl,
        gap: spacingValues.sm,
    },
    typeBadge: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacingValues.sm,
    },
    statItem: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        minWidth: 140,
    },
    statIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notesContent: {
        flexDirection: 'row',
        gap: spacingValues.sm,
        alignItems: 'flex-start',
    },
    notesText: {
        flex: 1,
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default WorkoutDetail;
