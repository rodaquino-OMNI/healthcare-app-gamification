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

interface Review {
    id: string;
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
}

const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        reviewer: 'Maria C.',
        rating: 5,
        comment: 'Excelente profissional, muito atenciosa e pontual.',
        date: '12/01/2026',
    },
    {
        id: '2',
        reviewer: 'Joao P.',
        rating: 4,
        comment: 'Bom atendimento, explicou tudo com clareza.',
        date: '05/01/2026',
    },
    {
        id: '3',
        reviewer: 'Ana R.',
        rating: 5,
        comment: 'Medica incrivel! Recomendo a todos.',
        date: '28/12/2025',
    },
    {
        id: '4',
        reviewer: 'Carlos M.',
        rating: 3,
        comment: 'Atendimento ok, mas a espera foi longa.',
        date: '15/12/2025',
    },
    {
        id: '5',
        reviewer: 'Lucia F.',
        rating: 4,
        comment: 'Muito competente, consulta detalhada.',
        date: '10/12/2025',
    },
];

const SORT_OPTIONS = ['Mais Recentes', 'Maior Nota', 'Menor Nota'];

const STAR_DISTRIBUTION = [
    { stars: 5, count: 42 },
    { stars: 4, count: 18 },
    { stars: 3, count: 7 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
];

const renderStars = (rating: number): string =>
    Array.from({ length: 5 }, (_, i) => (i < rating ? '\u2605' : '\u2606')).join('');

const ReviewsPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const [sortBy, setSortBy] = useState('Mais Recentes');
    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Avaliacoes do Medico" />
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
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
                <JourneyHeader title="Avaliacoes do Medico" />
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar avaliacoes. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const totalReviews = STAR_DISTRIBUTION.reduce((sum, d) => sum + d.count, 0);
    const avgRating = (STAR_DISTRIBUTION.reduce((sum, d) => sum + d.stars * d.count, 0) / totalReviews).toFixed(1);

    const sortedReviews = [...MOCK_REVIEWS].sort((a, b) => {
        if (sortBy === 'Maior Nota') {
            return b.rating - a.rating;
        }
        if (sortBy === 'Menor Nota') {
            return a.rating - b.rating;
        }
        return 0;
    });

    return (
        <CareLayout>
            <JourneyHeader title="Avaliacoes do Medico" />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <Card journey="care" elevation="md">
                    <Box padding="lg">
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2xl'] }}>
                            <div style={{ textAlign: 'center' }}>
                                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.primary}>
                                    {avgRating}
                                </Text>
                                <Text fontSize="md" color={colors.journeys.care.primary}>
                                    {renderStars(Math.round(Number(avgRating)))}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {totalReviews} avaliacoes
                                </Text>
                            </div>
                            <div style={{ flex: 1 }}>
                                {STAR_DISTRIBUTION.map((d) => (
                                    <div
                                        key={d.stars}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: spacing.xs,
                                            marginBottom: spacing['3xs'],
                                        }}
                                    >
                                        <Text fontSize="sm" color={colors.gray[50]} style={{ width: '20px' }}>
                                            {d.stars}
                                        </Text>
                                        <div
                                            style={{
                                                flex: 1,
                                                height: '8px',
                                                backgroundColor: colors.neutral.gray100,
                                                borderRadius: '4px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${(d.count / totalReviews) * 100}%`,
                                                    height: '100%',
                                                    backgroundColor: colors.journeys.care.primary,
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </div>
                                        <Text
                                            fontSize="sm"
                                            color={colors.gray[50]}
                                            style={{ width: '24px', textAlign: 'right' }}
                                        >
                                            {d.count}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Box>
                </Card>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: spacing.xl,
                        marginBottom: spacing.md,
                    }}
                >
                    <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.text}>
                        Avaliacoes
                    </Text>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Ordenar avaliacoes"
                        style={{
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: '8px',
                            border: `1px solid ${colors.neutral.gray300}`,
                            fontSize: '14px',
                        }}
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: spacing.md,
                    }}
                >
                    {sortedReviews.map((review) => (
                        <Card key={review.id} journey="care" elevation="sm">
                            <Box padding="md">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: spacing.xs,
                                    }}
                                >
                                    <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                        {review.reviewer}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {review.date}
                                    </Text>
                                </div>
                                <Text
                                    fontSize="md"
                                    color={colors.journeys.care.primary}
                                    style={{ marginBottom: spacing.xs }}
                                >
                                    {renderStars(review.rating)}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]}>
                                    {review.comment}
                                </Text>
                            </Box>
                        </Card>
                    ))}
                </div>

                <div style={{ marginTop: spacing['2xl'] }}>
                    <Button journey="care" variant="outlined" onPress={() => router.back()} accessibilityLabel="Voltar">
                        Voltar
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ReviewsPage;
