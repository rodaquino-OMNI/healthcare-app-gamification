import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Flow intensity options.
 */
type FlowIntensity = 'light' | 'medium' | 'heavy';

interface FlowOption {
  id: FlowIntensity;
  labelKey: string;
  iconScale: number;
}

const FLOW_OPTIONS: FlowOption[] = [
  { id: 'light', labelKey: 'journeys.health.cycle.flow.light', iconScale: 1 },
  { id: 'medium', labelKey: 'journeys.health.cycle.flow.medium', iconScale: 2 },
  { id: 'heavy', labelKey: 'journeys.health.cycle.flow.heavy', iconScale: 3 },
];

/**
 * Generate a simple date display string.
 */
const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Generate the last 7 days as selectable date options.
 */
const generateRecentDates = (): { date: Date; label: string; formatted: string }[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return {
      date: d,
      label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : formatDate(d),
      formatted: formatDate(d),
    };
  });
};

/**
 * LogPeriodStart allows users to mark the start date of their period
 * with initial flow intensity selection and optional notes.
 */
export const LogPeriodStart: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const recentDates = generateRecentDates();

  const [selectedDate, setSelectedDate] = useState(recentDates[0].formatted);
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>('medium');
  const [notes, setNotes] = useState('');

  const handleStartedToday = useCallback(() => {
    setSelectedDate(recentDates[0].formatted);
  }, [recentDates]);

  const handleSave = useCallback(() => {
    Alert.alert(
      t('journeys.health.cycle.logPeriod.savedTitle'),
      t('journeys.health.cycle.logPeriod.savedMessage'),
      [{ text: t('common.buttons.ok'), onPress: () => navigation.goBack() }],
    );
  }, [navigation, t]);

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
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('common.buttons.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.cycle.logPeriod.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Start Button */}
        <Button
          journey="health"
          onPress={handleStartedToday}
          accessibilityLabel={t('journeys.health.cycle.logPeriod.startedToday')}
          testID="started-today-button"
        >
          {t('journeys.health.cycle.logPeriod.startedToday')}
        </Button>

        {/* Date Picker */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.logPeriod.selectDate')}
          </Text>
          <View style={styles.dateGrid}>
            {recentDates.map((item) => {
              const isSelected = item.formatted === selectedDate;
              return (
                <Touchable
                  key={item.formatted}
                  onPress={() => setSelectedDate(item.formatted)}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                  testID={`date-option-${item.formatted}`}
                  style={[
                    styles.dateOption,
                    isSelected && styles.dateOptionSelected,
                  ]}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={isSelected ? 'semiBold' : 'regular'}
                    color={isSelected ? colors.neutral.white : colors.gray[60]}
                    textAlign="center"
                  >
                    {item.label}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Flow Intensity */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.logPeriod.flowIntensity')}
          </Text>
          <View style={styles.flowRow}>
            {FLOW_OPTIONS.map((option) => {
              const isSelected = option.id === flowIntensity;
              return (
                <Touchable
                  key={option.id}
                  onPress={() => setFlowIntensity(option.id)}
                  accessibilityLabel={t(option.labelKey)}
                  accessibilityRole="button"
                  testID={`flow-${option.id}`}
                  style={[
                    styles.flowOption,
                    isSelected && styles.flowOptionSelected,
                  ]}
                >
                  <View style={styles.dropletContainer}>
                    {Array.from({ length: option.iconScale }, (_, i) => (
                      <View
                        key={`drop-${i}`}
                        style={[
                          styles.droplet,
                          {
                            backgroundColor: isSelected
                              ? colors.semantic.error
                              : colors.gray[30],
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    fontSize="sm"
                    fontWeight={isSelected ? 'semiBold' : 'regular'}
                    color={isSelected ? colors.semantic.error : colors.gray[50]}
                  >
                    {t(option.labelKey)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.logPeriod.notes')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={t('journeys.health.cycle.logPeriod.notesPlaceholder')}
              placeholderTextColor={colors.gray[40]}
              multiline
              numberOfLines={4}
              style={styles.textInput}
              testID="notes-input"
              accessibilityLabel={t('journeys.health.cycle.logPeriod.notes')}
            />
          </Card>
        </View>

        {/* Save Button */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleSave}
            accessibilityLabel={t('journeys.health.cycle.logPeriod.save')}
            testID="save-button"
          >
            {t('journeys.health.cycle.logPeriod.save')}
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
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  dateOption: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
    minWidth: 90,
    alignItems: 'center',
  },
  dateOptionSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  flowRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  flowOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacingValues.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
    gap: spacingValues.xs,
  },
  flowOptionSelected: {
    borderColor: colors.semantic.error,
    backgroundColor: colors.semantic.errorBg,
  },
  dropletContainer: {
    flexDirection: 'row',
    gap: spacingValues['3xs'],
  },
  droplet: {
    width: 12,
    height: 16,
    borderRadius: 6,
  },
  textInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: colors.gray[60],
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
  },
});

export default LogPeriodStart;
