import React, { useState, useEffect } from 'react'; // react v18.0.0
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native'; // @react-navigation/native v6.0.0
import {
  TreatmentPlan as TreatmentPlanType, // TreatmentPlan interface
} from 'src/web/shared/types/care.types';
import { MedicationList } from 'src/web/mobile/src/components/lists/MedicationList'; // MedicationList component
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader'; // JourneyHeader component
import { useJourney } from 'src/web/mobile/src/hooks/useJourney'; // useJourney hook
import { Card } from 'src/web/design-system/src/components/Card/Card'; // Card component
import { Button } from 'src/web/design-system/src/components/Button/Button'; // Button component
import { ProgressBar } from 'src/web/design-system/src/components/ProgressBar/ProgressBar'; // ProgressBar component
import { LoadingIndicator } from 'src/web/mobile/src/components/shared/LoadingIndicator'; // LoadingIndicator component
import { ErrorState } from 'src/web/mobile/src/components/shared/ErrorState'; // ErrorState component

/**
 * Displays the details of a treatment plan and its associated medications.
 */
export const TreatmentPlanScreen: React.FC = () => {
  const { t } = useTranslation();
  // Access the route parameters to get the treatment plan ID.
  const route = useRoute<any>();
  const { treatmentPlanId } = route.params;

  // Set up a state variable to store the treatment plan details.
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlanType | null>(null);

  // Set up a state variable to track loading state.
  const [loading, setLoading] = useState<boolean>(true);

  // Set up a state variable to track error state.
  const [error, setError] = useState<string | null>(null);

  // Use useEffect to fetch the treatment plan details from the API when the component mounts.
  useEffect(() => {
    const fetchTreatmentPlan = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockTreatmentPlan: TreatmentPlanType = {
            id: treatmentPlanId,
            name: 'Sample Treatment Plan',
            description: 'This is a sample treatment plan to manage your health.',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            progress: 60,
          };
          setTreatmentPlan(mockTreatmentPlan);
          setLoading(false);
        }, 1000);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchTreatmentPlan();
  }, [treatmentPlanId]);

  // If the treatment plan is loading, display a LoadingIndicator.
  if (loading) {
    return <LoadingIndicator label={t('journeys.care.treatmentPlan.loading')} />;
  }

  // If there is an error, display an ErrorState.
  if (error) {
    return <ErrorState message={error} />;
  }

  // Otherwise, display the treatment plan details in a Card component.
  return (
    <View>
      <JourneyHeader title={t('journeys.care.treatmentPlan.title')} showBackButton />
      {treatmentPlan && (
        <Card>
          {/* Display the treatment plan name, description, start date, end date, and progress. */}
          <View>
            <Text>{t('journeys.care.treatmentPlan.name')}: {treatmentPlan.name}</Text>
            <Text>{t('journeys.care.treatmentPlan.description')}: {treatmentPlan.description}</Text>
            <Text>{t('journeys.care.treatmentPlan.startDate')}: {treatmentPlan.startDate}</Text>
            <Text>{t('journeys.care.treatmentPlan.endDate')}: {treatmentPlan.endDate}</Text>
            {/* Use the ProgressBar component to visualize the treatment plan progress. */}
            <ProgressBar current={treatmentPlan.progress} total={100} />
          </View>
          {/* Display a MedicationList component to show the medications associated with the treatment plan. */}
          <MedicationList />
        </Card>
      )}
    </View>
  );
};