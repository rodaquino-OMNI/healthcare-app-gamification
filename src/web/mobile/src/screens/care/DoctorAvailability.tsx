import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { ROUTES } from 'src/web/mobile/src/constants/routes';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { useTheme } from 'styled-components/native';
import type { Theme } from 'src/web/design-system/src/themes/base.theme';
import { useTranslation } from 'react-i18next';

/**
 * Route params expected by the DoctorAvailability screen.
 */
interface DoctorAvailabilityRouteParams {
  doctorId: string;
}

/**
 * Represents a single time slot.
 */
interface TimeSlot {
  time: string;
  available: boolean;
}

/**
 * Represents a group of time slots by period.
 */
interface SlotPeriod {
  label: string;
  slots: TimeSlot[];
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

/**
 * Returns mock available dates for the given month (days with at least one slot open).
 */
const getAvailableDays = (year: number, month: number): Set<number> => {
  // Mock: even days + 1, 7, 15, 21, 27 are available
  const available = new Set<number>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (d % 2 === 0 || [1, 7, 15, 21, 27].includes(d)) {
      available.add(d);
    }
  }
  return available;
};

/**
 * Returns mock time slots for a given date, with some slots marked as booked.
 */
const getTimeSlotsForDate = (day: number): SlotPeriod[] => {
  const bookedSlots = new Set<string>();
  // Mock: certain slots are booked based on day number
  if (day % 3 === 0) {
    bookedSlots.add('09:00');
    bookedSlots.add('14:00');
    bookedSlots.add('18:30');
  }
  if (day % 5 === 0) {
    bookedSlots.add('08:30');
    bookedSlots.add('15:00');
    bookedSlots.add('19:00');
  }

  const makeSlot = (time: string): TimeSlot => ({
    time,
    available: !bookedSlots.has(time),
  });

  return [
    {
      label: 'Manha',
      slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'].map(makeSlot),
    },
    {
      label: 'Tarde',
      slots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map(makeSlot),
    },
    {
      label: 'Noite',
      slots: ['18:00', '18:30', '19:00', '19:30'].map(makeSlot),
    },
  ];
};

/**
 * Builds a calendar grid for the given year/month.
 * Returns an array of weeks, each containing 7 cells (null for padding).
 */
const buildCalendarGrid = (year: number, month: number): (number | null)[][] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = new Array(firstDay).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

/**
 * DoctorAvailability screen displays a calendar month view with available
 * time slots for the selected doctor. Users select a date and time slot
 * before proceeding to the booking schedule.
 */
