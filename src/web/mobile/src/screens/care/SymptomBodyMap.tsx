import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Stepper } from '@austa/design-system/src/components/Stepper/Stepper';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Box } from '@austa/design-system/src/primitives/Box/Box';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { ROUTES } from '@constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { useTranslation } from 'react-i18next';

/**
 * Anatomical body regions for symptom location selection.
 * Each region has a display name and position coordinates relative
 * to the body silhouette container.
 */
interface BodyRegion {
  id: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const BODY_REGIONS_BASE = [
  { id: 'head', labelKey: 'journeys.care.symptomChecker.bodyMap.head', top: 2, left: 35, width: 30, height: 10 },
  { id: 'neck', labelKey: 'journeys.care.symptomChecker.bodyMap.neck', top: 12, left: 38, width: 24, height: 5 },
  { id: 'chest', labelKey: 'journeys.care.symptomChecker.bodyMap.chest', top: 17, left: 28, width: 44, height: 12 },
  { id: 'abdomen', labelKey: 'journeys.care.symptomChecker.bodyMap.abdomen', top: 29, left: 30, width: 40, height: 12 },
  { id: 'pelvis', labelKey: 'journeys.care.symptomChecker.bodyMap.pelvis', top: 41, left: 32, width: 36, height: 8 },
  { id: 'left_arm', labelKey: 'journeys.care.symptomChecker.bodyMap.leftArm', top: 17, left: 5, width: 22, height: 28 },
  { id: 'right_arm', labelKey: 'journeys.care.symptomChecker.bodyMap.rightArm', top: 17, left: 73, width: 22, height: 28 },
  { id: 'back', labelKey: 'journeys.care.symptomChecker.bodyMap.back', top: 20, left: 35, width: 30, height: 20 },
  { id: 'left_leg', labelKey: 'journeys.care.symptomChecker.bodyMap.leftLeg', top: 49, left: 20, width: 24, height: 48 },
  { id: 'right_leg', labelKey: 'journeys.care.symptomChecker.bodyMap.rightLeg', top: 49, left: 56, width: 24, height: 48 },
];

type SymptomBodyMapRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  description: string;
};

/**
 * Interactive body map screen for selecting anatomical regions where symptoms are located.
 * Step 2 of the symptom checker flow.
 * Users tap on body regions to indicate where they experience symptoms.
 */
const SymptomBodyMap: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomBodyMapRouteParams }, 'params'>>();
  const { symptoms = [], description = '' } = route.params || {};
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const SYMPTOM_STEPS = [
    { label: t('journeys.care.symptomChecker.steps.symptoms') },
    { label: t('journeys.care.symptomChecker.steps.bodyMap') },
    { label: t('journeys.care.symptomChecker.steps.details') },
    { label: t('journeys.care.symptomChecker.steps.questions') },
    { label: t('journeys.care.symptomChecker.steps.severity') },
    { label: t('journeys.care.symptomChecker.steps.results') },
    { label: t('journeys.care.symptomChecker.steps.actions') },
  ];

  const BODY_REGIONS: BodyRegion[] = BODY_REGIONS_BASE.map((r) => ({
    id: r.id,
    label: t(r.labelKey),
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
  }));

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
    const selectedRegionData = BODY_REGIONS.filter((r) =>
      selectedRegions.includes(r.id)
    );

    navigation.navigate(ROUTES.CARE_SYMPTOM_DETAIL, {
      symptoms,
      description,
      regions: selectedRegionData.map((r) => ({ id: r.id, label: r.label })),
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.stepperContainer}>
          <Stepper
            steps={SYMPTOM_STEPS}
            activeStep={1}
            journey="care"
            accessibilityLabel="Symptom checker progress - Step 2 Body Map"
          />
        </View>

        <Text
          variant="heading"
          journey="care"
          testID="body-map-title"
        >
          {t('journeys.care.symptomChecker.bodyMap.title')}
        </Text>

        <Text
          variant="body"
          journey="care"
          testID="body-map-subtitle"
        >
          {t('journeys.care.symptomChecker.bodyMap.subtitle')}
        </Text>

        <View style={styles.bodyContainer}>
          {/* Body silhouette background */}
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

          {/* Interactive body regions */}
          {BODY_REGIONS.map((region) => (
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
              accessibilityLabel={`${region.label} region${isSelected(region.id) ? ', selected' : ''}`}
              accessibilityRole="button"
              testID={`body-region-${region.id}`}
            >
              <Text
                fontSize="text-xs"
                fontWeight="medium"
                color={isSelected(region.id) ? colors.neutral.white : colors.journeys.care.text}
                textAlign="center"
              >
                {region.label}
              </Text>
            </Touchable>
          ))}
        </View>

        {/* Selected regions summary */}
        {selectedRegions.length > 0 && (
          <View style={styles.selectedSummary}>
            <Text variant="body" fontWeight="semiBold" journey="care">
              {t('journeys.care.symptomChecker.bodyMap.selectedAreas', { count: selectedRegions.length })}:
            </Text>
            <View style={styles.chipRow}>
              {selectedRegions.map((regionId) => {
                const region = BODY_REGIONS.find((r) => r.id === regionId);
                return (
                  <View key={regionId} style={styles.chip}>
                    <Text
                      fontSize="text-sm"
                      color={colors.neutral.white}
                    >
                      {region?.label}
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
            accessibilityLabel="Go back to symptom input"
            testID="back-button"
          >
            {t('common.buttons.back')}
          </Button>
          <Button
            onPress={handleContinue}
            journey="care"
            disabled={selectedRegions.length === 0}
            accessibilityLabel="Continue to symptom details"
            testID="continue-button"
          >
            {t('common.buttons.next')}
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
  stepperContainer: {
    marginBottom: spacingValues.xl,
  },
  bodyContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 0.5,
    marginTop: spacingValues.xl,
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

export default SymptomBodyMap;
