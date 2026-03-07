import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

interface BackRegion {
    id: string;
    label: string;
    description: string;
}

const BACK_REGIONS: BackRegion[] = [
    { id: 'upper-back', label: 'Upper Back', description: 'Between shoulders and neck' },
    { id: 'mid-back', label: 'Mid Back', description: 'Thoracic spine area' },
    { id: 'lower-back', label: 'Lower Back', description: 'Lumbar region' },
    { id: 'left-shoulder-blade', label: 'Left Shoulder Blade', description: 'Scapular area' },
    { id: 'right-shoulder-blade', label: 'Right Shoulder Blade', description: 'Scapular area' },
    { id: 'spine', label: 'Spine', description: 'Along the vertebral column' },
    { id: 'tailbone', label: 'Tailbone', description: 'Coccyx and sacral area' },
    { id: 'flanks', label: 'Flanks', description: 'Sides of the lower back' },
];

/** Back body map page for selecting specific back regions with symptoms. */
const BackBodyMapPage: React.FC = () => {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
    };

    const handleContinue = () => {
        router.push({
            pathname: WEB_CARE_ROUTES.SYMPTOM_DETAIL,
            query: { ...router.query, backRegions: selected.join(',') },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Select Back Region
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Tap the areas where you feel discomfort.
            </Text>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: spacing.md,
                }}
            >
                {BACK_REGIONS.map((region) => {
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
                                <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                                    {region.description}
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
                    data-testid="back-body-map-back-btn"
                >
                    Back
                </Button>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    disabled={selected.length === 0}
                    accessibilityLabel="Continue to symptom details"
                    data-testid="back-body-map-continue-btn"
                >
                    Continue
                </Button>
            </Box>
        </div>
    );
};

export default BackBodyMapPage;
