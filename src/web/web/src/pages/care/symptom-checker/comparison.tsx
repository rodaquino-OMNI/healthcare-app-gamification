import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface ComparisonData {
    symptom: string;
    date1Severity: number;
    date2Severity: number;
    trend: 'improved' | 'worsened' | 'stable';
}

const ComparisonPage: React.FC = () => {
    const router = useRouter();
    const { symptoms: _symptoms, results: _results, isLoading, error } = useSymptomChecker();

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

    const comparisonData: ComparisonData[] = [
        { symptom: 'Dor de Cabeca', date1Severity: 8, date2Severity: 5, trend: 'improved' },
        { symptom: 'Sensibilidade a Luz', date1Severity: 7, date2Severity: 4, trend: 'improved' },
        { symptom: 'Nausea', date1Severity: 6, date2Severity: 6, trend: 'stable' },
        { symptom: 'Fadiga', date1Severity: 5, date2Severity: 7, trend: 'worsened' },
        { symptom: 'Rigidez no Pescoco', date1Severity: 4, date2Severity: 3, trend: 'improved' },
    ];

    const getTrendIcon = (trend: 'improved' | 'worsened' | 'stable'): string => {
        switch (trend) {
            case 'improved':
                return '📉';
            case 'worsened':
                return '📈';
            case 'stable':
                return '➡️';
        }
    };

    const getTrendColor = (trend: 'improved' | 'worsened' | 'stable'): string => {
        switch (trend) {
            case 'improved':
                return colors.semantic.success;
            case 'worsened':
                return colors.semantic.error;
            case 'stable':
                return colors.semantic.warning;
        }
    };

    const getTrendLabel = (trend: 'improved' | 'worsened' | 'stable'): string => {
        switch (trend) {
            case 'improved':
                return 'Melhorou';
            case 'worsened':
                return 'Piorou';
            case 'stable':
                return 'Estavel';
        }
    };

    const SeverityBar = ({ severity }: { severity: number }): React.ReactElement => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
            }}
        >
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: colors.neutral.gray200,
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${(severity / 10) * 100}%`,
                            height: '100%',
                            backgroundColor:
                                severity > 6
                                    ? colors.semantic.error
                                    : severity > 3
                                      ? colors.journeys.care.primary
                                      : colors.semantic.warning,
                            borderRadius: '4px',
                        }}
                    />
                </div>
            </div>
            <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.journeys.care.text}
                style={{ minWidth: '30px', textAlign: 'right' }}
            >
                {severity}/10
            </Text>
        </div>
    );

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
                    Comparacao de Sintomas
                </Text>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.sm }}>
                    Acompanhe a evolucao dos seus sintomas ao longo do tempo
                </Text>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.md,
                    padding: spacing.lg,
                    backgroundColor: colors.neutral.gray100,
                    borderRadius: '8px',
                    border: `1px solid ${colors.neutral.gray200}`,
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                        12 de Fevereiro
                    </Text>
                    <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                        Relatorio Inicial
                    </Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                        19 de Fevereiro
                    </Text>
                    <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing.xs }}>
                        Acompanhamento (7 dias)
                    </Text>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                }}
            >
                {comparisonData.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            padding: spacing.lg,
                            backgroundColor: colors.neutral.white,
                            borderRadius: '8px',
                            border: `1px solid ${colors.neutral.gray200}`,
                        }}
                        data-testid={`comparison-row-${idx}`}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: spacing.md,
                            }}
                        >
                            <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                                {item.symptom}
                            </Text>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing.xs,
                                    padding: `${spacing.xs} ${spacing.sm}`,
                                    backgroundColor: getTrendColor(item.trend) + '20',
                                    borderRadius: '4px',
                                }}
                            >
                                <span>{getTrendIcon(item.trend)}</span>
                                <Text fontSize="xs" fontWeight="medium" color={getTrendColor(item.trend)}>
                                    {getTrendLabel(item.trend)}
                                </Text>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: spacing.md,
                            }}
                        >
                            <div>
                                <Text fontSize="xs" color={colors.gray[40]} style={{ marginBottom: spacing.sm }}>
                                    12 de Fevereiro
                                </Text>
                                <SeverityBar severity={item.date1Severity} />
                            </div>
                            <div>
                                <Text fontSize="xs" color={colors.gray[40]} style={{ marginBottom: spacing.sm }}>
                                    19 de Fevereiro
                                </Text>
                                <SeverityBar severity={item.date2Severity} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    padding: spacing.lg,
                    backgroundColor: colors.journeys.care.primary + '10',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${colors.journeys.care.primary}`,
                }}
            >
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Resumo do Progresso
                </Text>
                <Text fontSize="sm" color={colors.journeys.care.text} style={{ lineHeight: '1.6' }}>
                    3 sintomas melhoraram
                    {'\n'}1 sintoma permaneceu estavel
                    {'\n'}1 sintoma piorou
                </Text>
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
                    data-testid="export-comparison-button"
                    onClick={() => {
                        // Simulate export
                        alert('Comparacao exportada como PDF');
                    }}
                >
                    Exportar Comparacao
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
                    data-testid="share-comparison-button"
                    onClick={() => void router.push('/care/symptom-checker/share-report')}
                >
                    Compartilhar
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ComparisonPage;
