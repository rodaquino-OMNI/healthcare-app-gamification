import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

/**
 * Represents a mood level option.
 */
interface MoodOption {
  value: number;
  emoji: string;
  labelKey: string;
}

/**
 * Represents a recent mood entry for the history preview.
 */
interface MoodEntry {
  id: string;
  value: number;
  emoji: string;
  date: string;
  note: string;
}

/**
 * Mock mood options for the 5-point scale.
 */
const MOOD_OPTIONS: MoodOption[] = [
  { value: 1, emoji: '\u{1F622}', labelKey: 'journeys.health.wellness.moodCheckIn.verySad' },
  { value: 2, emoji: '\u{1F641}', labelKey: 'journeys.health.wellness.moodCheckIn.sad' },
  { value: 3, emoji: '\u{1F610}', labelKey: 'journeys.health.wellness.moodCheckIn.neutral' },
  { value: 4, emoji: '\u{1F642}', labelKey: 'journeys.health.wellness.moodCheckIn.happy' },
  { value: 5, emoji: '\u{1F604}', labelKey: 'journeys.health.wellness.moodCheckIn.veryHappy' },
];

/**
 * Mock mood history data for development.
 */
const MOCK_MOOD_HISTORY: MoodEntry[] = [
  { id: 'mh-001', value: 4, emoji: '\u{1F642}', date: '2024-01-14', note: 'journeys.health.wellness.moodCheckIn.historyNote1' },
  { id: 'mh-002', value: 3, emoji: '\u{1F610}', date: '2024-01-13', note: 'journeys.health.wellness.moodCheckIn.historyNote2' },
  { id: 'mh-003', value: 5, emoji: '\u{1F604}', date: '2024-01-12', note: 'journeys.health.wellness.moodCheckIn.historyNote3' },
  { id: 'mh-004', value: 2, emoji: '\u{1F641}', date: '2024-01-11', note: 'journeys.health.wellness.moodCheckIn.historyNote4' },
  { id: 'mh-005', value: 4, emoji: '\u{1F642}', date: '2024-01-10', note: 'journeys.health.wellness.moodCheckIn.historyNote5' },
];

/**
 * CompanionMoodCheckInScreen allows users to log their current mood
 * on a 5-point emoji scale with an optional note.
 */
