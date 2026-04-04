import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAppointments } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { CareLayout } from '@/layouts/CareLayout';

/** Filter state for doctor search */
interface FilterState {
    specialty: string;
    maxDistance: number;
    minRating: number;
    availability: 'any' | 'today' | 'this-week' | 'next-week';
    gender: 'any' | 'male' | 'female';
    acceptsInsurance: boolean;
}

const SPECIALTIES = [
    'Todas',
    'Clinico Geral',
    'Cardiologia',
    'Dermatologia',
    'Ortopedia',
    'Pediatria',
    'Ginecologia',
    'Neurologia',
    'Psiquiatria',
];

const AVAILABILITY_OPTIONS = [
    { value: 'any', label: 'Qualquer data' },
    { value: 'today', label: 'Hoje' },
    { value: 'this-week', label: 'Esta semana' },
    { value: 'next-week', label: 'Proxima semana' },
];

const DISTANCE_OPTIONS = [5, 10, 20, 50];

/**
 * Doctor search filters page for the Care consultation flow.
 * Allows users to refine their search with specialty, distance, rating, and availability.
 */
const DoctorFiltersPage: React.FC = () => {
    const router = useRouter();
    const { appointments: _appointments, loading, error } = useAppointments();
    const [filters, setFilters] = useState<FilterState>({
        specialty: 'Todas',
        maxDistance: 20,
        minRating: 0,
        availability: 'any',
        gender: 'any',
        acceptsInsurance: true,
    });
    const { t } = useTranslation();

    if (loading) {
        return (
            <CareLayout>
                <JourneyHeader title="Filtros de Busca" />
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
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
                <JourneyHeader title="Filtros de Busca" />
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl, textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.semantic.error}>
                        {t('common.error')}
                    </Text>
                </div>
            </CareLayout>
        );
    }

    const handleApplyFilters = (): void => {
        void router.push({
            pathname: WEB_CARE_ROUTES.DOCTOR_SEARCH,
            query: {
                specialty: filters.specialty,
                distance: filters.maxDistance,
                rating: filters.minRating,
                availability: filters.availability,
            },
        });
    };

    const handleClearFilters = (): void => {
        setFilters({
            specialty: 'Todas',
            maxDistance: 20,
            minRating: 0,
            availability: 'any',
            gender: 'any',
            acceptsInsurance: true,
        });
    };

    return (
        <CareLayout>
            <JourneyHeader title="Filtros de Busca" />
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                {/* Specialty filter */}
                <Card journey="care" elevation="sm">
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Especialidade
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                            {SPECIALTIES.map((spec) => (
                                <button
                                    key={spec}
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            specialty: spec,
                                        }))
                                    }
                                    style={{
                                        padding: `${spacing.xs} ${spacing.sm}`,
                                        borderRadius: '20px',
                                        border: `1px solid ${
                                            filters.specialty === spec
                                                ? colors.journeys.care.primary
                                                : colors.neutral.gray300
                                        }`,
                                        backgroundColor:
                                            filters.specialty === spec
                                                ? colors.journeys.care.background
                                                : 'transparent',
                                        color:
                                            filters.specialty === spec
                                                ? colors.journeys.care.primary
                                                : colors.journeys.care.text,
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                    aria-pressed={filters.specialty === spec}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </Box>
                </Card>

                {/* Distance filter */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Distancia maxima
                        </Text>
                        <div style={{ display: 'flex', gap: spacing.sm }}>
                            {DISTANCE_OPTIONS.map((dist) => (
                                <button
                                    key={dist}
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            maxDistance: dist,
                                        }))
                                    }
                                    style={{
                                        padding: `${spacing.xs} ${spacing.md}`,
                                        borderRadius: '8px',
                                        border: `1px solid ${
                                            filters.maxDistance === dist
                                                ? colors.journeys.care.primary
                                                : colors.neutral.gray300
                                        }`,
                                        backgroundColor:
                                            filters.maxDistance === dist
                                                ? colors.journeys.care.background
                                                : 'transparent',
                                        color:
                                            filters.maxDistance === dist
                                                ? colors.journeys.care.primary
                                                : colors.journeys.care.text,
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                    aria-pressed={filters.maxDistance === dist}
                                >
                                    {dist} km
                                </button>
                            ))}
                        </div>
                    </Box>
                </Card>

                {/* Rating filter */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Avaliacao minima
                        </Text>
                        <div style={{ display: 'flex', gap: spacing.sm }}>
                            {[0, 3, 4, 4.5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            minRating: rating,
                                        }))
                                    }
                                    style={{
                                        padding: `${spacing.xs} ${spacing.md}`,
                                        borderRadius: '8px',
                                        border: `1px solid ${
                                            filters.minRating === rating
                                                ? colors.journeys.care.primary
                                                : colors.neutral.gray300
                                        }`,
                                        backgroundColor:
                                            filters.minRating === rating
                                                ? colors.journeys.care.background
                                                : 'transparent',
                                        color:
                                            filters.minRating === rating
                                                ? colors.journeys.care.primary
                                                : colors.journeys.care.text,
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                    aria-pressed={filters.minRating === rating}
                                >
                                    {rating === 0 ? 'Qualquer' : `${rating}+`}
                                </button>
                            ))}
                        </div>
                    </Box>
                </Card>

                {/* Availability filter */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md">
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            color={colors.journeys.care.text}
                            style={{ marginBottom: spacing.sm }}
                        >
                            Disponibilidade
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
                            {AVAILABILITY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            availability: opt.value as FilterState['availability'],
                                        }))
                                    }
                                    style={{
                                        padding: `${spacing.xs} ${spacing.sm}`,
                                        borderRadius: '20px',
                                        border: `1px solid ${
                                            filters.availability === opt.value
                                                ? colors.journeys.care.primary
                                                : colors.neutral.gray300
                                        }`,
                                        backgroundColor:
                                            filters.availability === opt.value
                                                ? colors.journeys.care.background
                                                : 'transparent',
                                        color:
                                            filters.availability === opt.value
                                                ? colors.journeys.care.primary
                                                : colors.journeys.care.text,
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                    aria-pressed={filters.availability === opt.value}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </Box>
                </Card>

                {/* Insurance toggle */}
                <Card journey="care" elevation="sm" style={{ marginTop: spacing.md }}>
                    <Box padding="md" display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                            Aceita meu convenio
                        </Text>
                        <button
                            onClick={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    acceptsInsurance: !prev.acceptsInsurance,
                                }))
                            }
                            style={{
                                width: '48px',
                                height: '28px',
                                borderRadius: '14px',
                                border: 'none',
                                backgroundColor: filters.acceptsInsurance
                                    ? colors.journeys.care.primary
                                    : colors.neutral.gray300,
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                            role="switch"
                            aria-checked={filters.acceptsInsurance}
                            aria-label="Aceita meu convenio"
                        >
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '2px',
                                    left: filters.acceptsInsurance ? '22px' : '2px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    transition: 'left 0.2s ease',
                                }}
                            />
                        </button>
                    </Box>
                </Card>

                {/* Action buttons */}
                <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                    <Button journey="care" variant="outlined" onPress={handleClearFilters}>
                        Limpar Filtros
                    </Button>
                    <Button journey="care" onPress={handleApplyFilters}>
                        Aplicar Filtros
                    </Button>
                </Box>
            </div>
        </CareLayout>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default DoctorFiltersPage;
