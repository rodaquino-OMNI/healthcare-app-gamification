import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  StyleProp,
  ViewStyle,
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
 * Mood level for the emoji scale (1 = terrible, 5 = excellent).
 */
type MoodLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Emoji mood option configuration.
 */
interface MoodOption {
  level: MoodLevel;
  emoji: string;
  labelKey: string;
}

/**
 * Sleep factor that may affect quality.
 */
interface SleepFactor {
  id: string;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MOOD_OPTIONS: MoodOption[] = [
  { level: 1, emoji: '\u{1F629}', labelKey: 'journeys.health.sleep.quality.terrible' },
  { level: 2, emoji: '\u{1F641}', labelKey: 'journeys.health.sleep.quality.poor' },
  { level: 3, emoji: '\u{1F610}', labelKey: 'journeys.health.sleep.quality.okay' },
  { level: 4, emoji: '\u{1F642}', labelKey: 'journeys.health.sleep.quality.good' },
  { level: 5, emoji: '\u{1F60D}', labelKey: 'journeys.health.sleep.quality.excellent' },
];

const SLEEP_FACTORS: SleepFactor[] = [
  { id: 'noise', labelKey: 'journeys.health.sleep.quality.factors.noise', icon: 'volume-high-outline' },
  { id: 'temperature', labelKey: 'journeys.health.sleep.quality.factors.temperature', icon: 'thermometer-outline' },
  { id: 'caffeine', labelKey: 'journeys.health.sleep.quality.factors.caffeine', icon: 'cafe-outline' },
  { id: 'stress', labelKey: 'journeys.health.sleep.quality.factors.stress', icon: 'flash-outline' },
  { id: 'exercise', labelKey: 'journeys.health.sleep.quality.factors.exercise', icon: 'fitness-outline' },
  { id: 'screenTime', labelKey: 'journeys.health.sleep.quality.factors.screenTime', icon: 'phone-portrait-outline' },
];

/**
 * SleepQuality allows users to rate their sleep experience
 * using an emoji mood scale and a factors checklist.
 */
export const SleepQuality: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const theme = useTheme();

  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<Set<string>>(new Set());

  const handleMoodPress = useCallback((level: MoodLevel) => {
    setSelectedMood(level);
  }, []);

  const handleFactorToggle = useCallback((factorId: string) => {
    setSelectedFactors((prev) => {
      const next = new Set(prev);
      if (next.has(factorId)) {
        next.delete(factorId);
      } else {
        next.add(factorId);
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    Alert.alert(
      t('journeys.health.sleep.quality.savedTitle'),
      t('journeys.health.sleep.quality.savedMessage'),
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
          {t('journeys.health.sleep.quality.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emoji Mood Scale */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.quality.howDidYouSleep')}
          </Text>
          <View style={styles.moodRow}>
            {MOOD_OPTIONS.map((option) => {
              const isSelected = selectedMood === option.level;
              return (
                <Touchable
                  key={`mood-${option.level}`}
                  onPress={() => handleMoodPress(option.level)}
                  accessibilityLabel={t(option.labelKey)}
                  accessibilityRole="button"
                  testID={`sleep-quality-emoji-${option.level}`}
                  style={[
                    styles.moodOption,
                    isSelected && styles.moodOptionSelected,
                  ] as any}
                >
                  <Text fontSize="heading-2xl">{option.emoji}</Text>
                  <Text
                    fontSize="xs"
                    fontWeight={isSelected ? 'semiBold' : 'regular'}
                    color={
                      isSelected
                        ? colors.journeys.health.primary
                        : colors.gray[50]
                    }
                  >
                    {t(option.labelKey)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Sleep Factors Checklist */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.sleep.quality.factorsTitle')}
          </Text>
          <View style={styles.factorsGrid}>
            {SLEEP_FACTORS.map((factor) => {
              const isSelected = selectedFactors.has(factor.id);
              return (
                <Touchable
                  key={factor.id}
                  onPress={() => handleFactorToggle(factor.id)}
                  accessibilityLabel={t(factor.labelKey)}
                  accessibilityRole="button"
                  testID={`sleep-quality-factor-${factor.id}`}
                >
                  <Card
                    journey="health"
                    elevation="sm"
                    padding="md"
                  >
                    <View
                      style={[
                        styles.factorContent,
                        isSelected && styles.factorContentSelected,
                      ] as StyleProp<ViewStyle>}
                    >
                      <View
                        style={[
                          styles.factorIconCircle,
                          {
                            backgroundColor: isSelected
                              ? colors.journeys.health.primary
                              : colors.gray[10],
                          },
                        ]}
                      >
                        <Ionicons
                          name={factor.icon}
                          size={20}
                          color={
                            isSelected
                              ? colors.neutral.white
                              : colors.gray[50]
                          }
                        />
                      </View>
                      <Text
                        fontSize="sm"
                        fontWeight={isSelected ? 'semiBold' : 'regular'}
                        color={
                          isSelected
                            ? colors.journeys.health.primary
                            : colors.gray[60]
                        }
                      >
                        {t(factor.labelKey)}
                      </Text>
                    </View>
                  </Card>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleSave}
            accessibilityLabel={t('journeys.health.sleep.quality.save')}
            testID="sleep-quality-save-button"
          >
            {t('journeys.health.sleep.quality.save')}
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
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
    gap: spacingValues['4xs'],
    flex: 1,
    marginHorizontal: 2,
  },
  moodOptionSelected: {
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
  },
  factorsGrid: {
    gap: spacingValues.sm,
  },
  factorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.md,
  },
  factorContentSelected: {
    opacity: 1,
  },
  factorIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    marginTop: spacingValues['2xl'],
  },
});

export default SleepQuality;