const DoctorAvailability: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctorId } = route.params as DoctorAvailabilityRouteParams;
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const availableDays = useMemo(
    () => getAvailableDays(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const calendarGrid = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const timeSlots = useMemo(
    () => (selectedDay ? getTimeSlotsForDate(selectedDay) : []),
    [selectedDay],
  );

  const monthLabel = new Date(currentYear, currentMonth).toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
    setSelectedSlot(null);
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
    setSelectedSlot(null);
  }, [currentMonth]);

  const handleDayPress = useCallback(
    (day: number) => {
      if (availableDays.has(day)) {
        setSelectedDay(day);
        setSelectedSlot(null);
      }
    },
    [availableDays],
  );

  const handleSlotPress = useCallback((time: string) => {
    setSelectedSlot(time);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedDay || !selectedSlot) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    navigation.navigate(ROUTES.CARE_BOOKING_SCHEDULE, {
      doctorId,
      date: dateStr,
      time: selectedSlot,
    });
  }, [navigation, doctorId, currentYear, currentMonth, selectedDay, selectedSlot]);

  const isPastDay = (day: number): boolean => {
    const cellDate = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return cellDate < todayStart;
  };

  return (
    <View style={styles.container}>
      <JourneyHeader title={t('journeys.care.doctorAvailability.title')} showBackButton />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Calendar navigation */}
        <View style={styles.calendarNav}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton} accessibilityLabel="Mes anterior">
            <Text fontSize="lg" fontWeight="bold" color={colors.gray[70]}>{'<'}</Text>
          </TouchableOpacity>
          <Text fontSize="lg" fontWeight="bold" color={colors.gray[70]} textAlign="center">
            {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton} accessibilityLabel="Proximo mes">
            <Text fontSize="lg" fontWeight="bold" color={colors.gray[70]}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekRow}>
          {WEEKDAY_LABELS.map((label) => (
            <View key={label} style={styles.weekDayCell}>
              <Text fontSize="xs" fontWeight="medium" color={colors.gray[50]} textAlign="center">
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        {calendarGrid.map((week, wi) => (
          <View key={`week-${wi}`} style={styles.weekRow}>
            {week.map((day, di) => {
              if (day === null) {
                return <View key={`empty-${wi}-${di}`} style={styles.dayCell} />;
              }
              const isAvailable = availableDays.has(day) && !isPastDay(day);
              const isSelected = day === selectedDay;

              return (
                <TouchableOpacity
                  key={`day-${day}`}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    !isAvailable && styles.dayCellUnavailable,
                  ]}
                  onPress={() => handleDayPress(day)}
                  disabled={!isAvailable}
                  accessibilityLabel={`Dia ${day}${isAvailable ? ', disponivel' : ', indisponivel'}`}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={isSelected ? 'bold' : 'regular'}
                    color={isSelected ? colors.neutral.white : isAvailable ? colors.gray[70] : colors.gray[30]}
                    textAlign="center"
                  >
                    {String(day)}
                  </Text>
                  {isAvailable && !isSelected && (
                    <View style={styles.availableDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Time slots */}
        {selectedDay && timeSlots.length > 0 && (
          <View style={styles.slotsSection}>
            <Text fontSize="md" fontWeight="bold" color={colors.gray[70]}>
              {t('journeys.care.doctorAvailability.slotsForDay', { day: selectedDay })}
            </Text>

            {timeSlots.map((period) => (
              <View key={period.label} style={styles.periodSection}>
                <Badge journey="care" size="sm" accessibilityLabel={period.label}>
                  {period.label}
                </Badge>
                <View style={styles.slotsGrid}>
                  {period.slots.map((slot) => {
                    const isSlotSelected = selectedSlot === slot.time;
                    return (
                      <TouchableOpacity
                        key={slot.time}
                        style={[
                          styles.slotChip,
                          isSlotSelected && styles.slotChipSelected,
                          !slot.available && styles.slotChipDisabled,
                        ]}
                        onPress={() => slot.available && handleSlotPress(slot.time)}
                        disabled={!slot.available}
                        accessibilityLabel={`${slot.time}${slot.available ? '' : ', indisponivel'}`}
                      >
                        <Text
                          fontSize="sm"
                          color={
                            isSlotSelected
                              ? colors.neutral.white
                              : slot.available
                                ? colors.gray[70]
                                : colors.gray[30]
                          }
                          textAlign="center"
                        >
                          {slot.time}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Continue button */}
        <View style={styles.bottomAction}>
          <Button
            journey="care"
            variant="primary"
            onPress={handleContinue}
            disabled={!selectedDay || !selectedSlot}
            accessibilityLabel="Continuar para agendamento"
          >
            {t('common.buttons.next')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  calendarNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  weekDayCell: {
    width: 44,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayCell: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  dayCellSelected: {
    backgroundColor: colors.journeys.care.primary,
  },
  dayCellUnavailable: {
    opacity: 0.4,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.semantic.success,
    position: 'absolute',
    bottom: 4,
  },
  slotsSection: {
    marginTop: 24,
  },
  periodSection: {
    marginTop: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  slotChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    minWidth: 72,
    alignItems: 'center',
  },
  slotChipSelected: {
    backgroundColor: colors.journeys.care.primary,
    borderColor: colors.journeys.care.primary,
  },
  slotChipDisabled: {
    backgroundColor: theme.colors.background.subtle,
    borderColor: theme.colors.border.default,
  },
  bottomAction: {
    marginTop: 32,
    paddingHorizontal: 8,
  },
});

export default DoctorAvailability;
