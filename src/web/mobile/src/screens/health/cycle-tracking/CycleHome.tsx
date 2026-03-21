import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '../../../constants/routes';
import type { CycleTrackingNavigationProp } from '../../../navigation/types';

/**
 * Phase type within a menstrual cycle.
 */
type CyclePhase = 'period' | 'fertile' | 'ovulation' | 'pms' | 'none';

/**
 * Represents one day on the calendar.
 */
interface CalendarDay {
    date: number;
    phase: CyclePhase;
    isToday: boolean;
}

/**
 * Bottom tab key type.
 */
type TabKey = 'calendar' | 'log' | 'insights' | 'settings';

const TAB_ICONS: Record<TabKey, string> = {
    calendar: '\u{1F4C5}',
    log: '\u{270F}',
    insights: '\u{1F4CA}',
    settings: '\u{2699}',
};

const PHASE_COLORS: Record<CyclePhase, string> = {
    period: colors.semantic.error,
    fertile: colors.semantic.success,
    ovulation: colors.semantic.info,
    pms: colors.journeys.community.primary,
    none: 'transparent',
};

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Generate calendar days for a given month/year with mock cycle phases.
 */
const generateMonthDays = (year: number, month: number): CalendarDay[] => {
    const today = new Date();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const padding: CalendarDay[] = Array.from({ length: firstDayOfWeek }, () => ({
        date: 0,
        phase: 'none' as CyclePhase,
        isToday: false,
    }));

    const days: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNum = i + 1;
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === dayNum;

        let phase: CyclePhase = 'none';
        if (dayNum >= 1 && dayNum <= 5) {
            phase = 'period';
        } else if (dayNum >= 12 && dayNum <= 16) {
            phase = 'fertile';
        } else if (dayNum === 14) {
            phase = 'ovulation';
        } else if (dayNum >= 24 && dayNum <= 28) {
            phase = 'pms';
        }

        return { date: dayNum, phase, isToday };
    });

    return [...padding, ...days];
};

/**
 * CycleHome displays a monthly calendar with color-coded cycle phases,
 * quick stats, and navigation to all cycle tracking sub-screens.
 */
