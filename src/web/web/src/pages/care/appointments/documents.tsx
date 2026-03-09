import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { CareLayout } from '@/layouts/CareLayout';

interface DocumentSlot {
    id: string;
    label: string;
    required: boolean;
    uploaded: boolean;
}

const DocumentsPage: React.FC = () => {
    const router = useRouter();
    const [documents, setDocuments] = useState<DocumentSlot[]>([
        { id: 'id', label: 'Documento de Identidade', required: true, uploaded: false },
        { id: 'insurance', label: 'Carteira do Convenio', required: true, uploaded: false },
        { id: 'referral', label: 'Encaminhamento Medico', required: false, uploaded: false },
        { id: 'exams', label: 'Exames Anteriores', required: false, uploaded: false },
    ]);

    const handleUpload = (docId: string): void => {
        setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, uploaded: true } : d)));
    };

    const requiredComplete = documents.filter((d) => d.required).every((d) => d.uploaded);

    const handleContinue = (): void => {
        void router.push({ pathname: '/care/appointments/insurance', query: router.query });
    };

    return (
        <CareLayout>
            <JourneyHeader title="Documentos" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.xs }}
                >
                    Envie seus documentos
                </Text>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xl }}>
                    Documentos obrigatorios estao marcados com *.
                </Text>

                <div style={{ display: 'grid', gap: spacing.md }}>
                    {documents.map((doc) => (
                        <Card key={doc.id} journey="care" elevation="sm">
                            <Box padding="md">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                            {doc.label} {doc.required ? '*' : ''}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            color={colors.gray[50]}
                                            style={{ marginTop: spacing['3xs'] }}
                                        >
                                            {doc.required ? 'Obrigatorio' : 'Opcional'}
                                        </Text>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: spacing.sm,
                                        }}
                                    >
                                        {doc.uploaded && (
                                            <span
                                                style={{
                                                    padding: `${spacing['3xs']} ${spacing.xs}`,
                                                    borderRadius: '12px',
                                                    backgroundColor: colors.semantic.successBg,
                                                    color: colors.semantic.success,
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Enviado
                                            </span>
                                        )}
                                        <Button
                                            journey="care"
                                            variant={doc.uploaded ? 'outlined' : 'filled'}
                                            size="sm"
                                            onPress={() => handleUpload(doc.id)}
                                            accessibilityLabel={`Enviar ${doc.label}`}
                                        >
                                            {doc.uploaded ? 'Trocar' : 'Enviar'}
                                        </Button>
                                    </div>
                                </div>
                            </Box>
                        </Card>
                    ))}
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: spacing['2xl'],
                    }}
                >
                    <Button journey="care" variant="outlined" onPress={() => router.back()} accessibilityLabel="Voltar">
                        Voltar
                    </Button>
                    <Button
                        journey="care"
                        onPress={handleContinue}
                        disabled={!requiredComplete}
                        accessibilityLabel="Continuar"
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default DocumentsPage;
