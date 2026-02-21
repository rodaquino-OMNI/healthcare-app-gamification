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
import { useTranslation } from 'react-i18next';

interface RecommendationAction {
  id: string;
  priority: number;
  title: string;
  description: string;
  type: 'emergency' | 'doctor' | 'self_care' | 'medication';
  actionLabel?: string;
  items?: string[];
}

// getRecommendations is now inside the component to access t()

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

// getTypeBadge is now inside the component to access t()

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

  const getRecommendations = (severity: number): RecommendationAction[] => {
    const recs: RecommendationAction[] = [];

    if (severity >= 8) {
      recs.push({
        id: 'emergency',
        priority: 1,
        title: t('journeys.care.symptomChecker.recommendations.emergency.title'),
        description: t('journeys.care.symptomChecker.recommendations.emergency.description'),
        type: 'emergency',
        actionLabel: t('journeys.care.symptomChecker.recommendations.emergency.action'),
      });
    }

    recs.push({
      id: 'doctor',
      priority: severity >= 5 ? 2 : 3,
      title: t('journeys.care.symptomChecker.recommendations.doctor.title'),
      description: severity >= 5
        ? t('journeys.care.symptomChecker.recommendations.doctor.descriptionHigh')
        : t('journeys.care.symptomChecker.recommendations.doctor.descriptionLow'),
      type: 'doctor',
      actionLabel: t('journeys.care.symptomChecker.recommendations.doctor.action'),
    });

    recs.push({
      id: 'self_care',
      priority: 4,
      title: t('journeys.care.symptomChecker.recommendations.selfCare.title'),
      description: t('journeys.care.symptomChecker.recommendations.selfCare.description'),
      type: 'self_care',
      items: [
        t('journeys.care.symptomChecker.recommendations.selfCare.items.hydration'),
        t('journeys.care.symptomChecker.recommendations.selfCare.items.rest'),
        t('journeys.care.symptomChecker.recommendations.selfCare.items.diet'),
        t('journeys.care.symptomChecker.recommendations.selfCare.items.stress'),
        t('journeys.care.symptomChecker.recommendations.selfCare.items.monitor'),
        t('journeys.care.symptomChecker.recommendations.selfCare.items.activity'),
      ],
    });

    recs.push({
      id: 'medication',
      priority: 5,
      title: t('journeys.care.symptomChecker.recommendations.medication.title'),
      description: t('journeys.care.symptomChecker.recommendations.medication.description'),
      type: 'medication',
      items: [
        t('journeys.care.symptomChecker.recommendations.medication.items.acetaminophen'),
        t('journeys.care.symptomChecker.recommendations.medication.items.ibuprofen'),
        t('journeys.care.symptomChecker.recommendations.medication.items.antihistamines'),
        t('journeys.care.symptomChecker.recommendations.medication.items.decongestants'),
        t('journeys.care.symptomChecker.recommendations.medication.items.lozenges'),
      ],
    });

    return recs.sort((a, b) => a.priority - b.priority);
  };

  const getTypeBadge = (
    type: string
  ): { status: 'success' | 'warning' | 'error' | 'info' | 'neutral'; label: string } => {
    switch (type) {
      case 'emergency':
        return { status: 'error', label: t('journeys.care.symptomChecker.recommendations.badges.urgent') };
      case 'doctor':
        return { status: 'warning', label: t('journeys.care.symptomChecker.recommendations.badges.recommended') };
      case 'self_care':
        return { status: 'success', label: t('journeys.care.symptomChecker.recommendations.badges.selfCare') };
      case 'medication':
        return { status: 'info', label: t('journeys.care.symptomChecker.recommendations.badges.otc') };
      default:
        return { status: 'neutral', label: t('journeys.care.symptomChecker.recommendations.badges.info') };
    }
  };

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
          {t('journeys.care.symptomChecker.recommendations.title')}
        </Text>

        <Text variant="body" journey="care">
          {t('journeys.care.symptomChecker.recommendations.subtitle')}
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
            {t('journeys.care.symptomChecker.recommendations.fullDisclaimer')}
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
            {t('journeys.care.symptomChecker.results.startOver')}
          </Button>
          <Button
            onPress={handleDone}
            journey="care"
            accessibilityLabel="Done, return to care dashboard"
            testID="done-button"
          >
            {t('journeys.care.symptomChecker.recommendations.done')}
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
