import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface MedicationField {
    label: string;
    value: string;
    editable: boolean;
}

/**
 * OCR review page for scanned medication prescriptions.
 * Displays extracted text with editable fields for correction.
 */
const OCRReviewPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const [fields, setFields] = useState<MedicationField[]>([
        { label: 'Nome do Medicamento', value: 'Amoxicilina', editable: true },
        { label: 'Dosagem', value: '500mg', editable: true },
        { label: 'Frequência', value: '3x ao dia', editable: true },
        { label: 'Duração', value: '7 dias', editable: true },
        { label: 'Prescritor', value: 'Dr. João Silva', editable: false },
    ]);

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    const handleFieldChange = (index: number, newValue: string): void => {
        const updated = [...fields];
        updated[index].value = newValue;
        setFields(updated);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Revisão OCR
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Verifique e corrija os dados do medicamento digitalizados.
            </Text>

            {/* Scanned Preview */}
            <Card journey="health" elevation="sm" padding="lg">
                <Text fontSize="sm" fontWeight="medium" color={colors.gray[50]}>
                    Dados Extraídos
                </Text>
                <div style={{ marginTop: spacing.lg }}>
                    {fields.map((field, index) => (
                        <Box key={`field-${index}`} style={{ marginBottom: spacing.lg }}>
                            <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xs }}>
                                {field.label}
                            </Text>
                            <input
                                type="text"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, e.target.value)}
                                disabled={!field.editable}
                                style={{
                                    width: '100%',
                                    padding: spacing.md,
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.neutral.gray300}`,
                                    fontSize: '14px',
                                    backgroundColor: field.editable ? colors.gray[0] : colors.gray[10],
                                    color: colors.neutral.gray900,
                                    fontFamily: 'inherit',
                                }}
                                data-testid={`field-${field.label}`}
                            />
                        </Box>
                    ))}
                </div>
            </Card>

            {/* Action Buttons */}
            <Box style={{ marginTop: spacing.xl }}>
                <Button
                    variant="primary"
                    journey="health"
                    onPress={() => alert('Medicamento confirmado!')}
                    accessibilityLabel="Confirmar dados"
                >
                    Confirmar
                </Button>
            </Box>

            <Box style={{ marginTop: spacing.md }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => alert('Digitalizando novamente...')}
                    accessibilityLabel="Tentar novamente"
                >
                    Tentar Novamente
                </Button>
            </Box>

            <Box style={{ marginTop: spacing.md }}>
                <Button variant="tertiary" journey="health" onPress={() => router.back()} accessibilityLabel="Cancelar">
                    Cancelar
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default OCRReviewPage;
