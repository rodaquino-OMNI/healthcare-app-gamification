import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { CareLayout } from '@/layouts/CareLayout';

/** Equipment check item for pre-consultation verification */
interface EquipmentCheck {
    id: string;
    label: string;
    description: string;
    status: 'checking' | 'ok' | 'error';
}

/** Initial equipment checks defined outside component to avoid deps issues */
const INITIAL_EQUIPMENT_CHECKS: EquipmentCheck[] = [
    {
        id: 'internet',
        label: 'Conexao de Internet',
        description: 'Verificando velocidade...',
        status: 'checking',
    },
    {
        id: 'camera',
        label: 'Camera',
        description: 'Verificando acesso...',
        status: 'checking',
    },
    {
        id: 'microphone',
        label: 'Microfone',
        description: 'Verificando acesso...',
        status: 'checking',
    },
    {
        id: 'speaker',
        label: 'Alto-falante',
        description: 'Verificando saida de audio...',
        status: 'checking',
    },
];

/**
 * Pre-consultation waiting room page.
 * Runs equipment checks (camera, microphone, internet) and shows
 * a countdown/queue position until the doctor is ready.
 */
const WaitingRoomPage: React.FC = () => {
    const router = useRouter();
    const { time } = router.query;
    const { appointments: _appointments, loading, error } = useAppointments();

    const [equipmentChecks, setEquipmentChecks] = useState<EquipmentCheck[]>(INITIAL_EQUIPMENT_CHECKS);

    const [queuePosition, setQueuePosition] = useState(2);
    const [estimatedWait, setEstimatedWait] = useState('5 minutos');
    const hasRunChecks = useRef(false);

    // Simulate equipment checks completing (mount-only)
    useEffect(() => {
        if (hasRunChecks.current) {
            return;
        }
        hasRunChecks.current = true;

        const timers = INITIAL_EQUIPMENT_CHECKS.map((check, index) =>
            setTimeout(
                () => {
                    setEquipmentChecks((prev) =>
                        prev.map((c) =>
                            c.id === check.id
                                ? {
                                      ...c,
                                      status: 'ok' as const,
                                      description: 'Funcionando corretamente',
                                  }
                                : c
                        )
                    );
                },
                1000 + index * 800
            )
        );

        return () => timers.forEach(clearTimeout);
    }, []);

    // Simulate queue position decreasing
    useEffect(() => {
        const interval = setInterval(() => {
            setQueuePosition((prev) => {
                if (prev <= 0) {
                    return 0;
                }
                const newPos = prev - 1;
                setEstimatedWait(newPos === 0 ? 'Agora' : `${newPos * 3} minutos`);
                return newPos;
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const allChecksOk = equipmentChecks.every((c) => c.status === 'ok');
    const isReady = allChecksOk && queuePosition === 0;

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Sala de Espera" />
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
                <JourneyHeader title="Sala de Espera" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar dados. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const handleJoinConsultation = (): void => {
        // In production, this would connect to the video consultation
        void router.push('/care/telemedicine');
    };

    const handleCancelWaiting = (): void => {
        router.back();
    };

    const getStatusColor = (status: EquipmentCheck['status']): string => {
        switch (status) {
            case 'ok':
                return colors.semantic.success;
            case 'error':
                return colors.semantic.error;
            case 'checking':
            default:
                return colors.journeys.care.primary;
        }
    };

    const getStatusLabel = (status: EquipmentCheck['status']): string => {
        switch (status) {
            case 'ok':
                return 'OK';
            case 'error':
                return 'Erro';
            case 'checking':
            default:
                return '...';
        }
    };

    return (
        <CareLayout>
            <JourneyHeader title="Sala de Espera" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                {/* Appointment info */}
                <Card journey="care" elevation="sm">
                    <Box padding="md" display="flex" justifyContent="space-between" alignItems="center">
                        <div>
                            <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                Dra. Ana Silva
                            </Text>
                            <Text fontSize="sm" color={colors.journeys.care.primary}>
                                Cardiologia
                            </Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Text fontSize="sm" color={colors.gray[50]}>
                                Horario: {time || '—'}
                            </Text>
                        </div>
                    </Box>
                </Card>

                {/* Queue status */}
                <Card journey="care" elevation="md" style={{ marginTop: spacing.md }}>
                    <Box padding="lg" style={{ textAlign: 'center' }}>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Posicao na fila
                        </Text>
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={queuePosition === 0 ? colors.semantic.success : colors.journeys.care.primary}
                            style={{ marginTop: spacing.xs }}
                        >
                            {queuePosition === 0 ? 'Sua vez!' : `#${queuePosition}`}
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                            Tempo estimado: {estimatedWait}
                        </Text>
                    </Box>
                </Card>

                {/* Equipment checks */}
                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}
                >
                    Verificacao de equipamentos
                </Text>

                <div style={{ display: 'grid', gap: spacing.sm }}>
                    {equipmentChecks.map((check) => (
                        <Card key={check.id} journey="care" elevation="sm">
                            <Box padding="sm" display="flex" justifyContent="space-between" alignItems="center">
                                <div>
                                    <Text fontSize="sm" fontWeight="medium" color={colors.journeys.care.text}>
                                        {check.label}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {check.description}
                                    </Text>
                                </div>
                                <span
                                    style={{
                                        padding: `${spacing.xs} ${spacing.sm}`,
                                        borderRadius: '20px',
                                        backgroundColor: `${getStatusColor(check.status)}20`,
                                        color: getStatusColor(check.status),
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        minWidth: '40px',
                                        textAlign: 'center',
                                    }}
                                    role="status"
                                    aria-label={`${check.label}: ${getStatusLabel(check.status)}`}
                                >
                                    {getStatusLabel(check.status)}
                                </span>
                            </Box>
                        </Card>
                    ))}
                </div>

                {/* Tips */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.lg }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Enquanto aguarda
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
                            <li>Verifique se esta em um ambiente silencioso e bem iluminado</li>
                            <li>Tenha seus documentos e exames anteriores em maos</li>
                            <li>Anote suas duvidas para aproveitar melhor a consulta</li>
                            <li>Mantenha esta pagina aberta — voce sera notificado quando o medico estiver pronto</li>
                        </ul>
                    </Box>
                </Card>

                {/* Action buttons */}
                <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                    <Button journey="care" variant="outlined" onPress={handleCancelWaiting}>
                        Cancelar
                    </Button>
                    <Button
                        journey="care"
                        onPress={handleJoinConsultation}
                        disabled={!isReady}
                        accessibilityLabel={isReady ? 'Entrar na consulta' : 'Aguardando sua vez'}
                    >
                        {isReady ? 'Entrar na Consulta' : 'Aguardando...'}
                    </Button>
                </Box>
            </div>
        </CareLayout>
    );
};

export default WaitingRoomPage;
