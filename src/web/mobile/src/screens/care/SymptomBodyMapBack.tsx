/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import type { Theme } from '@design-system/themes/base.theme';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView, type ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '@constants/routes';

import type { CareNavigationProp, CareStackParamList } from '../../navigation/types';

/**
 * Anatomical body regions for the posterior (back) view.
 * Each region has a display label key and position coordinates
 * relative to the body silhouette container.
 */
interface BodyRegion {
    id: string;
    labelKey: string;
    top: number;
    left: number;
    width: number;
    height: number;
}

const BACK_BODY_REGIONS: BodyRegion[] = [
    { id: 'back_of_head', labelKey: 'backOfHead', top: 2, left: 35, width: 30, height: 10 },
    { id: 'neck_back', labelKey: 'neckBack', top: 12, left: 38, width: 24, height: 5 },
    { id: 'shoulders', labelKey: 'shoulders', top: 17, left: 18, width: 64, height: 7 },
    { id: 'upper_back', labelKey: 'upperBack', top: 24, left: 28, width: 44, height: 10 },
    { id: 'spine', labelKey: 'spine', top: 24, left: 42, width: 16, height: 22 },
    { id: 'lower_back', labelKey: 'lowerBack', top: 34, left: 28, width: 44, height: 10 },
    { id: 'glutes', labelKey: 'glutes', top: 44, left: 28, width: 44, height: 8 },
    { id: 'left_arm_back', labelKey: 'leftArmBack', top: 17, left: 5, width: 22, height: 28 },
    { id: 'right_arm_back', labelKey: 'rightArmBack', top: 17, left: 73, width: 22, height: 28 },
    { id: 'left_thigh_back', labelKey: 'leftThighBack', top: 52, left: 20, width: 24, height: 18 },
    { id: 'right_thigh_back', labelKey: 'rightThighBack', top: 52, left: 56, width: 24, height: 18 },
    { id: 'left_calf_back', labelKey: 'leftCalfBack', top: 70, left: 20, width: 24, height: 22 },
    { id: 'right_calf_back', labelKey: 'rightCalfBack', top: 70, left: 56, width: 24, height: 22 },
];

/**
 * Posterior (back) body map screen for selecting anatomical regions.
 * Mirror of SymptomBodyMap.tsx for the back view.
 * Users can flip between front and back views.
 */
