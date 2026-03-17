import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { CareLayout } from '@/layouts/CareLayout';

const CANCEL_REASONS = [
    'Nao preciso mais da consulta',
    'Encontrei outro profissional',
    'Problemas financeiros',
    'Conflito de agenda',
    'Outro motivo',
];

const CancelPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const [reason, setReason] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Cancelar Consulta" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.gray[50]}>
                        Carregando...
                    </Text>
                </div>
            </CareLayout>
        );
    }

    if (error) {
        return (
            <CareLayout>
                <JourneyHeader title="Cancelar Consulta" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar consulta. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const canCancel = reason !== '' && acknowledged;

    const handleCancel = (): void => {
        void router.push('/care/appointments/cancelled');
    };

    return (
        <CareLayout>
            <JourneyHeader title="Cancelar Consulta" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <Card journey="care" elevation="sm" style={{ marginBottom: spacing.xl }}>
                    <Box padding="md">
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Consulta
                        </Text>
                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                            Dra. Ana Silva — Cardiologia
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.primary}>
                            03/03/2026 as 14:00 — Presencial
                        </Text>
                    </Box>
                </Card>

                <Card
                    journey="care"
                    elevation="sm"
                    style={{
                        marginBottom: spacing.xl,
                        borderLeft: `4px solid ${colors.semantic.warning}`,
                    }}
                >
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.semantic.warning}
                            style={{ marginBottom: spacing.xs }}
                        >
                            Politica de Cancelamento
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text} style={{ lineHeight: '1.6' }}>
                            Cancelamentos com menos de 24 horas de antecedencia estao sujeitos a cobranca de 50% do
                            valor da consulta. Cancelamentos com mais de 24 horas sao gratuitos. O reembolso sera
                            processado em ate 5 dias uteis.
                        </Text>
                    </Box>
                </Card>

                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Motivo do cancelamento
                </Text>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    aria-label="Motivo do cancelamento"
                    style={{
                        width: '100%',
                        padding: spacing.sm,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray300}`,
                        fontSize: '16px',
                        marginBottom: spacing.xl,
                    }}
                >
                    <option value="">Selecione o motivo</option>
                    {CANCEL_REASONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>

                <label
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: spacing.sm,
                        marginBottom: spacing['2xl'],
                        cursor: 'pointer',
                    }}
                >
                    <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        aria-label="Aceitar politica de cancelamento"
                        style={{ marginTop: '3px', accentColor: colors.journeys.care.primary }}
                    />
                    <Text fontSize="sm" color={colors.journeys.care.text}>
                        Li e concordo com a politica de cancelamento. Entendo que poderei ser cobrado(a) caso o
                        cancelamento ocorra com menos de 24 horas de antecedencia.
                    </Text>
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button journey="care" onPress={() => router.back()} accessibilityLabel="Manter consulta">
                        Manter Consulta
                    </Button>
                    <Button
                        journey="care"
                        variant="outlined"
                        onPress={handleCancel}
                        disabled={!canCancel}
                        accessibilityLabel="Cancelar consulta"
                    >
                        Cancelar Consulta
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default CancelPage;
