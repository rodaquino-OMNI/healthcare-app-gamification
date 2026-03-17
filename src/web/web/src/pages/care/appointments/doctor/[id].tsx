import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import type { GetStaticPaths } from 'next';
import React from 'react';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { CareLayout } from '@/layouts/CareLayout';

/** Mock doctor data for the profile page */
interface DoctorProfile {
    id: string;
    name: string;
    specialty: string;
    crm: string;
    bio: string;
    education: string;
    rating: number;
    reviewCount: number;
    yearsExperience: number;
    languages: string[];
    consultationPrice: string;
    acceptedInsurance: string[];
    address: string;
}

const MOCK_DOCTOR: DoctorProfile = {
    id: '1',
    name: 'Dra. Ana Silva',
    specialty: 'Cardiologia',
    crm: 'CRM/SP 123456',
    bio: 'Especialista em cardiologia clinica e preventiva com mais de 15 anos de experiencia. Formada pela USP com residencia no InCor. Atua com foco em prevencao cardiovascular e acompanhamento de pacientes com doencas cronicas.',
    education: 'Universidade de Sao Paulo (USP) - Residencia em Cardiologia no InCor',
    rating: 4.8,
    reviewCount: 342,
    yearsExperience: 15,
    languages: ['Portugues', 'Ingles', 'Espanhol'],
    consultationPrice: 'R$ 350,00',
    acceptedInsurance: ['Unimed', 'Bradesco Saude', 'SulAmerica', 'Amil'],
    address: 'Av. Paulista, 1000 - Sala 801, Bela Vista, Sao Paulo - SP',
};

/** Mock review data */
interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
}

const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        author: 'Maria L.',
        rating: 5,
        date: '15/01/2026',
        comment: 'Excelente profissional, muito atenciosa e competente.',
    },
    {
        id: '2',
        author: 'Joao P.',
        rating: 4,
        date: '08/01/2026',
        comment: 'Otima consulta, explicou tudo com clareza.',
    },
    {
        id: '3',
        author: 'Ana C.',
        rating: 5,
        date: '28/12/2025',
        comment: 'Recomendo muito! Profissional dedicada e cuidadosa.',
    },
];

/**
 * Doctor profile page showing detailed information about a specific doctor.
 * Displays bio, reviews, credentials, and a booking button.
 */
const DoctorProfilePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const { appointments: _appointments, loading, error } = useAppointments();
    const doctor = MOCK_DOCTOR; // In production, fetch by id

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Perfil do Medico" />
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
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
                <JourneyHeader title="Perfil do Medico" />
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        Erro ao carregar dados. Tente novamente.
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const handleBookAppointment = (): void => {
        void router.push({
            pathname: WEB_CARE_ROUTES.DOCTOR_AVAILABILITY,
            query: { doctorId: id },
        });
    };

    return (
        <CareLayout>
            <JourneyHeader title="Perfil do Medico" />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: spacing.xl }}>
                {/* Doctor header */}
                <Card journey="care" elevation="md">
                    <Box padding="lg">
                        <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'flex-start' }}>
                            {/* Avatar placeholder */}
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    backgroundColor: colors.journeys.care.background,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                                aria-label={`Foto de ${doctor.name}`}
                            >
                                <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.primary}>
                                    {doctor.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </Text>
                            </div>

                            <div style={{ flex: 1 }}>
                                <Text fontSize="xl" fontWeight="bold" color={colors.journeys.care.text}>
                                    {doctor.name}
                                </Text>
                                <Text
                                    fontSize="md"
                                    color={colors.journeys.care.primary}
                                    style={{ marginTop: spacing.xs }}
                                >
                                    {doctor.specialty}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                                    {doctor.crm} | {doctor.yearsExperience} anos de experiencia
                                </Text>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: spacing.md,
                                        marginTop: spacing.sm,
                                    }}
                                >
                                    <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.primary}>
                                        {doctor.rating} estrelas ({doctor.reviewCount} avaliacoes)
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Card>

                {/* Bio section */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Sobre
                        </Text>
                        <Text fontSize="sm" color={colors.journeys.care.text} style={{ lineHeight: '1.6' }}>
                            {doctor.bio}
                        </Text>
                    </Box>
                </Card>

                {/* Details section */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Informacoes
                        </Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: spacing.sm,
                            }}
                        >
                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Formacao
                                </Text>
                                <Text fontSize="sm" color={colors.journeys.care.text}>
                                    {doctor.education}
                                </Text>
                            </div>
                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Idiomas
                                </Text>
                                <Text fontSize="sm" color={colors.journeys.care.text}>
                                    {doctor.languages.join(', ')}
                                </Text>
                            </div>
                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Valor da consulta
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.primary}>
                                    {doctor.consultationPrice}
                                </Text>
                            </div>
                            <div>
                                <Text fontSize="xs" color={colors.gray[50]}>
                                    Endereco
                                </Text>
                                <Text fontSize="sm" color={colors.journeys.care.text}>
                                    {doctor.address}
                                </Text>
                            </div>
                        </div>
                    </Box>
                </Card>

                {/* Insurance section */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Convenios aceitos
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                            {doctor.acceptedInsurance.map((ins) => (
                                <span
                                    key={ins}
                                    style={{
                                        padding: `${spacing.xs} ${spacing.sm}`,
                                        borderRadius: '20px',
                                        backgroundColor: colors.journeys.care.background,
                                        color: colors.journeys.care.primary,
                                        fontSize: '13px',
                                    }}
                                >
                                    {ins}
                                </span>
                            ))}
                        </div>
                    </Box>
                </Card>

                {/* Reviews section */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Avaliacoes recentes
                        </Text>
                        {MOCK_REVIEWS.map((review) => (
                            <div
                                key={review.id}
                                style={{
                                    paddingBottom: spacing.sm,
                                    marginBottom: spacing.sm,
                                    borderBottom: `1px solid ${colors.neutral.gray300}`,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text fontSize="sm" fontWeight="bold" color={colors.journeys.care.text}>
                                        {review.author}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[50]}>
                                        {review.date}
                                    </Text>
                                </div>
                                <Text fontSize="sm" color={colors.journeys.care.primary} style={{ marginTop: '2px' }}>
                                    {review.rating} estrelas
                                </Text>
                                <Text fontSize="sm" color={colors.journeys.care.text} style={{ marginTop: spacing.xs }}>
                                    {review.comment}
                                </Text>
                            </div>
                        ))}
                    </Box>
                </Card>

                {/* Book appointment button */}
                <Box display="flex" justifyContent="center" style={{ marginTop: spacing['2xl'] }}>
                    <Button journey="care" onPress={handleBookAppointment} accessibilityLabel="Agendar consulta">
                        Agendar Consulta
                    </Button>
                </Box>
            </div>
        </CareLayout>
    );
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps = () => ({ props: {} });

export default DoctorProfilePage;
