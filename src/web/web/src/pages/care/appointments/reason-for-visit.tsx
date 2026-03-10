import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { CareLayout } from '@/layouts/CareLayout';

const COMMON_REASONS = [
    'Check-up de rotina',
    'Dor de cabeca persistente',
    'Resultado de exames',
    'Renovacao de receita',
    'Acompanhamento pos-cirurgico',
    'Dor nas costas',
    'Pressao alta',
    'Alergia',
];

const ReasonForVisitPage: React.FC = () => {
    const router = useRouter();
    const { type } = router.query;
    const { appointments: _appointments, loading, error } = useAppointments();
    const [reason, setReason] = useState('');
    const [selectedChips, setSelectedChips] = useState<string[]>([]);

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Motivo da Consulta" />
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
                <JourneyHeader title="Motivo da Consulta" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar dados. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const toggleChip = (chip: string): void => {
        setSelectedChips((prev) => (prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]));
    };

    const handleContinue = (): void => {
        void router.push({ pathname: '/care/appointments/documents', query: { type, reason } });
    };

    const hasContent = reason.trim().length > 0 || selectedChips.length > 0;

    return (
        <CareLayout>
            <JourneyHeader title="Motivo da Consulta" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    Descreva o motivo da sua consulta
                </Text>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ex: Estou sentindo dores no peito ha 3 dias..."
                    rows={5}
                    aria-label="Motivo da consulta"
                    style={{
                        width: '100%',
                        padding: spacing.md,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray300}`,
                        fontSize: '16px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                    }}
                />

                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}
                >
                    Motivos comuns
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                    {COMMON_REASONS.map((chip) => {
                        const isActive = selectedChips.includes(chip);
                        return (
                            <button
                                key={chip}
                                onClick={() => toggleChip(chip)}
                                aria-pressed={isActive}
                                style={{
                                    padding: `${spacing.xs} ${spacing.sm}`,
                                    borderRadius: '20px',
                                    border: `1px solid ${
                                        isActive ? colors.journeys.care.primary : colors.neutral.gray300
                                    }`,
                                    backgroundColor: isActive ? colors.journeys.care.background : 'transparent',
                                    color: isActive ? colors.journeys.care.primary : colors.journeys.care.text,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                {chip}
                            </button>
                        );
                    })}
                </div>

                <Card journey="care" elevation="sm" style={{ marginTop: spacing.xl }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.xs }}
                        >
                            Anexar arquivos
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.sm }}>
                            Adicione exames, receitas ou outros documentos relevantes.
                        </Text>
                        <Button journey="care" variant="outlined" accessibilityLabel="Anexar arquivo">
                            Selecionar Arquivo
                        </Button>
                    </Box>
                </Card>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: spacing['2xl'],
                    }}
                >
                    <Button
                        journey="care"
                        onPress={handleContinue}
                        disabled={!hasContent}
                        accessibilityLabel="Continuar"
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default ReasonForVisitPage;
