import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Checkbox } from 'design-system/components/Checkbox/Checkbox';
import { DatePicker } from 'design-system/components/DatePicker/DatePicker';
import { Input } from 'design-system/components/Input/Input';
import { Select } from 'design-system/components/Select/Select';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { WEB_HEALTH_ROUTES } from 'shared/constants/routes';

const FREQUENCY_OPTIONS = [
    { label: 'Once daily', value: 'once-daily' },
    { label: 'Twice daily', value: 'twice-daily' },
    { label: 'Three times daily', value: 'three-daily' },
    { label: 'Every other day', value: 'every-other' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'As needed', value: 'as-needed' },
];

const FORM_OPTIONS = [
    { label: 'Tablet', value: 'tablet' },
    { label: 'Capsule', value: 'capsule' },
    { label: 'Liquid', value: 'liquid' },
    { label: 'Injection', value: 'injection' },
    { label: 'Inhaler', value: 'inhaler' },
    { label: 'Topical', value: 'topical' },
    { label: 'Patch', value: 'patch' },
];

/** Form state for adding a new medication */
interface MedicationFormState {
    name: string;
    dosage: string;
    form: string;
    frequency: string;
    startDate: Date | null;
    endDate: Date | null;
    instructions: string;
    reminders: boolean;
}

const initialFormState: MedicationFormState = {
    name: '',
    dosage: '',
    form: '',
    frequency: '',
    startDate: null,
    endDate: null,
    instructions: '',
    reminders: true,
};

/**
 * Add medication form page.
 * Collects medication details including name, dosage, form, frequency, dates,
 * and optional reminders.
 */
const MedicationAddPage: React.FC = () => {
    const router = useRouter();
    const [form, setForm] = useState<MedicationFormState>(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof MedicationFormState, string>>>({});

    const updateField = <K extends keyof MedicationFormState>(field: K, value: MedicationFormState[K]): void => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof MedicationFormState, string>> = {};
        if (!form.name.trim()) {
            newErrors.name = 'Medication name is required';
        }
        if (!form.dosage.trim()) {
            newErrors.dosage = 'Dosage is required';
        }
        if (!form.form) {
            newErrors.form = 'Please select a form';
        }
        if (!form.frequency) {
            newErrors.frequency = 'Please select a frequency';
        }
        if (!form.startDate) {
            newErrors.startDate = 'Start date is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (): void => {
        if (!validate()) {
            return;
        }
        // In a real app, this would call an API to save the medication
        void router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
    };

    const handleCancel = (): void => {
        void router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Add Medication
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Enter the details of your medication below.
            </Text>

            <Card journey="health" elevation="md" padding="lg">
                <Box style={{ marginBottom: spacing.lg }}>
                    <Input
                        label="Medication Name"
                        value={form.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
                        placeholder="e.g., Losartan"
                        journey="health"
                        error={errors.name}
                        testID="med-name-input"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.lg }}>
                    <Input
                        label="Dosage"
                        value={form.dosage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('dosage', e.target.value)}
                        placeholder="e.g., 50mg"
                        journey="health"
                        error={errors.dosage}
                        testID="med-dosage-input"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.lg }}>
                    <Select
                        label="Form"
                        options={FORM_OPTIONS}
                        value={form.form}
                        onChange={(val) => updateField('form', val as string)}
                        journey="health"
                        placeholder="Select medication form"
                        testID="med-form-select"
                    />
                    {errors.form && (
                        <Text fontSize="sm" color={colors.semantic.error}>
                            {errors.form}
                        </Text>
                    )}
                </Box>

                <Box style={{ marginBottom: spacing.lg }}>
                    <Select
                        label="Frequency"
                        options={FREQUENCY_OPTIONS}
                        value={form.frequency}
                        onChange={(val) => updateField('frequency', val as string)}
                        journey="health"
                        placeholder="How often do you take it?"
                        testID="med-frequency-select"
                    />
                    {errors.frequency && (
                        <Text fontSize="sm" color={colors.semantic.error}>
                            {errors.frequency}
                        </Text>
                    )}
                </Box>

                <Box display="flex" style={{ gap: spacing.md, marginBottom: spacing.lg }}>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" fontWeight="medium" style={{ marginBottom: spacing.xs }}>
                            Start Date
                        </Text>
                        <DatePicker
                            value={form.startDate}
                            onChange={(date) => updateField('startDate', date)}
                            journey="health"
                            error={errors.startDate}
                            testID="med-start-date"
                        />
                    </Box>
                    <Box style={{ flex: 1 }}>
                        <Text fontSize="sm" fontWeight="medium" style={{ marginBottom: spacing.xs }}>
                            End Date (optional)
                        </Text>
                        <DatePicker
                            value={form.endDate}
                            onChange={(date) => updateField('endDate', date)}
                            journey="health"
                            minDate={form.startDate || undefined}
                            testID="med-end-date"
                        />
                    </Box>
                </Box>

                <Box style={{ marginBottom: spacing.lg }}>
                    <Input
                        label="Special Instructions (optional)"
                        value={form.instructions}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateField('instructions', e.target.value)
                        }
                        placeholder="e.g., Take with food"
                        journey="health"
                        testID="med-instructions-input"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.md }}>
                    <Checkbox
                        id="reminders-checkbox"
                        name="reminders"
                        value="reminders"
                        label="Enable medication reminders"
                        checked={form.reminders}
                        onChange={() => updateField('reminders', !form.reminders)}
                        journey="health"
                        testID="med-reminders-checkbox"
                    />
                </Box>
            </Card>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={handleCancel}
                    accessibilityLabel="Cancel and go back"
                >
                    Cancel
                </Button>
                <Button journey="health" onPress={handleSubmit} accessibilityLabel="Save medication">
                    Save Medication
                </Button>
            </Box>
        </div>
    );
};

export default MedicationAddPage;
