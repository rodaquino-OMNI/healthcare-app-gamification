import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

const HistoryDetailPage: React.FC = () => {
    const router = useRouter();

    const getSeverityColor = (severity: string): string => {
        switch (severity) {
            case 'Leve':
                return colors.semantic.warning;
            case 'Moderada':
                return colors.journeys.care.primary;
            case 'Severa':
                return colors.semantic.error;
            default:
                return colors.journeys.care.primary;
        }
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
            <button
                onClick={() => router.back()}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    marginBottom: spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.journeys.care.primary,
                    fontSize: '14px',
                    fontWeight: '500',
                }}
                data-testid="back-button"
            >
                ← Voltar
            </button>

            <div>
                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                    Detalhes do Historico
                </Text>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    19 de Fevereiro de 2026
                </Text>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: spacing.md,
                }}
            >
                <div
                    style={{
                        padding: spacing.md,
                        backgroundColor: colors.neutral.white,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray200}`,
                    }}
                >
                    <Text fontSize="xs" color={colors.gray[40]} style={{ marginBottom: spacing.sm }}>
                        Regiao Corporal
                    </Text>
                    <div
                        style={{
                            display: 'inline-block',
                            padding: `${spacing.xs} ${spacing.sm}`,
                            backgroundColor: colors.journeys.care.primary + '20',
                            color: colors.journeys.care.primary,
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '500',
                        }}
                        data-testid="body-region-tag"
                    >
                        Cabeca
                    </div>
                </div>

                <div
                    style={{
                        padding: spacing.md,
                        backgroundColor: colors.neutral.white,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray200}`,
                    }}
                >
                    <Text fontSize="xs" color={colors.gray[40]} style={{ marginBottom: spacing.sm }}>
                        Severidade
                    </Text>
                    <div
                        style={{
                            display: 'inline-block',
                            padding: `${spacing.xs} ${spacing.sm}`,
                            backgroundColor: getSeverityColor('Moderada') + '20',
                            color: getSeverityColor('Moderada'),
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '500',
                        }}
                        data-testid="severity-badge"
                    >
                        Moderada
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
                    Condicoes Identificadas
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {[
                        { name: 'Cefaleia Tensional', probability: '72%' },
                        { name: 'Enxaqueca', probability: '68%' },
                        { name: 'Sinusite', probability: '45%' },
                    ].map((condition, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: spacing.md,
                                borderBottom: idx < 2 ? `1px solid ${colors.neutral.gray200}` : 'none',
                            }}
                        >
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {condition.name}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.primary}>
                                {condition.probability}
                            </Text>
                        </div>
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
                    Acoes Recomendadas
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {[
                        'Descanso e reducao de stress',
                        'Medicacao recomendada pelo medico',
                        'Consulta com especialista se persistir',
                        'Acompanhar sintomas por 7 dias',
                    ].map((action, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                gap: spacing.md,
                                alignItems: 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: colors.journeys.care.primary,
                                    color: colors.neutral.white,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    flexShrink: 0,
                                }}
                            >
                                ✓
                            </div>
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {action}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: spacing.md,
                }}
            >
                <button
                    style={{
                        flex: 1,
                        padding: `${spacing.md} ${spacing.lg}`,
                        backgroundColor: colors.journeys.care.primary,
                        color: colors.neutral.white,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                    data-testid="view-full-report-button"
                    onClick={() => void router.push('/care/symptom-checker')}
                >
                    Ver Relatorio Completo
                </button>
                <button
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
                    data-testid="share-detail-button"
                    onClick={() => void router.push('/care/symptom-checker/share-report')}
                >
                    Compartilhar
                </button>
            </div>
        </div>
    );
};

export default HistoryDetailPage;
