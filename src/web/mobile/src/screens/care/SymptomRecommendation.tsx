import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Stepper } from '@austa/design-system/src/components/Stepper/Stepper';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
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

interface RecommendationAction {
  id: string;
  priority: number;
  title: string;
  description: string;
  type: 'emergency' | 'doctor' | 'self_care' | 'medication';
  actionLabel?: string;
  items?: string[];
}

const getRecommendations = (overallSeverity: number): RecommendationAction[] => {
  const recommendations: RecommendationAction[] = [];

  // Emergency recommendation for high severity
  if (overallSeverity >= 8) {
    recommendations.push({
      id: 'emergency',
      priority: 1,
      title: 'Seek Emergency Care',
      description:
        'Your symptoms indicate a potentially serious condition. Please seek immediate medical attention.',
      type: 'emergency',
      actionLabel: 'Call Emergency Services',
    });
  }

  // Doctor visit recommendation
  recommendations.push({
    id: 'doctor',
    priority: overallSeverity >= 5 ? 2 : 3,
    title: 'Schedule a Doctor Visit',
    description:
      overallSeverity >= 5
        ? 'Based on your symptom severity, we recommend seeing a healthcare provider soon. Book an appointment through the app.'
        : 'Consider scheduling a check-up to discuss your symptoms with a healthcare professional.',
    type: 'doctor',
    actionLabel: 'Book Appointment',
  });

  // Self-care tips
  recommendations.push({
    id: 'self_care',
    priority: 4,
    title: 'Self-Care Tips',
    description:
      'While monitoring your symptoms, these self-care measures may help provide relief:',
    type: 'self_care',
    items: [
      'Stay well-hydrated with water and clear fluids',
      'Get adequate rest (7-9 hours of sleep)',
      'Maintain a balanced, nutritious diet',
      'Practice stress-management techniques',
      'Monitor your symptoms daily and note any changes',
      'Avoid strenuous physical activity until symptoms improve',
    ],
  });

  // Medication suggestions
  recommendations.push({
    id: 'medication',
    priority: 5,
    title: 'Suggested OTC Medications',
    description:
      'The following over-the-counter medications may help manage your symptoms. Always read labels and follow dosing instructions.',
    type: 'medication',
    items: [
      'Acetaminophen (Tylenol) for pain and fever',
      'Ibuprofen (Advil/Motrin) for inflammation and pain',
      'Antihistamines for allergy-related symptoms',
      'Decongestants for nasal congestion',
      'Throat lozenges for sore throat',
    ],
  });

  return recommendations.sort((a, b) => a.priority - b.priority);
};

const getCardBorderColor = (type: string): string => {
  switch (type) {
    case 'emergency':
      return colors.semantic.error;
    case 'doctor':
      return colors.journeys.care.primary;
    case 'self_care':
      return colors.semantic.success;
    case 'medication':
      return colors.semantic.info;
    default:
      return colors.neutral.gray300;
  }
};

const getTypeBadge = (
  type: string
): { status: 'success' | 'warning' | 'error' | 'info' | 'neutral'; label: string } => {
  switch (type) {
    case 'emergency':
      return { status: 'error', label: 'Urgent' };
    case 'doctor':
      return { status: 'warning', label: 'Recommended' };
    case 'self_care':
      return { status: 'success', label: 'Self-Care' };
    case 'medication':
      return { status: 'info', label: 'OTC' };
    default:
      return { status: 'neutral', label: 'Info' };
  }
};

type SymptomRecommendationRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  description: string;
  regions: Array<{ id: string; label: string }>;
  details: any[];
  answers: Record<string, string | string[]>;
  overallSeverity: number;
  conditions: any[];
};

/**
 * Recommendation screen showing prioritized action items based on the symptom analysis.
 * Provides emergency instructions, doctor visit booking, self-care tips, and medication suggestions.
 * Step 7 (final step) of the symptom checker flow.
 */
