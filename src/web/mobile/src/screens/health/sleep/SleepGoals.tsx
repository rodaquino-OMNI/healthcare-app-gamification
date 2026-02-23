import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
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
 * Duration options for target sleep.
 */
const DURATION_OPTIONS = ['6 hours', '6.5 hours', '7 hours', '7.5 hours', '8 hours', '8.5 hours', '9 hours'];

/**
 * Bedtime options for the mock picker.
 */
const BEDTIME_OPTIONS = ['9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'];

/**
 * Wake time options for the mock picker.
 */
const WAKE_OPTIONS = ['5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM'];

/**
 * SleepGoals allows users to configure their sleep targets
 * including bedtime, wake time, duration, and reminder notifications.
 */
export const SleepGoals: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [targetBedtime, setTargetBedtime] = useState('10:30 PM');
  const [targetWakeTime, setTargetWakeTime] = useState('6:30 AM');
  const [targetDuration, setTargetDuration] = useState('8 hours');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleBedtimePress = useCallback(() => {
    const currentIdx = BEDTIME_OPTIONS.indexOf(targetBedtime);
    const nextIdx = (currentIdx + 1) % BEDTIME_OPTIONS.length;
    setTargetBedtime(BEDTIME_OPTIONS[nextIdx]);
  }, [targetBedtime]);

  const handleWakeTimePress = useCallback(() => {
    const currentIdx = WAKE_OPTIONS.indexOf(targetWakeTime);
    const nextIdx = (currentIdx + 1) % WAKE_OPTIONS.length;
    setTargetWakeTime(WAKE_OPTIONS[nextIdx]);
  }, [targetWakeTime]);

  const handleDurationPress = useCallback(() => {
    const currentIdx = DURATION_OPTIONS.indexOf(targetDuration);
    const nextIdx = (currentIdx + 1) % DURATION_OPTIONS.length;
    setTargetDuration(DURATION_OPTIONS[nextIdx]);
  }, [targetDuration]);

  const handleNotificationsToggle = useCallback((value: boolean) => {
    setNotificationsEnabled(value);
  }, []);

  const handleSave = useCallback(() => {
    Alert.alert(
      t('journeys.health.sleep.goals.savedTitle'),
      t('journeys.health.sleep.goals.savedMessage'),
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
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.journeys.health.primary}
          />
        </Touchable>
        <Text variant="heading" journey="health">
          {t('journeys.health.sleep.goals.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Target Bedtime */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.goals.targetBedtime')}
          </Text>
          <Touchable
            onPress={handleBedtimePress}
            accessibilityLabel={t('journeys.health.sleep.goals.targetBedtime')}
            accessibilityRole="button"
            testID="sleep-goals-bedtime-input"
          >
            <Card journey="health" elevation="sm" padding="md">
              <View style={styles.goalRow}>
                <View style={styles.goalIconCircle}>
                  <Ionicons
                    name="moon-outline"
                    size={24}
                    color={colors.journeys.health.primary}
                  />
                </View>
                <View style={styles.goalContent}>
                  <Text fontSize="xs" color={colors.gray[50]}>
                    {t('journeys.health.sleep.goals.bedtime')}
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                    {targetBedtime}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.gray[40]}
                />
              </View>
            </Card>
          </Touchable>
        </View>

        {/* Target Wake Time */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.goals.targetWakeTime')}
          </Text>
          <Touchable
            onPress={handleWakeTimePress}
            accessibilityLabel={t('journeys.health.sleep.goals.targetWakeTime')}
            accessibilityRole="button"
            testID="sleep-goals-wake-input"
          >
            <Card journey="health" elevation="sm" padding="md">
              <View style={styles.goalRow}>
                <View style={styles.goalIconCircle}>
                  <Ionicons
                    name="alarm-outline"
                    size={24}
                    color={colors.journeys.health.primary}
                  />
                </View>
                <View style={styles.goalContent}>
                  <Text fontSize="xs" color={colors.gray[50]}>
                    {t('journeys.health.sleep.goals.wakeTime')}
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                    {targetWakeTime}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.gray[40]}
                />
              </View>
            </Card>
          </Touchable>
        </View>

        {/* Target Duration */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.goals.targetDuration')}
          </Text>
          <Touchable
            onPress={handleDurationPress}
            accessibilityLabel={t('journeys.health.sleep.goals.targetDuration')}
            accessibilityRole="button"
            testID="sleep-goals-duration-input"
          >
            <Card journey="health" elevation="sm" padding="md">
              <View style={styles.goalRow}>
                <View style={styles.goalIconCircle}>
                  <Ionicons
                    name="time-outline"
                    size={24}
                    color={colors.journeys.health.primary}
                  />
                </View>
                <View style={styles.goalContent}>
                  <Text fontSize="xs" color={colors.gray[50]}>
                    {t('journeys.health.sleep.goals.duration')}
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                    {targetDuration}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.gray[40]}
                />
              </View>
            </Card>
          </Touchable>
        </View>

        {/* Bedtime Reminders Toggle */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.goals.reminders')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.toggleRow}>
              <View style={styles.toggleContent}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.journeys.health.primary}
                />
                <Text fontSize="md" color={colors.gray[60]}>
                  {t('journeys.health.sleep.goals.bedtimeReminder')}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{
                  false: colors.gray[20],
                  true: colors.journeys.health.primary,
                }}
                thumbColor={colors.neutral.white}
                testID="sleep-goals-notifications-toggle"
                accessibilityLabel={t('journeys.health.sleep.goals.bedtimeReminder')}
              />
            </View>
          </Card>
        </View>

        {/* Save Button */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleSave}
            accessibilityLabel={t('journeys.health.sleep.goals.save')}
            testID="sleep-goals-save-button"
          >
            {t('journeys.health.sleep.goals.save')}
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
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.md,
  },
  goalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalContent: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
    flex: 1,
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
  },
});

export default SleepGoals;
