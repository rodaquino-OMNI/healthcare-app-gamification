import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { ROUTES } from '../../../../constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface MedicationItem {
  id: string;
  nameKey: string;
  dosage: string;
  frequency: string;
  isCurrentlyTaking: boolean;
}

/**
 * Mock medication list from user profile. In production these would
 * come from the user's medication records or pharmacy integration.
 */
const MOCK_MEDICATIONS: MedicationItem[] = [
  { id: 'med1', nameKey: 'lisinopril', dosage: '10mg', frequency: 'daily', isCurrentlyTaking: false },
  { id: 'med2', nameKey: 'metformin', dosage: '500mg', frequency: 'twiceDaily', isCurrentlyTaking: false },
  { id: 'med3', nameKey: 'atorvastatin', dosage: '20mg', frequency: 'daily', isCurrentlyTaking: false },
  { id: 'med4', nameKey: 'omeprazole', dosage: '20mg', frequency: 'daily', isCurrentlyTaking: false },
  { id: 'med5', nameKey: 'albuterol', dosage: '90mcg', frequency: 'asNeeded', isCurrentlyTaking: false },
  { id: 'med6', nameKey: 'ibuprofen', dosage: '400mg', frequency: 'asNeeded', isCurrentlyTaking: false },
];

type SymptomMedicationContextRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  description: string;
  regions: Array<{ id: string; label: string }>;
  photos: Array<{ id: string; uri: string }>;
  medicalHistory: Array<{ id: string; type: string; name: string }>;
};

/**
 * Current medications screen for symptom context.
 * Users toggle which medications they are currently taking
 * and can add additional medications.
 */
