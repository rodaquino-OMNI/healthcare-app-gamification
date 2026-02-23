import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '@constants/routes';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

const MAX_CHARS = 500;

interface AttachedFile {
  id: string;
  name: string;
}

interface ChipOption {
  key: string;
  labelKey: string;
}

const COMMON_REASONS: ChipOption[] = [
  { key: 'checkup', labelKey: 'consultation.reasonForVisit.checkup' },
  { key: 'follow-up', labelKey: 'consultation.reasonForVisit.followUp' },
  { key: 'new-symptoms', labelKey: 'consultation.reasonForVisit.newSymptoms' },
  { key: 'second-opinion', labelKey: 'consultation.reasonForVisit.secondOpinion' },
  { key: 'prescription', labelKey: 'consultation.reasonForVisit.prescriptionRenewal' },
  { key: 'exam-results', labelKey: 'consultation.reasonForVisit.examResults' },
];

/**
 * BookingReasonForVisit screen lets the user enter a reason for their visit,
 * select common reasons as chips, and attach files.
 */
export const BookingReasonForVisit: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { doctorId, appointmentType } = route.params || {
    doctorId: 'doc-001',
    appointmentType: 'in-person',
  };

  const [reason, setReason] = useState('');
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

  const handleToggleChip = useCallback((key: string) => {
    setSelectedChips((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleAttachFile = useCallback(() => {
    const newFile: AttachedFile = {
      id: `file-${Date.now()}`,
      name: `documento_${attachments.length + 1}.pdf`,
    };
    setAttachments((prev) => [...prev, newFile]);
  }, [attachments.length]);

  const handleRemoveFile = useCallback((fileId: string) => {
    setAttachments((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const handleTextChange = useCallback((text: string) => {
    if (text.length <= MAX_CHARS) {
      setReason(text);
    }
  }, []);

  const handleContinue = useCallback(() => {
    navigation.navigate(ROUTES.CARE_BOOKING_DOCUMENTS, {
      doctorId,
      appointmentType,
    });
  }, [navigation, doctorId, appointmentType]);

  const hasContent = reason.trim().length > 0 || selectedChips.size > 0;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text fontSize="lg">{'\u2190'}</Text>
        </TouchableOpacity>
        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
          {t('consultation.reasonForVisit.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Text Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.textInput}
            value={reason}
            onChangeText={handleTextChange}
            placeholder={t('consultation.reasonForVisit.placeholder')}
            placeholderTextColor={colors.neutral.gray500}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={MAX_CHARS}
            accessibilityLabel={t('consultation.reasonForVisit.title')}
            testID="reason-input"
          />
          <Text fontSize="sm" color={colors.neutral.gray500} style={styles.charCounter}>
            {reason.length}/{MAX_CHARS} {t('consultation.reasonForVisit.characters')}
          </Text>
        </View>

        {/* Common Reasons Chips */}
        <View style={styles.section}>
          <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
            {t('consultation.reasonForVisit.commonReasons')}
          </Text>
          <View style={styles.chipsContainer}>
            {COMMON_REASONS.map((chip) => {
              const isSelected = selectedChips.has(chip.key);
              return (
                <TouchableOpacity
                  key={chip.key}
                  onPress={() => handleToggleChip(chip.key)}
                  accessibilityLabel={t(chip.labelKey)}
                  accessibilityRole="button"
                  testID={`chip-${chip.key}`}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text
                    fontSize="sm"
                    color={isSelected ? colors.neutral.white : colors.journeys.care.text}
                  >
                    {t(chip.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* File Attachments */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleAttachFile}
            accessibilityLabel={t('consultation.reasonForVisit.attachFile')}
            accessibilityRole="button"
            testID="attach-file-button"
            style={styles.attachButton}
          >
            <Text fontSize="md" color={colors.journeys.care.primary}>
              {'\u{1F4CE}'} {t('consultation.reasonForVisit.attachFile')}
            </Text>
          </TouchableOpacity>

          {attachments.map((file) => (
            <Card key={file.id} journey="care" elevation="sm">
              <View style={styles.fileRow}>
                <Text fontSize="sm" color={colors.journeys.care.text} style={styles.fileName}>
                  {'\u{1F4C4}'} {file.name}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveFile(file.id)}
                  accessibilityLabel={`Remove ${file.name}`}
                  accessibilityRole="button"
                  testID={`remove-file-${file.id}`}
                >
                  <Text fontSize="md" color={colors.semantic.error}>{'\u2715'}</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Continue CTA */}
      <View style={styles.ctaContainer}>
        <Button
          variant="primary"
          journey="care"
          size="lg"
          onPress={handleContinue}
          disabled={!hasContent}
          accessibilityLabel={t('consultation.reasonForVisit.continue')}
          testID="continue-button"
        >
          {t('consultation.reasonForVisit.continue')}
        </Button>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['6xl'],
  },
  inputSection: {
    marginBottom: spacingValues.lg,
  },
  textInput: {
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: spacingValues.xs,
    padding: spacingValues.sm,
    minHeight: 120,
    fontSize: 14,
    color: colors.journeys.care.text,
  },
  charCounter: {
    textAlign: 'right',
    marginTop: spacingValues['3xs'],
  },
  section: {
    marginBottom: spacingValues.lg,
    gap: spacingValues.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  chip: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    borderRadius: spacingValues.lg,
    borderWidth: 1,
    borderColor: colors.journeys.care.primary,
    backgroundColor: theme.colors.background.default,
  },
  chipSelected: {
    backgroundColor: colors.journeys.care.primary,
    borderColor: colors.journeys.care.primary,
  },
  attachButton: {
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: colors.journeys.care.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    flex: 1,
    marginRight: spacingValues.xs,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.journeys.care.background,
    padding: spacingValues.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
});

export default BookingReasonForVisit;
