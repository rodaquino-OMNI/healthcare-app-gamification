import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Trend direction for cycle length comparison.
 */
type TrendDirection = 'longer' | 'shorter' | 'same';

/**
 * Represents a single past cycle record.
 */
interface CycleRecord {
    id: string;
    startDate: string;
    endDate: string;
    length: number;
    periodDays: number;
    flowSummary: string;
    trend: TrendDirection;
}

/**
 * Regularity rating.
 */
type Regularity = 'regular' | 'somewhat' | 'irregular';

const TREND_CONFIG: Record<TrendDirection, { symbol: string; color: string }> = {
    longer: { symbol: '\u2191', color: colors.semantic.warning },
    shorter: { symbol: '\u2193', color: colors.semantic.info },
    same: { symbol: '\u2194', color: colors.semantic.success },
};

const REGULARITY_CONFIG: Record<Regularity, { labelKey: string; color: string }> = {
    regular: {
        labelKey: 'journeys.health.cycle.history.regular',
        color: colors.semantic.success,
    },
    somewhat: {
        labelKey: 'journeys.health.cycle.history.somewhat',
        color: colors.semantic.warning,
    },
    irregular: {
        labelKey: 'journeys.health.cycle.history.irregular',
        color: colors.semantic.error,
    },
};

/**
 * Mock cycle history for the last 12 months.
 */
const MOCK_CYCLES: CycleRecord[] = [
    {
        id: 'c-1',
        startDate: '2026-02-14',
        endDate: '2026-02-18',
        length: 28,
        periodDays: 5,
        flowSummary: 'Medium',
        trend: 'same',
    },
    {
        id: 'c-2',
        startDate: '2026-01-17',
        endDate: '2026-01-22',
        length: 28,
        periodDays: 6,
        flowSummary: 'Heavy',
        trend: 'same',
    },
    {
        id: 'c-3',
        startDate: '2025-12-20',
        endDate: '2025-12-24',
        length: 27,
        periodDays: 5,
        flowSummary: 'Medium',
        trend: 'shorter',
    },
    {
        id: 'c-4',
        startDate: '2025-11-22',
        endDate: '2025-11-27',
        length: 29,
        periodDays: 6,
        flowSummary: 'Heavy',
        trend: 'longer',
    },
    {
        id: 'c-5',
        startDate: '2025-10-24',
        endDate: '2025-10-28',
        length: 28,
        periodDays: 5,
        flowSummary: 'Medium',
        trend: 'same',
    },
    {
        id: 'c-6',
        startDate: '2025-09-26',
        endDate: '2025-09-30',
        length: 30,
        periodDays: 5,
        flowSummary: 'Light',
        trend: 'longer',
    },
    {
        id: 'c-7',
        startDate: '2025-08-27',
        endDate: '2025-08-31',
        length: 27,
        periodDays: 5,
        flowSummary: 'Medium',
        trend: 'shorter',
    },
    {
        id: 'c-8',
        startDate: '2025-07-31',
        endDate: '2025-08-04',
        length: 28,
        periodDays: 5,
        flowSummary: 'Medium',
        trend: 'same',
    },
    {
        id: 'c-9',
        startDate: '2025-07-03',
        endDate: '2025-07-07',
        length: 29,
        periodDays: 5,
        flowSummary: 'Heavy',
        trend: 'longer',
    },
    {
        id: 'c-10',
        startDate: '2025-06-04',
        endDate: '2025-06-08',
        length: 28,
        periodDays: 5,
        flowSummary: 'Medium',
        trend: 'same',
    },
    {
        id: 'c-11',
        startDate: '2025-05-07',
        endDate: '2025-05-11',
        length: 27,
        periodDays: 5,
        flowSummary: 'Light',
        trend: 'shorter',
    },
    {
        id: 'c-12',
        startDate: '2025-04-10',
        endDate: '2025-04-14',
        length: 28,
        periodDays: 5,
        flowSummary: 'Medium',
        trend: 'same',
    },
];

const MOCK_AVG_LENGTH = 28;
const MOCK_REGULARITY: Regularity = 'regular';

/**
 * CycleHistory displays a scrollable list of past cycles over the last 12 months
 * with average length, regularity indicator, and trend arrows.
 */
