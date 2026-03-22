import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';

import type { HealthStackParamList } from '../../navigation/types';

/**
 * Export format type
 */
type ExportFormat = 'pdf' | 'csv' | 'print';

/**
 * Data scope type
 */
type DataScope = 'all' | 'active' | 'date_range';

/**
 * Format option definition
 */
interface FormatOption {
    id: ExportFormat;
    labelKey: string;
    descriptionKey: string;
}

/**
 * Scope option definition
 */
interface ScopeOption {
    id: DataScope;
    labelKey: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
    {
        id: 'pdf',
        labelKey: 'medication.export.formatPDF',
        descriptionKey: 'medication.export.formatPDFDescription',
    },
    {
        id: 'csv',
        labelKey: 'medication.export.formatCSV',
        descriptionKey: 'medication.export.formatCSVDescription',
    },
    {
        id: 'print',
        labelKey: 'medication.export.formatPrint',
        descriptionKey: 'medication.export.formatPrintDescription',
    },
];

const SCOPE_OPTIONS: ScopeOption[] = [
    { id: 'all', labelKey: 'medication.export.scopeAll' },
    { id: 'active', labelKey: 'medication.export.scopeActive' },
    { id: 'date_range', labelKey: 'medication.export.scopeDateRange' },
];

/** Mock export summary */
const EXPORT_SUMMARY = {
    totalMedications: 6,
    activeMedications: 4,
    dateRange: '2025-09-01 - 2026-02-21',
};

/**
 * MedicationExport allows users to export their medication list
 * in various formats (PDF, CSV, Print) with configurable data scope.
 */
export const MedicationExport: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
    const [selectedScope, setSelectedScope] = useState<DataScope>('all');

    const handleExport = useCallback(() => {
        Alert.alert(
            t('medication.export.exportTitle'),
            t('medication.export.exportMessage', {
                format: selectedFormat.toUpperCase(),
            })
        );
    }, [selectedFormat, t]);

    const handleShare = useCallback(() => {
        Alert.alert(t('medication.export.shareTitle'), t('medication.export.shareMessage'));
    }, [t]);

    const getExportCount = useCallback(() => {
        switch (selectedScope) {
            case 'active':
                return EXPORT_SUMMARY.activeMedications;
            case 'all':
            case 'date_range':
            default:
                return EXPORT_SUMMARY.totalMedications;
        }
    }, [selectedScope]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={() => navigation.goBack()}
                    accessibilityLabel={t('medication.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('medication.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.export.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Export Format */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('medication.export.selectFormat')}
                    </Text>
                    {FORMAT_OPTIONS.map((option) => (
                        <Touchable
                            key={option.id}
                            onPress={() => setSelectedFormat(option.id)}
                            accessibilityLabel={t(option.labelKey)}
                            accessibilityRole="button"
                            testID={`format-option-${option.id}`}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <View style={styles.optionRow}>
                                    <View style={styles.radioOuter}>
                                        {selectedFormat === option.id && <View style={styles.radioInner} />}
                                    </View>
                                    <View style={styles.optionContent}>
                                        <Text fontWeight="semiBold" fontSize="md">
                                            {t(option.labelKey)}
                                        </Text>
                                        <Text fontSize="sm" color={colors.gray[50]}>
                                            {t(option.descriptionKey)}
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        </Touchable>
                    ))}
                </View>

                {/* Data Scope */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('medication.export.dataScope')}
                    </Text>
                    <View style={styles.scopeContainer}>
                        {SCOPE_OPTIONS.map((option) => (
                            <Touchable
                                key={option.id}
                                onPress={() => setSelectedScope(option.id)}
                                accessibilityLabel={t(option.labelKey)}
                                accessibilityRole="button"
                                testID={`scope-option-${option.id}`}
                                style={[styles.scopeOption, selectedScope === option.id && styles.scopeOptionActive]}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight={selectedScope === option.id ? 'semiBold' : 'regular'}
                                    color={
                                        selectedScope === option.id ? colors.journeys.health.primary : colors.gray[50]
                                    }
                                    textAlign="center"
                                >
                                    {t(option.labelKey)}
                                </Text>
                            </Touchable>
                        ))}
                    </View>
                </View>

                {/* Preview Summary */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('medication.export.previewTitle')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('medication.export.medicationsCount')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {getExportCount()}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('medication.export.format')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {selectedFormat.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('medication.export.dateRange')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {EXPORT_SUMMARY.dateRange}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleExport}
                        accessibilityLabel={t('medication.export.exportButton')}
                        testID="export-button"
                    >
                        {t('medication.export.exportButton')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleShare}
                        accessibilityLabel={t('medication.export.shareButton')}
                        testID="share-button"
                    >
                        {t('medication.export.shareButton')}
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
    optionRow: {
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
    optionContent: {
        flex: 1,
        gap: spacingValues['4xs'],
    },
    scopeContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[20],
        overflow: 'hidden',
    },
    scopeOption: {
        flex: 1,
        paddingVertical: spacingValues.sm,
        backgroundColor: colors.gray[0],
        alignItems: 'center',
    },
    scopeOptionActive: {
        backgroundColor: colors.journeys.health.background,
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
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default MedicationExport;
