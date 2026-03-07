import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

type StatusOption = 'Melhor' | 'Igual' | 'Pior';

const FollowUpPage: React.FC = () => {
    const router = useRouter();
    const [status, setStatus] = useState<StatusOption>('Igual');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/care/symptom-checker/history-detail');
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
                    Acompanhamento de Sintomas
                </Text>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    Como voce esta se sentindo desde o ultimo relatorio?
                </Text>
            </div>

            <div
                style={{
                    padding: spacing.lg,
                    backgroundColor: colors.neutral.gray50,
                    borderRadius: '8px',
                    border: `1px solid ${colors.neutral.gray200}`,
                }}
            >
                <Text fontSize="sm" color={colors.gray[40]} style={{ marginBottom: spacing.md }}>
                    Data do Relatorio Original: 12 de Fevereiro de 2026
                </Text>
                <Text fontSize="sm" color={colors.gray[40]}>
                    Tempo decorrido: 7 dias
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
                    Status Atual
                </Text>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: spacing.md,
                    }}
                >
                    {(['Melhor', 'Igual', 'Pior'] as const).map((option) => (
                        <button
                            key={option}
                            onClick={() => setStatus(option)}
                            style={{
                                padding: spacing.md,
                                backgroundColor:
                                    status === option ? colors.journeys.care.primary : colors.neutral.white,
                                color: status === option ? colors.neutral.white : colors.journeys.care.text,
                                border: `2px solid ${status === option ? colors.journeys.care.primary : colors.neutral.gray300}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                            }}
                            data-testid={`status-${option.toLowerCase()}`}
                        >
                            {option === 'Melhor' && '📈'}
                            {option === 'Igual' && '➡️'}
                            {option === 'Pior' && '📉'}
                            <div style={{ marginTop: spacing.xs }}>{option}</div>
                        </button>
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
                    Observacoes Adicionais
                </Text>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Descreva como voce esta se sentindo, qualquer mudanca nos sintomas, ou medicamentos que tomou..."
                    style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: spacing.md,
                        border: `1px solid ${colors.neutral.gray300}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                    }}
                    data-testid="follow-up-notes"
                />
                <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing.sm }}>
                    {notes.length} / 500 caracteres
                </Text>
            </div>

            <div
                style={{
                    padding: spacing.lg,
                    backgroundColor: colors.journeys.care.primary + '10',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${colors.journeys.care.primary}`,
                }}
            >
                <Text fontSize="sm" color={colors.journeys.care.text}>
                    Seu acompanhamento ajuda a melhorar seu historico de saude e fornece informacoes valiosas para seus
                    medicos.
                </Text>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: spacing.md,
                    marginTop: spacing.lg,
                }}
            >
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        flex: 1,
                        padding: `${spacing.md} ${spacing.lg}`,
                        backgroundColor: isSubmitting ? colors.neutral.gray300 : colors.journeys.care.primary,
                        color: colors.neutral.white,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                    data-testid="submit-follow-up-button"
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Acompanhamento'}
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
                    data-testid="cancel-follow-up-button"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default FollowUpPage;
