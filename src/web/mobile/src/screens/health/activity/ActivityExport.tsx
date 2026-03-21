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
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/useTheme';

/**
 * Export file format.
 */
type ExportFormat = 'pdf' | 'csv';

const MOCK_FROM_DATE = '2026-01-01';
const MOCK_TO_DATE = '2026-02-23';
const MOCK_TOTAL_SESSIONS = 68;

/**
 * ActivityExport allows users to export their activity data as a PDF or CSV report,
 * with configurable date range and a preview summary.
 */
export const ActivityExport: React.FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [fromDate, _setFromDate] = useState(MOCK_FROM_DATE);
    const [toDate, _setToDate] = useState(MOCK_TO_DATE);
    const [format, setFormat] = useState<ExportFormat>('pdf');

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleFromDatePress = useCallback(() => {
        Alert.alert(
            t('journeys.health.activity.export.selectFromDate'),
            t('journeys.health.activity.export.datePickerPlaceholder')
        );
    }, [t]);

    const handleToDatePress = useCallback(() => {
        Alert.alert(
            t('journeys.health.activity.export.selectToDate'),
            t('journeys.health.activity.export.datePickerPlaceholder')
        );
    }, [t]);

    const handleFormatChange = useCallback((fmt: ExportFormat) => {
        setFormat(fmt);
    }, []);

    const handleGenerate = useCallback(() => {
        Alert.alert(
            t('journeys.health.activity.export.generateTitle'),
            t('journeys.health.activity.export.generateMessage', {
                format: format.toUpperCase(),
                from: fromDate,
                to: toDate,
            })
        );
    }, [format, fromDate, toDate, t]);

    const handleShare = useCallback(() => {
        Alert.alert(t('journeys.health.activity.export.shareTitle'), t('journeys.health.activity.export.shareMessage'));
    }, [t]);

    return (
        <SafeAreaView style={styles.container}>
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
                    {t('journeys.health.activity.export.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Format Selector */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.export.format')}
                    </Text>
                    <View style={styles.formatContainer}>
                        {(['pdf', 'csv'] as ExportFormat[]).map((fmt) => (
                            <Touchable
                                key={fmt}
                                onPress={() => handleFormatChange(fmt)}
                                accessibilityLabel={fmt.toUpperCase()}
                                accessibilityRole="button"
                                testID={`activity-export-format-${fmt}`}
                            >
                                <Card journey="health" elevation="sm" padding="md">
                                    <View style={styles.radioRow}>
                                        <View style={styles.radioOuter}>
                                            {format === fmt && <View style={styles.radioInner} />}
                                        </View>
                                        <Ionicons
                                            name={fmt === 'pdf' ? 'document-text-outline' : 'grid-outline'}
                                            size={20}
                                            color={format === fmt ? colors.journeys.health.primary : colors.gray[40]}
                                            style={styles.formatIcon}
                                        />
                                        <View style={styles.formatInfo}>
                                            <Text fontSize="md" fontWeight="semiBold">
                                                {fmt.toUpperCase()}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[50]}>
                                                {t(
                                                    `journeys.health.activity.export.formatDesc${fmt === 'pdf' ? 'Pdf' : 'Csv'}`
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </Touchable>
                        ))}
                    </View>
                </View>

                {/* Date Range */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.export.dateRange')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <Touchable
                            onPress={handleFromDatePress}
                            accessibilityLabel={t('journeys.health.activity.export.fromDate')}
                            accessibilityRole="button"
                            testID="activity-export-from-date"
                        >
                            <View style={styles.dateField}>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {t('journeys.health.activity.export.from')}
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
                            accessibilityLabel={t('journeys.health.activity.export.toDate')}
                            accessibilityRole="button"
                            testID="activity-export-to-date"
                        >
                            <View style={styles.dateField}>
                                <Text fontSize="xs" color={colors.gray[40]}>
                                    {t('journeys.health.activity.export.to')}
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

                {/* Preview */}
                <View style={styles.sectionContainer}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.activity.export.preview')}
                    </Text>
                    <Card journey="health" elevation="sm" padding="md">
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.activity.export.totalSessions')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {MOCK_TOTAL_SESSIONS}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.activity.export.dateRangeLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {fromDate} - {toDate}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.previewRow}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {t('journeys.health.activity.export.formatLabel')}
                            </Text>
                            <Text fontSize="sm" fontWeight="semiBold">
                                {format.toUpperCase()}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        journey="health"
                        onPress={handleGenerate}
                        accessibilityLabel={t('journeys.health.activity.export.generate')}
                        testID="activity-export-generate-button"
                    >
                        {t('journeys.health.activity.export.generate')}
                    </Button>
                    <View style={styles.buttonSpacer} />
                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleShare}
                        accessibilityLabel={t('journeys.health.activity.export.share')}
                        testID="activity-export-share-button"
                    >
                        {t('journeys.health.activity.export.share')}
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

export default ActivityExport;
