import React from 'react'; // Version ^18.0.0
import { View } from 'react-native'; // Version 0.71+
import { useNavigation, StackScreenProps } from '@react-navigation/native'; // Version latest

import JourneyHeader from 'src/web/mobile/src/components/shared/JourneyHeader'; // Provides a consistent header for each journey
import { ClaimForm } from 'src/web/mobile/src/components/forms/ClaimForm'; // Reusable form component for claim details input.
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes'; // Defines the route for the claim submission screen.
import { useJourneyContext } from 'src/web/mobile/src/context/JourneyContext.tsx'; // Provides access to the current journey context.

/**
 * Renders the claim submission screen with a journey-specific header and the ClaimForm component.
 * @param {StackScreenProps<any, any>} props - The navigation props for the screen.
 * @returns {JSX.Element} The rendered claim submission screen.
 */
const ClaimSubmissionScreen: React.FC<StackScreenProps<any, any>> = (props) => {
  // LD1: Retrieves the navigation object using the `useNavigation` hook.
  const navigation = useNavigation();

  // LD1: Retrieves the journey name from the `useJourneyContext` hook.
  const { journey } = useJourneyContext();

  // LD1: Renders a `JourneyHeader` component with the title set to 'Submit Claim' and a back button.
  // IE1: The `JourneyHeader` component is imported from 'src/web/mobile/src/components/shared/JourneyHeader'
  // and is used to provide a consistent header for the claim submission screen.
  return (
    <View>
      <JourneyHeader
        title="Submit Claim"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      {/* LD1: Renders the `ClaimForm` component for handling claim details and submission. */}
      {/* IE1: The `ClaimForm` component is imported from 'src/web/mobile/src/components/forms/ClaimForm'
          and is used to handle the claim submission form. */}
      <ClaimForm />
    </View>
  );
};

// LD1: Exports the ClaimSubmissionScreen component for use in the application.
export { ClaimSubmissionScreen };