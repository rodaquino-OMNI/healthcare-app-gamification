import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { ROUTES } from '../../../../constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

const EMERGENCY_SYMPTOMS = [
  'Chest pain or pressure',
  'Difficulty breathing or shortness of breath',
  'Severe or uncontrollable bleeding',
  'Loss of consciousness or fainting',
  'Sudden severe headache',
  'Sudden weakness or numbness on one side',
  'Seizures',
  'Severe allergic reaction (swelling, hives, throat closing)',
  'Signs of stroke (face drooping, arm weakness, speech difficulty)',
  'Severe abdominal pain',
];

type SymptomEmergencyWarningRouteParams = {
  symptoms: Array<{ id: string; name: string }>;
  overallSeverity: number;
};

/**
 * Critical emergency warning screen with red background.
 * Provides immediate access to emergency phone numbers and ER locator.
 * Displays critical warning symptoms that require immediate medical attention.
 */
const SymptomEmergencyWarning: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: SymptomEmergencyWarningRouteParams }, 'params'>>();
  const { t } = useTranslation();
  const {
    symptoms = [],
    overallSeverity = 10,
  } = route.params || {};

  const handleCallSAMU = () => {
    Linking.openURL('tel:192');
  };

  const handleCallEmergency = () => {
    Linking.openURL('tel:192');
  };

  const handleFindER = () => {
    navigation.navigate(ROUTES.CARE_SYMPTOM_ER_LOCATOR, {
      symptoms,
      overallSeverity,
    });
  };

  const handleDismiss = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Warning icon and title */}
        <View style={styles.warningHeader}>
          <Text
            fontSize="display-lg"
            textAlign="center"
            testID="emergency-icon"
          >
            {'\u26a0\ufe0f'}
          </Text>
          <Text
            variant="heading"
            color={colors.neutral.white}
            textAlign="center"
            testID="emergency-title"
          >
            {t('journeys.care.symptomChecker.emergency.title', {
              defaultValue: 'Emergency Warning',
            })}
          </Text>
          <Text
            fontSize="heading-md"
            fontWeight="bold"
            color={colors.neutral.white}
            textAlign="center"
            testID="emergency-do-not-wait"
          >
            {t('journeys.care.symptomChecker.emergency.doNotWait', {
              defaultValue: 'DO NOT WAIT \u2014 Seek immediate medical attention',
            })}
          </Text>
        </View>

        {/* Emergency call buttons */}
        <View style={styles.emergencyButtons}>
          <Button
            variant="primary"
            onPress={handleCallSAMU}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.emergency.callSamu', {
              defaultValue: 'Call SAMU emergency services at 192',
            })}
            testID="call-samu-button"
          >
            {t('journeys.care.symptomChecker.emergency.samuButton', {
              defaultValue: 'Call 192 (SAMU)',
            })}
          </Button>
          <Button
            variant="primary"
            onPress={handleCallEmergency}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.emergency.callEmergency', {
              defaultValue: 'Call emergency services at 192',
            })}
            testID="call-emergency-button"
          >
            {t('journeys.care.symptomChecker.emergency.emergencyButton', {
              defaultValue: 'Call Emergency',
            })}
          </Button>
          <Button
            variant="secondary"
            onPress={handleFindER}
            journey="care"
            accessibilityLabel={t('journeys.care.symptomChecker.emergency.findER', {
              defaultValue: 'Find nearest emergency room',
            })}
            testID="find-er-button"
          >
            {t('journeys.care.symptomChecker.emergency.erButton', {
              defaultValue: 'Nearest Emergency Room',
            })}
          </Button>
        </View>

        {/* Warning symptoms list */}
        <Card journey="care" elevation="md">
          <Text
            fontSize="heading-md"
            fontWeight="semiBold"
            color={colors.semantic.error}
            testID="warning-symptoms-title"
          >
            {t('journeys.care.symptomChecker.emergency.warningTitle', {
              defaultValue: 'Seek immediate help if you experience:',
            })}
          </Text>

          <View style={styles.symptomList}>
            {EMERGENCY_SYMPTOMS.map((symptom, index) => (
              <View key={index} style={styles.symptomRow}>
                <Text fontSize="text-sm" color={colors.semantic.error}>
                  {'\u2022'}
                </Text>
                <Text
                  variant="body"
                  fontSize="text-sm"
                  journey="care"
                  testID={`warning-symptom-${index}`}
                >
                  {t(`journeys.care.symptomChecker.emergency.symptom${index}`, {
                    defaultValue: symptom,
                  })}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Disclaimer */}
        <Card journey="care" elevation="sm">
          <Text
            variant="caption"
            color={colors.neutral.gray600}
            testID="emergency-disclaimer"
          >
            {t('journeys.care.symptomChecker.emergency.disclaimer', {
              defaultValue:
                'If you are experiencing a life-threatening emergency, call 192 (SAMU) immediately. Do not rely solely on this app for emergency medical decisions.',
            })}
          </Text>
        </Card>

        {/* Dismiss link at bottom */}
        <View style={styles.dismissContainer}>
          <Touchable
            onPress={handleDismiss}
            accessibilityLabel={t('journeys.care.symptomChecker.emergency.dismiss', {
              defaultValue: 'I understand, go back',
            })}
            accessibilityRole="button"
            testID="dismiss-button"
          >
            <Text
              fontSize="text-xs"
              color={colors.neutral.gray500}
              textAlign="center"
            >
              {t('journeys.care.symptomChecker.emergency.dismissLabel', {
                defaultValue: 'I understand, go back',
              })}
            </Text>
          </Touchable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.semantic.error,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  warningHeader: {
    alignItems: 'center',
    gap: spacingValues.sm,
    marginBottom: spacingValues.xl,
    paddingTop: spacingValues.xl,
  },
  emergencyButtons: {
    gap: spacingValues.md,
    marginBottom: spacingValues.xl,
  },
  symptomList: {
    marginTop: spacingValues.sm,
    gap: spacingValues['3xs'],
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingValues.xs,
    paddingLeft: spacingValues.xs,
  },
  dismissContainer: {
    alignItems: 'center',
    marginTop: spacingValues.xl,
    paddingBottom: spacingValues.xl,
  },
});

export { SymptomEmergencyWarning };
export default SymptomEmergencyWarning;
