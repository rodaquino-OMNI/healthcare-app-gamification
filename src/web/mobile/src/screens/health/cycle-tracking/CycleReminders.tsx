import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
  StyleProp,
  ViewStyle,
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
 * Reminder type identifier.
 */
type ReminderType = 'period_start' | 'fertile_window' | 'ovulation' | 'pms';

/**
 * Individual reminder configuration.
 */
interface ReminderConfig {
  type: ReminderType;
  enabled: boolean;
  daysBefore: number;
}

const DAYS_BEFORE_OPTIONS = [1, 2, 3];

const DEFAULT_NOTIFICATION_TIME = '09:00';

const INITIAL_REMINDERS: ReminderConfig[] = [
  { type: 'period_start', enabled: true, daysBefore: 2 },
  { type: 'fertile_window', enabled: true, daysBefore: 1 },
  { type: 'ovulation', enabled: false, daysBefore: 1 },
  { type: 'pms', enabled: true, daysBefore: 3 },
];

/**
 * CycleReminders allows users to configure period prediction notifications
 * with toggle switches and days-before selectors for each reminder type.
 */
export const CycleReminders: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [reminders, setReminders] = useState<ReminderConfig[]>(INITIAL_REMINDERS);
  const [notificationTime, setNotificationTime] = useState(DEFAULT_NOTIFICATION_TIME);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggle = useCallback((type: ReminderType) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.type === type ? { ...r, enabled: !r.enabled } : r,
      ),
    );
  }, []);

  const handleDaysBefore = useCallback((type: ReminderType, days: number) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.type === type ? { ...r, daysBefore: days } : r,
      ),
    );
  }, []);

  const handleTimePress = useCallback(() => {
    Alert.alert(
      t('journeys.health.cycle.reminders.timePicker'),
      t('journeys.health.cycle.reminders.timePickerMessage'),
    );
  }, [t]);

  const handleTestNotification = useCallback(() => {
    Alert.alert(
      t('journeys.health.cycle.reminders.testTitle'),
      t('journeys.health.cycle.reminders.testMessage'),
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
          {t('journeys.health.cycle.reminders.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="reminders-scroll"
      >
        {/* Reminder Settings */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.reminders.notifications')}
          </Text>

          {reminders.map((reminder) => (
            <Card
              key={reminder.type}
              journey="health"
              elevation="sm"
              padding="md"
            >
              {/* Toggle Row */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabel}>
                  <Text fontSize="md" fontWeight="medium">
                    {t(`journeys.health.cycle.reminders.types.${reminder.type}`)}
                  </Text>
                  <Text fontSize="sm" color={colors.gray[50]}>
                    {t(`journeys.health.cycle.reminders.descriptions.${reminder.type}`)}
                  </Text>
                </View>
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => handleToggle(reminder.type)}
                  trackColor={{
                    false: colors.gray[20],
                    true: colors.journeys.health.primary,
                  }}
                  thumbColor={colors.gray[0]}
                  accessibilityLabel={t(`journeys.health.cycle.reminders.types.${reminder.type}`)}
                  testID={`toggle-${reminder.type}`}
                />
              </View>

              {/* Days Before Selector */}
              {reminder.enabled && (
                <View style={styles.daysContainer}>
                  <Text fontSize="sm" color={colors.gray[50]}>
                    {t('journeys.health.cycle.reminders.daysBefore')}
                  </Text>
                  <View style={styles.daysOptions}>
                    {DAYS_BEFORE_OPTIONS.map((days) => (
                      <Touchable
                        key={`${reminder.type}-${days}`}
                        onPress={() => handleDaysBefore(reminder.type, days)}
                        accessibilityLabel={t('journeys.health.cycle.reminders.daysOption', { count: days })}
                        accessibilityRole="button"
                        testID={`days-${reminder.type}-${days}`}
                        style={[
                          styles.dayChip,
                          reminder.daysBefore === days && styles.dayChipActive,
                        ] as any}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight={reminder.daysBefore === days ? 'semiBold' : 'regular'}
                          color={
                            reminder.daysBefore === days
                              ? colors.gray[0]
                              : colors.gray[50]
                          }
                        >
                          {days}
                        </Text>
                      </Touchable>
                    ))}
                  </View>
                </View>
              )}
            </Card>
          ))}
        </View>

        {/* Notification Time */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.reminders.notificationTime')}
          </Text>
          <Touchable
            onPress={handleTimePress}
            accessibilityLabel={t('journeys.health.cycle.reminders.selectTime')}
            accessibilityRole="button"
            testID="notification-time-picker"
          >
            <Card journey="health" elevation="sm" padding="md">
              <View style={styles.timeRow}>
                <Text fontSize="md" color={colors.gray[50]}>
                  {t('journeys.health.cycle.reminders.time')}
                </Text>
                <Text fontSize="md" fontWeight="semiBold" color={colors.journeys.health.primary}>
                  {notificationTime}
                </Text>
              </View>
            </Card>
          </Touchable>
        </View>

        {/* Test Notification */}
        <View style={styles.actionsContainer}>
          <Button
            variant="secondary"
            journey="health"
            onPress={handleTestNotification}
            accessibilityLabel={t('journeys.health.cycle.reminders.testButton')}
            testID="test-notification-button"
          >
            {t('journeys.health.cycle.reminders.testButton')}
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    flex: 1,
    marginRight: spacingValues.sm,
    gap: spacingValues['4xs'],
  },
  daysContainer: {
    marginTop: spacingValues.sm,
    paddingTop: spacingValues.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daysOptions: {
    flexDirection: 'row',
    gap: spacingValues.xs,
  },
  dayChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
  },
  dayChipActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
    marginBottom: spacingValues.xl,
  },
});

export default CycleReminders;
