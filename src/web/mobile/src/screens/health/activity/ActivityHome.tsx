import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
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
 * Day label used in the weekly bar chart.
 */
type DayLabel = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

/**
 * A single day entry for the weekly step chart.
 */
interface WeekDay {
  id: string;
  label: DayLabel;
  steps: number;
  isToday: boolean;
}

/**
 * Quick stat card data.
 */
interface QuickStat {
  id: string;
  labelKey: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Get color for step count relative to goal.
 */
const getStepColor = (steps: number, goal: number): string => {
  const ratio = steps / goal;
  if (ratio >= 1.0) return colors.semantic.success;
  if (ratio >= 0.75) return colors.journeys.health.primary;
  if (ratio >= 0.5) return colors.semantic.warning;
  return colors.semantic.error;
};

/**
 * Generate the last 7 days of mock activity data.
 */
const generateWeekData = (): WeekDay[] => {
  const today = new Date();
  const dayLabels: DayLabel[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mockSteps = [6200, 8400, 5100, 10200, 7800, 9600, 8750];

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      id: `day-${i}`,
      label: dayLabels[d.getDay()],
      steps: mockSteps[i],
      isToday: i === 6,
    };
  });
};

const TODAY_STEPS = 8750;
const STEP_GOAL = 10000;
const MAX_BAR_HEIGHT = 80;
const MAX_STEPS_CHART = 12000;

/**
 * ActivityHome displays a dashboard with a daily step ring,
 * quick stats, a weekly bar chart, and action buttons.
 */
