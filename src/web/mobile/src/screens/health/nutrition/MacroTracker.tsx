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

type MacroPeriod = '7d' | '30d';
type MacroType = 'carbs' | 'protein' | 'fat';

interface DayData {
    id: string;
    label: string;
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
}

interface MacroGoal {
    id: MacroType;
    labelKey: string;
    icon: keyof typeof Ionicons.glyphMap;
    currentGrams: number;
    goalGrams: number;
    color: string;
}

const MACRO_COLORS: Record<MacroType, string> = {
    carbs: colors.semantic.success,
    protein: colors.semantic.info,
    fat: colors.semantic.warning,
};

const WEEKLY_DATA: DayData[] = [
    { id: 'w-1', label: 'M', carbsGrams: 220, proteinGrams: 85, fatGrams: 55 },
    { id: 'w-2', label: 'T', carbsGrams: 180, proteinGrams: 95, fatGrams: 60 },
    { id: 'w-3', label: 'W', carbsGrams: 260, proteinGrams: 70, fatGrams: 72 },
    { id: 'w-4', label: 'T', carbsGrams: 200, proteinGrams: 110, fatGrams: 48 },
    { id: 'w-5', label: 'F', carbsGrams: 240, proteinGrams: 88, fatGrams: 65 },
    { id: 'w-6', label: 'S', carbsGrams: 170, proteinGrams: 75, fatGrams: 50 },
    { id: 'w-7', label: 'S', carbsGrams: 165, proteinGrams: 72, fatGrams: 52 },
];

const MONTHLY_DATA: DayData[] = Array.from({ length: 30 }, (_, i) => ({
    id: `m-${i + 1}`,
    label: `${i + 1}`,
    carbsGrams: 150 + Math.round(Math.random() * 120),
    proteinGrams: 60 + Math.round(Math.random() * 60),
    fatGrams: 40 + Math.round(Math.random() * 40),
}));

const MACRO_GOALS: MacroGoal[] = [
    {
        id: 'carbs',
        labelKey: 'journeys.health.nutrition.macro.carbs',
        icon: 'leaf-outline',
        currentGrams: 165,
        goalGrams: 250,
        color: MACRO_COLORS.carbs,
    },
    {
        id: 'protein',
        labelKey: 'journeys.health.nutrition.macro.protein',
        icon: 'barbell-outline',
        currentGrams: 72,
        goalGrams: 100,
        color: MACRO_COLORS.protein,
    },
    {
        id: 'fat',
        labelKey: 'journeys.health.nutrition.macro.fat',
        icon: 'water-outline',
        currentGrams: 52,
        goalGrams: 67,
        color: MACRO_COLORS.fat,
    },
];

const TODAY_CALORIES = 1450;
const MAX_BAR_HEIGHT = 80;

