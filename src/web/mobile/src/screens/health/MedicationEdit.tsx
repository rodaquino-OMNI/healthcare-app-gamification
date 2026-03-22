import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Checkbox } from '@austa/design-system/src/components/Checkbox/Checkbox';
import { DatePicker } from '@austa/design-system/src/components/DatePicker/DatePicker';
import Input from '@austa/design-system/src/components/Input/Input';
import { Select } from '@austa/design-system/src/components/Select/Select';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import * as yup from 'yup';

import type { HealthStackParamList } from '../../navigation/types';

/**
 * Form data shape for editing a medication.
 */
interface MedicationEditFormData {
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date | null;
    endDate: Date | null;
    notes: string;
    reminder: boolean;
}

/**
 * Route params for the MedicationEdit screen.
 */
type MedicationEditRouteParams = {
    MedicationEdit: {
        medicationId?: string;
        medicationName?: string;
        medicationDosage?: string;
        frequency?: string;
        notes?: string;
    };
};

const FREQUENCY_OPTIONS = [
    { label: 'Once daily', value: 'once_daily' },
    { label: 'Twice daily', value: 'twice_daily' },
    { label: 'Three times daily', value: 'three_times_daily' },
    { label: 'Every 8 hours', value: 'every_8_hours' },
    { label: 'As needed', value: 'as_needed' },
    { label: 'Weekly', value: 'weekly' },
];

const medicationEditSchema = yup.object({
    name: yup.string().required('Medication name is required'),
    dosage: yup.string().required('Dosage is required'),
    frequency: yup.string().required('Frequency is required'),
    startDate: yup.date().nullable().required('Start date is required').typeError('Please select a valid date'),
    endDate: yup.date().nullable().notRequired(),
    notes: yup.string().default(''),
    reminder: yup.boolean().default(true),
});

/**
 * MedicationEdit allows users to edit an existing medication.
 * Pre-fills form fields from route params.
 */
export const MedicationEdit: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<HealthStackParamList>>();
    const { t } = useTranslation();
    const route = useRoute<RouteProp<MedicationEditRouteParams, 'MedicationEdit'>>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const prefillName = route.params?.medicationName ?? '';
    const prefillDosage = route.params?.medicationDosage ?? '';
    const prefillFrequency = route.params?.frequency ?? '';
    const prefillNotes = route.params?.notes ?? '';

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<MedicationEditFormData>({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- yupResolver returns Resolver with `any` context type
        resolver: yupResolver(medicationEditSchema),
        defaultValues: {
            name: prefillName,
            dosage: prefillDosage,
            frequency: prefillFrequency,
            startDate: new Date(),
            endDate: null,
            notes: prefillNotes,
            reminder: true,
        },
    });

    const onSubmit = useCallback(
        async (_data: MedicationEditFormData) => {
            setIsSubmitting(true);
            try {
                // In production, call API to update the medication
                await new Promise((resolve) => setTimeout(resolve, 500));
                navigation.goBack();
            } catch (error) {
                Alert.alert(t('medication.edit.errorTitle'), t('medication.edit.errorMessage'));
            } finally {
                setIsSubmitting(false);
            }
        },
        [navigation, t]
    );

    const handleCancel = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleCancel}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="back-button"
                >
                    <Text fontSize="lg" color={colors.journeys.health.primary}>
                        {t('common.buttons.back')}
                    </Text>
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('medication.edit.title')}
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
                                <Input
                                    label={t('medication.edit.nameLabel')}
                                    value={value}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                                    placeholder={t('medication.edit.namePlaceholder')}
                                    journey="health"
                                    aria-label={t('medication.edit.nameLabel')}
                                    testID="medication-name-input"
                                    error={errors.name?.message}
                                />
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
                                    label={t('medication.edit.dosageLabel')}
                                    value={value}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                                    placeholder={t('medication.edit.dosagePlaceholder')}
                                    journey="health"
                                    aria-label={t('medication.edit.dosageLabel')}
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
                                    label={t('medication.edit.frequencyLabel')}
                                    options={FREQUENCY_OPTIONS}
                                    value={value}
                                    onChange={(val) => onChange(val as string)}
                                    placeholder={t('medication.edit.frequencyPlaceholder')}
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
                        <Text fontSize="sm" color={colors.neutral.gray900} fontWeight="medium">
                            {t('medication.edit.startDateLabel')}
                        </Text>
                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field: { value, onChange } }) => (
                                <DatePicker
                                    label={t('medication.edit.startDateLabel')}
                                    value={value}
                                    onChange={onChange}
                                    journey="health"
                                    accessibilityLabel={t('medication.edit.startDateLabel')}
                                    testID="medication-start-date"
                                    error={errors.startDate?.message}
                                />
                            )}
                        />
                    </View>

                    {/* End Date (Optional) */}
                    <View style={styles.fieldContainer}>
                        <Text fontSize="sm" color={colors.neutral.gray900} fontWeight="medium">
                            {t('medication.edit.endDateLabel')}
                        </Text>
                        <Controller
                            control={control}
                            name="endDate"
                            render={({ field: { value, onChange } }) => (
                                <DatePicker
                                    label={t('medication.edit.endDateLabel')}
                                    value={value}
                                    onChange={onChange}
                                    journey="health"
                                    accessibilityLabel={t('medication.edit.endDateLabel')}
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
                                    label={t('medication.edit.notesLabel')}
                                    value={value}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                                    placeholder={t('medication.edit.notesPlaceholder')}
                                    journey="health"
                                    aria-label={t('medication.edit.notesLabel')}
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
                                    id="medication-reminder-edit"
                                    name="reminder"
                                    value="reminder"
                                    checked={value}
                                    onChange={() => onChange(!value)}
                                    label={t('medication.edit.reminderLabel')}
                                    journey="health"
                                    testID="medication-reminder-checkbox"
                                />
                            )}
                        />
                    </View>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        variant="primary"
                        journey="health"
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        accessibilityLabel={t('medication.edit.saveChanges')}
                        testID="save-changes-button"
                    >
                        {t('medication.edit.saveChanges')}
                    </Button>

                    <View style={styles.buttonSpacer} />

                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={handleCancel}
                        accessibilityLabel={t('common.buttons.cancel')}
                        testID="cancel-button"
                    >
                        {t('common.buttons.cancel')}
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
    actionsContainer: {
        marginTop: spacingValues.xl,
        paddingBottom: spacingValues.xl,
    },
    buttonSpacer: {
        height: spacingValues.sm,
    },
});

export default MedicationEdit;
