import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

interface HeadRegion {
    id: string;
    label: string;
}

const HEAD_REGIONS: HeadRegion[] = [
    { id: 'forehead', label: 'Forehead' },
    { id: 'temples', label: 'Temples' },
    { id: 'eyes', label: 'Eyes' },
    { id: 'nose', label: 'Nose & Sinuses' },
    { id: 'ears', label: 'Ears' },
    { id: 'mouth', label: 'Mouth & Throat' },
    { id: 'jaw', label: 'Jaw' },
    { id: 'scalp', label: 'Scalp' },
    { id: 'back-of-head', label: 'Back of Head' },
];

/** Head detail page for selecting specific head/face regions. */
const HeadDetailPage: React.FC = () => {
    const router = useRouter();
    const { addSymptom: _addSymptom, isLoading, error } = useSymptomChecker();
    const [selected, setSelected] = useState<string[]>([]);

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.semantic.error}>
                    {error.message}
                </Text>
            </div>
        );
    }

    const toggle = (id: string): void => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
    };

    const handleContinue = (): void => {
        void router.push({
            pathname: WEB_CARE_ROUTES.SYMPTOM_DETAIL,
            query: {
                ...router.query,
                headRegions: selected.join(','),
            },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Head & Face Region
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Select specific areas of your head or face that are affected.
            </Text>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: spacing.md,
                }}
            >
                {HEAD_REGIONS.map((region) => {
                    const isSelected = selected.includes(region.id);
                    return (
                        <Card
                            key={region.id}
                            journey="care"
                            elevation={isSelected ? 'md' : 'sm'}
                            interactive
                            onPress={() => toggle(region.id)}
                            backgroundColor={isSelected ? colors.journeys.care.background : colors.neutral.white}
                            borderColor={isSelected ? colors.journeys.care.primary : colors.neutral.gray300}
                            accessibilityLabel={`${region.label}${isSelected ? ', selected' : ''}`}
                        >
                            <Box padding="sm">
                                <Text
                                    fontWeight={isSelected ? 'bold' : 'medium'}
                                    fontSize="md"
                                    color={isSelected ? colors.journeys.care.primary : colors.journeys.care.text}
                                >
                                    {region.label}
                                </Text>
                            </Box>
                        </Card>
                    );
                })}
            </div>

            <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="care"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                    data-testid="head-detail-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    disabled={selected.length === 0}
                    accessibilityLabel="Continue to symptom details"
                    data-testid="head-detail-continue-btn"
                >
                    Continue
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default HeadDetailPage;
