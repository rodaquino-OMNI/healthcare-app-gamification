import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizingValues } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MoodTag {
  id: string;
  labelKey: string;
  icon: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOOD_TAGS: MoodTag[] = [
  { id: 'happy', labelKey: 'journeys.health.wellness.journal.moods.happy', icon: '\u{1F60A}' },
  { id: 'calm', labelKey: 'journeys.health.wellness.journal.moods.calm', icon: '\u{1F60C}' },
  { id: 'anxious', labelKey: 'journeys.health.wellness.journal.moods.anxious', icon: '\u{1F630}' },
  { id: 'sad', labelKey: 'journeys.health.wellness.journal.moods.sad', icon: '\u{1F622}' },
  { id: 'energetic', labelKey: 'journeys.health.wellness.journal.moods.energetic', icon: '\u{26A1}' },
  { id: 'tired', labelKey: 'journeys.health.wellness.journal.moods.tired', icon: '\u{1F634}' },
  { id: 'grateful', labelKey: 'journeys.health.wellness.journal.moods.grateful', icon: '\u{1F64F}' },
  { id: 'stressed', labelKey: 'journeys.health.wellness.journal.moods.stressed', icon: '\u{1F624}' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CompanionJournalScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const [text, setText] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const todayLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return 0;
    return trimmed.split(/\s+/).length;
  }, [text]);

  const handleMoodToggle = useCallback((moodId: string) => {
    setSelectedMoods((prev) =>
      prev.includes(moodId)
        ? prev.filter((id) => id !== moodId)
        : [...prev, moodId],
    );
  }, []);

  const handleSave = useCallback(() => {
    // Save logic would go here
    navigation.navigate(ROUTES.WELLNESS_JOURNAL_HISTORY as 'WellnessJournalHistory');
  }, [navigation]);

  const isSaveDisabled = text.trim().length === 0;

  return (
    <SafeAreaView style={styles.container} testID="wellness-journal-screen">
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {t('journeys.health.wellness.journal.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Date Display */}
        <Text style={styles.dateText}>{todayLabel}</Text>

        {/* Mood Tag Selector */}
        <Text style={styles.sectionLabel}>
          {t('journeys.health.wellness.journal.howFeeling')}
        </Text>
        <View style={styles.moodRow}>
          {MOOD_TAGS.map((mood) => {
            const isSelected = selectedMoods.includes(mood.id);
            return (
              <TouchableOpacity
                key={mood.id}
                onPress={() => handleMoodToggle(mood.id)}
                style={[styles.moodChip, isSelected && styles.moodChipSelected]}
                accessibilityLabel={t(mood.labelKey)}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.moodIcon}>{mood.icon}</Text>
                <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                  {t(mood.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Journal Text Input */}
        <Text style={styles.sectionLabel}>
          {t('journeys.health.wellness.journal.writeHere')}
        </Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={t('journeys.health.wellness.journal.placeholder')}
            placeholderTextColor={theme.colors.text.muted}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
            testID="journal-text-input"
            accessibilityLabel={t('journeys.health.wellness.journal.entryInput')}
          />
        </View>

        {/* Word Count */}
        <Text style={styles.wordCount}>
          {t('journeys.health.wellness.journal.wordCount', { count: wordCount })}
        </Text>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, isSaveDisabled && styles.saveButtonDisabled]}
          disabled={isSaveDisabled}
          accessibilityLabel={t('journeys.health.wellness.journal.save')}
          accessibilityState={{ disabled: isSaveDisabled }}
        >
          <Text style={[styles.saveButtonText, isSaveDisabled && styles.saveButtonTextDisabled]}>
            {t('journeys.health.wellness.journal.save')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.subtle,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacingValues.md,
      paddingVertical: spacingValues.sm,
      backgroundColor: colors.brand.primary,
    },
    backButton: {
      width: sizingValues.component.sm,
      height: sizingValues.component.sm,
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
      width: sizingValues.component.sm,
    },
    scrollContent: {
      paddingHorizontal: spacingValues.md,
      paddingBottom: spacingValues['5xl'],
    },
    dateText: {
      fontSize: 14,
      color: theme.colors.text.muted,
      marginTop: spacingValues.md,
      textAlign: 'center',
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.default,
      marginTop: spacingValues.lg,
      marginBottom: spacingValues.sm,
    },
    moodRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacingValues.xs,
    },
    moodChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacingValues.xs,
      paddingHorizontal: spacingValues.sm,
      borderRadius: borderRadiusValues.full,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      backgroundColor: theme.colors.background.default,
      gap: spacingValues['3xs'],
    },
    moodChipSelected: {
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
    },
    moodIcon: {
      fontSize: 16,
    },
    moodLabel: {
      fontSize: 12,
      color: theme.colors.text.default,
    },
    moodLabelSelected: {
      color: theme.colors.text.onBrand,
    },
    textInputContainer: {
      backgroundColor: theme.colors.background.default,
      borderRadius: borderRadiusValues.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      minHeight: 200,
    },
    textInput: {
      flex: 1,
      padding: spacingValues.md,
      fontSize: 16,
      color: theme.colors.text.default,
      minHeight: 200,
    },
    wordCount: {
      fontSize: 12,
      color: theme.colors.text.muted,
      textAlign: 'right',
      marginTop: spacingValues['3xs'],
    },
    saveButton: {
      marginTop: spacingValues.xl,
      backgroundColor: colors.brand.primary,
      borderRadius: borderRadiusValues.full,
      paddingVertical: spacingValues.sm,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.onBrand,
    },
    saveButtonTextDisabled: {
      color: theme.colors.text.onBrand,
    },
  });

export default CompanionJournalScreen;