export const CompanionMoodCheckInScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const handleMoodSelect = useCallback((value: number) => {
    setSelectedMood(value);
  }, []);

  const handleSave = useCallback(() => {
    if (selectedMood === null) return;
    navigation.navigate(ROUTES.WELLNESS_INSIGHTS as 'WellnessInsights');
  }, [selectedMood, navigation]);

  const getMoodColor = (value: number): string => {
    switch (value) {
      case 1: return colors.semantic.error;
      case 2: return colors.journeys.care.primary;
      case 3: return colors.semantic.warning;
      case 4: return colors.semantic.success;
      case 5: return colors.journeys.health.primary;
      default: return theme.colors.text.muted;
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="wellness-mood-check-in-screen">
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {t('journeys.health.wellness.moodCheckIn.screenTitle')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Prompt */}
        <Text style={styles.prompt}>
          {t('journeys.health.wellness.moodCheckIn.prompt')}
        </Text>

        {/* Mood Scale */}
        <View style={styles.moodScale}>
          {MOOD_OPTIONS.map((option) => {
            const isSelected = selectedMood === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.moodOption,
                  isSelected && [styles.moodOptionSelected, { borderColor: getMoodColor(option.value) }],
                ]}
                onPress={() => handleMoodSelect(option.value)}
                accessibilityLabel={t(option.labelKey)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                testID={`mood-option-${option.value}`}
              >
                <Text style={[styles.moodEmoji, isSelected && styles.moodEmojiSelected]}>
                  {option.emoji}
                </Text>
                <Text
                  style={[
                    styles.moodLabel,
                    isSelected && { color: getMoodColor(option.value), fontWeight: '600' },
                  ]}
                >
                  {t(option.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected feedback */}
        {selectedMood !== null && (
          <View style={[styles.feedbackCard, { borderLeftColor: getMoodColor(selectedMood) }]}>
            <Text style={styles.feedbackText}>
              {t('journeys.health.wellness.moodCheckIn.feedbackPrefix')}{' '}
              {t(MOOD_OPTIONS[selectedMood - 1].labelKey)}
            </Text>
          </View>
        )}

        {/* Note Input */}
        <Text style={styles.noteLabel}>
          {t('journeys.health.wellness.moodCheckIn.noteLabel')}
        </Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder={t('journeys.health.wellness.moodCheckIn.notePlaceholder')}
          placeholderTextColor={theme.colors.text.muted}
          multiline
          maxLength={300}
          testID="mood-note-input"
          accessibilityLabel={t('journeys.health.wellness.moodCheckIn.noteLabel')}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, selectedMood === null && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={selectedMood === null}
          accessibilityLabel={t('journeys.health.wellness.moodCheckIn.save')}
          accessibilityRole="button"
          testID="mood-save-button"
        >
          <Text style={styles.saveButtonText}>
            {t('journeys.health.wellness.moodCheckIn.save')}
          </Text>
        </TouchableOpacity>

        {/* Mood History Preview */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>
            {t('journeys.health.wellness.moodCheckIn.recentMoods')}
          </Text>
          <View style={styles.historyList}>
            {MOCK_MOOD_HISTORY.map((entry) => (
              <View key={entry.id} style={styles.historyItem} testID={`mood-history-${entry.id}`}>
                <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                  <Text style={styles.historyNote} numberOfLines={1}>
                    {t(entry.note)}
                  </Text>
                </View>
                <View
                  style={[styles.historyBar, { backgroundColor: getMoodColor(entry.value) }]}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacingValues.md,
      paddingVertical: spacingValues.sm,
      backgroundColor: colors.brand.primary,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backArrow: {
      fontSize: 20,
      color: theme.colors.text.onBrand,
      fontWeight: '600',
    },
    screenTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.onBrand,
      textAlign: 'center',
    },
    headerSpacer: {
      width: 40,
    },
    scrollContent: {
      padding: spacingValues.md,
      paddingBottom: spacingValues['5xl'],
    },
    prompt: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text.default,
      textAlign: 'center',
      marginVertical: spacingValues.lg,
    },
    moodScale: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacingValues.lg,
    },
    moodOption: {
      alignItems: 'center',
      padding: spacingValues.xs,
      borderRadius: borderRadiusValues.lg,
      borderWidth: 2,
      borderColor: 'transparent',
      flex: 1,
    },
    moodOptionSelected: {
      backgroundColor: theme.colors.background.subtle,
    },
    moodEmoji: {
      fontSize: 36,
    },
    moodEmojiSelected: {
      fontSize: 44,
    },
    moodLabel: {
      fontSize: 11,
      color: theme.colors.text.muted,
      marginTop: spacingValues['3xs'],
      textAlign: 'center',
    },
    feedbackCard: {
      padding: spacingValues.md,
      backgroundColor: theme.colors.background.subtle,
      borderRadius: borderRadiusValues.md,
      borderLeftWidth: 4,
      marginBottom: spacingValues.lg,
    },
    feedbackText: {
      fontSize: 15,
      color: theme.colors.text.default,
    },
    noteLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text.default,
      marginBottom: spacingValues.xs,
    },
    noteInput: {
      minHeight: 80,
      padding: spacingValues.sm,
      backgroundColor: theme.colors.background.subtle,
      borderRadius: borderRadiusValues.md,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      fontSize: 15,
      color: theme.colors.text.default,
      textAlignVertical: 'top',
      marginBottom: spacingValues.lg,
    },
    saveButton: {
      paddingVertical: spacingValues.sm,
      backgroundColor: colors.brand.primary,
      borderRadius: borderRadiusValues.md,
      alignItems: 'center',
      marginBottom: spacingValues['2xl'],
    },
    saveButtonDisabled: {
      opacity: 0.4,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.onBrand,
    },
    historySection: {
      marginTop: spacingValues.sm,
    },
    historyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
      marginBottom: spacingValues.sm,
    },
    historyList: {
      gap: spacingValues.xs,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacingValues.sm,
      backgroundColor: theme.colors.background.subtle,
      borderRadius: borderRadiusValues.md,
    },
    historyEmoji: {
      fontSize: 24,
      marginRight: spacingValues.sm,
    },
    historyContent: {
      flex: 1,
    },
    historyDate: {
      fontSize: 12,
      color: theme.colors.text.muted,
    },
    historyNote: {
      fontSize: 14,
      color: theme.colors.text.default,
      marginTop: spacingValues['4xs'],
    },
    historyBar: {
      width: 4,
      height: 32,
      borderRadius: 2,
      marginLeft: spacingValues.xs,
    },
  });

export default CompanionMoodCheckInScreen;
