import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { CareLayout } from '@/layouts/CareLayout';

const NoShowPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Ausencia Registrada" />
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
                <JourneyHeader title="Ausencia Registrada" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar dados. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    return (
        <CareLayout>
            <JourneyHeader title="Ausencia Registrada" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: colors.semantic.warningBg,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: spacing.md,
                        }}
                        aria-hidden="true"
                    >
                        <Text fontSize="2xl" color={colors.semantic.warning}>
                            !
                        </Text>
                    </div>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.text}>
                        Voce nao compareceu a consulta
                    </Text>
                    <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                        Sua ausencia foi registrada no sistema.
                    </Text>
                </div>

                <Card journey="care" elevation="md" style={{ marginBottom: spacing.md }}>
                    <Box padding="lg">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.md }}
                        >
                            Detalhes da Consulta
                        </Text>
                        <div style={{ display: 'grid', gap: spacing.sm }}>
                            <div>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Medico
                                </Text>
                                <Text fontWeight="bold" color={colors.journeys.care.text}>
                                    Dra. Ana Silva — Cardiologia
                                </Text>
                            </div>
                            <div>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Data
                                </Text>
                                <Text fontWeight="bold" color={colors.journeys.care.text}>
                                    03/03/2026 as 14:00
                                </Text>
                            </div>
                            <div>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Tipo
                                </Text>
                                <Text fontWeight="bold" color={colors.journeys.care.text}>
                                    Presencial
                                </Text>
                            </div>
                        </div>
                    </Box>
                </Card>

                <Card
                    journey="care"
                    elevation="sm"
                    style={{
                        borderLeft: `4px solid ${colors.semantic.error}`,
                        marginBottom: spacing.md,
                    }}
                >
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.semantic.error}
                            style={{ marginBottom: spacing.xs }}
                        >
                            Taxa de No-Show
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text} style={{ lineHeight: '1.6' }}>
                            Uma taxa de R$ 80,00 sera cobrada pela ausencia sem aviso previo. O valor sera adicionado a
                            sua proxima fatura.
                        </Text>
                        <div
                            style={{
                                marginTop: spacing.sm,
                                padding: spacing.sm,
                                borderRadius: '8px',
                                backgroundColor: colors.semantic.errorBg,
                            }}
                        >
                            <Text fontWeight="bold" fontSize="lg" color={colors.semantic.error}>
                                R$ 80,00
                            </Text>
                        </div>
                    </Box>
                </Card>

                <Card journey="care" elevation="sm">
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.xs }}
                        >
                            Politica de Ausencia
                        </Text>
                        <ul
                            style={{
                                margin: 0,
                                paddingLeft: spacing.md,
                                color: colors.journeys.care.text,
                                fontSize: '14px',
                                lineHeight: '1.8',
                            }}
                        >
                            <li>Tres ausencias consecutivas podem resultar em restricao de agendamento</li>
                            <li>Cancele com antecedencia para evitar taxas</li>
                            <li>Em caso de emergencia, entre em contato com o suporte</li>
                        </ul>
                    </Box>
                </Card>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: spacing['2xl'],
                    }}
                >
                    <Button
                        journey="care"
                        variant="outlined"
                        onPress={() => void router.push('/care/appointments/reschedule')}
                        accessibilityLabel="Reagendar"
                    >
                        Reagendar Consulta
                    </Button>
                    <Button
                        journey="care"
                        onPress={() => {
                            /* Contact support */
                        }}
                        accessibilityLabel="Contatar suporte"
                    >
                        Contatar Suporte
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default NoShowPage;
