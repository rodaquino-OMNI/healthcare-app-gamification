import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Slider } from 'src/web/design-system/src/components/Slider/Slider';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { WEB_CARE_ROUTES } from 'src/web/shared/constants/routes';

/** Severity level thresholds and their labels */
const SEVERITY_LABELS = [
  { min: 1, max: 3, label: 'Mild', description: 'Noticeable but does not interfere with daily activities', color: colors.semantic.success },
  { min: 4, max: 6, label: 'Moderate', description: 'Interferes with some daily activities', color: colors.semantic.warning },
  { min: 7, max: 8, label: 'Severe', description: 'Significantly limits daily activities', color: colors.semantic.error },
  { min: 9, max: 10, label: 'Critical', description: 'Requires immediate medical attention', color: colors.semantic.error },
];

const getSeverityInfo = (value: number) => {
  return SEVERITY_LABELS.find((s) => value >= s.min && value <= s.max) || SEVERITY_LABELS[0];
};

/**
 * Overall severity assessment page.
 * Users rate the overall impact of their symptoms before analysis.
 */
const SymptomSeverityPage: React.FC = () => {
  const router = useRouter();
  const [overallSeverity, setOverallSeverity] = useState(5);

  const severityInfo = getSeverityInfo(overallSeverity);

  const handleAnalyze = () => {
    router.push({
      pathname: WEB_CARE_ROUTES.SYMPTOM_RESULT,
      query: {
        ...router.query,
        overallSeverity: overallSeverity.toString(),
      },
    });
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={colors.journeys.care.text}
      >
        Overall Severity
      </Text>
      <Text
        fontSize="md"
        color={colors.gray[50]}
        style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}
      >
        Rate the overall impact of your symptoms on a scale of 1 to 10.
      </Text>

      <Card journey="care" elevation="md" padding="lg">
        <Box style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color={severityInfo.color}
          >
            {overallSeverity}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="medium"
            color={severityInfo.color}
            style={{ marginTop: spacing.xs }}
          >
            {severityInfo.label}
          </Text>
          <Text
            fontSize="sm"
            color={colors.gray[50]}
            style={{ marginTop: spacing.xs }}
          >
            {severityInfo.description}
          </Text>
        </Box>

        <Slider
          min={1}
          max={10}
          step={1}
          value={overallSeverity}
          onChange={setOverallSeverity}
          journey="care"
          accessibilityLabel="Overall symptom severity from 1 to 10"
        />

        <Box
          display="flex"
          justifyContent="space-between"
          style={{ marginTop: spacing.sm }}
        >
          <Text fontSize="xs" color={colors.semantic.success}>1 - Mild</Text>
          <Text fontSize="xs" color={colors.semantic.warning}>5 - Moderate</Text>
          <Text fontSize="xs" color={colors.semantic.error}>10 - Critical</Text>
        </Box>
      </Card>

      <Box
        display="flex"
        justifyContent="space-between"
        style={{ marginTop: spacing['2xl'] }}
      >
        <Button
          variant="secondary"
          journey="care"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          Back
        </Button>
        <Button
          journey="care"
          onPress={handleAnalyze}
          accessibilityLabel="Analyze symptoms"
        >
          Analyze Symptoms
        </Button>
      </Box>
    </div>
  );
};

export default SymptomSeverityPage;