export const ActivityHome: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();
  const weekData = useMemo(() => generateWeekData(), []);
  const [selectedDay, setSelectedDay] = useState(6);

  const currentSteps = weekData[selectedDay].steps;
  const stepPercentage = Math.min((currentSteps / STEP_GOAL) * 100, 100);

  const quickStats: QuickStat[] = useMemo(
    () => [
      {
        id: 'calories',
        labelKey: 'journeys.health.activity.home.calories',
        value: `${Math.round(currentSteps * 0.04)}`,
        icon: 'flame-outline' as keyof typeof Ionicons.glyphMap,
      },
      {
        id: 'minutes',
        labelKey: 'journeys.health.activity.home.activeMinutes',
        value: `${Math.round(currentSteps / 100)}`,
        icon: 'timer-outline' as keyof typeof Ionicons.glyphMap,
      },
      {
        id: 'distance',
        labelKey: 'journeys.health.activity.home.distance',
        value: `${(currentSteps * 0.0008).toFixed(1)} km`,
        icon: 'walk-outline' as keyof typeof Ionicons.glyphMap,
      },
    ],
    [currentSteps],
  );

  const handleLogPress = useCallback(() => {
    navigation.navigate('HealthActivityWorkoutLog');
  }, [navigation]);

  const handleTrendsPress = useCallback(() => {
    navigation.navigate('HealthActivityTrends');
  }, [navigation]);

  const handleDayPress = useCallback((index: number) => {
    setSelectedDay(index);
  }, []);

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
          {t('journeys.health.activity.home.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Step Ring */}
        <Card journey="health" elevation="md" padding="md">
          <View style={styles.stepRingContainer} testID="activity-home-step-ring">
            <View
              style={[
                styles.stepRingOuter,
                { borderColor: getStepColor(currentSteps, STEP_GOAL) },
              ]}
            >
              <View style={styles.stepRingInner}>
                <Ionicons
                  name="footsteps-outline"
                  size={20}
                  color={colors.journeys.health.primary}
                />
                <Text
                  fontSize="heading-2xl"
                  fontWeight="bold"
                  color={getStepColor(currentSteps, STEP_GOAL)}
                >
                  {currentSteps.toLocaleString()}
                </Text>
                <Text fontSize="xs" color={colors.gray[50]}>
                  {t('journeys.health.activity.home.ofGoal', { goal: STEP_GOAL.toLocaleString() })}
                </Text>
              </View>
            </View>
            <View style={styles.percentageRow}>
              <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.primary}>
                {Math.round(stepPercentage)}%
              </Text>
              <Text fontSize="xs" color={colors.gray[50]}>
                {t('journeys.health.activity.home.completed')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.activity.home.todaySummary')}
          </Text>
          <View style={styles.statsRow}>
            {quickStats.map((stat) => (
              <Card key={stat.id} journey="health" elevation="sm" padding="md">
                <View style={styles.statItem}>
                  <Ionicons
                    name={stat.icon}
                    size={20}
                    color={colors.journeys.health.primary}
                  />
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.journeys.health.primary}
                  >
                    {stat.value}
                  </Text>
                  <Text fontSize="xs" color={colors.gray[50]}>
                    {t(stat.labelKey)}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Weekly Mini Chart */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.activity.home.weeklyOverview')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.chartContainer}>
              {weekData.map((day, idx) => {
                const barHeight = (day.steps / MAX_STEPS_CHART) * MAX_BAR_HEIGHT;
                const isSelected = idx === selectedDay;
                return (
                  <Touchable
                    key={day.id}
                    onPress={() => handleDayPress(idx)}
                    accessibilityLabel={`${day.label} ${day.steps} ${t('journeys.health.activity.home.steps')}`}
                    accessibilityRole="button"
                    style={styles.chartBarWrapper}
                  >
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: barHeight,
                          backgroundColor: isSelected
                            ? colors.journeys.health.primary
                            : colors.journeys.health.secondary,
                        },
                      ]}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight={day.isToday ? 'bold' : 'regular'}
                      color={isSelected ? colors.journeys.health.primary : colors.gray[50]}
                    >
                      {day.label.charAt(0)}
                    </Text>
                  </Touchable>
                );
              })}
            </View>
            <View style={styles.chartLegend}>
              <Text fontSize="xs" color={colors.gray[40]}>
                {t('journeys.health.activity.home.stepsPerDay')}
              </Text>
            </View>
          </Card>
        </View>

        {/* Goal Line Indicator */}
        <Card journey="health" elevation="sm" padding="md">
          <View style={styles.goalIndicatorRow}>
            <Ionicons name="flag-outline" size={20} color={colors.journeys.health.primary} />
            <Text fontSize="sm" color={colors.gray[50]}>
              {t('journeys.health.activity.home.dailyGoal')}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>
              {STEP_GOAL.toLocaleString()}
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
              {t('journeys.health.activity.home.steps')}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleLogPress}
            accessibilityLabel={t('journeys.health.activity.home.logWorkout')}
            testID="activity-home-log-button"
          >
            {t('journeys.health.activity.home.logWorkout')}
          </Button>
          <View style={styles.buttonSpacer} />
          <Button
            variant="secondary"
            journey="health"
            onPress={handleTrendsPress}
            accessibilityLabel={t('journeys.health.activity.home.viewTrends')}
            testID="activity-home-trends-button"
          >
            {t('journeys.health.activity.home.viewTrends')}
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
  stepRingContainer: {
    alignItems: 'center',
    paddingVertical: spacingValues.md,
  },
  stepRingOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepRingInner: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
    marginTop: spacingValues.sm,
  },
  sectionContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
  },
  statItem: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
    flex: 1,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: MAX_BAR_HEIGHT + 20,
    paddingTop: spacingValues.xs,
  },
  chartBarWrapper: {
    alignItems: 'center',
    gap: spacingValues['4xs'],
    flex: 1,
  },
  chartBar: {
    width: 20,
    borderRadius: 4,
  },
  chartLegend: {
    alignItems: 'center',
    marginTop: spacingValues.xs,
  },
  goalIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingValues.sm,
    marginTop: spacingValues.md,
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
  },
  buttonSpacer: {
    height: spacingValues.sm,
  },
});

export default ActivityHome;
