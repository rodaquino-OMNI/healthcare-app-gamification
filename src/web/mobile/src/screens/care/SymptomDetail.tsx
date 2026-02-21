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

const SYMPTOM_STEPS = [
  { label: 'Symptoms' },
  { label: 'Body Map' },
  { label: 'Details' },
  { label: 'Questions' },
  { label: 'Severity' },
  { label: 'Results' },
  { label: 'Actions' },
];

const DURATION_OPTIONS = [
  { label: 'Less than 1 hour', value: 'less_than_hour' },
  { label: 'A few hours', value: 'hours' },
  { label: '1-3 days', value: 'days_1_3' },
  { label: '4-7 days', value: 'days_4_7' },
  { label: '1-2 weeks', value: 'weeks_1_2' },
  { label: '2-4 weeks', value: 'weeks_2_4' },
  { label: 'More than a month', value: 'months' },
];

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
    if (value <= 3) return 'Mild';
    if (value <= 6) return 'Moderate';
    return 'Severe';
  };

  if (!currentDetail) {
    return (
      <View style={styles.root}>
        <Text variant="body" journey="care">
          No regions selected. Please go back and select body areas.
        </Text>
        <Button onPress={handleBack} journey="care" accessibilityLabel="Go back">
          Go Back
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
          Symptom Details
        </Text>

        {details.length > 1 && (
          <Text
            variant="body"
            journey="care"
            testID="detail-region-counter"
          >
            Region {currentIndex + 1} of {details.length}
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
              Severity
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
              label="Duration"
              options={DURATION_OPTIONS}
              value={currentDetail.duration}
              onChange={(value) => updateDetail('duration', value as string)}
              placeholder="How long have you had this symptom?"
              journey="care"
              testID="duration-select"
            />
          </View>

          {/* Onset DatePicker */}
          <View style={styles.fieldGroup}>
            <Text variant="body" fontWeight="semiBold" journey="care">
              When did it start?
            </Text>
            <DatePicker
              value={currentDetail.onset}
              onChange={(date) => updateDetail('onset', date)}
              placeholder="Select onset date"
              label="Onset date"
              journey="care"
              maxDate={new Date()}
              accessibilityLabel={`Onset date for ${currentDetail.regionLabel}`}
              testID="onset-datepicker"
            />
          </View>

          {/* Notes Input */}
          <View style={styles.fieldGroup}>
            <Input
              label="Additional Notes"
              value={currentDetail.notes}
              onChange={(e: any) => updateDetail('notes', e.target?.value ?? e)}
              placeholder="Any additional details about this symptom..."
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
              Back
            </Button>
          ) : (
            <Button
              variant="secondary"
              onPress={handlePrevious}
              journey="care"
              accessibilityLabel="Previous region"
              testID="previous-button"
            >
              Previous
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
            {currentIndex < details.length - 1 ? 'Next Region' : 'Continue'}
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
