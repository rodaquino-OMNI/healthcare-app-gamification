import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Route params for the MedicationDoseTaken screen.
 */
type DoseTakenRouteParams = {
  MedicationDoseTaken: {
    medicationId?: string;
    medicationName?: string;
    dosage?: string;
    scheduledTime?: string;
  };
};

/**
 * Format current time as HH:MM AM/PM.
 */
const formatCurrentTime = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

/**
 * MedicationDoseTaken allows users to log a dose as taken.
 * Includes timestamp, notes, and side effects toggle.
 */
export const MedicationDoseTaken: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<DoseTakenRouteParams, 'MedicationDoseTaken'>>();

  const medicationName = route.params?.medicationName ?? t('medication.doseTaken.defaultName');
  const dosage = route.params?.dosage ?? '';
  const scheduledTime = route.params?.scheduledTime ?? '';

  const [timestamp, setTimestamp] = useState(formatCurrentTime());
  const [notes, setNotes] = useState('');
  const [hasSideEffects, setHasSideEffects] = useState(false);

  const handleConfirmDose = useCallback(() => {
    // In production, persist dose record via API
    navigation.goBack();
  }, [navigation]);

  const handleSideEffectsLink = useCallback(() => {
    navigation.navigate(ROUTES.HEALTH_MEDICATION_SIDE_EFFECT_FORM, {
      medicationId: route.params?.medicationId,
      medicationName,
    });
  }, [navigation, route.params?.medicationId, medicationName]);

  const toggleSideEffects = useCallback(() => {
    setHasSideEffects((prev) => !prev);
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
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('common.buttons.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('medication.doseTaken.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Medication Info */}
        <Card journey="health" elevation="md" padding="md">
          <Text fontWeight="semiBold" fontSize="xl">
            {medicationName}
          </Text>
          {dosage ? (
            <Badge
              variant="status"
              status="info"
              accessibilityLabel={`${t('medication.doseTaken.dosage')} ${dosage}`}
            >
              {dosage}
            </Badge>
          ) : null}
          {scheduledTime ? (
            <Text fontSize="sm" color={colors.neutral.gray600} style={styles.scheduledText}>
              {t('medication.doseTaken.scheduled')}: {scheduledTime}
            </Text>
          ) : null}
        </Card>

        {/* Timestamp Field */}
        <View style={styles.fieldSection}>
          <Text fontSize="md" fontWeight="medium" color={colors.neutral.gray900}>
            {t('medication.doseTaken.timeTaken')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <TextInput
              style={styles.timeInput}
              value={timestamp}
              onChangeText={setTimestamp}
              placeholder="HH:MM AM/PM"
              placeholderTextColor={colors.neutral.gray500}
              accessibilityLabel={t('medication.doseTaken.timeTaken')}
              testID="timestamp-input"
            />
          </Card>
        </View>

        {/* Notes Field */}
        <View style={styles.fieldSection}>
          <Text fontSize="md" fontWeight="medium" color={colors.neutral.gray900}>
            {t('medication.doseTaken.notes')}
          </Text>
          <Card journey="health" elevation="sm" padding="md">
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('medication.doseTaken.notesPlaceholder')}
              placeholderTextColor={colors.neutral.gray500}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel={t('medication.doseTaken.notes')}
              testID="notes-input"
            />
          </Card>
        </View>

        {/* Side Effects Toggle */}
        <View style={styles.fieldSection}>
          <Touchable
            onPress={toggleSideEffects}
            accessibilityLabel={t('medication.doseTaken.sideEffectsToggle')}
            accessibilityRole="button"
            testID="side-effects-toggle"
          >
            <Card journey="health" elevation="sm" padding="md">
              <View style={styles.toggleRow}>
                <Text fontSize="md" fontWeight="medium">
                  {t('medication.doseTaken.sideEffects')}
                </Text>
                <View style={[
                  styles.toggleIndicator,
                  hasSideEffects && styles.toggleIndicatorActive,
                ]}>
                  <Text
                    fontSize="sm"
                    color={hasSideEffects ? colors.neutral.white : colors.neutral.gray600}
                  >
                    {hasSideEffects ? t('common.yes') : t('common.no')}
                  </Text>
                </View>
              </View>
            </Card>
          </Touchable>

          {hasSideEffects && (
            <Touchable
              onPress={handleSideEffectsLink}
              accessibilityLabel={t('medication.doseTaken.reportSideEffects')}
              accessibilityRole="button"
              testID="report-side-effects-link"
              style={styles.sideEffectsLink}
            >
              <Text fontSize="sm" color={colors.journeys.health.primary} fontWeight="medium">
                {t('medication.doseTaken.reportSideEffects')}
              </Text>
            </Touchable>
          )}
        </View>

        {/* Confirm Button */}
        <View style={styles.submitContainer}>
          <Button
            variant="primary"
            journey="health"
            onPress={handleConfirmDose}
            accessibilityLabel={t('medication.doseTaken.confirm')}
            testID="confirm-dose-button"
          >
            {t('medication.doseTaken.confirm')}
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
  scheduledText: {
    marginTop: spacingValues.xs,
  },
  fieldSection: {
    marginTop: spacingValues.xl,
  },
  timeInput: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral.gray900,
    paddingVertical: spacingValues.xs,
  },
  notesInput: {
    fontSize: 14,
    color: colors.neutral.gray900,
    minHeight: 80,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleIndicator: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: 16,
    backgroundColor: colors.neutral.gray200,
  },
  toggleIndicatorActive: {
    backgroundColor: colors.journeys.health.primary,
  },
  sideEffectsLink: {
    marginTop: spacingValues.sm,
    paddingVertical: spacingValues.xs,
  },
  submitContainer: {
    marginTop: spacingValues['2xl'],
    paddingBottom: spacingValues.xl,
  },
});

export default MedicationDoseTaken;
