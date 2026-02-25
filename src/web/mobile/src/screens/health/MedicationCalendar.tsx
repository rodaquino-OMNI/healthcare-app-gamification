import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Represents a single dose slot for a medication on a given day.
 */
interface DoseSlot {
  id: string;
  medicationName: string;
  dosage: string;
  time: string;
  status: 'taken' | 'missed' | 'pending';
}

/**
 * Represents a single day in the weekly calendar strip.
 */
interface CalendarDay {
  key: string;
  label: string;
  dateNum: number;
  fullDate: string;
}

/**
 * Generate 7-day strip centered on today.
 */
const generateWeekDays = (): CalendarDay[] => {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return {
      key: `day-${i}`,
      label: dayLabels[date.getDay()],
      dateNum: date.getDate(),
      fullDate: `${yyyy}-${mm}-${dd}`,
    };
  });
};

/**
 * Mock dose schedule per day keyed by date string.
 */
const MOCK_SCHEDULE: Record<string, DoseSlot[]> = (() => {
  const days = generateWeekDays();
  const schedule: Record<string, DoseSlot[]> = {};
  days.forEach((day, idx) => {
    schedule[day.fullDate] = [
      {
        id: `${day.fullDate}-1`,
        medicationName: 'Metformin',
        dosage: '500mg',
        time: '08:00 AM',
        status: idx < 4 ? 'taken' : idx === 4 ? 'missed' : 'pending',
      },
      {
        id: `${day.fullDate}-2`,
        medicationName: 'Lisinopril',
        dosage: '10mg',
        time: '08:00 AM',
        status: idx < 5 ? 'taken' : 'pending',
      },
      {
        id: `${day.fullDate}-3`,
        medicationName: 'Metformin',
        dosage: '500mg',
        time: '02:00 PM',
        status: idx < 3 ? 'taken' : 'pending',
      },
      {
        id: `${day.fullDate}-4`,
        medicationName: 'Atorvastatin',
        dosage: '20mg',
        time: '08:00 PM',
        status: idx < 2 ? 'taken' : idx === 2 ? 'missed' : 'pending',
      },
    ];
  });
  return schedule;
})();

const STATUS_BADGE_MAP: Record<DoseSlot['status'], { badgeStatus: 'success' | 'error' | 'warning'; label: string }> = {
  taken: { badgeStatus: 'success', label: 'Taken' },
  missed: { badgeStatus: 'error', label: 'Missed' },
  pending: { badgeStatus: 'warning', label: 'Pending' },
};

/**
 * MedicationCalendar displays a 7-day strip with dose schedule per day.
 * Each day is touchable; selecting a day shows the medication doses.
 */
export const MedicationCalendar: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const weekDays = useMemo(() => generateWeekDays(), []);
  const todayStr = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const doses = useMemo(
    () => MOCK_SCHEDULE[selectedDate] ?? [],
    [selectedDate],
  );

  const handleDayPress = useCallback((fullDate: string) => {
    setSelectedDate(fullDate);
  }, []);

  const handleViewMonthly = useCallback(() => {
    // Placeholder for monthly view navigation
    navigation.navigate(ROUTES.HEALTH_MEDICATION_LIST);
  }, [navigation]);

  const renderDoseItem = useCallback(
    ({ item }: ListRenderItemInfo<DoseSlot>) => {
      const badgeConfig = STATUS_BADGE_MAP[item.status];
      return (
        <Card journey="health" elevation="sm" padding="md">
          <View style={styles.doseRow}>
            <View style={styles.doseTimeContainer}>
              <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                {item.time}
              </Text>
            </View>
            <View style={styles.doseInfo}>
              <Text fontWeight="medium" fontSize="md">
                {item.medicationName}
              </Text>
              <Text fontSize="sm" color={colors.neutral.gray600}>
                {item.dosage}
              </Text>
            </View>
            <Badge
              variant="status"
              status={badgeConfig.badgeStatus}
              accessibilityLabel={badgeConfig.label}
            >
              {badgeConfig.label}
            </Badge>
          </View>
        </Card>
      );
    },
    [],
  );

  const doseKeyExtractor = useCallback((item: DoseSlot) => item.id, []);

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
          {t('medication.calendar.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 7-Day Strip */}
      <View style={styles.weekStrip}>
        {weekDays.map((day) => {
          const isSelected = day.fullDate === selectedDate;
          const isToday = day.fullDate === todayStr;
          return (
            <Touchable
              key={day.key}
              onPress={() => handleDayPress(day.fullDate)}
              accessibilityLabel={`${day.label} ${day.dateNum}${isToday ? ', today' : ''}`}
              accessibilityRole="button"
              testID={`calendar-day-${day.key}`}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
              ] as any}
            >
              <Text
                fontSize="xs"
                color={isSelected ? colors.neutral.white : colors.neutral.gray600}
              >
                {day.label}
              </Text>
              <Text
                fontSize="lg"
                fontWeight={isToday ? 'bold' : 'medium'}
                color={isSelected ? colors.neutral.white : colors.neutral.gray900}
              >
                {day.dateNum}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {/* Dose Schedule for Selected Day */}
      <FlatList
        data={doses}
        renderItem={renderDoseItem}
        keyExtractor={doseKeyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID="dose-schedule-list"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text fontSize="md" color={colors.neutral.gray500} textAlign="center">
              {t('medication.calendar.noDoses')}
            </Text>
          </View>
        }
      />

      {/* View Monthly Button */}
      <View style={styles.bottomContainer}>
        <Button
          variant="secondary"
          journey="health"
          onPress={handleViewMonthly}
          accessibilityLabel={t('medication.calendar.viewMonthly')}
          testID="view-monthly-button"
        >
          {t('medication.calendar.viewMonthly')}
        </Button>
      </View>
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
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 60,
    borderRadius: 12,
  },
  dayCellSelected: {
    backgroundColor: colors.journeys.health.primary,
  },
  listContent: {
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues.sm,
    paddingBottom: spacingValues['5xl'],
    gap: spacingValues.sm,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doseTimeContainer: {
    width: 80,
    marginRight: spacingValues.sm,
  },
  doseInfo: {
    flex: 1,
    marginRight: spacingValues.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingValues['3xl'],
  },
  bottomContainer: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
  },
});

export default MedicationCalendar;
