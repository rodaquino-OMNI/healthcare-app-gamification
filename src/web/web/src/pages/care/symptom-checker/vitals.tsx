import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface VitalField {
    id: string;
    label: string;
    unit: string;
    placeholder: string;
    type: 'number' | 'text';
}

const VITAL_FIELDS: VitalField[] = [
    { id: 'temperature', label: 'Temperature', unit: 'C', placeholder: '36.5', type: 'number' },
    { id: 'blood-pressure', label: 'Blood Pressure', unit: 'mmHg', placeholder: '120/80', type: 'text' },
    { id: 'heart-rate', label: 'Heart Rate', unit: 'bpm', placeholder: '72', type: 'number' },
    { id: 'oxygen', label: 'Oxygen Saturation (SpO2)', unit: '%', placeholder: '98', type: 'number' },
];

/** Vitals input page for recording basic vital signs during symptom check. */
const VitalsPage: React.FC = () => {
    const router = useRouter();
    const [values, setValues] = useState<Record<string, string>>({});

    const handleChange = (id: string, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleContinue = () => {
        router.push({
            pathname: '/care/symptom-checker/analyzing',
            query: { ...router.query, ...values },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Vital Signs
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Enter your current vital signs if available. All fields are optional.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {VITAL_FIELDS.map((field) => (
                    <Card key={field.id} journey="care" elevation="sm" padding="lg">
                        <label htmlFor={field.id}>
                            <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                                {field.label}
                            </Text>
                        </label>
                        <Box display="flex" alignItems="center" style={{ gap: spacing.xs, marginTop: spacing.xs }}>
                            <input
                                id={field.id}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={values[field.id] || ''}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                data-testid={`vitals-${field.id}`}
                                style={{
                                    flex: 1,
                                    padding: spacing.sm,
                                    border: `1px solid ${colors.neutral.gray300}`,
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    color: colors.journeys.care.text,
                                    outline: 'none',
                                }}
                            />
                            <Text fontSize="sm" color={colors.gray[50]}>
                                {field.unit}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="vitals-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    accessibilityLabel="Submit vitals and analyze symptoms"
                    data-testid="vitals-continue-btn"
                >
                    Analyze Symptoms
                </Button>
            </Box>
        </div>
    );
};

export default VitalsPage;