const SymptomRecommendation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomRecommendationRouteParams }, 'params'>>();
  const {
    overallSeverity = 5,
  } = route.params || {};

  const recommendations = getRecommendations(overallSeverity);

  const handleEmergencyCall = () => {
    Linking.openURL('tel:911');
  };

  const handleBookAppointment = () => {
    navigation.navigate(ROUTES.CARE_APPOINTMENT_BOOKING);
  };

  const handleDone = () => {
    navigation.navigate(ROUTES.CARE_DASHBOARD);
  };

  const handleStartOver = () => {
    navigation.navigate(ROUTES.CARE_SYMPTOM_CHECKER);
  };

  const handleAction = (type: string) => {
    switch (type) {
      case 'emergency':
        handleEmergencyCall();
        break;
      case 'doctor':
        handleBookAppointment();
        break;
      default:
        break;
    }
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
            activeStep={6}
            journey="care"
            accessibilityLabel="Symptom checker progress - Step 7 Recommendations"
          />
        </View>

        <Text variant="heading" journey="care" testID="recommendation-title">
          Recommended Actions
        </Text>

        <Text variant="body" journey="care">
          Based on your symptoms and severity assessment, here are our recommended
          next steps, listed by priority.
        </Text>

        {recommendations.map((rec, index) => {
          const badge = getTypeBadge(rec.type);
          const borderColor = getCardBorderColor(rec.type);

          return (
            <Card
              key={rec.id}
              journey="care"
              elevation="sm"
              borderColor={borderColor}
            >
              <View style={styles.recHeader}>
                <View style={styles.recTitleRow}>
                  <View style={styles.priorityBadge}>
                    <Text
                      fontSize="text-xs"
                      fontWeight="bold"
                      color={colors.neutral.white}
                      textAlign="center"
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    fontSize="heading-md"
                    fontWeight="semiBold"
                    journey="care"
                    testID={`rec-title-${rec.id}`}
                  >
                    {rec.title}
                  </Text>
                </View>
                <Badge
                  variant="status"
                  status={badge.status}
                  testID={`rec-badge-${rec.id}`}
                  accessibilityLabel={`${badge.label} priority`}
                >
                  {badge.label}
                </Badge>
              </View>

              <Text variant="body" journey="care" testID={`rec-desc-${rec.id}`}>
                {rec.description}
              </Text>

              {/* List items for self-care and medication */}
              {rec.items && rec.items.length > 0 && (
                <View style={styles.itemList}>
                  {rec.items.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.itemRow}>
                      <Text
                        fontSize="text-sm"
                        color={colors.journeys.care.primary}
                      >
                        {'\u2022'}
                      </Text>
                      <Text
                        variant="body"
                        fontSize="text-sm"
                        journey="care"
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action button for emergency and doctor */}
              {rec.actionLabel && (
                <View style={styles.actionButton}>
                  <Button
                    variant={rec.type === 'emergency' ? 'primary' : 'secondary'}
                    onPress={() => handleAction(rec.type)}
                    journey="care"
                    accessibilityLabel={rec.actionLabel}
                    testID={`rec-action-${rec.id}`}
                  >
                    {rec.actionLabel}
                  </Button>
                </View>
              )}
            </Card>
          );
        })}

        {/* Disclaimer */}
        <Card journey="care" elevation="sm">
          <Text
            variant="caption"
            color={colors.neutral.gray600}
            testID="disclaimer"
          >
            Important: This symptom checker is for informational purposes only and does
            not constitute medical advice, diagnosis, or treatment. Always seek the
            advice of your physician or other qualified health provider with any
            questions you may have regarding a medical condition. Never disregard
            professional medical advice or delay in seeking it because of information
            provided by this tool.
          </Text>
        </Card>

        {/* Bottom action buttons */}
        <View style={styles.buttonRow}>
          <Button
            variant="secondary"
            onPress={handleStartOver}
            journey="care"
            accessibilityLabel="Start new symptom check"
            testID="start-over-button"
          >
            Start Over
          </Button>
          <Button
            onPress={handleDone}
            journey="care"
            accessibilityLabel="Done, return to care dashboard"
            testID="done-button"
          >
            Done
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
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacingValues.sm,
  },
  recTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacingValues.xs,
  },
  priorityBadge: {
    width: spacingValues.xl,
    height: spacingValues.xl,
    borderRadius: spacingValues.sm,
    backgroundColor: colors.journeys.care.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  actionButton: {
    marginTop: spacingValues.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingValues.xl,
    gap: spacingValues.md,
  },
});

export default SymptomRecommendation;
