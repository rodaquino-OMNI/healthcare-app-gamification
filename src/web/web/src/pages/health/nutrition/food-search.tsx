import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const RECENT_SEARCHES = ['Chicken breast', 'Brown rice', 'Avocado', 'Greek yogurt', 'Almonds'];

const MOCK_RESULTS = [
    { id: 'f1', name: 'Chicken Breast (grilled)', calories: 165, per: '100g' },
    { id: 'f2', name: 'Brown Rice (cooked)', calories: 112, per: '100g' },
    { id: 'f3', name: 'Avocado', calories: 160, per: '100g' },
    { id: 'f4', name: 'Greek Yogurt (plain)', calories: 59, per: '100g' },
];

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.xs,
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray[60],
};

const FoodSearchPage: React.FC = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = (): void => {
        if (query.trim()) {
            setSearched(true);
        }
    };

    const handleAdd = (name: string): void => {
        window.alert(`Added ${name} to meal log`);
        void router.push('/health/nutrition/meal-log');
    };

    const results = searched
        ? MOCK_RESULTS.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || query === '')
        : [];

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/nutrition')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to nutrition home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Food Search
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Search for foods to log nutrition information
            </Text>

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" style={{ gap: spacing.sm }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSearched(false);
                        }}
                        placeholder="Search foods, e.g. chicken breast"
                        aria-label="Search foods"
                        style={{ ...inputStyle, flex: 1 }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <Button journey="health" onPress={handleSearch} accessibilityLabel="Search">
                        Search
                    </Button>
                </Box>
            </Card>

            {!searched && (
                <>
                    <Text
                        fontSize="lg"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Recent Searches
                    </Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xl }}>
                        {RECENT_SEARCHES.map((term) => (
                            <div
                                key={term}
                                onClick={() => {
                                    setQuery(term);
                                    setSearched(true);
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Search for ${term}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setQuery(term);
                                        setSearched(true);
                                    }
                                }}
                                style={{
                                    padding: `${spacing['3xs']} ${spacing.xs}`,
                                    borderRadius: '16px',
                                    backgroundColor: `${colors.journeys.health.primary}22`,
                                    cursor: 'pointer',
                                }}
                            >
                                <Text fontSize="sm" color={colors.journeys.health.primary}>
                                    {term}
                                </Text>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {searched && (
                <>
                    <Text
                        fontSize="lg"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Results for &quot;{query}&quot;
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {results.length === 0 ? (
                            <Card journey="health" elevation="sm" padding="md">
                                <Text fontSize="md" color={colors.gray[50]}>
                                    No results found. Try a different search term.
                                </Text>
                            </Card>
                        ) : (
                            results.map((food) => (
                                <Card key={food.id} journey="health" elevation="sm" padding="md">
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Text
                                                fontSize="md"
                                                fontWeight="semiBold"
                                                color={colors.journeys.health.text}
                                            >
                                                {food.name}
                                            </Text>
                                            <Text fontSize="sm" color={colors.gray[50]}>
                                                {food.calories} kcal / {food.per}
                                            </Text>
                                        </Box>
                                        <Button
                                            variant="secondary"
                                            journey="health"
                                            onPress={() => handleAdd(food.name)}
                                            accessibilityLabel={`Add ${food.name}`}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FoodSearchPage;
