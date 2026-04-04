import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { CareLayout } from '@/layouts/CareLayout';

const SuccessPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const { t } = useTranslation();

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Agendamento Confirmado" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.gray[50]}>
                        {t('common.loading')}
                    </Text>
                </div>
            </CareLayout>
        );
    }

    if (error) {
        return (
            <CareLayout>
                <JourneyHeader title="Agendamento Confirmado" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        {t('common.error')}
                    </Text>
                </div>
            </CareLayout>
        );
    }

    return (
        <CareLayout>
            <JourneyHeader title="Agendamento Confirmado" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: colors.semantic.successBg,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: spacing.md,
                        }}
                        aria-hidden="true"
                    >
                        <Text fontSize="2xl" color={colors.semantic.success}>
                            OK
                        </Text>
                    </div>
                    <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.text}>
                        Consulta agendada com sucesso!
                    </Text>
                    <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                        Voce recebera uma confirmacao por e-mail e notificacao.
                    </Text>
                </div>

                <Card journey="care" elevation="md">
                    <Box padding="lg">
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.md }}
                        >
                            Resumo da Consulta
                        </Text>
                        <div style={{ display: 'grid', gap: spacing.md }}>
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
                                    Segunda-feira, 3 de marco de 2026
                                </Text>
                            </div>
                            <div>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Horario
                                </Text>
                                <Text fontWeight="bold" color={colors.journeys.care.text}>
                                    14:00
                                </Text>
                            </div>
                            <div>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Tipo
                                </Text>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: `${spacing['3xs']} ${spacing.xs}`,
                                        borderRadius: '12px',
                                        backgroundColor: colors.journeys.care.background,
                                        color: colors.journeys.care.primary,
                                        fontSize: '14px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Presencial
                                </span>
                            </div>
                            <div>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    Local
                                </Text>
                                <Text fontWeight="bold" color={colors.journeys.care.text}>
                                    Clinica AUSTA Centro — Rua Augusta, 1200
                                </Text>
                            </div>
                        </div>
                    </Box>
                </Card>

                <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
                    <Button
                        journey="care"
                        variant="outlined"
                        accessibilityLabel="Adicionar ao calendario"
                        style={{ marginBottom: spacing.md }}
                    >
                        Adicionar ao Calendario
                    </Button>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: spacing.xl,
                    }}
                >
                    <Button
                        journey="care"
                        variant="outlined"
                        onPress={() => void router.push('/care/appointments/list')}
                        accessibilityLabel="Ver consultas"
                    >
                        Ver Minhas Consultas
                    </Button>
                    <Button
                        journey="care"
                        onPress={() => void router.push('/care/appointments')}
                        accessibilityLabel="Voltar ao inicio"
                    >
                        Voltar ao Inicio
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default SuccessPage;
