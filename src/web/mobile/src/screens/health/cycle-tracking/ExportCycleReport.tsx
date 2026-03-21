import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Switch, StyleSheet, Alert } from 'react-native';

/**
 * Export date range option.
 */
type DateRange = '3m' | '6m' | '12m';

/**
 * Export file format.
 */
type ExportFormat = 'pdf' | 'csv';

/**
 * Data categories to include in the report.
 */
interface IncludeOption {
    id: string;
    enabled: boolean;
}

const DATE_RANGE_OPTIONS: { id: DateRange; labelKey: string }[] = [
    { id: '3m', labelKey: 'journeys.health.cycle.export.last3months' },
    { id: '6m', labelKey: 'journeys.health.cycle.export.last6months' },
    { id: '12m', labelKey: 'journeys.health.cycle.export.last12months' },
];

const INITIAL_INCLUDES: IncludeOption[] = [
    { id: 'cycle_dates', enabled: true },
    { id: 'symptoms', enabled: true },
    { id: 'flow_intensity', enabled: true },
    { id: 'insights', enabled: false },
];

const MOCK_PREVIEW = {
    totalCycles: 6,
    totalDays: 180,
    startDate: '2025-08-22',
    endDate: '2026-02-22',
};

/**
 * ExportCycleReport allows users to generate and share a medical report
 * of their cycle data with configurable date range, content, and format.
 */
