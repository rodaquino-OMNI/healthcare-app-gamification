import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React from 'react';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { CareLayout } from '@/layouts/CareLayout';

/**
 * Booking confirmation page showing appointment summary after successful scheduling.
 * Displays doctor, date, time, type, and provides options to add to calendar or start waiting room.
 */
const BookingConfirmationPage: React.FC = () => {
    const router = useRouter();
    const { doctorId, date, time, type } = router.query;
    const { appointments: _appointments, loading, error } = useAppointments();

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Confirmacao de Agendamento" />
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
                <JourneyHeader title="Confirmacao de Agendamento" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar dados. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const formattedDate = date
        ? new Date(date as string).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '';

    const isTelemedicine = type === 'telemedicina';

    const handleGoToWaitingRoom = (): void => {
        void router.push({
            pathname: WEB_CARE_ROUTES.WAITING_ROOM,
            query: { doctorId, date, time },
        });
    };

    const handleBackToAppointments = (): void => {
        void router.push(WEB_CARE_ROUTES.APPOINTMENTS);
    };

    return (
        <CareLayout>
            <JourneyHeader title="Confirmacao de Agendamento" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                {/* Success icon / message */}
                <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: colors.journeys.care.background,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: spacing.md,
                        }}
                        aria-hidden="true"
                    >
                        <Text fontSize="2xl" color={colors.journeys.care.primary}>
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

                {/* Appointment summary card */}
                <Card journey="care" elevation="md">
                    <Box padding="lg">
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.md }}
                        >
                            Resumo da consulta
                        </Text>

                        <div style={{ display: 'grid', gap: spacing.md }}>
                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Medico
                                </Text>
                                <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.text}>
                                    Dra. Ana Silva — Cardiologia
                                </Text>
                            </div>

                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Data
                                </Text>
                                <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.text}>
                                    {formattedDate}
                                </Text>
                            </div>

                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Horario
                                </Text>
                                <Text fontSize="md" fontWeight="medium" color={colors.journeys.care.text}>
                                    {time || '—'}
                                </Text>
                            </div>

                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Tipo
                                </Text>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: `${spacing.xs} ${spacing.sm}`,
                                        borderRadius: '20px',
                                        backgroundColor: isTelemedicine
                                            ? colors.journeys.care.background
                                            : colors.neutral.gray100,
                                        color: isTelemedicine
                                            ? colors.journeys.care.primary
                                            : colors.journeys.care.text,
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        marginTop: '4px',
                                    }}
                                >
                                    {isTelemedicine ? 'Telemedicina' : 'Presencial'}
                                </span>
                            </div>

                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Valor
                                </Text>
                                <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.primary}>
                                    R$ 350,00
                                </Text>
                                <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: '2px' }}>
                                    Coberto pelo convenio
                                </Text>
                            </div>
                        </div>
                    </Box>
                </Card>

                {/* Reminders card */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Lembretes
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
                            {isTelemedicine ? (
                                <>
                                    <li>Acesse a sala de espera virtual 10 minutos antes</li>
                                    <li>Verifique sua conexao de internet, camera e microfone</li>
                                    <li>Tenha seus documentos e exames em maos</li>
                                </>
                            ) : (
                                <>
                                    <li>Chegue 15 minutos antes do horario marcado</li>
                                    <li>Traga documento de identidade e carteira do convenio</li>
                                    <li>Traga exames anteriores relevantes</li>
                                </>
                            )}
                        </ul>
                    </Box>
                </Card>

                {/* Action buttons */}
                <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                    <Button journey="care" variant="outlined" onPress={handleBackToAppointments}>
                        Minhas Consultas
                    </Button>
                    {isTelemedicine && (
                        <Button journey="care" onPress={handleGoToWaitingRoom}>
                            Sala de Espera
                        </Button>
                    )}
                </Box>
            </div>
        </CareLayout>
    );
};

export default BookingConfirmationPage;
