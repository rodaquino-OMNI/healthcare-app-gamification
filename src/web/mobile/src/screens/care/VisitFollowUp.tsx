import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '../../../../constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Route parameters expected by VisitFollowUp.
 */
type VisitFollowUpRouteParams = {
  appointmentId: string;
  doctorName: string;
};

/**
 * Suggested date option for follow-up scheduling.
 */
interface SuggestedDate {
  id: string;
  label: string;
  dateStr: string;
  weeksOut: number;
}

/**
 * Time slot option.
 */
interface TimeSlot {
  id: string;
  label: string;
  period: 'morning' | 'afternoon' | 'evening';
}

/** Mock suggested dates (3 options). */
const SUGGESTED_DATES: SuggestedDate[] = [
  {
    id: 'date-1',
    label: '23/03/2026',
    dateStr: '2026-03-23',
    weeksOut: 4,
  },
  {
    id: 'date-2',
    label: '30/03/2026',
    dateStr: '2026-03-30',
    weeksOut: 5,
  },
  {
    id: 'date-3',
    label: '06/04/2026',
    dateStr: '2026-04-06',
    weeksOut: 6,
  },
];

/** Available time slots. */
const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-morning', label: '08:00 - 12:00', period: 'morning' },
  { id: 'slot-afternoon', label: '13:00 - 17:00', period: 'afternoon' },
  { id: 'slot-evening', label: '18:00 - 20:00', period: 'evening' },
];

/**
 * VisitFollowUp screen allows the patient to schedule a follow-up appointment
 * based on the doctor's recommendation. Shows suggested dates and time slots.
 *
 * Part of the Care Now journey (orange theme).
 */