export const CycleHistory: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const regularityConfig = useMemo(() => REGULARITY_CONFIG[MOCK_REGULARITY], []);

    const renderCycleItem = useCallback(
        ({ item }: ListRenderItemInfo<CycleRecord>) => {
            const trendConfig = TREND_CONFIG[item.trend];
            return (
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.cycleHeader}>
                        <View style={styles.cycleDates}>
                            <Text fontSize="md" fontWeight="semiBold">
                                {item.startDate}
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.cycle.history.to')} {item.endDate}
                            </Text>
                        </View>
                        <View style={styles.trendContainer}>
                            <Text fontSize="lg" color={trendConfig.color}>
                                {trendConfig.symbol}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cycleDetails}>
                        <View style={styles.detailItem}>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.history.cycleLength')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {item.length} {t('journeys.health.cycle.history.days')}
                            </Text>
                        </View>
                        <View style={styles.detailDivider} />
                        <View style={styles.detailItem}>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.history.periodDays')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {item.periodDays} {t('journeys.health.cycle.history.days')}
                            </Text>
                        </View>
                        <View style={styles.detailDivider} />
                        <View style={styles.detailItem}>
                            <Text fontSize="xs" color={colors.gray[50]}>
                                {t('journeys.health.cycle.history.flow')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {item.flowSummary}
                            </Text>
                        </View>
                    </View>
                </Card>
            );
        },
        [t]
    );

    const cycleKeyExtractor = useCallback((item: CycleRecord) => item.id, []);

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
                    {t('journeys.health.cycle.history.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <FlatList
                data={MOCK_CYCLES}
                renderItem={renderCycleItem}
                keyExtractor={cycleKeyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                testID="cycle-history-list"
                ListHeaderComponent={
                    <>
                        {/* Summary Card */}
                        <Card journey="health" elevation="md" padding="md">
                            <View style={styles.summaryRow}>
                                <View style={styles.summaryItem}>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t('journeys.health.cycle.history.avgLength')}
                                    </Text>
                                    <Text
                                        fontSize="heading-2xl"
                                        fontWeight="bold"
                                        color={colors.journeys.health.primary}
                                    >
                                        {MOCK_AVG_LENGTH}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t('journeys.health.cycle.history.days')}
                                    </Text>
                                </View>
                                <View style={styles.summaryDivider} />
                                <View style={styles.summaryItem}>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {t('journeys.health.cycle.history.regularity')}
                                    </Text>
                                    <Badge
                                        variant="status"
                                        status={
                                            MOCK_REGULARITY === 'regular'
                                                ? 'success'
                                                : MOCK_REGULARITY === 'somewhat'
                                                  ? 'warning'
                                                  : 'error'
                                        }
                                        accessibilityLabel={t(regularityConfig.labelKey)}
                                    >
                                        {t(regularityConfig.labelKey)}
                                    </Badge>
                                </View>
                            </View>
                        </Card>

                        {/* Trend Legend */}
                        <View style={styles.trendLegend}>
                            {(['longer', 'shorter', 'same'] as TrendDirection[]).map((dir) => (
                                <View key={dir} style={styles.trendLegendItem}>
                                    <Text fontSize="sm" color={TREND_CONFIG[dir].color}>
                                        {TREND_CONFIG[dir].symbol}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {t(`journeys.health.cycle.history.trend.${dir}`)}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Section Label */}
                        <Text fontSize="lg" fontWeight="semiBold" journey="health" style={styles.sectionLabel}>
                            {t('journeys.health.cycle.history.pastCycles')}
                        </Text>
                    </>
                }
            />
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
    listContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
        gap: spacingValues.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    summaryDivider: {
        width: 1,
        height: 50,
        backgroundColor: colors.gray[20],
    },
    trendLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacingValues.xl,
        marginTop: spacingValues.md,
    },
    trendLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['3xs'],
    },
    sectionLabel: {
        marginTop: spacingValues.md,
    },
    cycleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cycleDates: {
        gap: spacingValues['4xs'],
    },
    trendContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.gray[10],
        alignItems: 'center',
        justifyContent: 'center',
    },
    cycleDetails: {
        flexDirection: 'row',
        marginTop: spacingValues.sm,
        paddingTop: spacingValues.sm,
        borderTopWidth: 1,
        borderTopColor: colors.gray[10],
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    detailDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.gray[20],
    },
});

export default CycleHistory;
