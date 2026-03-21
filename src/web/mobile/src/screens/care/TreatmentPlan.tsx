/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Card } from '@design-system/components/Card/Card'; // Card component
import { ProgressBar } from '@design-system/components/ProgressBar/ProgressBar'; // ProgressBar component
import { useRoute } from '@react-navigation/native'; // @react-navigation/native v6.0.0
import {
    TreatmentPlan as TreatmentPlanType, // TreatmentPlan interface
} from '@shared/types/care.types';
import React, { useState, useEffect } from 'react'; // react v18.0.0
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

import { MedicationList } from '@components/lists/MedicationList'; // MedicationList component
import { ErrorState } from '@components/shared/ErrorState'; // ErrorState component
import { JourneyHeader } from '@components/shared/JourneyHeader'; // JourneyHeader component
import { LoadingIndicator } from '@components/shared/LoadingIndicator'; // LoadingIndicator component

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
        // eslint-disable-next-line @typescript-eslint/require-await -- simulated API; will use await when real API is wired
        const fetchTreatmentPlan = async () => {
            try {
                // Simulate API call
                setTimeout(() => {
                    const mockTreatmentPlan: TreatmentPlanType = {
                        id: treatmentPlanId,
                        patientId: 'patient-001',
                        providerId: 'provider-001',
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
                        <Text>
                            {t('journeys.care.treatmentPlan.name')}: {treatmentPlan.name}
                        </Text>
                        <Text>
                            {t('journeys.care.treatmentPlan.description')}: {treatmentPlan.description}
                        </Text>
                        <Text>
                            {t('journeys.care.treatmentPlan.startDate')}: {treatmentPlan.startDate}
                        </Text>
                        <Text>
                            {t('journeys.care.treatmentPlan.endDate')}: {treatmentPlan.endDate}
                        </Text>
                        {/* Use the ProgressBar component to visualize the treatment plan progress. */}
                        <ProgressBar current={treatmentPlan.progress} total={100} />
                    </View>
                    {/* Display a MedicationList for the treatment plan medications. */}
                    <MedicationList />
                </Card>
            )}
        </View>
    );
};
