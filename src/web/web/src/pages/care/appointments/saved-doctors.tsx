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

interface SavedDoctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    nextAvailable: string;
    initials: string;
}

const MOCK_SAVED: SavedDoctor[] = [
    {
        id: '1',
        name: 'Dra. Ana Silva',
        specialty: 'Cardiologia',
        rating: 4.8,
        nextAvailable: 'Hoje, 14:00',
        initials: 'AS',
    },
    {
        id: '2',
        name: 'Dr. Carlos Santos',
        specialty: 'Clinico Geral',
        rating: 4.6,
        nextAvailable: 'Amanha, 09:00',
        initials: 'CS',
    },
    {
        id: '3',
        name: 'Dra. Maria Oliveira',
        specialty: 'Dermatologia',
        rating: 4.9,
        nextAvailable: 'Qui, 10:30',
        initials: 'MO',
    },
    {
        id: '4',
        name: 'Dr. Pedro Lima',
        specialty: 'Ortopedia',
        rating: 4.5,
        nextAvailable: 'Sex, 15:00',
        initials: 'PL',
    },
    {
        id: '5',
        name: 'Dra. Lucia Ferreira',
        specialty: 'Pediatria',
        rating: 4.7,
        nextAvailable: 'Seg, 08:00',
        initials: 'LF',
    },
];

const renderStars = (rating: number): string =>
    Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? '\u2605' : '\u2606')).join('');

const SavedDoctorsPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const [search, setSearch] = useState('');

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Medicos Favoritos" />
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
                <JourneyHeader title="Medicos Favoritos" />
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar medicos favoritos. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const filtered = MOCK_SAVED.filter(
        (doc) =>
            doc.name.toLowerCase().includes(search.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <CareLayout>
            <JourneyHeader title="Medicos Favoritos" />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar entre seus medicos favoritos..."
                    aria-label="Buscar medico favorito"
                    style={{
                        width: '100%',
                        padding: spacing.sm,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray300}`,
                        fontSize: '16px',
                        marginBottom: spacing.xl,
                        boxSizing: 'border-box',
                    }}
                />

                {filtered.length === 0 ? (
                    <Card journey="care" elevation="sm">
                        <Box padding="xl" style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: colors.neutral.gray100,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: spacing.md,
                                }}
                            >
                                <Text fontSize="xl" color={colors.gray[50]}>
                                    0
                                </Text>
                            </div>
                            <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
                                Nenhum medico favorito encontrado
                            </Text>
                            <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                                {search ? 'Tente outro termo de busca.' : 'Salve medicos ao visitar seus perfis.'}
                            </Text>
                        </Box>
                    </Card>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: spacing.md,
                        }}
                    >
                        {filtered.map((doc) => (
                            <Card key={doc.id} journey="care" elevation="sm">
                                <Box padding="md">
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: spacing.sm,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: spacing.sm,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    backgroundColor: colors.journeys.care.background,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="md"
                                                    color={colors.journeys.care.primary}
                                                >
                                                    {doc.initials}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                                    {doc.name}
                                                </Text>
                                                <Text fontSize="sm" color={colors.gray[50]}>
                                                    {doc.specialty}
                                                </Text>
                                            </div>
                                        </div>
                                        <span
                                            aria-label="Medico favoritado"
                                            style={{
                                                fontSize: '20px',
                                                color: colors.semantic.error,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {'\u2665'}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: spacing.sm,
                                        }}
                                    >
                                        <Text fontSize="sm" color={colors.journeys.care.primary}>
                                            {renderStars(doc.rating)} {doc.rating}
                                        </Text>
                                    </div>
                                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.sm }}>
                                        Proximo horario: {doc.nextAvailable}
                                    </Text>
                                    <Button
                                        journey="care"
                                        size="sm"
                                        onPress={() => void router.push(`/care/appointments/doctor/${doc.id}`)}
                                        accessibilityLabel={`Agendar com ${doc.name}`}
                                    >
                                        Agendar Rapido
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: spacing['2xl'] }}>
                    <Button journey="care" variant="outlined" onPress={() => router.back()} accessibilityLabel="Voltar">
                        Voltar
                    </Button>
                </div>
            </div>
        </CareLayout>
    );
};

export default SavedDoctorsPage;
