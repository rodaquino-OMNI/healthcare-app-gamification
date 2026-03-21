import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, FlatList, StyleSheet, Alert, ListRenderItemInfo } from 'react-native';

interface MedicationAdherenceEntry {
    id: string;
    name: string;
    dosage: string;
    totalDoses: number;
    takenDoses: number;
    adherence: number;
}

interface DayStatus {
    day: number;
    taken: boolean;
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MOCK_MEDICATIONS: MedicationAdherenceEntry[] = [
    { id: '1', name: 'Metformin', dosage: '500mg', totalDoses: 56, takenDoses: 52, adherence: 93 },
    { id: '2', name: 'Lisinopril', dosage: '10mg', totalDoses: 28, takenDoses: 25, adherence: 89 },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', totalDoses: 28, takenDoses: 20, adherence: 71 },
];

const generateDayStatuses = (daysInMonth: number): DayStatus[] =>
    Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        taken: Math.random() > 0.15,
    }));

const getDaysInMonth = (month: number, year: number): number => new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (month: number, year: number): number => new Date(year, month, 1).getDay();

/**
 * MedicationMonthlyReport displays a monthly adherence report with summary,
 * per-medication breakdown, and a daily grid showing taken/missed doses.
 */
export const MedicationMonthlyReport: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year, setYear] = useState(now.getFullYear());

    const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);
    const firstDay = useMemo(() => getFirstDayOfMonth(month, year), [month, year]);
    const dayStatuses = useMemo(() => generateDayStatuses(daysInMonth), [daysInMonth]);

    const summary = useMemo(() => {
        const totalDoses = MOCK_MEDICATIONS.reduce((s, m) => s + m.totalDoses, 0);
        const takenDoses = MOCK_MEDICATIONS.reduce((s, m) => s + m.takenDoses, 0);
        const missedDoses = totalDoses - takenDoses;
        const adherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
        return { totalDoses, takenDoses, missedDoses, adherence };
    }, []);

    const handlePrevMonth = useCallback(() => {
        if (month === 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else {
            setMonth((m) => m - 1);
        }
    }, [month]);

    const handleNextMonth = useCallback(() => {
        if (month === 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else {
            setMonth((m) => m + 1);
        }
    }, [month]);

    const handleExportPDF = useCallback(() => {
        Alert.alert(t('medication.comingSoon'), t('medication.exportPDFMessage'));
    }, [t]);

    const handleShare = useCallback(() => {
        Alert.alert(t('medication.comingSoon'), t('medication.shareMessage'));
    }, [t]);

    const renderMedicationItem = useCallback(
        ({ item }: ListRenderItemInfo<MedicationAdherenceEntry>) => (
            <View style={styles.medRow} testID={`med-row-${item.id}`}>
                <View style={styles.medInfo}>
                    <Text fontWeight="medium" fontSize="sm">
                        {item.name}
                    </Text>
                    <Text fontSize="xs" color={colors.neutral.gray600}>
                        {item.dosage} - {item.takenDoses}/{item.totalDoses} {t('medication.doses')}
                    </Text>
                </View>
                <Badge
                    variant="status"
                    status={item.adherence >= 80 ? 'success' : item.adherence >= 50 ? 'warning' : 'error'}
                    accessibilityLabel={`${item.adherence}%`}
                >
                    {item.adherence}%
                </Badge>
            </View>
        ),
        [t]
    );

    const medKeyExtractor = useCallback((item: MedicationAdherenceEntry) => item.id, []);

    const gridCells = useMemo(() => {
        const cells: (DayStatus | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            cells.push(null);
        }
        dayStatuses.forEach((ds) => cells.push(ds));
        return cells;
    }, [firstDay, dayStatuses]);

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
                    {t('medication.monthlyReport')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Month Selector */}
                <View style={styles.monthSelector}>
                    <Touchable
                        onPress={handlePrevMonth}
                        accessibilityLabel={t('medication.previousMonth')}
                        accessibilityRole="button"
                        testID="prev-month-button"
                    >
                        <Text fontSize="xl" color={colors.journeys.health.primary}>
                            {'<'}
                        </Text>
                    </Touchable>
                    <Text fontWeight="semiBold" fontSize="lg">
                        {MONTHS[month]} {year}
                    </Text>
                    <Touchable
                        onPress={handleNextMonth}
                        accessibilityLabel={t('medication.nextMonth')}
                        accessibilityRole="button"
                        testID="next-month-button"
                    >
                        <Text fontSize="xl" color={colors.journeys.health.primary}>
                            {'>'}
                        </Text>
                    </Touchable>
                </View>

                {/* Summary Card */}
                <Card journey="health" elevation="md" padding="md">
                    <Text fontWeight="semiBold" fontSize="lg" journey="health">
                        {t('medication.summary')}
                    </Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryItem}>
                            <Text fontSize="heading-xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                {summary.totalDoses}
                            </Text>
                            <Text fontSize="xs" color={colors.neutral.gray600}>
                                {t('medication.totalDoses')}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text fontSize="heading-xl" fontWeight="bold" color={colors.semantic.success}>
                                {summary.takenDoses}
                            </Text>
                            <Text fontSize="xs" color={colors.neutral.gray600}>
                                {t('medication.taken')}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text fontSize="heading-xl" fontWeight="bold" color={colors.semantic.error}>
                                {summary.missedDoses}
                            </Text>
                            <Text fontSize="xs" color={colors.neutral.gray600}>
                                {t('medication.missed')}
                            </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text fontSize="heading-xl" fontWeight="bold" color={colors.journeys.health.primary}>
                                {summary.adherence}%
                            </Text>
                            <Text fontSize="xs" color={colors.neutral.gray600}>
                                {t('medication.adherenceRate')}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Medication Breakdown */}
                <View style={styles.sectionContainer}>
                    <Text fontWeight="semiBold" fontSize="lg" journey="health">
                        {t('medication.breakdown')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <FlatList
                            data={MOCK_MEDICATIONS}
                            renderItem={renderMedicationItem}
                            keyExtractor={medKeyExtractor}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            testID="medication-breakdown-list"
                        />
                    </Card>
                </View>

                {/* Daily Grid */}
                <View style={styles.sectionContainer}>
                    <Text fontWeight="semiBold" fontSize="lg" journey="health">
                        {t('medication.dailyOverview')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.weekdayRow}>
                            {WEEKDAY_LABELS.map((label, i) => (
                                <View key={`wk-${i}`} style={styles.gridCell}>
                                    <Text fontSize="xs" fontWeight="medium" color={colors.neutral.gray600}>
                                        {label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.gridContainer}>
                            {gridCells.map((cell, i) => (
                                <View key={`cell-${i}`} style={styles.gridCell}>
                                    {cell ? (
                                        <View
                                            style={[
                                                styles.dot,
                                                {
                                                    backgroundColor: cell.taken
                                                        ? colors.semantic.success
                                                        : colors.semantic.error,
                                                },
                                            ]}
                                            testID={`day-dot-${cell.day}`}
                                        >
                                            <Text fontSize="xs" color={colors.neutral.white} textAlign="center">
                                                {cell.day}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.emptyCell} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </Card>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleExportPDF}
                        accessibilityLabel={t('medication.exportPDF')}
                        testID="export-pdf-button"
                    >
                        {t('medication.exportPDF')}
                    </Button>
                    <View style={styles.actionSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleShare}
                        accessibilityLabel={t('medication.share')}
                        testID="share-button"
                    >
                        {t('medication.share')}
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
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues.md,
        paddingVertical: spacingValues.sm,
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: spacingValues.md,
    },
    summaryItem: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: spacingValues.sm,
    },
    sectionContainer: {
        marginTop: spacingValues.xl,
    },
    medRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.xs,
    },
    medInfo: {
        flex: 1,
        marginRight: spacingValues.sm,
    },
    separator: {
        height: 1,
        backgroundColor: colors.neutral.gray200,
        marginVertical: spacingValues['3xs'],
    },
    weekdayRow: {
        flexDirection: 'row',
        marginBottom: spacingValues.xs,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridCell: {
        width: '14.28%',
        alignItems: 'center',
        paddingVertical: spacingValues['3xs'],
    },
    dot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCell: {
        width: 28,
        height: 28,
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        paddingBottom: spacingValues.xl,
    },
    actionSpacer: {
        height: spacingValues.sm,
    },
});

export default MedicationMonthlyReport;
