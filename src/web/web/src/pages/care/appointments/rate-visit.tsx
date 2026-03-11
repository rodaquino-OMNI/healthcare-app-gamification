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

const CATEGORIES = [
    { id: 'punctuality', label: 'Pontualidade' },
    { id: 'attention', label: 'Atencao ao paciente' },
    { id: 'clarity', label: 'Clareza nas explicacoes' },
    { id: 'environment', label: 'Ambiente da clinica' },
];

const StarSelector: React.FC<{ value: number; onChange: (v: number) => void; label: string }> = ({
    value,
    onChange,
    label,
}) => (
    <div style={{ display: 'flex', gap: spacing['3xs'] }} role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                onClick={() => onChange(star)}
                aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                aria-pressed={value >= star}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                    color: value >= star ? colors.journeys.care.primary : colors.neutral.gray300,
                    padding: spacing['3xs'],
                }}
            >
                {value >= star ? '\u2605' : '\u2606'}
            </button>
        ))}
    </div>
);

const RateVisitPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const [overallRating, setOverallRating] = useState(0);
    const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>(
        Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]))
    );
    const [review, setReview] = useState('');
    const [recommend, setRecommend] = useState<boolean | null>(null);

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Avaliar Consulta" />
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
                <JourneyHeader title="Avaliar Consulta" />
                <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar dados. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const handleCategoryChange = (id: string, value: number): void => {
        setCategoryRatings((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (): void => {
        void router.push('/care/appointments/list');
    };

    return (
        <CareLayout>
            <JourneyHeader title="Avaliar Consulta" />
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
                <Card journey="care" elevation="sm" style={{ marginBottom: spacing.xl }}>
                    <Box padding="md" style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: colors.journeys.care.background,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: spacing.sm,
                            }}
                        >
                            <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.primary}>
                                AS
                            </Text>
                        </div>
                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                            Dra. Ana Silva
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Cardiologia — 03/03/2026
                        </Text>
                    </Box>
                </Card>

                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Avaliacao geral
                </Text>
                <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                    <StarSelector value={overallRating} onChange={setOverallRating} label="Avaliacao geral" />
                </div>

                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    Avaliacoes por categoria
                </Text>
                <div style={{ display: 'grid', gap: spacing.md, marginBottom: spacing.xl }}>
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text fontSize="sm" color={colors.journeys.care.text}>
                                {cat.label}
                            </Text>
                            <StarSelector
                                value={categoryRatings[cat.id]}
                                onChange={(v) => handleCategoryChange(cat.id, v)}
                                label={cat.label}
                            />
                        </div>
                    ))}
                </div>

                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Comentario
                </Text>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Conte como foi sua experiencia..."
                    rows={4}
                    aria-label="Comentario da avaliacao"
                    style={{
                        width: '100%',
                        padding: spacing.md,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray300}`,
                        fontSize: '16px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        marginBottom: spacing.xl,
                    }}
                />

                <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.sm }}
                >
                    Recomendaria este medico?
                </Text>
                <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                    {[true, false].map((val) => (
                        <button
                            key={String(val)}
                            onClick={() => setRecommend(val)}
                            aria-pressed={recommend === val}
                            style={{
                                flex: 1,
                                padding: spacing.sm,
                                borderRadius: '8px',
                                border: `2px solid ${
                                    recommend === val ? colors.journeys.care.primary : colors.neutral.gray300
                                }`,
                                backgroundColor:
                                    recommend === val ? colors.journeys.care.background : colors.neutral.white,
                                color: recommend === val ? colors.journeys.care.primary : colors.journeys.care.text,
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                            }}
                        >
                            {val ? 'Sim, recomendo' : 'Nao recomendo'}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        journey="care"
                        variant="outlined"
                        onPress={() => void router.push('/care/appointments/list')}
                        accessibilityLabel="Pular"
                    >
                        Pular
                    </Button>
                    <Button
                        journey="care"
                        onPress={handleSubmit}
                        disabled={overallRating === 0}
                        accessibilityLabel="Enviar avaliacao"
                    >
                        Enviar Avaliacao
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default RateVisitPage;
