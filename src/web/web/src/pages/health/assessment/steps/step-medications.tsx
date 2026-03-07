import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
    data: Record<string, any>;
    onUpdate: (field: string, value: any) => void;
}

interface MedicationEntry {
    name: string;
    dosage: string;
    frequency: string;
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: 8,
    fontSize: 14,
    color: colors.neutral.gray900,
    backgroundColor: colors.neutral.white,
    outline: 'none',
    boxSizing: 'border-box',
};

const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed'];

const StepMedicationsPage: React.FC<StepProps> = ({ data, onUpdate }) => {
    const takesMedication: boolean = data.takesMedication ?? false;
    const medications: MedicationEntry[] = data.medications || [];

    const toggleMedication = (value: boolean) => {
        onUpdate('takesMedication', value);
        if (!value) {
            onUpdate('medications', []);
        }
    };

    const addMedication = () => {
        onUpdate('medications', [...medications, { name: '', dosage: '', frequency: '' }]);
    };

    const updateMedication = (index: number, field: keyof MedicationEntry, value: string) => {
        const updated = medications.map((med, i) => (i === index ? { ...med, [field]: value } : med));
        onUpdate('medications', updated);
    };

    const removeMedication = (index: number) => {
        onUpdate(
            'medications',
            medications.filter((_, i) => i !== index)
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
                Current Medications
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
                List any medications, supplements, or vitamins you take regularly.
            </Text>

            {/* Yes/No toggle */}
            <div style={{ display: 'flex', gap: spacing.xs }}>
                {[
                    { label: 'Yes, I take medications', value: true },
                    { label: 'No medications', value: false },
                ].map((opt) => {
                    const isActive = takesMedication === opt.value;
                    return (
                        <button
                            key={opt.label}
                            onClick={() => toggleMedication(opt.value)}
                            style={{
                                flex: 1,
                                padding: spacing.sm,
                                borderRadius: 8,
                                border: `1px solid ${isActive ? colors.journeys.health.primary : colors.neutral.gray300}`,
                                backgroundColor: isActive ? colors.journeys.health.primary : colors.neutral.white,
                                color: isActive ? colors.neutral.white : colors.neutral.gray900,
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 400,
                            }}
                            aria-pressed={isActive}
                            aria-label={opt.label}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            {/* Medication list */}
            {takesMedication && (
                <>
                    {medications.map((med, idx) => (
                        <Card key={`med-${idx}`} journey="health" elevation="sm" padding="md">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: spacing.sm,
                                }}
                            >
                                <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                                    Medication {idx + 1}
                                </Text>
                                <button
                                    onClick={() => removeMedication(idx)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: colors.semantic.error,
                                        cursor: 'pointer',
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                    aria-label={`Remove medication ${idx + 1}`}
                                >
                                    Remove
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                                <input
                                    style={inputStyle}
                                    placeholder="Medication name"
                                    value={med.name}
                                    onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                                    aria-label={`Medication ${idx + 1} name`}
                                />
                                <input
                                    style={inputStyle}
                                    placeholder="Dosage (e.g. 500mg)"
                                    value={med.dosage}
                                    onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                                    aria-label={`Medication ${idx + 1} dosage`}
                                />
                                <select
                                    style={inputStyle}
                                    value={med.frequency}
                                    onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                                    aria-label={`Medication ${idx + 1} frequency`}
                                >
                                    <option value="">Select frequency</option>
                                    {FREQUENCY_OPTIONS.map((f) => (
                                        <option key={f} value={f}>
                                            {f}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Card>
                    ))}

                    <Button
                        variant="secondary"
                        journey="health"
                        onPress={addMedication}
                        accessibilityLabel="Add another medication"
                    >
                        + Add Medication
                    </Button>
                </>
            )}
        </div>
    );
};

export default StepMedicationsPage;
