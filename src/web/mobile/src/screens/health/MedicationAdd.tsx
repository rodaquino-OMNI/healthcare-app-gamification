import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ROUTES } from '../../constants/routes';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Checkbox } from '@austa/design-system/src/components/Checkbox/Checkbox';
import Input from '@austa/design-system/src/components/Input/Input';
import { Select } from '@austa/design-system/src/components/Select/Select';
import { DatePicker } from '@austa/design-system/src/components/DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Form data shape for the medication add/edit form
 */
interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date | null;
  endDate: Date | null;
  notes: string;
  reminder: boolean;
}

/**
 * Route params for MedicationAdd screen
 */
type MedicationAddRouteParams = {
  MedicationAdd: {
    medicationId?: string;
    medicationName?: string;
    medicationDosage?: string;
  };
};

/**
 * Yup validation schema is created inside the component to access t().
 */

/**
 * MedicationAdd screen provides a form for adding or editing a medication.
 * Uses react-hook-form with yup validation, and design-system components.
 */
const MedicationAdd: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const FREQUENCY_OPTIONS = [
    { label: t('journeys.care.medications.frequency.onceDaily'), value: 'once_daily' },
    { label: t('journeys.care.medications.frequency.twiceDaily'), value: 'twice_daily' },
    { label: t('journeys.care.medications.frequency.threeTimesDaily'), value: 'three_times_daily' },
    { label: t('journeys.care.medications.frequency.every8Hours'), value: 'every_8_hours' },
    { label: t('journeys.care.medications.frequency.asNeeded'), value: 'as_needed' },
    { label: t('journeys.care.medications.frequency.weekly'), value: 'weekly' },
  ];

  const medicationSchema = yup.object({
    name: yup.string().required(t('common.validation.required')),
    dosage: yup.string().required(t('common.validation.required')),
    frequency: yup.string().required(t('common.validation.required')),
    startDate: yup
      .date()
      .nullable()
      .required(t('common.validation.required'))
      .typeError(t('common.validation.required')),
    endDate: yup.date().nullable().notRequired(),
    notes: yup.string().default(''),
    reminder: yup.boolean().default(true),
  });
  const route = useRoute<RouteProp<MedicationAddRouteParams, 'MedicationAdd'>>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prefillName = route.params?.medicationName ?? '';
  const prefillDosage = route.params?.medicationDosage ?? '';
  const isEditing = !!route.params?.medicationId;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MedicationFormData>({
    resolver: yupResolver(medicationSchema as any),
    defaultValues: {
      name: prefillName,
      dosage: prefillDosage,
      frequency: '',
      startDate: new Date(),
      endDate: null,
      notes: '',
      reminder: true,
    },
  });

  const onSubmit = useCallback(
    async (data: MedicationFormData) => {
      setIsSubmitting(true);
      try {
        // In production, this would call the API to persist the medication
        // For now, simulate a save delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigation.goBack();
      } catch (error) {
        Alert.alert(t('common.errors.default'), t('common.errors.default'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigation],
  );

  const handleNameFocus = useCallback(() => {
    navigation.navigate(ROUTES.HEALTH_MEDICATION_SEARCH);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          testID="back-button"
        >
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('common.buttons.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {isEditing ? t('journeys.care.medications.edit') : t('journeys.care.medications.add')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card journey="health" elevation="sm" padding="md">
          {/* Medication Name */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Touchable
                  onPress={handleNameFocus}
                  accessibilityLabel="Search for medication name"
                  testID="medication-name-touchable"
                >
                  <Input
                    label={t('journeys.care.medications.name')}
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChange(e.target.value)
                    }
                    placeholder={t('common.placeholders.search')}
                    journey="health"
                    aria-label="Medication name"
                    testID="medication-name-input"
                    error={errors.name?.message}
                  />
                </Touchable>
              )}
            />
          </View>

          {/* Dosage */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="dosage"
              render={({ field: { value, onChange } }) => (
                <Input
                  label={t('journeys.care.medications.dosage')}
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(e.target.value)
                  }
                  placeholder="e.g. 500mg"
                  journey="health"
                  aria-label="Medication dosage"
                  testID="medication-dosage-input"
                  error={errors.dosage?.message}
                />
              )}
            />
          </View>

          {/* Frequency */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="frequency"
              render={({ field: { value, onChange } }) => (
                <Select
                  label={t('journeys.care.medications.frequency')}
                  options={FREQUENCY_OPTIONS}
                  value={value}
                  onChange={(val) => onChange(val as string)}
                  placeholder={t('common.placeholders.select')}
                  journey="health"
                  testID="medication-frequency-select"
                />
              )}
            />
            {errors.frequency?.message && (
              <Text fontSize="xs" color={colors.semantic.error}>
                {errors.frequency.message}
              </Text>
            )}
          </View>

          {/* Start Date */}
          <View style={styles.fieldContainer}>
            <Text
              fontSize="sm"
              color={colors.neutral.gray900}
              fontWeight="medium"
            >
              {t('journeys.care.medications.startDate')}
            </Text>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label={t('journeys.care.medications.startDate')}
                  value={value}
                  onChange={onChange}
                  journey="health"
                  accessibilityLabel="Select start date"
                  testID="medication-start-date"
                  error={errors.startDate?.message}
                />
              )}
            />
          </View>

          {/* End Date (Optional) */}
          <View style={styles.fieldContainer}>
            <Text
              fontSize="sm"
              color={colors.neutral.gray900}
              fontWeight="medium"
            >
              {t('journeys.care.medications.endDate')}
            </Text>
            <Controller
              control={control}
              name="endDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label={t('journeys.care.medications.endDate')}
                  value={value}
                  onChange={onChange}
                  journey="health"
                  accessibilityLabel="Select end date (optional)"
                  testID="medication-end-date"
                />
              )}
            />
          </View>

          {/* Notes */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="notes"
              render={({ field: { value, onChange } }) => (
                <Input
                  label={t('common.labels.notes')}
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(e.target.value)
                  }
                  placeholder={t('common.labels.notes')}
                  journey="health"
                  aria-label="Medication notes"
                  testID="medication-notes-input"
                />
              )}
            />
          </View>

          {/* Reminder Toggle */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="reminder"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="medication-reminder"
                  name="reminder"
                  value="reminder"
                  checked={value}
                  onChange={() => onChange(!value)}
                  label={t('journeys.care.medications.reminder')}
                  journey="health"
                  testID="medication-reminder-checkbox"
                />
              )}
            />
          </View>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            variant="primary"
            journey="health"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            accessibilityLabel={
              isEditing ? 'Save medication changes' : 'Save medication'
            }
          >
            {isEditing ? t('common.buttons.save') : t('common.buttons.save')}
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
  fieldContainer: {
    marginBottom: spacingValues.md,
  },
  submitContainer: {
    marginTop: spacingValues.xl,
    paddingBottom: spacingValues.xl,
  },
});

export default MedicationAdd;
