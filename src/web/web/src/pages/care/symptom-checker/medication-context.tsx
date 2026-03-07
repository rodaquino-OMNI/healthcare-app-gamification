import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface Medication {
    id: string;
    name: string;
    dosage: string;
}

const COMMON_MEDICATIONS: Medication[] = [
    { id: 'aspirin', name: 'Aspirin', dosage: '100mg daily' },
    { id: 'metformin', name: 'Metformin', dosage: '500mg twice daily' },
    { id: 'lisinopril', name: 'Lisinopril', dosage: '10mg daily' },
    { id: 'omeprazole', name: 'Omeprazole', dosage: '20mg daily' },
    { id: 'levothyroxine', name: 'Levothyroxine', dosage: '50mcg daily' },
    { id: 'amlodipine', name: 'Amlodipine', dosage: '5mg daily' },
    { id: 'atorvastatin', name: 'Atorvastatin', dosage: '20mg daily' },
    { id: 'ibuprofen', name: 'Ibuprofen', dosage: 'As needed' },
];

/** Current medications toggle list for contextualizing the symptom check. */
const MedicationContextPage: React.FC = () => {
    const router = useRouter();
    const [active, setActive] = useState<Record<string, boolean>>({});

    const toggle = (id: string) => {
        setActive((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleContinue = () => {
        const selected = Object.keys(active).filter((k) => active[k]);
        router.push({
            pathname: '/care/symptom-checker/vitals',
            query: { ...router.query, medications: selected.join(',') },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Current Medications
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Select any medications you are currently taking. This helps improve assessment accuracy.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                {COMMON_MEDICATIONS.map((med) => (
                    <Card
                        key={med.id}
                        journey="care"
                        elevation="sm"
                        interactive
                        onPress={() => toggle(med.id)}
                        backgroundColor={active[med.id] ? colors.journeys.care.background : colors.neutral.white}
                        borderColor={active[med.id] ? colors.journeys.care.primary : colors.neutral.gray300}
                        accessibilityLabel={`${med.name}${active[med.id] ? ', selected' : ''}`}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" padding="sm">
                            <div>
                                <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.text}>
                                    {med.name}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    {med.dosage}
                                </Text>
                            </div>
                            <div
                                data-testid={`toggle-${med.id}`}
                                style={{
                                    width: '40px',
                                    height: '22px',
                                    borderRadius: '11px',
                                    backgroundColor: active[med.id]
                                        ? colors.journeys.care.primary
                                        : colors.neutral.gray400,
                                    position: 'relative',
                                    transition: 'background-color 0.2s',
                                    cursor: 'pointer',
                                }}
                            >
                                <div
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        backgroundColor: colors.neutral.white,
                                        position: 'absolute',
                                        top: '2px',
                                        left: active[med.id] ? '20px' : '2px',
                                        transition: 'left 0.2s',
                                    }}
                                />
                            </div>
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
                    data-testid="medication-context-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    accessibilityLabel="Continue to vitals"
                    data-testid="medication-context-continue-btn"
                >
                    Continue
                </Button>
            </Box>
        </div>
    );
};

export default MedicationContextPage;
