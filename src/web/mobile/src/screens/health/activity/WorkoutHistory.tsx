import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Workout type filter key.
 */
type WorkoutFilter = 'all' | 'run' | 'walk' | 'cycle' | 'gym';

/**
 * Workout type identifier.
 */
type WorkoutType = 'run' | 'walk' | 'cycle' | 'gym' | 'swim';

/**
 * A single workout history entry.
 */
interface WorkoutEntry {
    id: string;
    type: WorkoutType;
    date: string;
    duration: string;
    calories: number;
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
 * Color mapping for workout type badges.
 */
const WORKOUT_BADGE_COLORS: Record<WorkoutType, string> = {
    run: colors.journeys.health.primary,
    walk: colors.semantic.success,
    cycle: colors.semantic.info,
    gym: colors.semantic.warning,
    swim: colors.journeys.health.secondary,
};

/**
 * Filter tab definitions.
 */
const FILTERS: { key: WorkoutFilter; labelKey: string }[] = [
    { key: 'all', labelKey: 'journeys.health.activity.workoutHistory.all' },
    { key: 'run', labelKey: 'journeys.health.activity.workoutHistory.run' },
    { key: 'walk', labelKey: 'journeys.health.activity.workoutHistory.walk' },
    { key: 'cycle', labelKey: 'journeys.health.activity.workoutHistory.cycle' },
    { key: 'gym', labelKey: 'journeys.health.activity.workoutHistory.gym' },
];

/**
 * Mock workout history data.
 */
const MOCK_ENTRIES: WorkoutEntry[] = [
    { id: 'w-1', type: 'run', date: '2026-02-23', duration: '45 min', calories: 420 },
    { id: 'w-2', type: 'gym', date: '2026-02-22', duration: '60 min', calories: 380 },
    { id: 'w-3', type: 'walk', date: '2026-02-21', duration: '30 min', calories: 150 },
    { id: 'w-4', type: 'cycle', date: '2026-02-20', duration: '90 min', calories: 520 },
    { id: 'w-5', type: 'run', date: '2026-02-19', duration: '35 min', calories: 340 },
    { id: 'w-6', type: 'swim', date: '2026-02-18', duration: '45 min', calories: 400 },
    { id: 'w-7', type: 'gym', date: '2026-02-17', duration: '50 min', calories: 350 },
    { id: 'w-8', type: 'walk', date: '2026-02-16', duration: '40 min', calories: 180 },
    { id: 'w-9', type: 'cycle', date: '2026-02-15', duration: '60 min', calories: 450 },
    { id: 'w-10', type: 'run', date: '2026-02-14', duration: '50 min', calories: 480 },
    { id: 'w-11', type: 'gym', date: '2026-02-13', duration: '55 min', calories: 360 },
    { id: 'w-12', type: 'walk', date: '2026-02-12', duration: '25 min', calories: 120 },
];

/**
 * WorkoutHistory displays a filterable list of past workout entries,
 * each showing the type icon, date, duration, and calories.
 */
export const WorkoutHistory: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [activeFilter, setActiveFilter] = useState<WorkoutFilter>('all');

    const filteredEntries = useMemo(() => {
        if (activeFilter === 'all') {
            return MOCK_ENTRIES;
        }
        return MOCK_ENTRIES.filter((entry) => entry.type === activeFilter);
    }, [activeFilter]);

    const handleFilterPress = useCallback((filter: WorkoutFilter) => {
        setActiveFilter(filter);
    }, []);

    const handleEntryPress = useCallback(
        (entryId: string) => {
            navigation.navigate('HealthActivityWorkoutDetail', { workoutId: entryId });
        },
        [navigation]
    );

    const renderEntry = useCallback(
        ({ item }: ListRenderItemInfo<WorkoutEntry>) => {
            const badgeColor = WORKOUT_BADGE_COLORS[item.type];
            return (
                <Touchable
                    onPress={() => handleEntryPress(item.id)}
                    accessibilityLabel={`${item.type} ${item.date}`}
                    accessibilityRole="button"
                >
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.entryRow} testID={`activity-workout-history-entry-${item.id}`}>
                            {/* Type Icon Badge */}
                            <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
                                <Ionicons name={WORKOUT_ICONS[item.type]} size={20} color={colors.neutral.white} />
                            </View>

                            {/* Date & Type */}
                            <View style={styles.entryDateCol}>
                                <Text fontSize="md" fontWeight="semiBold">
                                    {t(`journeys.health.activity.workoutHistory.type_${item.type}`)}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {item.date}
                                </Text>
                            </View>

                            {/* Duration */}
                            <View style={styles.entryMetricCol}>
                                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                    {item.duration}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.activity.workoutHistory.duration')}
                                </Text>
                            </View>

                            {/* Calories */}
                            <View style={styles.entryMetricCol}>
                                <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.warning}>
                                    {item.calories}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.activity.workoutHistory.cal')}
                                </Text>
                            </View>

                            {/* Chevron */}
                            <Ionicons name="chevron-forward" size={16} color={colors.gray[40]} />
                        </View>
                    </Card>
                </Touchable>
            );
        },
        [t, handleEntryPress]
    );

    const keyExtractor = useCallback((item: WorkoutEntry) => item.id, []);

    const renderEmpty = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <Ionicons name="fitness-outline" size={48} color={colors.gray[30]} />
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('journeys.health.activity.workoutHistory.noEntries')}
                </Text>
            </View>
        ),
        [t]
    );

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
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.activity.workoutHistory.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
                {FILTERS.map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                        <Touchable
                            key={filter.key}
                            onPress={() => handleFilterPress(filter.key)}
                            accessibilityLabel={t(filter.labelKey)}
                            accessibilityRole="button"
                            testID={`activity-workout-history-filter-${filter.key}`}
                            style={[styles.filterTab, isActive && styles.filterTabActive] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={isActive ? 'semiBold' : 'regular'}
                                color={isActive ? colors.journeys.health.primary : colors.gray[50]}
                            >
                                {t(filter.labelKey)}
                            </Text>
                        </Touchable>
                    );
                })}
            </View>

            {/* Entry List */}
            <FlatList
                data={filteredEntries}
                renderItem={renderEntry}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                testID="activity-workout-history-list"
                ListEmptyComponent={renderEmpty}
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
    filterRow: {
        flexDirection: 'row',
        marginHorizontal: spacingValues.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[20],
        overflow: 'hidden',
        marginBottom: spacingValues.sm,
    },
    filterTab: {
        flex: 1,
        paddingVertical: spacingValues.sm,
        alignItems: 'center',
        backgroundColor: colors.gray[0],
    },
    filterTabActive: {
        backgroundColor: colors.journeys.health.background,
    },
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    entryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    typeBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    entryDateCol: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    entryMetricCol: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacingValues['3xl'],
        gap: spacingValues.md,
    },
});

export default WorkoutHistory;
