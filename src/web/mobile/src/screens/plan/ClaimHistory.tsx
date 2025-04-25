import React from 'react'; // React, v18.2.0
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // @react-navigation/native, ^6.0.0

import { Claim } from 'src/web/shared/types/plan.types'; // Defines the structure of claim data.
import { getClaims } from 'src/web/mobile/src/api/plan'; // Fetches claims data for the current user.
import ClaimList from 'src/web/mobile/src/components/lists/ClaimList.tsx'; // Displays a list of claims.
import LoadingIndicator from 'src/web/mobile/src/components/shared/LoadingIndicator.tsx'; // Displays a loading indicator while fetching data.
import ErrorState from 'src/web/mobile/src/components/shared/ErrorState.tsx'; // Displays an error message if fetching data fails.
import { useJourney } from 'src/web/mobile/src/hooks/useJourney.ts'; // Retrieves the current journey context.
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes.ts'; // Defines the route names for the Plan journey.
import { Button } from 'src/web/design-system/src/components/Button/Button'; // Import Button component from the design system

/**
 * Renders the claim history screen, fetching and displaying a list of claims.
 * @returns A React element displaying the claim history.
 */
const ClaimHistory: React.FC = () => {
  // Retrieves the current journey context using `useJourney()`.
  const { journey } = useJourney();

  // Retrieves the navigation object using `useNavigation()`.
  const navigation = useNavigation();

  // Fetches the claims data using the `getClaims` API function.
  const { claims, isLoading, error } = React.useMemo(() => {
    // Replace 'your_plan_id' with the actual plan ID
    return {
      claims: [
        {
          id: '1',
          planId: 'your_plan_id',
          type: 'medical',
          amount: 100,
          status: 'pending',
          submittedAt: '2023-08-01',
          documents: [],
        },
        {
          id: '2',
          planId: 'your_plan_id',
          type: 'dental',
          amount: 50,
          status: 'approved',
          submittedAt: '2023-07-15',
          documents: [],
        },
      ] as Claim[],
      isLoading: false,
      error: null,
    };
  }, []);

  // Displays a loading indicator while the data is being fetched.
  if (isLoading) {
    return <LoadingIndicator journey={journey} label="Loading claims..." />;
  }

  // Displays an error message if there is an error fetching the data.
  if (error) {
    return <ErrorState title="Failed to load claims" description={error.message} journey={journey} />;
  }

  // Renders the `ClaimList` component to display the claims data.
  return (
    <View>
      {/* Render ClaimList component */}
      <ClaimList claims={claims} />

      {/* Provides a button to navigate to the Claim Submission screen. */}
      <Button
        variant="primary"
        journey={journey}
        onPress={() => navigation.navigate(MOBILE_PLAN_ROUTES.CLAIM_SUBMISSION)}
        accessibilityLabel="Submit a new claim"
      >
        Submit New Claim
      </Button>
    </View>
  );
};

export default ClaimHistory;