/** MacroTracker displays macro ring, weekly stacked bars, and goal vs actual summaries. */
export const MacroTracker: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState<MacroPeriod>('7d');

    const chartData = useMemo(() => (selectedPeriod === '7d' ? WEEKLY_DATA : MONTHLY_DATA), [selectedPeriod]);

    const totalMacros = useMemo(() => {
        const carbs = MACRO_GOALS[0].currentGrams;
        const protein = MACRO_GOALS[1].currentGrams;
        const fat = MACRO_GOALS[2].currentGrams;
        return carbs + protein + fat;
    }, []);

    const maxDayTotal = useMemo(
        () => chartData.reduce((max, d) => Math.max(max, d.carbsGrams + d.proteinGrams + d.fatGrams), 1),
        [chartData]
    );

    const handlePeriodChange = useCallback((period: MacroPeriod) => {
        setSelectedPeriod(period);
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
                    {t('journeys.health.nutrition.macro.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Macro Ring Visualization */}
                <Card journey="health" elevation="md" padding="md">
                    <View style={styles.ringContainer} testID="nutrition-macro-chart">
                        {/* Outer ring segments */}
                        <View style={styles.ringOuter}>
                            {/* Inner circle with calorie total */}
                            <View style={styles.ringInner}>
                                <Ionicons name="pie-chart-outline" size={18} color={colors.journeys.health.primary} />
                                <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                    {TODAY_CALORIES}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {t('journeys.health.nutrition.home.kcal')}
                                </Text>
                            </View>
                        </View>

                        {/* Macro legend */}
                        <View style={styles.ringLegend}>
                            {MACRO_GOALS.map((macro) => {
                                const percent =
                                    totalMacros > 0 ? Math.round((macro.currentGrams / totalMacros) * 100) : 0;
                                return (
                                    <View key={macro.id} style={styles.ringLegendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: macro.color }]} />
                                        <Text fontSize="sm" color={colors.gray[60]}>
                                            {t(macro.labelKey)}
                                        </Text>
                                        <Text fontSize="sm" fontWeight="semiBold" color={macro.color}>
                                            {percent}%
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Stacked macro bar */}
                    <View style={styles.macroStackedBar}>
                        {MACRO_GOALS.map((macro) => (
                            <View
                                key={macro.id}
                                style={[
                                    styles.macroSegment,
                                    {
                                        flex: macro.currentGrams,
                                        backgroundColor: macro.color,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </Card>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {(['7d', '30d'] as MacroPeriod[]).map((period) => (
                        <Touchable
                            key={period}
                            onPress={() => handlePeriodChange(period)}
                            accessibilityLabel={t('journeys.health.nutrition.macro.period', { period })}
                            accessibilityRole="button"
                            testID={`nutrition-macro-period-${period}`}
                            style={[styles.periodOption, selectedPeriod === period && styles.periodOptionActive] as any}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={selectedPeriod === period ? 'semiBold' : 'regular'}
                                color={selectedPeriod === period ? colors.journeys.health.primary : colors.gray[50]}
                            >
                                {period === '7d'
                                    ? t('journeys.health.nutrition.macro.sevenDays')
                                    : t('journeys.health.nutrition.macro.thirtyDays')}
                            </Text>
                        </Touchable>
                    ))}
                </View>

                {/* Weekly Stacked Bar Chart */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.macro.weeklyComparison')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.barChartContainer}>
                            {chartData.map((day) => {
                                const tot = day.carbsGrams + day.proteinGrams + day.fatGrams;
                                const h = (tot / maxDayTotal) * MAX_BAR_HEIGHT;
                                return (
                                    <View key={day.id} style={styles.barWrapper}>
                                        <View style={[styles.stackedBarCol, { height: h }]}>
                                            <View
                                                style={[
                                                    styles.barSegment,
                                                    { flex: day.fatGrams, backgroundColor: MACRO_COLORS.fat },
                                                ]}
                                            />
                                            <View
                                                style={[
                                                    styles.barSegment,
                                                    { flex: day.proteinGrams, backgroundColor: MACRO_COLORS.protein },
                                                ]}
                                            />
                                            <View
                                                style={[
                                                    styles.barSegment,
                                                    { flex: day.carbsGrams, backgroundColor: MACRO_COLORS.carbs },
                                                ]}
                                            />
                                        </View>
                                        {selectedPeriod === '7d' && (
                                            <Text fontSize="xs" color={colors.gray[50]}>
                                                {day.label}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </Card>
                </View>

                {/* Goal vs Actual Cards */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.macro.goalVsActual')}
                    </Text>
                    <View style={styles.goalCardsContainer}>
                        {MACRO_GOALS.map((macro) => {
                            const percent = macro.goalGrams > 0 ? Math.min(macro.currentGrams / macro.goalGrams, 1) : 0;
                            return (
                                <Card
                                    key={macro.id}
                                    journey="health"
                                    elevation="sm"
                                    padding="md"
                                    testID={macro.id === 'protein' ? 'nutrition-macro-protein-card' : undefined}
                                >
                                    <View style={styles.goalCard}>
                                        <Ionicons name={macro.icon} size={20} color={macro.color} />
                                        <Text fontSize="sm" fontWeight="semiBold" color={colors.gray[60]}>
                                            {t(macro.labelKey)}
                                        </Text>
                                        <Text fontSize="lg" fontWeight="bold" color={macro.color}>
                                            {macro.currentGrams}g
                                        </Text>
                                        <Text fontSize="xs" color={colors.gray[40]}>
                                            {t('journeys.health.nutrition.macro.of', {
                                                goal: macro.goalGrams,
                                            })}
                                        </Text>
                                        {/* Progress bar */}
                                        <View style={styles.goalBarTrack}>
                                            <View
                                                style={[
                                                    styles.goalBarFill,
                                                    {
                                                        width: `${percent * 100}%`,
                                                        backgroundColor: macro.color,
                                                    },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                </Card>
                            );
                        })}
                    </View>
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
    ringContainer: {
        alignItems: 'center',
        gap: spacingValues.md,
    },
    ringOuter: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 14,
        borderColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringInner: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    ringLegend: {
        gap: spacingValues.xs,
        alignSelf: 'stretch',
    },
    ringLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.sm,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    macroStackedBar: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: spacingValues.md,
    },
    macroSegment: {
        height: 8,
    },
    periodSelector: {
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[20],
        overflow: 'hidden',
        marginTop: spacingValues.xl,
    },
    periodOption: {
        flex: 1,
        paddingVertical: spacingValues.sm,
        alignItems: 'center',
        backgroundColor: colors.gray[0],
    },
    periodOptionActive: {
        backgroundColor: colors.journeys.health.background,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: MAX_BAR_HEIGHT + 20,
    },
    barWrapper: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
        flex: 1,
    },
    stackedBarCol: {
        width: 16,
        borderRadius: 4,
        overflow: 'hidden',
        flexDirection: 'column-reverse',
    },
    barSegment: {
        width: 16,
    },
    goalCardsContainer: {
        gap: spacingValues.sm,
    },
    goalCard: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    goalBarTrack: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.gray[10],
        overflow: 'hidden',
        marginTop: spacingValues.xs,
    },
    goalBarFill: {
        height: 6,
        borderRadius: 3,
    },
});

export default MacroTracker;