const SymptomBodyMapBack: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const navigation = useNavigation<CareNavigationProp>();
    const route = useRoute<RouteProp<CareStackParamList, 'CareSymptomBodyMapBack'>>();
    const sessionId = route.params?.sessionId ?? '';
    const symptoms: string[] = route.params?.symptoms ?? [];

    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    const toggleRegion = (regionId: string) => {
        setSelectedRegions((prev) => {
            if (prev.includes(regionId)) {
                return prev.filter((id) => id !== regionId);
            }
            return [...prev, regionId];
        });
    };

    const isSelected = (regionId: string): boolean => {
        return selectedRegions.includes(regionId);
    };

    const handleContinue = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_DETAIL, {
            symptomId: symptoms[0] ?? '',
            sessionId,
        });
    };

    const handleFlipToFront = (): void => {
        navigation.navigate(ROUTES.CARE_SYMPTOM_BODY_MAP, {
            symptoms,
            sessionId,
        });
    };

    const handleBack = (): void => {
        navigation.goBack();
    };

    return (
        <View style={styles.root}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text variant="heading" journey="care" testID="body-map-back-title">
                    {t('journeys.care.symptomChecker.bodyMapBack.title')}
                </Text>

                <Text variant="body" journey="care" testID="body-map-back-subtitle">
                    {t('journeys.care.symptomChecker.bodyMapBack.subtitle')}
                </Text>

                <View style={styles.flipContainer}>
                    <Button
                        variant="secondary"
                        onPress={handleFlipToFront}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.bodyMapBack.flipToFront')}
                        testID="flip-to-front-button"
                    >
                        {t('journeys.care.symptomChecker.bodyMapBack.flipToFront')}
                    </Button>
                </View>

                <View style={styles.bodyContainer}>
                    <View style={styles.bodySilhouette}>
                        <Text
                            fontSize="display-lg"
                            textAlign="center"
                            color={colors.neutral.gray300}
                            aria-hidden="true"
                        >
                            {'\u{1F9CD}'}
                        </Text>
                    </View>

                    {BACK_BODY_REGIONS.map((region) => (
                        <Touchable
                            key={region.id}
                            onPress={() => toggleRegion(region.id)}
                            style={[
                                styles.regionTouchable,
                                {
                                    top: `${region.top}%` as ViewStyle['top'],
                                    left: `${region.left}%` as ViewStyle['left'],
                                    width: `${region.width}%` as ViewStyle['width'],
                                    height: `${region.height}%` as ViewStyle['height'],
                                },
                                isSelected(region.id) ? styles.regionSelected : null,
                            ]}
                            accessibilityLabel={`${t(`journeys.care.symptomChecker.bodyMapBack.regions.${region.labelKey}`)}${isSelected(region.id) ? `, ${t('journeys.care.symptomChecker.bodyMapBack.selected')}` : ''}`}
                            accessibilityRole="button"
                            testID={`body-region-back-${region.id}`}
                        >
                            <Text
                                fontSize="text-xs"
                                fontWeight="medium"
                                color={isSelected(region.id) ? colors.neutral.white : colors.journeys.care.text}
                                textAlign="center"
                            >
                                {t(`journeys.care.symptomChecker.bodyMapBack.regions.${region.labelKey}`)}
                            </Text>
                        </Touchable>
                    ))}
                </View>

                {selectedRegions.length > 0 && (
                    <View style={styles.selectedSummary}>
                        <Text variant="body" fontWeight="semiBold" journey="care">
                            {t('journeys.care.symptomChecker.bodyMapBack.selectedAreas', {
                                count: selectedRegions.length,
                            })}
                        </Text>
                        <View style={styles.chipRow}>
                            {selectedRegions.map((regionId) => {
                                const region = BACK_BODY_REGIONS.find((r) => r.id === regionId);
                                return (
                                    <View key={regionId} style={styles.chip}>
                                        <Text fontSize="text-sm" color={colors.neutral.white}>
                                            {region
                                                ? t(
                                                      `journeys.care.symptomChecker.bodyMapBack.regions.${region.labelKey}`
                                                  )
                                                : regionId}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <Button
                        variant="secondary"
                        onPress={handleBack}
                        journey="care"
                        accessibilityLabel={t('journeys.care.symptomChecker.bodyMapBack.back')}
                        testID="back-button"
                    >
                        {t('journeys.care.symptomChecker.bodyMapBack.back')}
                    </Button>
                    <Button
                        onPress={handleContinue}
                        journey="care"
                        disabled={selectedRegions.length === 0}
                        accessibilityLabel={t('journeys.care.symptomChecker.bodyMapBack.continue')}
                        testID="continue-button"
                    >
                        {t('journeys.care.symptomChecker.bodyMapBack.continue')}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: colors.journeys.care.background,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            padding: spacingValues.md,
            paddingBottom: spacingValues['3xl'],
        },
        flipContainer: {
            alignItems: 'center',
            marginTop: spacingValues.sm,
            marginBottom: spacingValues.xs,
        },
        bodyContainer: {
            position: 'relative',
            width: '100%',
            aspectRatio: 0.5,
            marginTop: spacingValues.md,
            marginBottom: spacingValues.xl,
            backgroundColor: theme.colors.background.default,
            borderRadius: spacingValues.xs,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            overflow: 'hidden',
        },
        bodySilhouette: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.3,
        },
        regionTouchable: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: `${colors.journeys.care.primary}20`,
            borderWidth: 1,
            borderColor: colors.journeys.care.primary,
            borderRadius: spacingValues.xs,
        },
        regionSelected: {
            backgroundColor: colors.journeys.care.primary,
            borderColor: colors.journeys.care.accent,
        },
        selectedSummary: {
            marginBottom: spacingValues.md,
        },
        chipRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: spacingValues.xs,
            gap: spacingValues.xs,
        },
        chip: {
            backgroundColor: colors.journeys.care.primary,
            paddingVertical: spacingValues['3xs'],
            paddingHorizontal: spacingValues.sm,
            borderRadius: spacingValues.md,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacingValues.md,
            gap: spacingValues.md,
        },
    });

export { SymptomBodyMapBack };
export default SymptomBodyMapBack;
