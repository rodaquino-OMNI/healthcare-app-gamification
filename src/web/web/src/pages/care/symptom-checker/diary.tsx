import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const DiaryPage: React.FC = () => {
    const router = useRouter();
    const { symptoms: _symptoms, results: _results, isLoading, error } = useSymptomChecker();
    const [severity, setSeverity] = useState(5);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Dor']);
    const [notes, setNotes] = useState('');
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

    const symptomOptions = ['Dor', 'Fadiga', 'Febre', 'Tosse', 'Congestao', 'Dor de Garganta'];

    const toggleSymptom = (symptom: string): void => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
        );
    };

    const handleSave = (): void => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSeverity(5);
            setSelectedSymptoms(['Dor']);
            setNotes('');
        }, 1000);
    };

    const getSeverityColor = (value: number): string => {
        if (value <= 3) {
            return colors.semantic.warning;
        }
        if (value <= 6) {
            return colors.journeys.care.primary;
        }
        return colors.semantic.error;
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
                    Diario de Sintomas
                </Text>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
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
                    Severidade (1-10)
                </Text>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                    }}
                >
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={severity}
                        onChange={(e) => setSeverity(parseInt(e.target.value))}
                        style={{
                            flex: 1,
                            cursor: 'pointer',
                            accentColor: getSeverityColor(severity),
                        }}
                        data-testid="severity-slider"
                    />
                    <div
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '8px',
                            backgroundColor: getSeverityColor(severity) + '20',
                            color: getSeverityColor(severity),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                        }}
                        data-testid="severity-indicator"
                    >
                        {severity}
                    </div>
                </div>
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
                    Sintomas Presentes
                </Text>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: spacing.md,
                    }}
                >
                    {symptomOptions.map((symptom) => (
                        <label
                            key={symptom}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.sm,
                                cursor: 'pointer',
                                padding: spacing.sm,
                                borderRadius: '6px',
                                backgroundColor: selectedSymptoms.includes(symptom)
                                    ? colors.journeys.care.primary + '10'
                                    : 'transparent',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(symptom)}
                                onChange={() => toggleSymptom(symptom)}
                                style={{
                                    cursor: 'pointer',
                                    width: '18px',
                                    height: '18px',
                                    accentColor: colors.journeys.care.primary,
                                }}
                                data-testid={`symptom-${symptom.toLowerCase()}`}
                            />
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {symptom}
                            </Text>
                        </label>
                    ))}
                </div>
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
                    Anotacoes Pessoais
                </Text>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Como voce se sente? Que medicacoes tomou? Que atividades fez?"
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: spacing.md,
                        border: `1px solid ${colors.neutral.gray300}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                    }}
                    data-testid="diary-notes"
                />
            </div>

            <div
                style={{
                    padding: spacing.lg,
                    backgroundColor: colors.neutral.gray100,
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
                    Entradas Recentes
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {[
                        { date: '18 de Fevereiro', severity: 6, symptoms: '3 sintomas' },
                        { date: '17 de Fevereiro', severity: 7, symptoms: '4 sintomas' },
                        { date: '16 de Fevereiro', severity: 5, symptoms: '2 sintomas' },
                    ].map((entry, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: spacing.md,
                                backgroundColor: colors.neutral.white,
                                borderRadius: '6px',
                                border: `1px solid ${colors.neutral.gray300}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            data-testid={`diary-entry-${idx}`}
                        >
                            <div>
                                <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                                    {entry.date}
                                </Text>
                                <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                                    {entry.symptoms}
                                </Text>
                            </div>
                            <div
                                style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: getSeverityColor(entry.severity),
                                }}
                            >
                                {entry.severity}/10
                            </div>
                        </div>
                    ))}
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
                    data-testid="save-diary-button"
                >
                    {isSaving ? 'Salvando...' : 'Salvar Entrada'}
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
                    data-testid="cancel-diary-button"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default DiaryPage;