export const CycleHome: React.FC = () => {
    const navigation = useNavigation<CycleTrackingNavigationProp>();
    const { t } = useTranslation();
    const today = useMemo(() => new Date(), []);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [activeTab, setActiveTab] = useState<TabKey>('calendar');

    const calendarDays = useMemo(() => generateMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

    const monthLabel = useMemo(() => {
        const date = new Date(currentYear, currentMonth);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }, [currentYear, currentMonth]);

    const handlePrevMonth = useCallback(() => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    }, [currentMonth]);

    const handleNextMonth = useCallback(() => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    }, [currentMonth]);

    const handleTabPress = useCallback(
        (tab: TabKey) => {
            setActiveTab(tab);
            if (tab === 'log') {
                navigation.navigate(ROUTES.HEALTH_CYCLE_LOG_PERIOD);
            }
            if (tab === 'insights') {
                navigation.navigate(ROUTES.HEALTH_CYCLE_HISTORY);
            }
            if (tab === 'settings') {
                navigation.navigate(ROUTES.HEALTH_CYCLE_PMS);
            }
        },
        [navigation]
    );

    const tabs: { key: TabKey; labelKey: string }[] = [
        { key: 'calendar', labelKey: 'journeys.health.cycle.tabs.calendar' },
        { key: 'log', labelKey: 'journeys.health.cycle.tabs.log' },
        { key: 'insights', labelKey: 'journeys.health.cycle.tabs.insights' },
        { key: 'settings', labelKey: 'journeys.health.cycle.tabs.settings' },
    ];

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
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.cycle.home.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Quick Stats */}
                <Card journey="health" elevation="md" padding="md">
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text fontSize="heading-2xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                8
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.cycle.home.cycleDay')}
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text fontSize="heading-2xl" fontWeight="bold" color={colors.semantic.error}>
                                20
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.cycle.home.daysUntilPeriod')}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Month Navigator */}
                <View style={styles.monthNav}>
                    <Touchable
                        onPress={handlePrevMonth}
                        accessibilityLabel={t('journeys.health.cycle.home.prevMonth')}
                        accessibilityRole="button"
                        testID="prev-month-button"
                    >
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {'<'}
                        </Text>
                    </Touchable>
                    <Text fontSize="lg" fontWeight="semiBold">
                        {monthLabel}
                    </Text>
                    <Touchable
                        onPress={handleNextMonth}
                        accessibilityLabel={t('journeys.health.cycle.home.nextMonth')}
                        accessibilityRole="button"
                        testID="next-month-button"
                    >
                        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
                            {'>'}
                        </Text>
                    </Touchable>
                </View>

                {/* Weekday Headers */}
                <View style={styles.weekdayRow}>
                    {WEEKDAY_LABELS.map((label, idx) => (
                        <View key={`wd-${idx}`} style={styles.weekdayCell}>
                            <Text fontSize="xs" fontWeight="semiBold" color={colors.gray[50]}>
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarGrid}>
                    {calendarDays.map((day, idx) => {
                        if (day.date === 0) {
                            return <View key={`empty-${idx}`} style={styles.dayCell} />;
                        }
                        const hasPhase = day.phase !== 'none';
                        return (
                            <View
                                key={`day-${day.date}`}
                                style={
                                    [
                                        styles.dayCell,
                                        hasPhase && { backgroundColor: PHASE_COLORS[day.phase] + '20' },
                                        day.isToday && styles.todayCell,
                                    ] as StyleProp<ViewStyle>
                                }
                                testID={`calendar-day-${day.date}`}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight={day.isToday ? 'bold' : 'regular'}
                                    color={day.isToday ? colors.journeys.health.primary : colors.gray[60]}
                                >
                                    {day.date}
                                </Text>
                                {hasPhase && (
                                    <View style={[styles.phaseDot, { backgroundColor: PHASE_COLORS[day.phase] }]} />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Phase Legend */}
                <View style={styles.legendContainer}>
                    {[
                        { phase: 'period' as CyclePhase, labelKey: 'journeys.health.cycle.phases.period' },
                        { phase: 'fertile' as CyclePhase, labelKey: 'journeys.health.cycle.phases.fertile' },
                        { phase: 'ovulation' as CyclePhase, labelKey: 'journeys.health.cycle.phases.ovulation' },
                        { phase: 'pms' as CyclePhase, labelKey: 'journeys.health.cycle.phases.pms' },
                    ].map((item) => (
                        <View key={item.phase} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: PHASE_COLORS[item.phase] }]} />
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t(item.labelKey)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={() => navigation.navigate(ROUTES.HEALTH_CYCLE_LOG_PERIOD)}
                        accessibilityLabel={t('journeys.health.cycle.home.logPeriod')}
                        testID="log-period-button"
                    >
                        {t('journeys.health.cycle.home.logPeriod')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={() => navigation.navigate(ROUTES.HEALTH_CYCLE_CALENDAR)}
                        accessibilityLabel={t('journeys.health.cycle.home.viewToday')}
                        testID="view-today-button"
                    >
                        {t('journeys.health.cycle.home.viewToday')}
                    </Button>
                </View>
            </ScrollView>

            {/* Bottom Tabs */}
            <View style={styles.tabBar}>
                {tabs.map((tab) => (
                    <Touchable
                        key={tab.key}
                        onPress={() => handleTabPress(tab.key)}
                        accessibilityLabel={t(tab.labelKey)}
                        accessibilityRole="button"
                        testID={`tab-${tab.key}`}
                        style={{...styles.tabItem, ...(activeTab === tab.key ? styles.tabItemActive : {})}}
                    >
                        <Text
                            fontSize="lg"
                            color={activeTab === tab.key ? colors.journeys.health.primary : colors.gray[40]}
                        >
                            {TAB_ICONS[tab.key]}
                        </Text>
                        <Text
                            fontSize="xs"
                            fontWeight={activeTab === tab.key ? 'semiBold' : 'regular'}
                            color={activeTab === tab.key ? colors.journeys.health.primary : colors.gray[40]}
                        >
                            {t(tab.labelKey)}
                        </Text>
                    </Touchable>
                ))}
            </View>
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
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.gray[20],
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacingValues.xl,
        paddingHorizontal: spacingValues.sm,
    },
    weekdayRow: {
        flexDirection: 'row',
        marginTop: spacingValues.md,
    },
    weekdayCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacingValues.xs,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 8,
    },
    todayCell: {
        borderWidth: 2,
        borderColor: colors.journeys.health.primary,
    },
    phaseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 2,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
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
    actionsContainer: {
        marginTop: spacingValues['2xl'],
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
    tabBar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.gray[20],
        backgroundColor: colors.gray[0],
        paddingBottom: spacingValues.md,
        paddingTop: spacingValues.xs,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacingValues.xs,
    },
    tabItemActive: {
        borderTopWidth: 2,
        borderTopColor: colors.journeys.health.primary,
    },
});

export default CycleHome;
