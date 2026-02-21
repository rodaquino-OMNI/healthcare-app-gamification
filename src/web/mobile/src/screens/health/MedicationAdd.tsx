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
 * Frequency options for the Select component
 */
const FREQUENCY_OPTIONS = [
  { label: 'Once daily', value: 'once_daily' },
  { label: 'Twice daily', value: 'twice_daily' },
  { label: 'Three times daily', value: 'three_times_daily' },
  { label: 'Every 8 hours', value: 'every_8_hours' },
  { label: 'As needed', value: 'as_needed' },
  { label: 'Weekly', value: 'weekly' },
];

/**
 * Yup validation schema for the medication form
 */
const medicationSchema = yup.object({
  name: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required'),
  startDate: yup
    .date()
    .nullable()
    .required('Start date is required')
    .typeError('Please select a valid date'),
  endDate: yup.date().nullable().notRequired(),
  notes: yup.string().default(''),
  reminder: yup.boolean().default(true),
});

/**
 * MedicationAdd screen provides a form for adding or editing a medication.
 * Uses react-hook-form with yup validation, and design-system components.
 */
const MedicationAdd: React.FC = () => {
  const navigation = useNavigation<any>();
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
    resolver: yupResolver(medicationSchema) as any,
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
        Alert.alert('Error', 'Failed to save medication. Please try again.');
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
            Back
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {isEditing ? 'Edit Medication' : 'Add Medication'}
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
                    label="Medication Name"
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChange(e.target.value)
                    }
                    placeholder="Tap to search medications..."
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
                  label="Dosage"
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
                  label="Frequency"
                  options={FREQUENCY_OPTIONS}
                  value={value}
                  onChange={(val) => onChange(val as string)}
                  placeholder="Select frequency"
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
              Start Date
            </Text>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label="Start Date"
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
              End Date (Optional)
            </Text>
            <Controller
              control={control}
              name="endDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label="End Date"
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
                  label="Notes"
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(e.target.value)
                  }
                  placeholder="Any additional notes..."
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
                  label="Enable medication reminders"
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
            {isEditing ? 'Save Changes' : 'Save Medication'}
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
