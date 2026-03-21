import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface DailyData {
    label: string;
    adherence: number;
}

const DAILY_DATA: DailyData[] = [
    { label: 'Mon', adherence: 100 },
    { label: 'Tue', adherence: 80 },
    { label: 'Wed', adherence: 100 },
    { label: 'Thu', adherence: 60 },
    { label: 'Fri', adherence: 100 },
    { label: 'Sat', adherence: 40 },
    { label: 'Sun', adherence: 80 },
];

const WEEKLY_DATA: DailyData[] = [
    { label: 'Week 1', adherence: 85 },
    { label: 'Week 2', adherence: 92 },
    { label: 'Week 3', adherence: 78 },
    { label: 'Week 4', adherence: 88 },
];

const MONTHLY_DATA: DailyData[] = [
    { label: 'Sep', adherence: 75 },
    { label: 'Oct', adherence: 82 },
    { label: 'Nov', adherence: 90 },
    { label: 'Dec', adherence: 88 },
    { label: 'Jan', adherence: 95 },
    { label: 'Feb', adherence: 85 },
];

const MAX_BAR_HEIGHT = 160;

const getBarColor = (adherence: number): string => {
    if (adherence >= 80) {
        return colors.semantic.success;
    }
    if (adherence >= 50) {
        return colors.semantic.warning;
    }
    return colors.semantic.error;
};

/**
 * MedicationAdherence displays adherence charts with daily/weekly/monthly views.
 * Bar chart visualization using View bars with percentage labels.
 */
export const MedicationAdherence: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TimeRange>('daily');

    const chartData = useMemo(() => {
        switch (activeTab) {
            case 'daily':
                return DAILY_DATA;
            case 'weekly':
                return WEEKLY_DATA;
            case 'monthly':
                return MONTHLY_DATA;
            default:
                return DAILY_DATA;
        }
    }, [activeTab]);

    const overallAdherence = useMemo(() => {
        if (chartData.length === 0) {
            return 0;
        }
        const sum = chartData.reduce((acc, d) => acc + d.adherence, 0);
        return Math.round(sum / chartData.length);
    }, [chartData]);

    const handleShareReport = useCallback(() => {
        Alert.alert(t('medication.shareReport'), t('medication.shareReportMessage'));
    }, [t]);

    const tabs: { key: TimeRange; label: string }[] = [
        { key: 'daily', label: t('medication.daily') },
        { key: 'weekly', label: t('medication.weekly') },
        { key: 'monthly', label: t('medication.monthly') },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('medication.goBack')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('medication.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.adherence')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Overall Adherence */}
                <Card journey="health" elevation="md" padding="md">
                    <Text fontSize="sm" color={colors.neutral.gray600} textAlign="center">
                        {t('medication.overallAdherence')}
                    </Text>
                    <Text
                        fontSize="heading-2xl"
                        fontWeight="bold"
                        color={getBarColor(overallAdherence)}
                        textAlign="center"
                    >
                        {overallAdherence}%
                    </Text>
                </Card>

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    {tabs.map((tab) => (
                        <Touchable
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            accessibilityLabel={tab.label}
                            accessibilityRole="button"
                            testID={`tab-${tab.key}`}
                            style={[styles.tab, activeTab === tab.key && styles.tabActive] as any}
                        >
                            <Text
                                fontWeight={activeTab === tab.key ? 'semiBold' : 'regular'}
                                color={activeTab === tab.key ? colors.journeys.health.primary : colors.neutral.gray600}
                            >
                                {tab.label}
                            </Text>
                        </Touchable>
                    ))}
                </View>

                {/* Bar Chart */}
                <Card journey="health" elevation="sm" padding="md">
                    <View style={styles.chartContainer}>
                        {chartData.map((item, index) => {
                            const barHeight = (item.adherence / 100) * MAX_BAR_HEIGHT;
                            return (
                                <View key={`bar-${index}`} style={styles.barColumn} testID={`bar-${index}`}>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="medium"
                                        color={colors.neutral.gray700}
                                        textAlign="center"
                                    >
                                        {item.adherence}%
                                    </Text>
                                    <View style={styles.barWrapper}>
                                        <View
                                            style={
                                                [
                                                    styles.bar,
                                                    {
                                                        height: barHeight,
                                                        backgroundColor: getBarColor(item.adherence),
                                                    },
                                                ] as any
                                            }
                                        />
                                    </View>
                                    <Text fontSize="xs" color={colors.neutral.gray600} textAlign="center">
                                        {item.label}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {/* Share Report Button */}
                <View style={styles.actionContainer}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleShareReport}
                        accessibilityLabel={t('medication.shareReport')}
                        testID="share-report-button"
                    >
                        {t('medication.shareReport')}
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
    tabContainer: {
        flexDirection: 'row',
        marginTop: spacingValues.xl,
        marginBottom: spacingValues.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray300,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.journeys.health.primary,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingTop: spacingValues.sm,
    },
    barColumn: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        height: MAX_BAR_HEIGHT,
        justifyContent: 'flex-end',
        marginVertical: spacingValues.xs,
    },
    bar: {
        width: 28,
        borderRadius: 4,
        minHeight: 4,
    },
    actionContainer: {
        marginTop: spacingValues['2xl'],
        paddingBottom: spacingValues.xl,
    },
});

export default MedicationAdherence;
