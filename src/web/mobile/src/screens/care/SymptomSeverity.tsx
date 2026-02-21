import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Stepper } from '@austa/design-system/src/components/Stepper/Stepper';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Slider } from '@austa/design-system/src/components/Slider/Slider';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
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

type SeverityLevel = 'mild' | 'moderate' | 'severe';

interface SeverityConfig {
  level: SeverityLevel;
  label: string;
  description: string;
  color: string;
  badgeStatus: 'success' | 'warning' | 'error';
  icon: string;
}

const getSeverityConfig = (value: number): SeverityConfig => {
  if (value <= 3) {
    return {
      level: 'mild',
      label: 'Mild',
      description:
        'Your symptoms are manageable. Monitor them and consider self-care measures. If they persist or worsen, consult a healthcare provider.',
      color: colors.semantic.success,
      badgeStatus: 'success',
      icon: 'Low Severity',
    };
  }
  if (value <= 6) {
    return {
      level: 'moderate',
      label: 'Moderate',
      description:
        'Your symptoms require attention. We recommend scheduling an appointment with your healthcare provider within the next few days.',
      color: colors.semantic.warning,
      badgeStatus: 'warning',
      icon: 'Medium Severity',
    };
  }
  return {
    level: 'severe',
    label: 'Severe',
    description:
      'Your symptoms are significant. We strongly recommend seeking medical attention as soon as possible. If you experience an emergency, call 911 immediately.',
    color: colors.semantic.error,
    badgeStatus: 'error',
    icon: 'High Severity',
  };
};

type SymptomSeverityRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  description: string;
  regions: Array<{ id: string; label: string }>;
  details: any[];
  answers: Record<string, string | string[]>;
};

/**
 * Overall severity assessment screen. Users rate their overall symptom severity
 * on a 1-10 scale with visual color-coded feedback.
 * Step 5 of the symptom checker flow.
 */
const SymptomSeverity: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomSeverityRouteParams }, 'params'>>();
  const {
    symptoms = [],
    description = '',
    regions = [],
    details = [],
    answers = {},
  } = route.params || {};

  const [overallSeverity, setOverallSeverity] = useState(5);

  const severityConfig = getSeverityConfig(overallSeverity);

  const handleAnalyze = () => {
    navigation.navigate(ROUTES.CARE_SYMPTOM_RESULT, {
      symptoms,
      description,
      regions,
      details,
      answers,
      overallSeverity,
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
            activeStep={4}
            journey="care"
            accessibilityLabel="Symptom checker progress - Step 5 Severity"
          />
        </View>

        <Text variant="heading" journey="care" testID="severity-title">
          Overall Severity
        </Text>

        <Text variant="body" journey="care">
          Considering all your symptoms together, how would you rate your overall discomfort?
        </Text>

        <Card journey="care" elevation="md">
          {/* Large severity value display */}
          <View style={styles.severityDisplay}>
            <Text
              fontSize="display-lg"
              fontWeight="bold"
              color={severityConfig.color}
              textAlign="center"
              testID="severity-value"
            >
              {overallSeverity}
            </Text>
            <Badge
              variant="status"
              status={severityConfig.badgeStatus}
              testID="severity-badge"
              accessibilityLabel={`Severity level: ${severityConfig.label}`}
            >
              {severityConfig.label}
            </Badge>
          </View>

          {/* Severity Slider */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Text fontSize="text-xs" color={colors.semantic.success}>
                1 - Mild
              </Text>
              <Text fontSize="text-xs" color={colors.semantic.warning}>
                5 - Moderate
              </Text>
              <Text fontSize="text-xs" color={colors.semantic.error}>
                10 - Severe
              </Text>
            </View>
            <Slider
              min={1}
              max={10}
              step={1}
              value={overallSeverity}
              onChange={setOverallSeverity}
              showValue={false}
              journey="care"
              accessibilityLabel="Overall severity slider, 1 is mild and 10 is severe"
            />
          </View>

          {/* Severity indicator bar */}
          <View style={styles.indicatorBar}>
            <View
              style={[
                styles.indicatorSegment,
                {
                  flex: 3,
                  backgroundColor: colors.semantic.success,
                  borderTopLeftRadius: spacingValues['3xs'],
                  borderBottomLeftRadius: spacingValues['3xs'],
                },
              ]}
            />
            <View
              style={[
                styles.indicatorSegment,
                { flex: 3, backgroundColor: colors.semantic.warning },
              ]}
            />
            <View
              style={[
                styles.indicatorSegment,
                {
                  flex: 4,
                  backgroundColor: colors.semantic.error,
                  borderTopRightRadius: spacingValues['3xs'],
                  borderBottomRightRadius: spacingValues['3xs'],
                },
              ]}
            />
          </View>
        </Card>

        {/* Severity description card */}
        <Card journey="care" elevation="sm">
          <View
            style={[
              styles.descriptionHeader,
              { borderLeftColor: severityConfig.color },
            ]}
          >
            <Text
              fontSize="heading-md"
              fontWeight="semiBold"
              color={severityConfig.color}
            >
              {severityConfig.icon}
            </Text>
          </View>
          <Text variant="body" journey="care" testID="severity-description">
            {severityConfig.description}
          </Text>
        </Card>

        <View style={styles.buttonRow}>
          <Button
            variant="secondary"
            onPress={handleBack}
            journey="care"
            accessibilityLabel="Go back to questions"
            testID="back-button"
          >
            Back
          </Button>
          <Button
            onPress={handleAnalyze}
            journey="care"
            accessibilityLabel="Analyze symptoms"
            testID="analyze-button"
          >
            Analyze Symptoms
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
  severityDisplay: {
    alignItems: 'center',
    paddingVertical: spacingValues.xl,
    gap: spacingValues.sm,
  },
  sliderContainer: {
    marginTop: spacingValues.md,
    paddingHorizontal: spacingValues.xs,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacingValues.xs,
  },
  indicatorBar: {
    flexDirection: 'row',
    height: spacingValues.xs,
    marginTop: spacingValues.xl,
    borderRadius: spacingValues['3xs'],
    overflow: 'hidden',
  },
  indicatorSegment: {
    height: '100%',
  },
  descriptionHeader: {
    borderLeftWidth: 3,
    paddingLeft: spacingValues.sm,
    marginBottom: spacingValues.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingValues.xl,
    gap: spacingValues.md,
  },
});

export default SymptomSeverity;
