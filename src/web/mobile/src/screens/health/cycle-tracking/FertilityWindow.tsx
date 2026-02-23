import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Represents a single day in the fertility calendar strip.
 */
interface FertilityDay {
  date: number;
  label: string;
  isFertile: boolean;
  isOvulation: boolean;
  isToday: boolean;
}

/**
 * Generate a 14-day strip centered around ovulation for display.
 */
const generateFertilityDays = (): FertilityDay[] => {
  const today = new Date();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i - 2);
    const dayOfMonth = date.getDate();
    const isFertile = i >= 3 && i <= 8;
    const isOvulation = i === 6;
    const isToday = i === 2;

    return {
      date: dayOfMonth,
      label: dayLabels[date.getDay()],
      isFertile,
      isOvulation,
      isToday,
    };
  });
};

/**
 * Mock fertility data.
 */
const FERTILITY_DATA = {
  fertileStart: '2026-03-04',
  fertileEnd: '2026-03-09',
  ovulationDate: '2026-03-07',
  probabilityHigh: 85,
  probabilityModerate: 60,
  cycleDayOvulation: 14,
};

/**
 * FertilityWindow displays the predicted fertile window with calendar highlights,
 * ovulation marker, probability indicators, and educational content.
 */
export const FertilityWindow: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const fertilityDays = useMemo(() => generateFertilityDays(), []);

  const educationItems = [
    {
      titleKey: 'journeys.health.cycle.fertility.edu.windowTitle',
      descKey: 'journeys.health.cycle.fertility.edu.windowDesc',
    },
    {
      titleKey: 'journeys.health.cycle.fertility.edu.ovulationTitle',
      descKey: 'journeys.health.cycle.fertility.edu.ovulationDesc',
    },
    {
      titleKey: 'journeys.health.cycle.fertility.edu.signsTitle',
      descKey: 'journeys.health.cycle.fertility.edu.signsDesc',
    },
  ];

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
          {t('journeys.health.cycle.fertility.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Fertile Window Dates */}
        <Card journey="health" elevation="md" padding="md">
          <View
            style={styles.windowHeader}
            accessibilityLabel={`${t('journeys.health.cycle.fertility.windowLabel')}: ${FERTILITY_DATA.fertileStart} - ${FERTILITY_DATA.fertileEnd}`}
            accessibilityRole="summary"
          >
            <Text fontSize="lg" fontWeight="semiBold">
              {t('journeys.health.cycle.fertility.windowLabel')}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={colors.semantic.success}>
              {FERTILITY_DATA.fertileStart} - {FERTILITY_DATA.fertileEnd}
            </Text>
          </View>
          <View style={styles.divider} />
          <View
            style={styles.ovulationRow}
            accessibilityLabel={`${t('journeys.health.cycle.fertility.ovulationLabel')}: ${FERTILITY_DATA.ovulationDate}`}
            accessibilityRole="text"
          >
            <View style={[styles.ovulationDot, { backgroundColor: colors.semantic.info }]} />
            <Text fontSize="sm" color={colors.gray[50]}>
              {t('journeys.health.cycle.fertility.ovulationLabel')}
            </Text>
            <Text fontSize="sm" fontWeight="semiBold">
              {FERTILITY_DATA.ovulationDate}
            </Text>
          </View>
        </Card>

        {/* Calendar Strip */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.fertility.calendarView')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stripContainer}
          >
            {fertilityDays.map((day, idx) => {
              const getBgColor = () => {
                if (day.isOvulation) return colors.semantic.info;
                if (day.isFertile) return colors.semantic.success;
                return 'transparent';
              };
              const getTextColor = () => {
                if (day.isOvulation || day.isFertile) return colors.neutral.white;
                return colors.gray[60];
              };
              return (
                <View
                  key={`fd-${idx}`}
                  style={[
                    styles.stripDay,
                    { backgroundColor: getBgColor() },
                    day.isToday && styles.stripDayToday,
                  ]}
                  testID={`fertility-day-${idx}`}
                >
                  <Text fontSize="xs" color={getTextColor()}>
                    {day.label}
                  </Text>
                  <Text
                    fontSize="md"
                    fontWeight={day.isToday ? 'bold' : 'medium'}
                    color={getTextColor()}
                  >
                    {day.date}
                  </Text>
                  {day.isOvulation && (
                    <View style={styles.ovulationMarker} />
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.semantic.success }]} />
              <Text fontSize="xs" color={colors.gray[50]}>
                {t('journeys.health.cycle.fertility.fertile')}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.semantic.info }]} />
              <Text fontSize="xs" color={colors.gray[50]}>
                {t('journeys.health.cycle.fertility.ovulation')}
              </Text>
            </View>
          </View>
        </View>

        {/* Probability Indicator */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.fertility.probability')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <View style={styles.probabilityContainer}>
              <View style={styles.probabilityItem}>
                <Text fontSize="sm" color={colors.gray[50]}>
                  {t('journeys.health.cycle.fertility.highProbability')}
                </Text>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${FERTILITY_DATA.probabilityHigh}%`,
                        backgroundColor: colors.semantic.success,
                      },
                    ]}
                  />
                </View>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.success}>
                  {FERTILITY_DATA.probabilityHigh}%
                </Text>
              </View>
              <View style={styles.probabilityItem}>
                <Text fontSize="sm" color={colors.gray[50]}>
                  {t('journeys.health.cycle.fertility.moderateProbability')}
                </Text>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${FERTILITY_DATA.probabilityModerate}%`,
                        backgroundColor: colors.semantic.warning,
                      },
                    ]}
                  />
                </View>
                <Text fontSize="sm" fontWeight="semiBold" color={colors.semantic.warning}>
                  {FERTILITY_DATA.probabilityModerate}%
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Educational Content */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.fertility.learnMore')}
          </Text>
          {educationItems.map((item, idx) => (
            <Card key={`edu-${idx}`} journey="health" elevation="sm" padding="md">
              <Text fontSize="md" fontWeight="semiBold">
                {t(item.titleKey)}
              </Text>
              <Text fontSize="sm" color={colors.gray[50]}>
                {t(item.descKey)}
              </Text>
            </Card>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Card journey="health" elevation="sm" padding="md">
            <Text fontSize="xs" color={colors.gray[40]} textAlign="center">
              {t('journeys.health.cycle.fertility.disclaimer')}
            </Text>
          </Card>
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
  windowHeader: {
    gap: spacingValues['3xs'],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[10],
    marginVertical: spacingValues.sm,
  },
  ovulationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  ovulationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  stripContainer: {
    paddingVertical: spacingValues.xs,
    gap: spacingValues.xs,
  },
  stripDay: {
    width: 50,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: spacingValues['4xs'],
  },
  stripDayToday: {
    borderWidth: 2,
    borderColor: colors.journeys.health.primary,
  },
  ovulationMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral.white,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacingValues.xl,
    marginTop: spacingValues.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues['3xs'],
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  probabilityContainer: {
    gap: spacingValues.md,
  },
  probabilityItem: {
    gap: spacingValues['3xs'],
  },
  barBackground: {
    height: 8,
    backgroundColor: colors.gray[10],
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  disclaimerContainer: {
    marginTop: spacingValues['2xl'],
  },
});

export default FertilityWindow;
