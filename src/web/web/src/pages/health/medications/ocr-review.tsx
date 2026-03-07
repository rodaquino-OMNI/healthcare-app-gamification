import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

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
    const router = useRouter();
    const [fields, setFields] = useState<MedicationField[]>([
        { label: 'Nome do Medicamento', value: 'Amoxicilina', editable: true },
        { label: 'Dosagem', value: '500mg', editable: true },
        { label: 'Frequência', value: '3x ao dia', editable: true },
        { label: 'Duração', value: '7 dias', editable: true },
        { label: 'Prescritor', value: 'Dr. João Silva', editable: false },
    ]);

    const handleFieldChange = (index: number, newValue: string) => {
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
                                    backgroundColor: field.editable ? '#fff' : colors.gray[100],
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

export default OCRReviewPage;
