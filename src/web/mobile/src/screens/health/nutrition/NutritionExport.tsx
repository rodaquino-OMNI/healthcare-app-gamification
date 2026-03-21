import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Export file format.
 */
type ExportFormat = 'pdf' | 'csv';

/**
 * Format card descriptor.
 */
interface FormatOption {
    id: ExportFormat;
    icon: keyof typeof Ionicons.glyphMap;
    labelKey: string;
    descKey: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
    {
        id: 'pdf',
        icon: 'document-text-outline',
        labelKey: 'journeys.health.nutrition.export.formatPdfLabel',
        descKey: 'journeys.health.nutrition.export.formatPdfDesc',
    },
    {
        id: 'csv',
        icon: 'grid-outline',
        labelKey: 'journeys.health.nutrition.export.formatCsvLabel',
        descKey: 'journeys.health.nutrition.export.formatCsvDesc',
    },
];

const MOCK_FROM_DATE = '2026-01-01';
const MOCK_TO_DATE = '2026-02-23';
const MOCK_TOTAL_MEALS = 132;

/**
 * NutritionExport allows users to export their nutrition data as a PDF or CSV
 * report with a configurable date range and a summary preview before generating.
 */
export const NutritionExport: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const _theme = useTheme();

    const [format, setFormat] = useState<ExportFormat>('pdf');
    const [fromDate, _setFromDate] = useState(MOCK_FROM_DATE);
    const [toDate, _setToDate] = useState(MOCK_TO_DATE);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleFormatChange = useCallback((fmt: ExportFormat) => {
        setFormat(fmt);
    }, []);

    const handleFromDatePress = useCallback(() => {
        Alert.alert(
            t('journeys.health.nutrition.export.selectFromDate'),
            t('journeys.health.nutrition.export.datePickerPlaceholder')
        );
    }, [t]);

    const handleToDatePress = useCallback(() => {
        Alert.alert(
            t('journeys.health.nutrition.export.selectToDate'),
            t('journeys.health.nutrition.export.datePickerPlaceholder')
        );
    }, [t]);

    const handleGenerate = useCallback(() => {
        Alert.alert(
            t('journeys.health.nutrition.export.generateTitle'),
            t('journeys.health.nutrition.export.generateMessage', {
                format: format.toUpperCase(),
                from: fromDate,
                to: toDate,
            })
        );
    }, [format, fromDate, toDate, t]);

    const handleShare = useCallback(() => {
        Alert.alert(
            t('journeys.health.nutrition.export.shareTitle'),
            t('journeys.health.nutrition.export.shareMessage')
        );
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
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.nutrition.export.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="nutrition-export-scroll"
            >
                {/* Format Picker */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.export.format')}
                    </Text>
                    {FORMAT_OPTIONS.map((option) => (
                        <Touchable
                            key={option.id}
                            onPress={() => handleFormatChange(option.id)}
                            accessibilityLabel={t(option.labelKey)}
                            accessibilityRole="button"
                            testID={`nutrition-export-format-${option.id}`}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.radioRow}>
                                    <View style={styles.radioOuter}>
                                        {format === option.id && <View style={styles.radioInner} />}
                                    </View>
                                    <Ionicons
                                        name={option.icon}
                                        size={22}
                                        color={format === option.id ? colors.journeys.health.primary : colors.gray[40]}
                                        style={styles.formatIcon}
                                    />
                                    <View style={styles.formatInfo}>
                                        <Text fontSize="md" fontWeight="semiBold">
                                            {t(option.labelKey)}
                                        </Text>
                                        <Text fontSize="sm" color={colors.gray[50]}>
                                            {t(option.descKey)}
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        </Touchable>
                    ))}
                </View>

                {/* Date Range */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.export.dateRange')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <Touchable
                            onPress={handleFromDatePress}
                            accessibilityLabel={t('journeys.health.nutrition.export.from')}
                            accessibilityRole="button"
                            testID="nutrition-export-from-date"
                        >
                            <View style={styles.dateField}>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {t('journeys.health.nutrition.export.from')}
                                </Text>
                                <View style={styles.dateValueRow}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={18}
                                        color={colors.journeys.health.primary}
                                    />
                                    <Text fontSize="md" fontWeight="medium" color={colors.gray[60]}>
                                        {fromDate}
                                    </Text>
                                </View>
                            </View>
                        </Touchable>
                        <View style={styles.divider} />
                        <Touchable
                            onPress={handleToDatePress}
                            accessibilityLabel={t('journeys.health.nutrition.export.to')}
                            accessibilityRole="button"
                            testID="nutrition-export-to-date"
                        >
                            <View style={styles.dateField}>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {t('journeys.health.nutrition.export.to')}
                                </Text>
                                <View style={styles.dateValueRow}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={18}
                                        color={colors.journeys.health.primary}
                                    />
                                    <Text fontSize="md" fontWeight="medium" color={colors.gray[60]}>
                                        {toDate}
                                    </Text>
                                </View>
                            </View>
                        </Touchable>
                    </Card>
                </View>

                {/* Data Preview */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.nutrition.export.preview')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.export.totalMeals')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {MOCK_TOTAL_MEALS}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.export.dateRangeLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {fromDate} - {toDate}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.nutrition.export.formatLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {format.toUpperCase()}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleGenerate}
                        accessibilityLabel={t('journeys.health.nutrition.export.generate')}
                        testID="nutrition-export-generate-button"
                    >
                        {t('journeys.health.nutrition.export.generate')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleShare}
                        accessibilityLabel={t('journeys.health.nutrition.export.share')}
                        testID="nutrition-export-share-button"
                    >
                        {t('journeys.health.nutrition.export.share')}
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
    formatIcon: {
        marginRight: spacingValues.sm,
    },
    formatInfo: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    dateField: {
        paddingVertical: spacingValues.xs,
        gap: spacingValues['4xs'],
    },
    dateValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues.xs,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[10],
        marginVertical: spacingValues['4xs'],
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacingValues.xs,
    },
    actionsContainer: {
        marginTop: spacingValues['2xl'],
        marginBottom: spacingValues.xl,
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default NutritionExport;
