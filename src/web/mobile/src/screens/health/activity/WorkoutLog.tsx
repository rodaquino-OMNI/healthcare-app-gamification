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
import { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Supported workout types.
 */
type WorkoutType = 'run' | 'walk' | 'cycle' | 'gym' | 'swim';

/**
 * Intensity level for a workout.
 */
type IntensityLevel = 'light' | 'moderate' | 'intense';

/**
 * Workout type configuration with icon mapping.
 */
interface WorkoutTypeConfig {
  key: WorkoutType;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const WORKOUT_TYPES: WorkoutTypeConfig[] = [
  { key: 'run', labelKey: 'journeys.health.activity.workoutLog.typeRun', icon: 'walk-outline' },
  { key: 'walk', labelKey: 'journeys.health.activity.workoutLog.typeWalk', icon: 'footsteps-outline' },
  { key: 'cycle', labelKey: 'journeys.health.activity.workoutLog.typeCycle', icon: 'bicycle-outline' },
  { key: 'gym', labelKey: 'journeys.health.activity.workoutLog.typeGym', icon: 'barbell-outline' },
  { key: 'swim', labelKey: 'journeys.health.activity.workoutLog.typeSwim', icon: 'water-outline' },
];

const DURATION_OPTIONS = ['15 min', '30 min', '45 min', '60 min', '90 min'];

const INTENSITY_OPTIONS: { key: IntensityLevel; labelKey: string }[] = [
  { key: 'light', labelKey: 'journeys.health.activity.workoutLog.light' },
  { key: 'moderate', labelKey: 'journeys.health.activity.workoutLog.moderate' },
  { key: 'intense', labelKey: 'journeys.health.activity.workoutLog.intense' },
];

/**
 * WorkoutLog allows users to log a workout session with type,
 * duration, intensity, and optional notes.
 */
export const WorkoutLog: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [selectedType, setSelectedType] = useState<WorkoutType>('run');
  const [durationIndex, setDurationIndex] = useState(1);
  const [intensity, setIntensity] = useState<IntensityLevel>('moderate');
  const [notes, setNotes] = useState('');

  const handleTypePress = useCallback((type: WorkoutType) => {
    setSelectedType(type);
  }, []);

  const handleDurationPress = useCallback(() => {
    setDurationIndex((prev) => (prev + 1) % DURATION_OPTIONS.length);
  }, []);

  const handleIntensityPress = useCallback((level: IntensityLevel) => {
    setIntensity(level);
  }, []);

  const handleSave = useCallback(() => {
    Alert.alert(
      t('journeys.health.activity.workoutLog.savedTitle'),
      t('journeys.health.activity.workoutLog.savedMessage'),
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
          {t('journeys.health.activity.workoutLog.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Type Picker */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.activity.workoutLog.workoutType')}
          </Text>
          <View style={styles.typeGrid}>
            {WORKOUT_TYPES.map((wt) => {
              const isSelected = selectedType === wt.key;
              return (
                <Touchable
                  key={wt.key}
                  onPress={() => handleTypePress(wt.key)}
                  accessibilityLabel={t(wt.labelKey)}
                  accessibilityRole="button"
                  testID={`activity-workout-log-type-${wt.key}`}
                >
                  <Card journey="health" elevation="sm" padding="sm">
                    <View
                      style={[
                        styles.typeCard,
                        isSelected && styles.typeCardSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.typeIconCircle,
                          isSelected && styles.typeIconCircleSelected,
                        ]}
                      >
                        <Ionicons
                          name={wt.icon}
                          size={24}
                          color={
                            isSelected
                              ? colors.neutral.white
                              : colors.journeys.health.primary
                          }
                        />
                      </View>
                      <Text
                        fontSize="sm"
                        fontWeight={isSelected ? 'semiBold' : 'regular'}
                        color={
                          isSelected
                            ? colors.journeys.health.primary
                            : colors.gray[50]
                        }
                      >
                        {t(wt.labelKey)}
                      </Text>
                    </View>
                  </Card>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Duration Picker */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.activity.workoutLog.duration')}
          </Text>
          <Touchable
            onPress={handleDurationPress}
            accessibilityLabel={t('journeys.health.activity.workoutLog.duration')}
            accessibilityRole="button"
            testID="activity-workout-log-duration"
          >
            <Card journey="health" elevation="sm" padding="md">
              <View style={styles.durationRow}>
                <View style={styles.durationIconCircle}>
                  <Ionicons
                    name="timer-outline"
                    size={24}
                    color={colors.journeys.health.primary}
                  />
                </View>
                <View style={styles.durationContent}>
                  <Text fontSize="xs" color={colors.gray[50]}>
                    {t('journeys.health.activity.workoutLog.tapToChange')}
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color={colors.journeys.health.primary}>
                    {DURATION_OPTIONS[durationIndex]}
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

        {/* Intensity Picker */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.activity.workoutLog.intensity')}
          </Text>
          <View style={styles.intensityRow}>
            {INTENSITY_OPTIONS.map((opt) => {
              const isActive = intensity === opt.key;
              return (
                <Touchable
                  key={opt.key}
                  onPress={() => handleIntensityPress(opt.key)}
                  accessibilityLabel={t(opt.labelKey)}
                  accessibilityRole="button"
                  style={[
                    styles.intensityChip,
                    isActive && styles.intensityChipActive,
                  ]}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={isActive ? 'semiBold' : 'regular'}
                    color={
                      isActive
                        ? colors.neutral.white
                        : colors.gray[50]
                    }
                  >
                    {t(opt.labelKey)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.activity.workoutLog.notes')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={t('journeys.health.activity.workoutLog.notesPlaceholder')}
              placeholderTextColor={colors.gray[40]}
              multiline
              numberOfLines={4}
              style={styles.textInput}
              testID="activity-workout-log-notes"
              accessibilityLabel={t('journeys.health.activity.workoutLog.notes')}
            />
          </Card>
        </View>

        {/* Save Button */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleSave}
            accessibilityLabel={t('journeys.health.activity.workoutLog.save')}
            testID="activity-workout-log-save-button"
          >
            {t('journeys.health.activity.workoutLog.save')}
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.sm,
  },
  typeCard: {
    alignItems: 'center',
    gap: spacingValues.xs,
    minWidth: 80,
    paddingVertical: spacingValues.xs,
  },
  typeCardSelected: {
    borderBottomWidth: 2,
    borderBottomColor: colors.journeys.health.primary,
  },
  typeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconCircleSelected: {
    backgroundColor: colors.journeys.health.primary,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.md,
  },
  durationIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.journeys.health.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationContent: {
    flex: 1,
    gap: spacingValues['4xs'],
  },
  intensityRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  intensityChip: {
    flex: 1,
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
    alignItems: 'center',
  },
  intensityChipActive: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
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

export default WorkoutLog;
