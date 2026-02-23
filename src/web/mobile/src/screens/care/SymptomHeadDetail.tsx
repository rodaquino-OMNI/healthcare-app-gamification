import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { ROUTES } from '@constants/routes';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Head/face regions for precise symptom location.
 * Larger touchable areas since this is a zoomed-in view.
 */
interface HeadRegion {
  id: string;
  labelKey: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const HEAD_REGIONS: HeadRegion[] = [
  { id: 'scalp', labelKey: 'scalp', top: 2, left: 25, width: 50, height: 12 },
  { id: 'forehead', labelKey: 'forehead', top: 14, left: 20, width: 60, height: 10 },
  { id: 'temples_left', labelKey: 'templesLeft', top: 22, left: 5, width: 20, height: 12 },
  { id: 'temples_right', labelKey: 'templesRight', top: 22, left: 75, width: 20, height: 12 },
  { id: 'eyes', labelKey: 'eyes', top: 26, left: 22, width: 56, height: 10 },
  { id: 'nose', labelKey: 'nose', top: 36, left: 35, width: 30, height: 12 },
  { id: 'ears', labelKey: 'ears', top: 32, left: 2, width: 16, height: 14 },
  { id: 'jaw', labelKey: 'jaw', top: 50, left: 15, width: 70, height: 12 },
  { id: 'throat', labelKey: 'throat', top: 64, left: 30, width: 40, height: 14 },
  { id: 'back_of_head', labelKey: 'backOfHead', top: 80, left: 25, width: 50, height: 14 },
];

type SymptomHeadDetailRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  description: string;
  bodyRegions: Array<{ id: string; label: string }>;
};

/**
 * Detailed head/face zoom view for precise symptom location selection.
 * Provides larger touchable areas for head-specific regions.
 */
const SymptomHeadDetail: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomHeadDetailRouteParams }, 'params'>>();
  const { symptoms = [], description = '', bodyRegions = [] } = route.params || {};

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

  const handleContinue = () => {
    const selectedHeadData = HEAD_REGIONS.filter((r) =>
      selectedRegions.includes(r.id)
    );
    const headRegions = selectedHeadData.map((r) => ({
      id: r.id,
      label: t(`journeys.care.symptomChecker.headDetail.regions.${r.labelKey}`),
    }));
    const allRegions = [...bodyRegions, ...headRegions];

    navigation.navigate(ROUTES.CARE_SYMPTOM_DETAIL, {
      symptoms,
      description,
      regions: allRegions,
    });
  };

  const handleBackToBodyMap = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text variant="heading" journey="care" testID="head-detail-title">
          {t('journeys.care.symptomChecker.headDetail.title')}
        </Text>

        <Text variant="body" journey="care" testID="head-detail-subtitle">
          {t('journeys.care.symptomChecker.headDetail.subtitle')}
        </Text>

        <View style={styles.headContainer}>
          <View style={styles.headSilhouette}>
            <Text
              fontSize="display-lg"
              textAlign="center"
              color={colors.neutral.gray300}
              aria-hidden="true"
            >
              {'\u{1F9D1}'}
            </Text>
          </View>

          {HEAD_REGIONS.map((region) => (
            <Touchable
              key={region.id}
              onPress={() => toggleRegion(region.id)}
              style={[
                styles.regionTouchable,
                {
                  top: `${region.top}%`,
                  left: `${region.left}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                },
                isSelected(region.id) && styles.regionSelected,
              ]}
              accessibilityLabel={`${t(`journeys.care.symptomChecker.headDetail.regions.${region.labelKey}`)}${isSelected(region.id) ? `, ${t('journeys.care.symptomChecker.headDetail.selected')}` : ''}`}
              accessibilityRole="button"
              testID={`head-region-${region.id}`}
            >
              <Text
                fontSize="text-xs"
                fontWeight="medium"
                color={isSelected(region.id) ? colors.neutral.white : colors.journeys.care.text}
                textAlign="center"
              >
                {t(`journeys.care.symptomChecker.headDetail.regions.${region.labelKey}`)}
              </Text>
            </Touchable>
          ))}
        </View>

        {selectedRegions.length > 0 && (
          <View style={styles.selectedSummary}>
            <Text variant="body" fontWeight="semiBold" journey="care">
              {t('journeys.care.symptomChecker.headDetail.selectedAreas', { count: selectedRegions.length })}
            </Text>
            <View style={styles.chipRow}>
              {selectedRegions.map((regionId) => {
                const region = HEAD_REGIONS.find((r) => r.id === regionId);
                return (
                  <View key={regionId} style={styles.chip}>
                    <Text fontSize="text-sm" color={colors.neutral.white}>
                      {region ? t(`journeys.care.symptomChecker.headDetail.regions.${region.labelKey}`) : regionId}
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
            onPress={handleBackToBodyMap}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.headDetail.backToBodyMap')}
            testID="back-to-body-map-button"
          >
            {t('journeys.care.symptomChecker.headDetail.backToBodyMap')}
          </Button>
          <Button
            onPress={handleContinue}
            journey="care"
            disabled={selectedRegions.length === 0}
            accessibilityLabel={t('journeys.care.symptomChecker.headDetail.continue')}
            testID="continue-button"
          >
            {t('journeys.care.symptomChecker.headDetail.continue')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
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
  headContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 0.75,
    marginTop: spacingValues.xl,
    marginBottom: spacingValues.xl,
    backgroundColor: theme.colors.background.default,
    borderRadius: spacingValues.xs,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
  },
  headSilhouette: {
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

export { SymptomHeadDetail };
export default SymptomHeadDetail;
