import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';
import { CareLayout } from '@/layouts/CareLayout';
import { JourneyHeader } from '@/components/shared/JourneyHeader';

/** Specialty option for the search filter */
interface Specialty {
    id: string;
    label: string;
}

const SPECIALTIES: Specialty[] = [
    { id: 'general', label: 'Clinico Geral' },
    { id: 'cardiology', label: 'Cardiologia' },
    { id: 'dermatology', label: 'Dermatologia' },
    { id: 'orthopedics', label: 'Ortopedia' },
    { id: 'pediatrics', label: 'Pediatria' },
    { id: 'gynecology', label: 'Ginecologia' },
    { id: 'neurology', label: 'Neurologia' },
    { id: 'psychiatry', label: 'Psiquiatria' },
];

/** Mock doctor result for the search listing */
interface DoctorResult {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    distance: string;
    nextAvailable: string;
}

const MOCK_DOCTORS: DoctorResult[] = [
    {
        id: '1',
        name: 'Dra. Ana Silva',
        specialty: 'Cardiologia',
        rating: 4.8,
        distance: '2.3 km',
        nextAvailable: 'Hoje, 14:00',
    },
    {
        id: '2',
        name: 'Dr. Carlos Santos',
        specialty: 'Clinico Geral',
        rating: 4.6,
        distance: '3.1 km',
        nextAvailable: 'Amanha, 09:00',
    },
    {
        id: '3',
        name: 'Dra. Maria Oliveira',
        specialty: 'Dermatologia',
        rating: 4.9,
        distance: '1.8 km',
        nextAvailable: 'Hoje, 16:30',
    },
];

/**
 * Doctor search page for the Care consultation flow.
 * Allows users to search for doctors by name or specialty.
 */
const DoctorSearchPage: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

    const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
        const matchesQuery = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty =
            !selectedSpecialty ||
            doc.specialty
                .toLowerCase()
                .includes(SPECIALTIES.find((s) => s.id === selectedSpecialty)?.label.toLowerCase() ?? '');
        return matchesQuery && matchesSpecialty;
    });

    const handleDoctorSelect = (doctorId: string) => {
        router.push(`/care/appointments/doctor/${doctorId}`);
    };

    const handleOpenFilters = () => {
        router.push(WEB_CARE_ROUTES.DOCTOR_FILTERS);
    };

    return (
        <CareLayout>
            <JourneyHeader title="Buscar Medico" />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: spacing.xl }}>
                {/* Search bar */}
                <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg }}>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou especialidade..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            padding: spacing.sm,
                            borderRadius: '8px',
                            border: `1px solid ${colors.neutral.gray300}`,
                            fontSize: '16px',
                        }}
                        aria-label="Buscar medico"
                    />
                    <Button journey="care" variant="outlined" onPress={handleOpenFilters}>
                        Filtros
                    </Button>
                </div>

                {/* Specialty quick filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xl }}>
                    {SPECIALTIES.map((spec) => (
                        <button
                            key={spec.id}
                            onClick={() => setSelectedSpecialty(selectedSpecialty === spec.id ? null : spec.id)}
                            style={{
                                padding: `${spacing.xs} ${spacing.sm}`,
                                borderRadius: '20px',
                                border: `1px solid ${selectedSpecialty === spec.id ? colors.journeys.care.primary : colors.neutral.gray300}`,
                                backgroundColor:
                                    selectedSpecialty === spec.id ? colors.journeys.care.background : 'transparent',
                                color:
                                    selectedSpecialty === spec.id
                                        ? colors.journeys.care.primary
                                        : colors.journeys.care.text,
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                            aria-pressed={selectedSpecialty === spec.id}
                        >
                            {spec.label}
                        </button>
                    ))}
                </div>

                {/* Results grid */}
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.journeys.care.text}
                    style={{ marginBottom: spacing.md }}
                >
                    {filteredDoctors.length} resultado(s) encontrado(s)
                </Text>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: spacing.md,
                    }}
                >
                    {filteredDoctors.map((doctor) => (
                        <Card
                            key={doctor.id}
                            journey="care"
                            elevation="sm"
                            interactive
                            onPress={() => handleDoctorSelect(doctor.id)}
                            accessibilityLabel={`Dr. ${doctor.name}, ${doctor.specialty}`}
                        >
                            <Box padding="md">
                                <Text fontWeight="bold" fontSize="md" color={colors.journeys.care.text}>
                                    {doctor.name}
                                </Text>
                                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                                    {doctor.specialty}
                                </Text>
                                <div
                                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing.sm }}
                                >
                                    <Text fontSize="sm" color={colors.journeys.care.primary}>
                                        {doctor.rating} estrelas
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]}>
                                        {doctor.distance}
                                    </Text>
                                </div>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={colors.journeys.care.primary}
                                    style={{ marginTop: spacing.sm }}
                                >
                                    Proximo horario: {doctor.nextAvailable}
                                </Text>
                            </Box>
                        </Card>
                    ))}
                </div>
            </div>
        </CareLayout>
    );
};

export default DoctorSearchPage;
