import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useMemo } from 'react';

import { useMedications } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface Medication {
    id: string;
    name: string;
    dosage: string;
    category: string;
}

const MOCK_MEDICATIONS: Medication[] = [
    { id: '1', name: 'Amoxicilina', dosage: '500mg', category: 'Antibiótico' },
    { id: '2', name: 'Paracetamol', dosage: '500mg', category: 'Analgésico' },
    { id: '3', name: 'Ibuprofen', dosage: '200mg', category: 'Anti-inflamatório' },
    { id: '4', name: 'Atorvastatina', dosage: '10mg', category: 'Estatina' },
    { id: '5', name: 'Metformina', dosage: '500mg', category: 'Antidiabético' },
];

const CATEGORIES = ['Todos', 'Antibiótico', 'Analgésico', 'Anti-inflamatório', 'Estatina', 'Antidiabético'];

/**
 * Search for medications by name and filter by category.
 * Display results as searchable cards with view/add actions.
 */
const MedicationSearchPage: React.FC = () => {
    const { medications, loading, error, refetch } = useMedications();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredMedications = useMemo(() => {
        return MOCK_MEDICATIONS.filter((med) => {
            const matchesQuery = med.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'Todos' || med.category === selectedCategory;
            return matchesQuery && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <p>
                    Error loading data. <button onClick={refetch}>Retry</button>
                </p>
            </div>
        );
    }

    void medications;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Buscar Medicamento
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Encontre e adicione medicamentos ao seu histórico.
            </Text>

            {/* Search Input */}
            <Box style={{ marginBottom: spacing.lg }}>
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: spacing.md,
                        borderRadius: '8px',
                        border: `1px solid ${colors.neutral.gray300}`,
                        fontSize: '14px',
                        backgroundColor: colors.gray[0],
                        color: colors.neutral.gray900,
                        fontFamily: 'inherit',
                    }}
                    data-testid="search-input"
                />
            </Box>

            {/* Category Filters */}
            <Box
                style={{
                    display: 'flex',
                    gap: spacing.sm,
                    overflowX: 'auto',
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.sm,
                }}
            >
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: '20px',
                            border: `1px solid ${
                                selectedCategory === category ? colors.journeys.health.primary : colors.neutral.gray300
                            }`,
                            backgroundColor:
                                selectedCategory === category ? colors.journeys.health.background : colors.gray[0],
                            color:
                                selectedCategory === category ? colors.journeys.health.primary : colors.neutral.gray600,
                            fontWeight: selectedCategory === category ? 600 : 400,
                            fontSize: '12px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                        data-testid={`filter-${category}`}
                    >
                        {category}
                    </button>
                ))}
            </Box>

            {/* Results */}
            {filteredMedications.length > 0 ? (
                <div>
                    {filteredMedications.map((med) => (
                        <Card
                            key={med.id}
                            journey="health"
                            elevation="sm"
                            padding="lg"
                            style={{ marginBottom: spacing.lg }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <Text fontSize="md" fontWeight="medium" color={colors.neutral.gray900}>
                                        {med.name}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                                        {med.dosage}
                                    </Text>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            marginTop: spacing.sm,
                                            backgroundColor: colors.journeys.health.background,
                                            color: colors.journeys.health.primary,
                                            padding: `${spacing.xs} ${spacing.sm}`,
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                        }}
                                        data-testid={`category-badge-${med.id}`}
                                    >
                                        {med.category}
                                    </span>
                                </div>
                                <Button
                                    variant="primary"
                                    journey="health"
                                    onPress={() => alert(`${med.name} adicionado!`)}
                                    accessibilityLabel={`Adicionar ${med.name}`}
                                >
                                    Adicionar
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text fontSize="md" color={colors.gray[50]} style={{ textAlign: 'center' }}>
                        Nenhum medicamento encontrado. Tente outra busca.
                    </Text>
                </Card>
            )}

            {/* Back Button */}
            <Box style={{ marginTop: spacing.xl }}>
                <Button variant="secondary" journey="health" onPress={() => router.back()} accessibilityLabel="Voltar">
                    Voltar
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default MedicationSearchPage;
