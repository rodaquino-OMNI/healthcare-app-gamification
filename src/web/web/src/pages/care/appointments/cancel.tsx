import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { CareLayout } from 'src/web/web/src/layouts/CareLayout';
import { JourneyHeader } from 'src/web/web/src/components/shared/JourneyHeader';

const CANCEL_REASONS = [
    'Nao preciso mais da consulta',
    'Encontrei outro profissional',
    'Problemas financeiros',
    'Conflito de agenda',
    'Outro motivo',
];

const CancelPage: React.FC = () => {
    const router = useRouter();
    const [reason, setReason] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);

    const canCancel = reason !== '' && acknowledged;

    const handleCancel = () => {
        router.push('/care/appointments/cancelled');
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
                    style={{ marginBottom: spacing.xl, borderLeft: `4px solid ${colors.semantic.warning}` }}
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

export default CancelPage;
