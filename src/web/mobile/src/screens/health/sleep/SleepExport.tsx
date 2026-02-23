import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Export file format.
 */
type ExportFormat = 'pdf' | 'csv';

const MOCK_FROM_DATE = '2026-01-01';
const MOCK_TO_DATE = '2026-02-22';
const MOCK_TOTAL_NIGHTS = 53;

/**
 * SleepExport allows users to export their sleep data as a PDF or CSV report,
 * with configurable date range and a preview summary.
 */
export const SleepExport: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();
  const [fromDate, setFromDate] = useState(MOCK_FROM_DATE);
  const [toDate, setToDate] = useState(MOCK_TO_DATE);
  const [format, setFormat] = useState<ExportFormat>('pdf');

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleFromDatePress = useCallback(() => {
    Alert.alert(
      t('journeys.health.sleep.export.selectFromDate'),
      t('journeys.health.sleep.export.datePickerPlaceholder'),
    );
  }, [t]);

  const handleToDatePress = useCallback(() => {
    Alert.alert(
      t('journeys.health.sleep.export.selectToDate'),
      t('journeys.health.sleep.export.datePickerPlaceholder'),
    );
  }, [t]);

  const handleFormatChange = useCallback((fmt: ExportFormat) => {
    setFormat(fmt);
  }, []);

  const handleGenerate = useCallback(() => {
    Alert.alert(
      t('journeys.health.sleep.export.generateTitle'),
      t('journeys.health.sleep.export.generateMessage', {
        format: format.toUpperCase(),
        from: fromDate,
        to: toDate,
      }),
    );
  }, [format, fromDate, toDate, t]);

  const handleShare = useCallback(() => {
    Alert.alert(
      t('journeys.health.sleep.export.shareTitle'),
      t('journeys.health.sleep.export.shareMessage'),
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
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('common.buttons.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.sleep.export.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="sleep-export-scroll"
      >
        {/* Date Range */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.export.dateRange')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <Touchable
              onPress={handleFromDatePress}
              accessibilityLabel={t('journeys.health.sleep.export.fromDate')}
              accessibilityRole="button"
              testID="sleep-export-from-date"
            >
              <View style={styles.dateField}>
                <Text fontSize="xs" color={colors.gray[40]}>
                  {t('journeys.health.sleep.export.from')}
                </Text>
                <View style={styles.dateValueRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.journeys.health.primary} />
                  <Text fontSize="md" fontWeight="medium" color={colors.gray[60]}>
                    {fromDate}
                  </Text>
                </View>
              </View>
            </Touchable>
            <View style={styles.divider} />
            <Touchable
              onPress={handleToDatePress}
              accessibilityLabel={t('journeys.health.sleep.export.toDate')}
              accessibilityRole="button"
              testID="sleep-export-to-date"
            >
              <View style={styles.dateField}>
                <Text fontSize="xs" color={colors.gray[40]}>
                  {t('journeys.health.sleep.export.to')}
                </Text>
                <View style={styles.dateValueRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.journeys.health.primary} />
                  <Text fontSize="md" fontWeight="medium" color={colors.gray[60]}>
                    {toDate}
                  </Text>
                </View>
              </View>
            </Touchable>
          </Card>
        </View>

        {/* Format Selector */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.export.format')}
          </Text>
          <View style={styles.formatContainer}>
            {(['pdf', 'csv'] as ExportFormat[]).map((fmt) => (
              <Touchable
                key={fmt}
                onPress={() => handleFormatChange(fmt)}
                accessibilityLabel={fmt.toUpperCase()}
                accessibilityRole="button"
                testID={`sleep-export-format-${fmt}`}
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
                        {t(`journeys.health.sleep.export.formatDesc${fmt === 'pdf' ? 'Pdf' : 'Csv'}`)}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Touchable>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.export.preview')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.previewRow}>
              <Text fontSize="sm" color={colors.gray[50]}>
                {t('journeys.health.sleep.export.totalNights')}
              </Text>
              <Text fontSize="sm" fontWeight="semiBold">
                {MOCK_TOTAL_NIGHTS}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.previewRow}>
              <Text fontSize="sm" color={colors.gray[50]}>
                {t('journeys.health.sleep.export.dateRangeLabel')}
              </Text>
              <Text fontSize="sm" fontWeight="semiBold">
                {fromDate} - {toDate}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.previewRow}>
              <Text fontSize="sm" color={colors.gray[50]}>
                {t('journeys.health.sleep.export.formatLabel')}
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
            accessibilityLabel={t('journeys.health.sleep.export.generate')}
            testID="sleep-export-generate-button"
          >
            {t('journeys.health.sleep.export.generate')}
          </Button>
          <View style={styles.buttonSpacer} />
          <Button
            variant="secondary"
            journey="health"
            onPress={handleShare}
            accessibilityLabel={t('journeys.health.sleep.export.share')}
            testID="sleep-export-share-button"
          >
            {t('journeys.health.sleep.export.share')}
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

export default SleepExport;
