import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { ROUTES } from '../../../../constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface ConditionParam {
  id: string;
  name: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const getSeverityBadgeStatus = (
  severity: 'low' | 'medium' | 'high'
): 'success' | 'warning' | 'error' => {
  switch (severity) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
  }
};

/** Mock detailed info per condition. In production, fetched from a medical API. */
const CONDITION_DETAILS: Record<string, {
  causes: string[];
  treatments: string[];
  warnings: string[];
  prevention: string[];
}> = {
  c1: {
    causes: [
      'Rhinovirus (most common)',
      'Coronavirus (non-COVID strains)',
      'Respiratory syncytial virus (RSV)',
      'Close contact with infected individuals',
    ],
    treatments: [
      'Rest and adequate sleep',
      'Increased fluid intake',
      'Over-the-counter decongestants',
      'Saline nasal spray',
      'Warm salt water gargle for sore throat',
    ],
    warnings: [
      'Fever above 39.4\u00b0C (103\u00b0F) lasting more than 3 days',
      'Symptoms lasting more than 10 days without improvement',
      'Severe or unusual headache',
      'Difficulty breathing or shortness of breath',
    ],
    prevention: [
      'Wash hands frequently with soap and water',
      'Avoid touching face with unwashed hands',
      'Maintain distance from sick individuals',
      'Disinfect frequently touched surfaces',
    ],
  },
  c2: {
    causes: [
      'Pollen from trees, grasses, and weeds',
      'Dust mites',
      'Pet dander',
      'Mold spores',
    ],
    treatments: [
      'Antihistamines (cetirizine, loratadine)',
      'Nasal corticosteroid sprays',
      'Decongestants for short-term relief',
      'Allergen immunotherapy (for severe cases)',
    ],
    warnings: [
      'Wheezing or difficulty breathing (possible asthma)',
      'Swelling of face, lips, or throat',
      'Symptoms not responding to OTC medications',
      'Recurring sinus infections',
    ],
    prevention: [
      'Monitor pollen counts and limit outdoor exposure',
      'Keep windows closed during high pollen seasons',
      'Use air purifiers with HEPA filters',
      'Shower after outdoor activities',
    ],
  },
};

const getDefaultDetails = () => ({
  causes: [
    'Multiple factors may contribute',
    'Lifestyle and environmental triggers',
    'Genetic predisposition',
    'Stress and fatigue',
  ],
  treatments: [
    'Consult with a healthcare professional for personalized treatment',
    'Over-the-counter symptom relief as appropriate',
    'Rest and adequate hydration',
    'Monitor symptoms and track changes',
  ],
  warnings: [
    'Sudden worsening of symptoms',
    'High fever that does not respond to medication',
    'Difficulty breathing',
    'Loss of consciousness',
  ],
  prevention: [
    'Maintain a healthy lifestyle with regular exercise',
    'Eat a balanced diet rich in vitamins and minerals',
    'Get adequate sleep (7-9 hours nightly)',
    'Manage stress through relaxation techniques',
  ],
});

type SymptomConditionDetailRouteParams = {
  condition: ConditionParam;
};

/**
 * Detailed information about a single possible condition.
 * Shows overview, causes, treatments, warning signs, and prevention tips.
 */
