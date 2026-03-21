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
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '../../../constants/routes';

/**
 * Day label used in the calendar strip.
 */
type DayLabel = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

/**
 * A single day entry for the weekly calendar strip.
 */
interface WeekDay {
    id: string;
    label: DayLabel;
    date: number;
    score: number;
    hours: number;
    isToday: boolean;
}

/**
 * Quick stat card data.
 */
interface QuickStat {
    id: string;
    labelKey: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Generate the last 7 days of mock sleep data.
 */
const generateWeekData = (): WeekDay[] => {
    const today = new Date();
    const dayLabels: DayLabel[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const mockScores = [78, 82, 65, 91, 73, 88, 85];
    const mockHours = [7.2, 7.8, 6.0, 8.5, 6.8, 8.0, 7.5];

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return {
            id: `day-${i}`,
            label: dayLabels[d.getDay()],
            date: d.getDate(),
            score: mockScores[i],
            hours: mockHours[i],
            isToday: i === 6,
        };
    });
};

/**
 * Get color for a sleep score value.
 */
const getScoreColor = (score: number): string => {
    if (score >= 85) {
        return colors.semantic.success;
    }
    if (score >= 70) {
        return colors.journeys.health.primary;
    }
    if (score >= 50) {
        return colors.semantic.warning;
    }
    return colors.semantic.error;
};

const _TONIGHT_SCORE = 85;
const MAX_BAR_HEIGHT = 80;
const MAX_HOURS = 10;

/**
 * SleepHome displays a dashboard with a weekly calendar strip,
 * tonight's sleep score ring, a mini bar chart, and quick stats.
 */
export const SleepHome: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();
    const weekData = useMemo(() => generateWeekData(), []);
    const [selectedDay, setSelectedDay] = useState(6);

    const quickStats: QuickStat[] = useMemo(
        () => [
            {
                id: 'hours',
                labelKey: 'journeys.health.sleep.home.hoursSlept',
                value: `${weekData[selectedDay].hours}h`,
                icon: 'bed-outline' as keyof typeof Ionicons.glyphMap,
            },
            {
                id: 'quality',
                labelKey: 'journeys.health.sleep.home.quality',
                value: `${weekData[selectedDay].score}%`,
                icon: 'moon-outline' as keyof typeof Ionicons.glyphMap,
            },
            {
                id: 'schedule',
                labelKey: 'journeys.health.sleep.home.schedule',
                value: '10:30 PM',
                icon: 'alarm-outline' as keyof typeof Ionicons.glyphMap,
            },
        ],
        [weekData, selectedDay]
    );

    const handleLogPress = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_SLEEP_LOG);
    }, [navigation]);

    const handleTrendsPress = useCallback(() => {
        navigation.navigate(ROUTES.HEALTH_SLEEP_TRENDS);
    }, [navigation]);

    const handleDayPress = useCallback((index: number) => {
        setSelectedDay(index);
    }, []);

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
                    {t('journeys.health.sleep.home.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Calendar Strip — Last 7 Days */}
                <View style={styles.calendarStrip}>
                    {weekData.map((day, idx) => {
                        const isSelected = idx === selectedDay;
                        return (
                            <Touchable
                                key={day.id}
                                onPress={() => handleDayPress(idx)}
                                accessibilityLabel={`${day.label} ${day.date}`}
                                accessibilityRole="button"
                                testID={`sleep-home-calendar-${day.label.toLowerCase()}`}
                                style={[styles.calendarDay, isSelected && styles.calendarDaySelected] as any}
                            >
                                <Text fontSize="xs" color={isSelected ? colors.neutral.white : colors.gray[50]}>
                                    {day.label}
                                </Text>
                                <Text
                                    fontSize="md"
                                    fontWeight={day.isToday ? 'bold' : 'semiBold'}
                                    color={isSelected ? colors.neutral.white : colors.gray[70]}
                                >
                                    {day.date}
                                </Text>
                                <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(day.score) }]}>
                                    <Text fontSize="xs" fontWeight="bold" color={colors.neutral.white}>
                                        {day.score}
                                    </Text>
                                </View>
                            </Touchable>
                        );
                    })}
                </View>

                {/* Tonight's Sleep Score Ring */}
                <Card journey="health" elevation="md" padding="md">
                    <View style={styles.scoreRingContainer}>
                        <View style={styles.scoreRingOuter}>
                            <View style={styles.scoreRingInner}>
                                <Ionicons name="moon-outline" size={20} color={colors.journeys.health.primary} />
                                <Text
                                    fontSize="heading-2xl"
                                    fontWeight="bold"
                                    color={getScoreColor(weekData[selectedDay].score)}
                                >
                                    {weekData[selectedDay].score}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.sleep.home.sleepScore')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Weekly Mini Chart */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.home.weeklyOverview')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.chartContainer}>
                            {weekData.map((day, idx) => {
                                const barHeight = (day.hours / MAX_HOURS) * MAX_BAR_HEIGHT;
                                const isSelected = idx === selectedDay;
                                return (
                                    <View key={day.id} style={styles.chartBarWrapper}>
                                        <View
                                            style={[
                                                styles.chartBar,
                                                {
                                                    height: barHeight,
                                                    backgroundColor: isSelected
                                                        ? colors.journeys.health.primary
                                                        : colors.journeys.health.secondary,
                                                },
                                            ]}
                                        />
                                        <Text fontSize="xs" color={colors.gray[50]}>
                                            {day.label.charAt(0)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.chartLegend}>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {t('journeys.health.sleep.home.hoursPerNight')}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Quick Stats */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.sleep.home.quickStats')}
                    </Text>
                    <View style={styles.statsRow}>
                        {quickStats.map((stat) => (
                            <Card key={stat.id} journey="health" elevation="sm" padding="md">
                                <View style={styles.statItem}>
                                    <Ionicons name={stat.icon} size={20} color={colors.journeys.health.primary} />
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

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleLogPress}
                        accessibilityLabel={t('journeys.health.sleep.home.logSleep')}
                        testID="sleep-home-log-button"
                    >
                        {t('journeys.health.sleep.home.logSleep')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleTrendsPress}
                        accessibilityLabel={t('journeys.health.sleep.home.viewTrends')}
                        testID="sleep-home-trends-button"
                    >
                        {t('journeys.health.sleep.home.viewTrends')}
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
    calendarStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacingValues.md,
    },
    calendarDay: {
        alignItems: 'center',
        paddingVertical: spacingValues.xs,
        paddingHorizontal: spacingValues['3xs'],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[20],
        backgroundColor: colors.gray[0],
        gap: spacingValues['4xs'],
        minWidth: 44,
    },
    calendarDaySelected: {
        backgroundColor: colors.journeys.health.primary,
        borderColor: colors.journeys.health.primary,
    },
    scoreBadge: {
        width: 28,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreRingContainer: {
        alignItems: 'center',
        paddingVertical: spacingValues.md,
    },
    scoreRingOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 6,
        borderColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreRingInner: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: MAX_BAR_HEIGHT + 20,
        paddingTop: spacingValues.xs,
    },
    chartBarWrapper: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        flex: 1,
    },
    chartBar: {
        width: 20,
        borderRadius: 4,
    },
    chartLegend: {
        alignItems: 'center',
        marginTop: spacingValues.xs,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacingValues.sm,
    },
    statItem: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        flex: 1,
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default SleepHome;
