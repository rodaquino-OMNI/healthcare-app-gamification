import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Stepper } from '@austa/design-system/src/components/Stepper/Stepper';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Select } from '@austa/design-system/src/components/Select/Select';
import { DatePicker } from '@austa/design-system/src/components/DatePicker/DatePicker';
import Input from '@austa/design-system/src/components/Input/Input';
import { Slider } from '@austa/design-system/src/components/Slider/Slider';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '../../../../constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { useTranslation } from 'react-i18next';

interface RegionDetail {
  regionId: string;
  regionLabel: string;
  severity: number;
  duration: string;
  onset: Date | null;
  notes: string;
}

type SymptomDetailRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  description: string;
  regions: Array<{ id: string; label: string }>;
};

/**
 * Symptom detail screen where users provide additional information for each
 * affected body region, including severity, duration, onset date, and notes.
 * Step 3 of the symptom checker flow.
 */
const SymptomDetail: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomDetailRouteParams }, 'params'>>();
  const { symptoms = [], description = '', regions = [] } = route.params || {};
  const { t } = useTranslation();

  const SYMPTOM_STEPS = [
    { label: t('journeys.care.symptomChecker.steps.symptoms') },
    { label: t('journeys.care.symptomChecker.steps.bodyMap') },
    { label: t('journeys.care.symptomChecker.steps.details') },
    { label: t('journeys.care.symptomChecker.steps.questions') },
    { label: t('journeys.care.symptomChecker.steps.severity') },
    { label: t('journeys.care.symptomChecker.steps.results') },
    { label: t('journeys.care.symptomChecker.steps.actions') },
  ];

  const DURATION_OPTIONS = [
    { label: t('journeys.care.symptomChecker.duration.lessThanHour'), value: 'less_than_hour' },
    { label: t('journeys.care.symptomChecker.duration.hours'), value: 'hours' },
    { label: t('journeys.care.symptomChecker.duration.days1to3'), value: 'days_1_3' },
    { label: t('journeys.care.symptomChecker.duration.days4to7'), value: 'days_4_7' },
    { label: t('journeys.care.symptomChecker.duration.weeks1to2'), value: 'weeks_1_2' },
    { label: t('journeys.care.symptomChecker.duration.weeks2to4'), value: 'weeks_2_4' },
    { label: t('journeys.care.symptomChecker.duration.months'), value: 'months' },
  ];

  const [details, setDetails] = useState<RegionDetail[]>(
    regions.map((region) => ({
      regionId: region.id,
      regionLabel: region.label,
      severity: 5,
      duration: '',
      onset: null,
      notes: '',
    }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDetail = details[currentIndex];

  const updateDetail = (field: keyof RegionDetail, value: any) => {
    setDetails((prev) =>
      prev.map((d, i) => (i === currentIndex ? { ...d, [field]: value } : d))
    );
  };

  const handleNext = () => {
    if (currentIndex < details.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleContinue();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleContinue = () => {
    navigation.navigate(ROUTES.CARE_SYMPTOM_QUESTIONS, {
      symptoms,
      description,
      regions,
      details,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getSeverityColor = (value: number): string => {
    if (value <= 3) return colors.semantic.success;
    if (value <= 6) return colors.semantic.warning;
    return colors.semantic.error;
  };

  const getSeverityLabel = (value: number): string => {
    if (value <= 3) return t('journeys.care.symptomChecker.severity.mild');
    if (value <= 6) return t('journeys.care.symptomChecker.severity.moderate');
    return t('journeys.care.symptomChecker.severity.severe');
  };

  if (!currentDetail) {
    return (
      <View style={styles.root}>
        <Text variant="body" journey="care">
          {t('journeys.care.symptomChecker.noRegionsSelected')}
        </Text>
        <Button onPress={handleBack} journey="care" accessibilityLabel="Go back">
          {t('common.buttons.back')}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepperContainer}>
          <Stepper
            steps={SYMPTOM_STEPS}
            activeStep={2}
            journey="care"
            accessibilityLabel="Symptom checker progress - Step 3 Details"
          />
        </View>

        <Text variant="heading" journey="care" testID="detail-title">
          {t('journeys.care.symptomChecker.details.title')}
        </Text>

        {details.length > 1 && (
          <Text
            variant="body"
            journey="care"
            testID="detail-region-counter"
          >
            {t('journeys.care.symptomChecker.details.regionCounter', { current: currentIndex + 1, total: details.length })}
          </Text>
        )}

        <Card journey="care" elevation="md">
          <Text
            variant="heading"
            fontSize="heading-lg"
            journey="care"
            testID="detail-region-name"
          >
            {currentDetail.regionLabel}
          </Text>

          {/* Severity Slider */}
          <View style={styles.fieldGroup}>
            <Text variant="body" fontWeight="semiBold" journey="care">
              {t('journeys.care.symptomChecker.severity.label')}
            </Text>
            <View style={styles.severityRow}>
              <Text
                fontSize="heading-2xl"
                fontWeight="bold"
                color={getSeverityColor(currentDetail.severity)}
              >
                {currentDetail.severity}
              </Text>
              <Text
                fontSize="text-sm"
                color={getSeverityColor(currentDetail.severity)}
              >
                {getSeverityLabel(currentDetail.severity)}
              </Text>
            </View>
            <Slider
              min={1}
              max={10}
              step={1}
              value={currentDetail.severity}
              onChange={(value) => updateDetail('severity', value)}
              showValue={false}
              journey="care"
              accessibilityLabel={`Severity slider for ${currentDetail.regionLabel}`}
            />
          </View>

          {/* Duration Select */}
          <View style={styles.fieldGroup}>
            <Select
              label={t('journeys.care.symptomChecker.details.duration')}
              options={DURATION_OPTIONS}
              value={currentDetail.duration}
              onChange={(value) => updateDetail('duration', value as string)}
              placeholder={t('journeys.care.symptomChecker.details.durationPlaceholder')}
              journey="care"
              testID="duration-select"
            />
          </View>

          {/* Onset DatePicker */}
          <View style={styles.fieldGroup}>
            <Text variant="body" fontWeight="semiBold" journey="care">
              {t('journeys.care.symptomChecker.details.whenDidItStart')}
            </Text>
            <DatePicker
              value={currentDetail.onset}
              onChange={(date) => updateDetail('onset', date)}
              placeholder={t('journeys.care.symptomChecker.details.selectOnsetDate')}
              label={t('journeys.care.symptomChecker.details.onsetDate')}
              journey="care"
              maxDate={new Date()}
              accessibilityLabel={`Onset date for ${currentDetail.regionLabel}`}
              testID="onset-datepicker"
            />
          </View>

          {/* Notes Input */}
          <View style={styles.fieldGroup}>
            <Input
              label={t('journeys.care.symptomChecker.details.additionalNotes')}
              value={currentDetail.notes}
              onChange={(e: any) => updateDetail('notes', e.target?.value ?? e)}
              placeholder={t('journeys.care.symptomChecker.details.notesPlaceholder')}
              journey="care"
              aria-label={`Additional notes for ${currentDetail.regionLabel}`}
              testID="notes-input"
            />
          </View>
        </Card>

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          {currentIndex === 0 ? (
            <Button
              variant="secondary"
              onPress={handleBack}
              journey="care"
              accessibilityLabel="Go back to body map"
              testID="back-button"
            >
              {t('common.buttons.back')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onPress={handlePrevious}
              journey="care"
              accessibilityLabel="Previous region"
              testID="previous-button"
            >
              {t('journeys.care.symptomChecker.details.previous')}
            </Button>
          )}

          <Button
            onPress={handleNext}
            journey="care"
            accessibilityLabel={
              currentIndex < details.length - 1
                ? 'Next region'
                : 'Continue to questions'
            }
            testID="next-button"
          >
            {currentIndex < details.length - 1 ? t('journeys.care.symptomChecker.details.nextRegion') : t('common.buttons.next')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  fieldGroup: {
    marginTop: spacingValues.md,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacingValues.xs,
    marginTop: spacingValues['3xs'],
    marginBottom: spacingValues.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingValues.xl,
    gap: spacingValues.md,
  },
});

export default SymptomDetail;