const SymptomConditionDetail: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomConditionDetailRouteParams }, 'params'>>();
  const { t } = useTranslation();
  const { condition } = route.params || { condition: { id: '', name: '', probability: 0, severity: 'low' as const, description: '' } };

  const details = CONDITION_DETAILS[condition.id] || getDefaultDetails();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBookAppointment = () => {
    navigation.navigate(ROUTES.CARE_SYMPTOM_BOOK_APPOINTMENT, {
      conditions: [condition],
      overallSeverity: condition.severity === 'high' ? 8 : condition.severity === 'medium' ? 5 : 3,
    });
  };

  const handleLearnMore = () => {
    // In production, this would open a deep link to a medical resource
  };

  const sections = [
    {
      key: 'overview',
      title: t('journeys.care.symptomChecker.conditionDetail.overview', { defaultValue: 'Overview' }),
      content: condition.description,
      items: null,
    },
    {
      key: 'causes',
      title: t('journeys.care.symptomChecker.conditionDetail.commonCauses', { defaultValue: 'Common Causes' }),
      content: null,
      items: details.causes,
    },
    {
      key: 'treatments',
      title: t('journeys.care.symptomChecker.conditionDetail.treatmentOptions', { defaultValue: 'Treatment Options' }),
      content: null,
      items: details.treatments,
    },
    {
      key: 'warnings',
      title: t('journeys.care.symptomChecker.conditionDetail.whenToWorry', { defaultValue: 'When to Seek Medical Help' }),
      content: null,
      items: details.warnings,
    },
    {
      key: 'prevention',
      title: t('journeys.care.symptomChecker.conditionDetail.prevention', { defaultValue: 'Prevention' }),
      content: null,
      items: details.prevention,
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with condition name and severity */}
        <View style={styles.header}>
          <Text variant="heading" journey="care" testID="condition-detail-title">
            {condition.name}
          </Text>
          <Badge
            variant="status"
            status={getSeverityBadgeStatus(condition.severity)}
            testID="condition-detail-severity"
            accessibilityLabel={t('journeys.care.symptomChecker.conditionDetail.severityLabel', {
              defaultValue: `${condition.severity} severity`,
              severity: condition.severity,
            })}
          >
            {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
          </Badge>
        </View>

        {/* Probability bar */}
        <Card journey="care" elevation="md">
          <View style={styles.probabilityRow}>
            <Text variant="body" fontWeight="semiBold" journey="care">
              {t('journeys.care.symptomChecker.conditionDetail.matchConfidence', {
                defaultValue: 'Match Confidence',
              })}
            </Text>
            <Text
              fontSize="text-sm"
              fontWeight="semiBold"
              color={colors.journeys.care.primary}
              testID="condition-detail-probability"
            >
              {condition.probability}%
            </Text>
          </View>
          <ProgressBar
            current={condition.probability}
            total={100}
            journey="care"
            size="md"
            testId="condition-detail-progress"
            ariaLabel={`${condition.name} match confidence: ${condition.probability}%`}
          />
        </Card>

        {/* Detail sections */}
        {sections.map((section) => (
          <Card key={section.key} journey="care" elevation="sm">
            <Text
              fontSize="heading-md"
              fontWeight="semiBold"
              journey="care"
              testID={`section-title-${section.key}`}
            >
              {section.title}
            </Text>

            {section.content && (
              <Text variant="body" journey="care">
                {section.content}
              </Text>
            )}

            {section.items && section.items.length > 0 && (
              <View style={styles.itemList}>
                {section.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text fontSize="text-sm" color={colors.journeys.care.primary}>
                      {'\u2022'}
                    </Text>
                    <Text variant="body" fontSize="text-sm" journey="care">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        ))}

        {/* Learn more link */}
        <View style={styles.learnMoreContainer}>
          <Touchable
            onPress={handleLearnMore}
            accessibilityLabel={t('journeys.care.symptomChecker.conditionDetail.learnMore', {
              defaultValue: `Learn more about ${condition.name}`,
              name: condition.name,
            })}
            accessibilityRole="link"
            testID="learn-more-link"
          >
            <Text
              fontSize="text-sm"
              fontWeight="semiBold"
              color={colors.journeys.care.primary}
            >
              {t('journeys.care.symptomChecker.conditionDetail.learnMoreLabel', {
                defaultValue: 'Learn More',
              })}
            </Text>
          </Touchable>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <Button
            variant="secondary"
            onPress={handleBack}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.conditionDetail.back', {
              defaultValue: 'Go back to conditions list',
            })}
            testID="back-button"
          >
            {t('journeys.care.symptomChecker.conditionDetail.backButton', { defaultValue: 'Back' })}
          </Button>
          <Button
            onPress={handleBookAppointment}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.conditionDetail.bookCta', {
              defaultValue: 'Book an appointment',
            })}
            testID="book-appointment-button"
          >
            {t('journeys.care.symptomChecker.conditionDetail.bookButton', {
              defaultValue: 'Book Appointment',
            })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.sm,
  },
  probabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues.xs,
  },
  itemList: {
    marginTop: spacingValues.sm,
    gap: spacingValues['3xs'],
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingValues.xs,
    paddingLeft: spacingValues.xs,
  },
  learnMoreContainer: {
    alignItems: 'center',
    marginTop: spacingValues.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingValues.xl,
    gap: spacingValues.md,
  },
});

export { SymptomConditionDetail };
export default SymptomConditionDetail;