const SymptomMedicationContext: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomMedicationContextRouteParams }, 'params'>>();
  const {
    symptoms = [],
    description = '',
    regions = [],
    photos = [],
    medicalHistory = [],
  } = route.params || {};

  const [medications, setMedications] = useState<MedicationItem[]>(MOCK_MEDICATIONS);
  const [newMedication, setNewMedication] = useState('');

  const toggleMedication = (medId: string) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === medId
          ? { ...med, isCurrentlyTaking: !med.isCurrentlyTaking }
          : med
      )
    );
  };

  const handleAddMedication = () => {
    if (newMedication.trim().length === 0) return;

    const newItem: MedicationItem = {
      id: `custom-med-${Date.now()}`,
      nameKey: newMedication.trim(),
      dosage: '',
      frequency: '',
      isCurrentlyTaking: true,
    };
    setMedications((prev) => [...prev, newItem]);
    setNewMedication('');
  };

  const handleContinue = () => {
    const currentMedications = medications
      .filter((med) => med.isCurrentlyTaking)
      .map((med) => ({
        id: med.id,
        name: med.id.startsWith('custom-med-')
          ? med.nameKey
          : t(`journeys.care.symptomChecker.medicationContext.medications.${med.nameKey}`),
        dosage: med.dosage,
        frequency: med.frequency,
      }));

    navigation.navigate(ROUTES.CARE_SYMPTOM_VITALS, {
      symptoms,
      description,
      regions,
      photos,
      medicalHistory,
      currentMedications,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const activeCount = medications.filter((m) => m.isCurrentlyTaking).length;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="heading" journey="care" testID="medication-context-title">
          {t('journeys.care.symptomChecker.medicationContext.title')}
        </Text>

        <Text variant="body" journey="care" testID="medication-context-subtitle">
          {t('journeys.care.symptomChecker.medicationContext.subtitle')}
        </Text>

        {activeCount > 0 && (
          <Text
            variant="caption"
            color={colors.journeys.care.primary}
            testID="active-medication-count"
          >
            {t('journeys.care.symptomChecker.medicationContext.activeCount', { count: activeCount })}
          </Text>
        )}

        <Card journey="care" elevation="sm">
          <Text variant="body" fontWeight="semiBold" journey="care">
            {t('journeys.care.symptomChecker.medicationContext.yourMedications')}
          </Text>

          {medications.map((med) => (
            <Touchable
              key={med.id}
              onPress={() => toggleMedication(med.id)}
              style={[styles.medicationItem, med.isCurrentlyTaking && styles.medicationItemActive]}
              accessibilityLabel={`${med.id.startsWith('custom-med-') ? med.nameKey : t(`journeys.care.symptomChecker.medicationContext.medications.${med.nameKey}`)}${med.dosage ? `, ${med.dosage}` : ''}${med.isCurrentlyTaking ? `, ${t('journeys.care.symptomChecker.medicationContext.currentlyTaking')}` : ''}`}
              accessibilityRole="button"
              testID={`medication-item-${med.id}`}
            >
              <View style={styles.medicationContent}>
                <View style={styles.medicationText}>
                  <Text
                    fontSize="text-sm"
                    fontWeight="medium"
                    color={med.isCurrentlyTaking ? colors.neutral.white : colors.journeys.care.text}
                  >
                    {med.id.startsWith('custom-med-')
                      ? med.nameKey
                      : t(`journeys.care.symptomChecker.medicationContext.medications.${med.nameKey}`)}
                  </Text>
                  {med.dosage ? (
                    <Text
                      fontSize="text-xs"
                      color={med.isCurrentlyTaking ? colors.neutral.gray200 : colors.neutral.gray600}
                    >
                      {med.dosage} - {t(`journeys.care.symptomChecker.medicationContext.frequency.${med.frequency}`)}
                    </Text>
                  ) : null}
                </View>
                <View style={[styles.toggleIndicator, med.isCurrentlyTaking && styles.toggleActive]}>
                  <View
                    style={[
                      styles.toggleThumb,
                      med.isCurrentlyTaking && styles.toggleThumbActive,
                    ]}
                  />
                </View>
              </View>
            </Touchable>
          ))}
        </Card>

        <Card journey="care" elevation="sm">
          <Text variant="body" fontWeight="semiBold" journey="care">
            {t('journeys.care.symptomChecker.medicationContext.addMedication')}
          </Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.textInput}
              value={newMedication}
              onChangeText={setNewMedication}
              placeholder={t('journeys.care.symptomChecker.medicationContext.addPlaceholder')}
              placeholderTextColor={colors.neutral.gray400}
              accessibilityLabel={t('journeys.care.symptomChecker.medicationContext.addPlaceholder')}
              testID="add-medication-input"
            />
            <Button
              variant="secondary"
              onPress={handleAddMedication}
              journey="care"
              disabled={newMedication.trim().length === 0}
              accessibilityLabel={t('journeys.care.symptomChecker.medicationContext.addButton')}
              testID="add-medication-button"
            >
              {t('journeys.care.symptomChecker.medicationContext.addButton')}
            </Button>
          </View>
        </Card>

        <View style={styles.buttonRow}>
          <Button
            variant="secondary"
            onPress={handleBack}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.medicationContext.back')}
            testID="back-button"
          >
            {t('journeys.care.symptomChecker.medicationContext.back')}
          </Button>
          <Button
            onPress={handleContinue}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.medicationContext.continue')}
            testID="continue-button"
          >
            {t('journeys.care.symptomChecker.medicationContext.continue')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  medicationItem: {
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.sm,
    marginTop: spacingValues.xs,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  medicationItemActive: {
    backgroundColor: colors.journeys.care.primary,
    borderColor: colors.journeys.care.accent,
  },
  medicationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationText: {
    flex: 1,
    gap: spacingValues['3xs'],
  },
  toggleIndicator: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral.gray300,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: colors.semantic.success,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.neutral.white,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
    marginTop: spacingValues.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: spacingValues.xs,
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.sm,
    fontSize: 14,
    color: colors.journeys.care.text,
    backgroundColor: colors.neutral.white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingValues.xl,
    gap: spacingValues.md,
  },
});

export { SymptomMedicationContext };
export default SymptomMedicationContext;
