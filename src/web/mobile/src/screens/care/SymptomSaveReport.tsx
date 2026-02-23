import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { ROUTES } from '@constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface PossibleCondition {
  id: string;
  name: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
}

type SymptomSaveReportRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  regions: Array<{ id: string; label: string }>;
  conditions: PossibleCondition[];
  overallSeverity: number;
};

const getSeverityLabel = (severity: number): string => {
  if (severity <= 3) return 'Low';
  if (severity <= 6) return 'Moderate';
  return 'High';
};

const getSeverityBadgeStatus = (
  severity: number,
): 'success' | 'warning' | 'error' => {
  if (severity <= 3) return 'success';
  if (severity <= 6) return 'warning';
  return 'error';
};

/**
 * Save symptom report screen.
 * Shows a summary of the symptom check and allows saving as PDF
 * or to health records.
 */
const SymptomSaveReport: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomSaveReportRouteParams }, 'params'>>();
  const { t } = useTranslation();

  const {
    symptoms = [],
    regions = [],
    conditions = [],
    overallSeverity = 5,
  } = route.params || {};

  const [saveToRecords, setSaveToRecords] = useState(true);
  const currentDate = new Date().toLocaleDateString();

  const handleSavePDF = () => {
    Alert.alert(
      t('journeys.care.symptomChecker.saveReport.pdfSuccessTitle'),
      t('journeys.care.symptomChecker.saveReport.pdfSuccessMessage'),
      [{ text: t('journeys.care.symptomChecker.saveReport.ok') }],
    );
  };

  const handleShareReport = () => {
    navigation.navigate(ROUTES.CARE_SYMPTOM_SHARE_REPORT, {
      symptoms,
      regions,
      conditions,
      overallSeverity,
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text variant="heading" journey="care" testID="save-report-title">
          {t('journeys.care.symptomChecker.saveReport.title')}
        </Text>

        {/* Summary card */}
        <Card journey="care" elevation="md">
          <Text variant="body" fontWeight="semiBold" journey="care">
            {t('journeys.care.symptomChecker.saveReport.summary')}
          </Text>

          {/* Date */}
          <View style={styles.summaryRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.symptomChecker.saveReport.date')}
            </Text>
            <Text fontSize="text-sm" fontWeight="semiBold" journey="care" testID="report-date">
              {currentDate}
            </Text>
          </View>

          {/* Severity */}
          <View style={styles.summaryRow}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.symptomChecker.saveReport.severity')}
            </Text>
            <Badge
              variant="status"
              status={getSeverityBadgeStatus(overallSeverity)}
              testID="severity-badge"
              accessibilityLabel={`${t('journeys.care.symptomChecker.saveReport.severity')}: ${getSeverityLabel(overallSeverity)}`}
            >
              {getSeverityLabel(overallSeverity)} ({overallSeverity}/10)
            </Badge>
          </View>

          {/* Symptoms */}
          <View style={styles.summarySection}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
              {t('journeys.care.symptomChecker.saveReport.symptoms')}
            </Text>
            {symptoms.map((symptom, index) => (
              <Text
                key={symptom.id}
                variant="body"
                journey="care"
                testID={`symptom-${index}`}
              >
                {'\u2022'} {symptom.name}
              </Text>
            ))}
          </View>

          {/* Body regions */}
          {regions.length > 0 && (
            <View style={styles.summarySection}>
              <Text fontSize="text-sm" color={colors.neutral.gray600}>
                {t('journeys.care.symptomChecker.saveReport.regions')}
              </Text>
              {regions.map((region, index) => (
                <Text
                  key={region.id}
                  variant="body"
                  journey="care"
                  testID={`region-${index}`}
                >
                  {'\u2022'} {region.label}
                </Text>
              ))}
            </View>
          )}

          {/* Top conditions */}
          {conditions.length > 0 && (
            <View style={styles.summarySection}>
              <Text fontSize="text-sm" color={colors.neutral.gray600}>
                {t('journeys.care.symptomChecker.saveReport.conditions')}
              </Text>
              {conditions.slice(0, 3).map((condition, index) => (
                <View key={condition.id} style={styles.conditionRow}>
                  <Text variant="body" journey="care" testID={`condition-${index}`}>
                    {'\u2022'} {condition.name}
                  </Text>
                  <Text fontSize="text-sm" color={colors.neutral.gray600}>
                    {condition.probability}%
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Save to health records toggle */}
        <Card journey="care" elevation="sm">
          <View style={styles.toggleRow}>
            <Text variant="body" journey="care">
              {t('journeys.care.symptomChecker.saveReport.saveToRecords')}
            </Text>
            <Switch
              value={saveToRecords}
              onValueChange={setSaveToRecords}
              trackColor={{
                false: colors.neutral.gray400,
                true: colors.journeys.care.primary,
              }}
              thumbColor={colors.neutral.white}
              accessibilityLabel={t('journeys.care.symptomChecker.saveReport.saveToRecords')}
              testID="save-to-records-toggle"
            />
          </View>
          <Text
            variant="caption"
            color={colors.neutral.gray600}
          >
            {t('journeys.care.symptomChecker.saveReport.saveToRecordsDescription')}
          </Text>
        </Card>

        {/* Actions */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSavePDF}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.saveReport.savePDF')}
            testID="save-pdf-button"
          >
            {t('journeys.care.symptomChecker.saveReport.savePDF')}
          </Button>

          <Touchable
            onPress={handleShareReport}
            accessibilityLabel={t('journeys.care.symptomChecker.saveReport.shareReport')}
            accessibilityRole="button"
            testID="share-report-button"
          >
            <View style={styles.shareButton}>
              <Text
                fontSize="text-sm"
                fontWeight="semiBold"
                color={colors.journeys.care.primary}
              >
                {t('journeys.care.symptomChecker.saveReport.shareReport')}
              </Text>
            </View>
          </Touchable>
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingValues['3xs'],
  },
  summarySection: {
    marginTop: spacingValues.sm,
    gap: spacingValues['4xs'],
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues['3xs'],
  },
  buttonContainer: {
    marginTop: spacingValues.xl,
    gap: spacingValues.sm,
  },
  shareButton: {
    alignItems: 'center',
    paddingVertical: spacingValues.sm,
  },
});

export { SymptomSaveReport };
export default SymptomSaveReport;
