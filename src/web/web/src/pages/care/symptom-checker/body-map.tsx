import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_CARE_ROUTES } from 'shared/constants/routes';

import { useSymptomChecker } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

/** Body region definition for the interactive body map */
interface BodyRegion {
    id: string;
    label: string;
    area: 'head' | 'chest' | 'abdomen' | 'arms' | 'legs' | 'back';
}

const BODY_REGIONS: BodyRegion[] = [
    { id: 'head', label: 'Head & Face', area: 'head' },
    { id: 'neck', label: 'Neck & Throat', area: 'head' },
    { id: 'chest', label: 'Chest', area: 'chest' },
    { id: 'upper-back', label: 'Upper Back', area: 'back' },
    { id: 'lower-back', label: 'Lower Back', area: 'back' },
    { id: 'abdomen', label: 'Abdomen', area: 'abdomen' },
    { id: 'left-arm', label: 'Left Arm & Hand', area: 'arms' },
    { id: 'right-arm', label: 'Right Arm & Hand', area: 'arms' },
    { id: 'left-leg', label: 'Left Leg & Foot', area: 'legs' },
    { id: 'right-leg', label: 'Right Leg & Foot', area: 'legs' },
];

/**
 * Body Map page for the symptom checker flow.
 * Users select the body region where they are experiencing symptoms.
 */
const SymptomBodyMapPage: React.FC = () => {
    const router = useRouter();
    const { addSymptom: _addSymptom, isLoading, error } = useSymptomChecker();
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    {t('common.loading')}
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

    const toggleRegion = (regionId: string): void => {
        setSelectedRegions((prev) =>
            prev.includes(regionId) ? prev.filter((id) => id !== regionId) : [...prev, regionId]
        );
    };

    const handleContinue = (): void => {
        void router.push({
            pathname: WEB_CARE_ROUTES.SYMPTOM_DETAIL,
            query: { regions: selectedRegions.join(',') },
        });
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.care.text}>
                Where are you feeling symptoms?
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Select one or more body regions to help us understand your symptoms.
            </Text>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: spacing.md,
                }}
            >
                {BODY_REGIONS.map((region) => {
                    const isSelected = selectedRegions.includes(region.id);
                    return (
                        <Card
                            key={region.id}
                            journey="care"
                            elevation={isSelected ? 'md' : 'sm'}
                            interactive
                            onPress={() => toggleRegion(region.id)}
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

            <Box display="flex" justifyContent="flex-end" style={{ marginTop: spacing['2xl'] }}>
                <Button
                    journey="care"
                    onPress={handleContinue}
                    disabled={selectedRegions.length === 0}
                    accessibilityLabel="Continue to symptom details"
                >
                    Continue
                </Button>
            </Box>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default SymptomBodyMapPage;
