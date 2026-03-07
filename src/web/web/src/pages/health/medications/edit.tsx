import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox';
import { DatePicker } from 'src/web/design-system/src/components/DatePicker/DatePicker';
import Input from 'src/web/design-system/src/components/Input/Input';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_HEALTH_ROUTES } from 'src/web/shared/constants/routes';

const FREQUENCY_OPTIONS = [
    { label: 'Once daily', value: 'once-daily' },
    { label: 'Twice daily', value: 'twice-daily' },
    { label: 'Three times daily', value: 'three-daily' },
    { label: 'Every other day', value: 'every-other' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'As needed', value: 'as-needed' },
];

/** Form state for editing a medication */
interface EditFormState {
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date | null;
    endDate: Date | null;
    notes: string;
    reminders: boolean;
}

/**
 * Edit medication form page. Pre-fills from query params and allows
 * the user to update medication details.
 */
const MedicationEditPage: React.FC = () => {
    const router = useRouter();
    const { id, name, dosage, frequency, notes } = router.query;

    const [form, setForm] = useState<EditFormState>({
        name: (name as string) || '',
        dosage: (dosage as string) || '',
        frequency: (frequency as string) || '',
        startDate: new Date(),
        endDate: null,
        notes: (notes as string) || '',
        reminders: true,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof EditFormState, string>>>({});

    const updateField = <K extends keyof EditFormState>(field: K, value: EditFormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof EditFormState, string>> = {};
        if (!form.name.trim()) newErrors.name = 'Medication name is required';
        if (!form.dosage.trim()) newErrors.dosage = 'Dosage is required';
        if (!form.frequency) newErrors.frequency = 'Frequency is required';
        if (!form.startDate) newErrors.startDate = 'Start date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        // In a real app, call API to update the medication
        router.push(WEB_HEALTH_ROUTES.MEDICATIONS);
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Edit Medication
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Update the details of your medication below.
            </Text>

            <Card journey="health" elevation="md" padding="lg">
                <Box style={{ marginBottom: spacing.lg }}>
                    <Input
                        label="Medication Name"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="e.g., Losartan"
                        journey="health"
                        error={errors.name}
                        testID="edit-name-input"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.lg }}>
                    <Input
                        label="Dosage"
                        value={form.dosage}
                        onChange={(e) => updateField('dosage', e.target.value)}
                        placeholder="e.g., 50mg"
                        journey="health"
                        error={errors.dosage}
                        testID="edit-dosage-input"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.lg }}>
                    <Select
                        label="Frequency"
                        options={FREQUENCY_OPTIONS}
                        value={form.frequency}
                        onChange={(val) => updateField('frequency', val as string)}
                        journey="health"
                        placeholder="How often do you take it?"
                        testID="edit-frequency-select"
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
                            testID="edit-start-date"
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
                            testID="edit-end-date"
                        />
                    </Box>
                </Box>

                <Box style={{ marginBottom: spacing.lg }}>
                    <Input
                        label="Notes (optional)"
                        value={form.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        placeholder="Any additional notes..."
                        journey="health"
                        testID="edit-notes-input"
                    />
                </Box>

                <Box style={{ marginBottom: spacing.md }}>
                    <Checkbox
                        id="edit-reminders-checkbox"
                        name="reminders"
                        value="reminders"
                        label="Enable medication reminders"
                        checked={form.reminders}
                        onChange={() => updateField('reminders', !form.reminders)}
                        journey="health"
                        testID="edit-reminders-checkbox"
                    />
                </Box>
            </Card>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={handleCancel} accessibilityLabel="Cancel editing">
                    Cancel
                </Button>
                <Button journey="health" onPress={handleSave} accessibilityLabel="Save medication changes">
                    Save Changes
                </Button>
            </Box>
        </div>
    );
};

export default MedicationEditPage;
