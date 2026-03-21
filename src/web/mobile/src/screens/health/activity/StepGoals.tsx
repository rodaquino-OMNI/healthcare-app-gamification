import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Day label used for the weekly progress indicators.
 */
type DayLabel = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

/**
 * A single day's progress data.
 */
interface DayProgress {
    id: string;
    label: DayLabel;
    steps: number;
    isToday: boolean;
}

/**
 * Target step options for the picker.
 */
const TARGET_OPTIONS = [5000, 7500, 10000, 12500, 15000];

/**
 * Current step count (mock).
 */
const CURRENT_STEPS = 8750;

/**
 * Current streak count (mock).
 */
const CURRENT_STREAK = 5;

/**
 * Maximum progress bar width reference.
 */
const PROGRESS_BAR_MAX = 1;

/**
 * Generate the last 7 days of mock step progress data.
 */
const generateWeekProgress = (_goal: number): DayProgress[] => {
    const today = new Date();
    const dayLabels: DayLabel[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const mockSteps = [6200, 8400, 10500, 7800, 11200, 9600, CURRENT_STEPS];

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return {
            id: `day-${i}`,
            label: dayLabels[d.getDay()],
            steps: mockSteps[i],
            isToday: i === 6,
        };
    });
};

/**
 * StepGoals allows users to configure their daily step target,
 * view current progress, streak, and weekly achievement indicators.
 */
export const StepGoals: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();

    const [targetIndex, setTargetIndex] = useState(2); // 10000
    const target = TARGET_OPTIONS[targetIndex];

    const weekProgress = useMemo(() => generateWeekProgress(target), [target]);

    const progressRatio = useMemo(() => Math.min(CURRENT_STEPS / target, PROGRESS_BAR_MAX), [target]);

    const progressPercentage = Math.round(progressRatio * 100);

    const handleTargetPress = useCallback(() => {
        setTargetIndex((prev) => (prev + 1) % TARGET_OPTIONS.length);
    }, []);

    const handleSave = useCallback(() => {
        Alert.alert(
            t('journeys.health.activity.stepGoals.savedTitle'),
            t('journeys.health.activity.stepGoals.savedMessage'),
            [{ text: t('common.buttons.ok'), onPress: () => navigation.goBack() }]
        );
    }, [navigation, t]);

    return (
        <SafeAreaView style={styles.container}>
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
                    {t('journeys.health.activity.stepGoals.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Daily Step Target */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.stepGoals.dailyTarget')}
                    </Text>
                    <Touchable
                        onPress={handleTargetPress}
                        accessibilityLabel={t('journeys.health.activity.stepGoals.dailyTarget')}
                        accessibilityRole="button"
                        testID="activity-step-goals-target"
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <View style={styles.goalRow}>
                                <View style={styles.goalIconCircle}>
                                    <Ionicons
                                        name="footsteps-outline"
                                        size={24}
                                        color={colors.journeys.health.primary}
                                    />
                                </View>
                                <View style={styles.goalContent}>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t('journeys.health.activity.stepGoals.tapToChange')}
                                    </Text>
                                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                        {target.toLocaleString()} {t('journeys.health.activity.stepGoals.steps')}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.gray[40]} />
                            </View>
                        </Card>
                    </Touchable>
                </View>

                {/* Current Progress Bar */}
                <View style={styles.sectionContainer} testID="activity-step-goals-progress">
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.stepGoals.todayProgress')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.progressHeader}>
                            <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.primary}>
                                {CURRENT_STEPS.toLocaleString()} / {target.toLocaleString()}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[50]}>
                                {progressPercentage}%
                            </Text>
                        </View>
                        <View style={styles.progressBarOuter}>
                            <View
                                style={[
                                    styles.progressBarInner,
                                    {
                                        width: `${progressPercentage}%`,
                                        backgroundColor:
                                            progressRatio >= 1
                                                ? colors.semantic.success
                                                : colors.journeys.health.primary,
                                    },
                                ]}
                            />
                        </View>
                        <View style={styles.progressLabels}>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                0
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {target.toLocaleString()}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Current Streak */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.stepGoals.currentStreak')}
                    </Text>
                    <Card journey="health" elevation="md" padding="md">
                        <View style={styles.streakContainer}>
                            <View style={styles.streakIconCircle}>
                                <Ionicons name="flame-outline" size={32} color={colors.semantic.warning} />
                            </View>
                            <Text fontSize="heading-2xl" fontWeight="bold" color={colors.semantic.warning}>
                                {CURRENT_STREAK}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.activity.stepGoals.daysInARow')}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Weekly Progress Indicators */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.stepGoals.weeklyProgress')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.weekRow}>
                            {weekProgress.map((day) => {
                                const achieved = day.steps >= target;
                                return (
                                    <View key={day.id} style={styles.dayIndicator}>
                                        <View
                                            style={[
                                                styles.dayCircle,
                                                {
                                                    backgroundColor: achieved
                                                        ? colors.semantic.success
                                                        : colors.gray[20],
                                                },
                                            ]}
                                        >
                                            {achieved ? (
                                                <Ionicons name="checkmark" size={14} color={colors.neutral.white} />
                                            ) : (
                                                <Text fontSize="xs" color={colors.gray[50]}>
                                                    {Math.round((day.steps / target) * 100)}
                                                </Text>
                                            )}
                                        </View>
                                        <Text
                                            fontSize="xs"
                                            fontWeight={day.isToday ? 'bold' : 'regular'}
                                            color={day.isToday ? colors.journeys.health.primary : colors.gray[50]}
                                        >
                                            {day.label.charAt(0)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.weekLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: colors.semantic.success }]} />
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.activity.stepGoals.goalMet')}
                                </Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: colors.gray[20] }]} />
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.activity.stepGoals.inProgress')}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Save Button */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleSave}
                        accessibilityLabel={t('journeys.health.activity.stepGoals.save')}
                        testID="activity-step-goals-save-button"
                    >
                        {t('journeys.health.activity.stepGoals.save')}
                    </Button>
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
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.md,
    },
    goalIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.sm,
    },
    progressBarOuter: {
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.gray[10],
        overflow: 'hidden',
    },
    progressBarInner: {
        height: 12,
        borderRadius: 6,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacingValues.xs,
    },
    streakContainer: {
        alignItems: 'center',
        paddingVertical: spacingValues.md,
        gap: spacingValues.xs,
    },
    streakIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayIndicator: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacingValues.xl,
        marginTop: spacingValues.md,
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
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
});

export default StepGoals;
