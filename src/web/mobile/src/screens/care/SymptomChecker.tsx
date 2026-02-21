import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Input,
  Button,
  Card,
  Text,
} from '@austa/design-system';
import { Stepper } from '@austa/design-system/src/components/Stepper/Stepper';
import { ROUTES } from '../../../../constants/routes';
import { checkSymptoms } from '../../../../api/care';
import { useJourney } from '../../../../hooks/useJourney';
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

/**
 * A screen component that allows users to input their symptoms and receive a preliminary assessment.
 * This implements requirement F-102-RQ-001: Allow users to input symptoms and receive preliminary guidance.
 * Step 1 of the symptom checker flow.
 */
const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const navigation = useNavigation<any>();
  const { journey } = useJourney();

  /**
   * Handles the submission of symptoms for the symptom flow.
   * Navigates to the body map screen with the entered symptoms.
   */
  const handleContinue = () => {
    if (!symptoms.trim()) {
      setError(new Error('Please describe your symptoms'));
      return;
    }

    setError(null);

    const symptomList = symptoms
      .split(',')
      .map((s, index) => ({
        id: `symptom-${index}`,
        name: s.trim(),
      }))
      .filter((s) => s.name.length > 0);

    navigation.navigate(ROUTES.CARE_SYMPTOM_BODY_MAP, {
      symptoms: symptomList,
      description: symptoms,
    });
  };

  /**
   * Navigates to the appointment booking screen
   */
  const handleBookAppointment = () => {
    navigation.navigate(ROUTES.CARE_APPOINTMENT_BOOKING);
  };

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
            activeStep={0}
            journey="care"
            accessibilityLabel="Symptom checker progress"
          />
        </View>

        <Text
          variant="heading"
          journey="care"
          testID="symptom-checker-title"
        >
          Symptom Checker
        </Text>

        <Text
          variant="body"
          journey="care"
          testID="symptom-checker-subtitle"
        >
          Describe your symptoms in detail to receive a preliminary assessment and guidance.
        </Text>

        <View style={styles.inputContainer}>
          <Card journey="care" elevation="sm">
            <Input
              label="Your Symptoms"
              value={symptoms}
              onChange={(e: any) => setSymptoms(e.target?.value ?? e)}
              placeholder="e.g. Headache, fever, cough..."
              journey="care"
              testID="symptom-input"
              aria-label="Field to describe your symptoms"
            />

            {error && (
              <Text
                fontSize="sm"
                color={colors.semantic.error}
                testID="symptom-error"
              >
                {error.message}
              </Text>
            )}

            <View style={styles.buttonRow}>
              <Button
                onPress={handleContinue}
                journey="care"
                disabled={isLoading || !symptoms.trim()}
                loading={isLoading}
                accessibilityLabel="Continue to body map"
                testID="continue-button"
              >
                Continue
              </Button>
            </View>
          </Card>
        </View>

        <View style={styles.infoContainer}>
          <Card journey="care" elevation="sm">
            <Text variant="body" journey="care">
              The Symptom Checker helps you understand your symptoms and suggests next steps. It is not a substitute for professional medical advice.
            </Text>
            <View style={styles.appointmentButton}>
              <Button
                variant="secondary"
                onPress={handleBookAppointment}
                journey="care"
                accessibilityLabel="Book appointment directly"
                testID="book-appointment-button"
              >
                Book Appointment Directly
              </Button>
            </View>
          </Card>
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
  inputContainer: {
    marginTop: spacingValues.md,
  },
  buttonRow: {
    marginTop: spacingValues.md,
    alignItems: 'flex-end',
  },
  infoContainer: {
    marginTop: spacingValues.xl,
  },
  appointmentButton: {
    marginTop: spacingValues.md,
  },
});

export default SymptomChecker;
