import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useSymptomChecker } from '@/hooks';

const SaveReportPage: React.FC = () => {
    const router = useRouter();
    const { symptoms: _symptoms, results: _results, isLoading, error } = useSymptomChecker();
    const [reportTitle, setReportTitle] = useState('Symptom Assessment Report');
    const [isSaving, setIsSaving] = useState(false);

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {error.message}
                </Text>
            </div>
        );
    }

    const handleSave = (): void => {
        setIsSaving(true);
        // Simulate save operation
        setTimeout(() => {
            setIsSaving(false);
            void router.push('/care/symptom-checker/conditions-list');
        }, 1000);
    };

    return (
        <div
            style={{
                maxWidth: '720px',
                margin: '0 auto',
                padding: spacing.xl,
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.lg,
            }}
        >
            <div>
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                    Salvar Relatorio de Sintomas
                </Text>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    Mantenha seu relatorio para futuras consultas
                </Text>
            </div>

            <div
                style={{
                    padding: spacing.lg,
                    backgroundColor: colors.neutral.white,
                    borderRadius: '8px',
                    border: `1px solid ${colors.neutral.gray200}`,
                }}
            >
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Titulo do Relatorio
                </Text>
                <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `1px solid ${colors.neutral.gray300}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                    }}
                    data-testid="report-title-input"
                />
            </div>

            <div
                style={{
                    padding: spacing.lg,
                    backgroundColor: colors.neutral.gray100,
                    borderRadius: '8px',
                    borderLeft: `4px solid ${colors.journeys.care.primary}`,
                }}
            >
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    Resumo do Relatorio
                </Text>
                <Text fontSize="sm" color={colors.gray[50]} style={{ lineHeight: '1.6' }}>
                    Data: {new Date().toLocaleDateString('pt-BR')}
                    {'\n'}
                    Sintomas Registrados: 5{'\n'}
                    Condicoes Identificadas: 3{'\n'}
                    Severidade: Moderada
                </Text>
            </div>

            <div
                style={{
                    padding: spacing.lg,
                    backgroundColor: colors.neutral.white,
                    borderRadius: '8px',
                    border: `1px solid ${colors.neutral.gray200}`,
                }}
            >
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    Compartilhar Link
                </Text>
                <div
                    style={{
                        display: 'flex',
                        gap: spacing.sm,
                        alignItems: 'center',
                    }}
                >
                    <input
                        type="text"
                        value="https://app.exemplo.com/report/abc123"
                        readOnly
                        style={{
                            flex: 1,
                            padding: spacing.md,
                            border: `1px solid ${colors.neutral.gray300}`,
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            backgroundColor: colors.neutral.gray100,
                        }}
                        data-testid="share-link"
                    />
                    <button
                        style={{
                            padding: `${spacing.md} ${spacing.lg}`,
                            backgroundColor: colors.journeys.care.primary,
                            color: colors.neutral.white,
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                        data-testid="copy-link-button"
                        onClick={() => void navigator.clipboard.writeText('https://app.exemplo.com/report/abc123')}
                    >
                        Copiar
                    </button>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: spacing.md,
                    marginTop: spacing.lg,
                }}
            >
                <button
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    style={{
                        flex: 1,
                        padding: `${spacing.md} ${spacing.lg}`,
                        backgroundColor: isSaving ? colors.neutral.gray300 : colors.journeys.care.primary,
                        color: colors.neutral.white,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                    data-testid="save-report-button"
                >
                    {isSaving ? 'Salvando...' : 'Salvar Relatorio'}
                </button>
                <button
                    onClick={() => router.back()}
                    style={{
                        flex: 1,
                        padding: `${spacing.md} ${spacing.lg}`,
                        backgroundColor: colors.neutral.gray200,
                        color: colors.journeys.care.text,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                    data-testid="cancel-button"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default SaveReportPage;
