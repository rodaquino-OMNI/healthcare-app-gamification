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
 * Mood type options.
 */
type MoodType = 'happy' | 'calm' | 'anxious' | 'irritable' | 'sad' | 'energetic';

/**
 * Energy level options.
 */
type EnergyLevel = 'low' | 'medium' | 'high';

/**
 * Physical symptom identifiers.
 */
type PhysicalSymptom = 'cramps' | 'bloating' | 'headache' | 'breastTenderness' | 'fatigue';

interface SymptomOption {
  id: PhysicalSymptom;
  labelKey: string;
}

interface MoodOption {
  id: MoodType;
  labelKey: string;
  emoji: string;
}

const PHYSICAL_SYMPTOMS: SymptomOption[] = [
  { id: 'cramps', labelKey: 'journeys.health.cycle.symptoms.cramps' },
  { id: 'bloating', labelKey: 'journeys.health.cycle.symptoms.bloating' },
  { id: 'headache', labelKey: 'journeys.health.cycle.symptoms.headache' },
  { id: 'breastTenderness', labelKey: 'journeys.health.cycle.symptoms.breastTenderness' },
  { id: 'fatigue', labelKey: 'journeys.health.cycle.symptoms.fatigue' },
];

const MOOD_OPTIONS: MoodOption[] = [
  { id: 'happy', labelKey: 'journeys.health.cycle.moods.happy', emoji: '\u{1F60A}' },
  { id: 'calm', labelKey: 'journeys.health.cycle.moods.calm', emoji: '\u{1F60C}' },
  { id: 'anxious', labelKey: 'journeys.health.cycle.moods.anxious', emoji: '\u{1F630}' },
  { id: 'irritable', labelKey: 'journeys.health.cycle.moods.irritable', emoji: '\u{1F624}' },
  { id: 'sad', labelKey: 'journeys.health.cycle.moods.sad', emoji: '\u{1F622}' },
  { id: 'energetic', labelKey: 'journeys.health.cycle.moods.energetic', emoji: '\u{26A1}' },
];

const ENERGY_LEVELS: { id: EnergyLevel; labelKey: string }[] = [
  { id: 'low', labelKey: 'journeys.health.cycle.energy.low' },
  { id: 'medium', labelKey: 'journeys.health.cycle.energy.medium' },
  { id: 'high', labelKey: 'journeys.health.cycle.energy.high' },
];

/**
 * LogSymptoms allows users to track physical symptoms, mood, and energy level
 * for any date (defaults to today).
 */
export const LogSymptoms: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<PhysicalSymptom>>(new Set());
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const todayFormatted = new Date().toISOString().split('T')[0];
  const [selectedDate] = useState(todayFormatted);

  const toggleSymptom = useCallback((symptom: PhysicalSymptom) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(symptom)) {
        next.delete(symptom);
      } else {
        next.add(symptom);
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    Alert.alert(
      t('journeys.health.cycle.logSymptoms.savedTitle'),
      t('journeys.health.cycle.logSymptoms.savedMessage'),
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
          {t('journeys.health.cycle.logSymptoms.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Display */}
        <Card journey="health" elevation="sm" padding="md">
          <View style={styles.dateRow}>
            <Text fontSize="sm" color={colors.gray[50]}>
              {t('journeys.health.cycle.logSymptoms.date')}
            </Text>
            <Text fontSize="md" fontWeight="semiBold">
              {selectedDate}
            </Text>
          </View>
        </Card>

        {/* Physical Symptoms */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.logSymptoms.physical')}
          </Text>
          <View style={styles.chipGrid}>
            {PHYSICAL_SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.has(symptom.id);
              return (
                <Touchable
                  key={symptom.id}
                  onPress={() => toggleSymptom(symptom.id)}
                  accessibilityLabel={t(symptom.labelKey)}
                  accessibilityRole="button"
                  testID={`symptom-${symptom.id}`}
                  style={[
                    styles.chip,
                    isSelected && styles.chipSelected,
                  ]}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={isSelected ? 'semiBold' : 'regular'}
                    color={isSelected ? colors.neutral.white : colors.gray[60]}
                  >
                    {t(symptom.labelKey)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Mood Selector */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.logSymptoms.mood')}
          </Text>
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <Touchable
                  key={mood.id}
                  onPress={() => setSelectedMood(mood.id)}
                  accessibilityLabel={t(mood.labelKey)}
                  accessibilityRole="button"
                  testID={`mood-${mood.id}`}
                  style={[
                    styles.moodOption,
                    isSelected && styles.moodOptionSelected,
                  ]}
                >
                  <Text fontSize="heading-2xl">{mood.emoji}</Text>
                  <Text
                    fontSize="xs"
                    fontWeight={isSelected ? 'semiBold' : 'regular'}
                    color={isSelected ? colors.journeys.health.primary : colors.gray[50]}
                  >
                    {t(mood.labelKey)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Energy Level */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.logSymptoms.energyLevel')}
          </Text>
          <View style={styles.energyRow}>
            {ENERGY_LEVELS.map((level) => {
              const isSelected = energyLevel === level.id;
              return (
                <Touchable
                  key={level.id}
                  onPress={() => setEnergyLevel(level.id)}
                  accessibilityLabel={t(level.labelKey)}
                  accessibilityRole="button"
                  testID={`energy-${level.id}`}
                  style={[
                    styles.energyOption,
                    isSelected && styles.energyOptionSelected,
                  ]}
                >
                  <Text
                    fontSize="md"
                    fontWeight={isSelected ? 'semiBold' : 'regular'}
                    color={isSelected ? colors.neutral.white : colors.gray[60]}
                    textAlign="center"
                  >
                    {t(level.labelKey)}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.sectionContainer}>
          <Text fontSize="lg" fontWeight="semiBold" journey="health">
            {t('journeys.health.cycle.logSymptoms.additionalNotes')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <TextInput
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              placeholder={t('journeys.health.cycle.logSymptoms.notesPlaceholder')}
              placeholderTextColor={colors.gray[40]}
              multiline
              numberOfLines={4}
              style={styles.textInput}
              testID="notes-input"
              accessibilityLabel={t('journeys.health.cycle.logSymptoms.additionalNotes')}
            />
          </Card>
        </View>

        {/* Save Button */}
        <View style={styles.actionsContainer}>
          <Button
            journey="health"
            onPress={handleSave}
            accessibilityLabel={t('journeys.health.cycle.logSymptoms.save')}
            testID="save-button"
          >
            {t('journeys.health.cycle.logSymptoms.save')}
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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  chip: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
  },
  chipSelected: {
    backgroundColor: colors.journeys.health.primary,
    borderColor: colors.journeys.health.primary,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.sm,
  },
  moodOption: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[20],
    backgroundColor: colors.gray[0],
    gap: spacingValues['3xs'],
  },
  moodOptionSelected: {
    borderColor: colors.journeys.health.primary,
    backgroundColor: colors.journeys.health.background,
  },
  energyRow: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[20],
    overflow: 'hidden',
  },
  energyOption: {
    flex: 1,
    paddingVertical: spacingValues.sm,
    backgroundColor: colors.gray[0],
    alignItems: 'center',
  },
  energyOptionSelected: {
    backgroundColor: colors.journeys.health.primary,
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

export default LogSymptoms;