export const ExportCycleReport: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState<DateRange>('6m');
    const [format, setFormat] = useState<ExportFormat>('pdf');
    const [includes, setIncludes] = useState<IncludeOption[]>(INITIAL_INCLUDES);
    const [doctorName, _setDoctorName] = useState('');
    const [clinicName, _setClinicName] = useState('');

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleDateRangeChange = useCallback((range: DateRange) => {
        setDateRange(range);
    }, []);

    const handleFormatChange = useCallback((fmt: ExportFormat) => {
        setFormat(fmt);
    }, []);

    const handleIncludeToggle = useCallback((id: string) => {
        setIncludes((prev) => prev.map((opt) => (opt.id === id ? { ...opt, enabled: !opt.enabled } : opt)));
    }, []);

    const handleGenerate = useCallback(() => {
        const includedItems = includes
            .filter((i) => i.enabled)
            .map((i) => i.id)
            .join(', ');
        Alert.alert(
            t('journeys.health.cycle.export.generateTitle'),
            t('journeys.health.cycle.export.generateMessage', {
                format: format.toUpperCase(),
                range: dateRange,
                items: includedItems,
            })
        );
    }, [format, dateRange, includes, t]);

    const handleShare = useCallback(() => {
        Alert.alert(t('journeys.health.cycle.export.shareTitle'), t('journeys.health.cycle.export.shareMessage'));
    }, [t]);

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
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.cycle.export.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="export-report-scroll"
            >
                {/* Date Range */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.export.dateRange')}
                    </Text>
                    <View style={styles.rangeSelector}>
                        {DATE_RANGE_OPTIONS.map((option) => (
                            <Touchable
                                key={option.id}
                                onPress={() => handleDateRangeChange(option.id)}
                                accessibilityLabel={t(option.labelKey)}
                                accessibilityRole="button"
                                testID={`range-${option.id}`}
                                style={[styles.rangeOption, dateRange === option.id && styles.rangeOptionActive] as any}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight={dateRange === option.id ? 'semiBold' : 'regular'}
                                    color={dateRange === option.id ? colors.journeys.health.primary : colors.gray[50]}
                                    textAlign="center"
                                >
                                    {t(option.labelKey)}
                                </Text>
                            </Touchable>
                        ))}
                    </View>
                </View>

                {/* What to Include */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.export.whatToInclude')}
                    </Text>
                    {includes.map((option) => (
                        <Card key={option.id} journey="health" elevation="sm" padding="md">
                            <View style={styles.toggleRow}>
                                <Text fontSize="md" fontWeight="medium" style={styles.toggleLabelText}>
                                    {t(`journeys.health.cycle.export.includes.${option.id}`)}
                                </Text>
                                <Switch
                                    value={option.enabled}
                                    onValueChange={() => handleIncludeToggle(option.id)}
                                    trackColor={{
                                        false: colors.gray[20],
                                        true: colors.journeys.health.primary,
                                    }}
                                    thumbColor={colors.gray[0]}
                                    accessibilityLabel={t(`journeys.health.cycle.export.includes.${option.id}`)}
                                    testID={`include-${option.id}`}
                                />
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Format Selector */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.export.format')}
                    </Text>
                    <View style={styles.formatContainer}>
                        {(['pdf', 'csv'] as ExportFormat[]).map((fmt) => (
                            <Touchable
                                key={fmt}
                                onPress={() => handleFormatChange(fmt)}
                                accessibilityLabel={fmt.toUpperCase()}
                                accessibilityRole="button"
                                testID={`format-${fmt}`}
                            >
                                <Card journey="health" elevation="sm" padding="md">
                                    <View style={styles.radioRow}>
                                        <View style={styles.radioOuter}>
                                            {format === fmt && <View style={styles.radioInner} />}
                                        </View>
                                        <View style={styles.formatInfo}>
                                            <Text fontSize="md" fontWeight="semiBold">
                                                {fmt.toUpperCase()}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[50]}>
                                                {t(`journeys.health.cycle.export.formatDesc.${fmt}`)}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </Touchable>
                        ))}
                    </View>
                </View>

                {/* Doctor Info (Optional) */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.export.doctorInfo')}
                    </Text>
                    <Text fontSize="sm" color={colors.gray[50]}>
                        {t('journeys.health.cycle.export.doctorInfoDesc')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <Touchable
                            onPress={() =>
                                Alert.alert(
                                    t('journeys.health.cycle.export.enterDoctorName'),
                                    t('journeys.health.cycle.export.doctorNamePlaceholder')
                                )
                            }
                            accessibilityLabel={t('journeys.health.cycle.export.doctorName')}
                            accessibilityRole="button"
                            testID="doctor-name-input"
                        >
                            <View style={styles.inputField}>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {t('journeys.health.cycle.export.doctorName')}
                                </Text>
                                <Text fontSize="md" color={doctorName ? colors.gray[70] : colors.gray[30]}>
                                    {doctorName || t('journeys.health.cycle.export.doctorNamePlaceholder')}
                                </Text>
                            </View>
                        </Touchable>
                        <View style={styles.divider} />
                        <Touchable
                            onPress={() =>
                                Alert.alert(
                                    t('journeys.health.cycle.export.enterClinicName'),
                                    t('journeys.health.cycle.export.clinicPlaceholder')
                                )
                            }
                            accessibilityLabel={t('journeys.health.cycle.export.clinicName')}
                            accessibilityRole="button"
                            testID="clinic-name-input"
                        >
                            <View style={styles.inputField}>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {t('journeys.health.cycle.export.clinicName')}
                                </Text>
                                <Text fontSize="md" color={clinicName ? colors.gray[70] : colors.gray[30]}>
                                    {clinicName || t('journeys.health.cycle.export.clinicPlaceholder')}
                                </Text>
                            </View>
                        </Touchable>
                    </Card>
                </View>

                {/* Preview */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.cycle.export.preview')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.cycle.export.totalCycles')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {MOCK_PREVIEW.totalCycles}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.cycle.export.dateRangeLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {MOCK_PREVIEW.startDate} - {MOCK_PREVIEW.endDate}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.cycle.export.formatLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {format.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.cycle.export.sections')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {includes.filter((i) => i.enabled).length}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleGenerate}
                        accessibilityLabel={t('journeys.health.cycle.export.generate')}
                        testID="generate-report-button"
                    >
                        {t('journeys.health.cycle.export.generate')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleShare}
                        accessibilityLabel={t('journeys.health.cycle.export.share')}
                        testID="share-report-button"
                    >
                        {t('journeys.health.cycle.export.share')}
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
    sectionContainer: {
        marginTop: spacingValues.xl,
        gap: spacingValues.sm,
    },
    rangeSelector: {
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[20],
        overflow: 'hidden',
    },
    rangeOption: {
        flex: 1,
        paddingVertical: spacingValues.sm,
        backgroundColor: colors.gray[0],
        alignItems: 'center',
    },
    rangeOptionActive: {
        backgroundColor: colors.journeys.health.background,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleLabelText: {
        flex: 1,
        marginRight: spacingValues.sm,
    },
    formatContainer: {
        gap: spacingValues.sm,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.journeys.health.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacingValues.sm,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.journeys.health.primary,
    },
    formatInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    inputField: {
        paddingVertical: spacingValues.xs,
        gap: spacingValues['4xs'],
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.xs,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default ExportCycleReport;