const VisitFollowUp: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: VisitFollowUpRouteParams }, 'params'>>();
  const { t } = useTranslation();

  const { appointmentId = 'apt-001', doctorName = 'Dr. Carlos Mendes' } =
    route.params || {};

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleBookFollowUp = useCallback(() => {
    navigation.navigate(ROUTES.CARE_BOOKING_CONFIRMATION, {
      appointmentId: `${appointmentId}-followup`,
      doctorName,
      date: selectedDate,
      time: selectedSlot,
      type: 'presencial',
    });
  }, [navigation, appointmentId, doctorName, selectedDate, selectedSlot]);

  const handleRemindLater = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSkip = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const canBook = selectedDate !== null && selectedSlot !== null;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text variant="heading" journey="care" testID="follow-up-title">
          {t('journeys.care.visit.followUp.title')}
        </Text>

        {/* Doctor recommendation card */}
        <Card journey="care" elevation="md">
          <View style={styles.recommendationIcon}>
            <View style={styles.iconCircle}>
              <Text fontSize="heading-md" color={colors.neutral.white} textAlign="center">
                {'!'}
              </Text>
            </View>
          </View>
          <Text
            variant="body"
            fontWeight="semiBold"
            journey="care"
            textAlign="center"
            testID="recommendation-text"
          >
            {t('journeys.care.visit.followUp.recommendation', {
              doctorName,
              weeks: 4,
            })}
          </Text>
          <Text
            variant="body"
            color={colors.neutral.gray600}
            textAlign="center"
            testID="recommendation-detail"
          >
            {t('journeys.care.visit.followUp.recommendationDetail')}
          </Text>
        </Card>

        {/* Recommended date display */}
        <View style={styles.section}>
          <Text
            variant="heading"
            fontSize="heading-md"
            journey="care"
            testID="recommended-date-label"
          >
            {t('journeys.care.visit.followUp.recommendedDate')}
          </Text>
          <View style={styles.recommendedDateRow}>
            <Badge journey="care" size="md" testID="recommended-date-badge">
              {SUGGESTED_DATES[0].label}
            </Badge>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.visit.followUp.weeksOut', {
                weeks: SUGGESTED_DATES[0].weeksOut,
              })}
            </Text>
          </View>
        </View>

        {/* Date selection */}
        <View style={styles.section}>
          <Text variant="heading" fontSize="heading-md" journey="care" testID="select-date-label">
            {t('journeys.care.visit.followUp.selectDate')}
          </Text>
          <View style={styles.dateGrid}>
            {SUGGESTED_DATES.map((dateOption) => {
              const isSelected = selectedDate === dateOption.dateStr;
              return (
                <TouchableOpacity
                  key={dateOption.id}
                  onPress={() => setSelectedDate(dateOption.dateStr)}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}
                  testID={`date-option-${dateOption.id}`}
                  accessibilityLabel={t('journeys.care.visit.followUp.dateAccessibility', {
                    date: dateOption.label,
                    weeks: dateOption.weeksOut,
                  })}
                  accessibilityRole="button"
                >
                  <Text
                    fontWeight={isSelected ? 'bold' : 'medium'}
                    fontSize="text-md"
                    color={isSelected ? colors.neutral.white : colors.journeys.care.text}
                  >
                    {dateOption.label}
                  </Text>
                  <Text
                    fontSize="text-sm"
                    color={isSelected ? colors.neutral.white : colors.neutral.gray600}
                  >
                    {t('journeys.care.visit.followUp.weeksOut', {
                      weeks: dateOption.weeksOut,
                    })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time slot selection */}
        <View style={styles.section}>
          <Text variant="heading" fontSize="heading-md" journey="care" testID="select-time-label">
            {t('journeys.care.visit.followUp.selectTime')}
          </Text>
          <View style={styles.slotsContainer}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => setSelectedSlot(slot.id)}
                  style={[
                    styles.slotCard,
                    isSelected && styles.slotCardSelected,
                  ]}
                  testID={`time-slot-${slot.id}`}
                  accessibilityLabel={t('journeys.care.visit.followUp.slotAccessibility', {
                    period: t(`journeys.care.visit.followUp.period.${slot.period}`),
                    time: slot.label,
                  })}
                  accessibilityRole="radio"
                >
                  <Text
                    fontWeight={isSelected ? 'bold' : 'medium'}
                    fontSize="text-sm"
                    color={isSelected ? colors.neutral.white : colors.journeys.care.text}
                  >
                    {t(`journeys.care.visit.followUp.period.${slot.period}`)}
                  </Text>
                  <Text
                    fontSize="text-sm"
                    color={isSelected ? colors.neutral.white : colors.neutral.gray600}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsSection}>
          <Button
            onPress={handleBookFollowUp}
            journey="care"
            accessibilityLabel={t('journeys.care.visit.followUp.bookFollowUp')}
            testID="book-follow-up-button"
            disabled={!canBook}
          >
            {t('journeys.care.visit.followUp.bookFollowUp')}
          </Button>

          <Button
            variant="secondary"
            onPress={handleRemindLater}
            journey="care"
            accessibilityLabel={t('journeys.care.visit.followUp.remindLater')}
            testID="remind-later-button"
          >
            {t('journeys.care.visit.followUp.remindLater')}
          </Button>

          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            testID="skip-button"
            accessibilityLabel={t('journeys.care.visit.followUp.skip')}
            accessibilityRole="button"
          >
            <Text
              fontSize="text-sm"
              fontWeight="medium"
              color={colors.neutral.gray600}
            >
              {t('journeys.care.visit.followUp.skip')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  recommendationIcon: {
    alignItems: 'center',
    marginBottom: spacingValues.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.journeys.care.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  recommendedDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  dateGrid: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  dateCard: {
    flex: 1,
    padding: spacingValues.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    alignItems: 'center',
    gap: spacingValues['3xs'],
  },
  dateCardSelected: {
    borderColor: colors.journeys.care.primary,
    backgroundColor: colors.journeys.care.primary,
  },
  slotsContainer: {
    gap: spacingValues.sm,
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacingValues.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
  },
  slotCardSelected: {
    borderColor: colors.journeys.care.primary,
    backgroundColor: colors.journeys.care.primary,
  },
  actionsSection: {
    marginTop: spacingValues['2xl'],
    gap: spacingValues.sm,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
  },
});

export { VisitFollowUp };
export default VisitFollowUp;
