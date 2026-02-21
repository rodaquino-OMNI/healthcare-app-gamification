import React from 'react'; // React, v18.2.0
import { createNativeStackNavigator } from '@react-navigation/stack'; // @react-navigation/stack, v6.3.17

import PlanDashboard from '../screens/plan/Dashboard'; // The main dashboard screen for the Plan journey.
import Coverage from '../screens/plan/Coverage'; // Screen to display insurance coverage details.
import ClaimHistory from '../screens/plan/ClaimHistory'; // Screen to display the history of submitted claims.
import ClaimDetail from '../screens/plan/ClaimDetail'; // Screen to display details of a specific claim.
import ClaimSubmission from '../screens/plan/ClaimSubmission'; // Screen to allow users to submit new claims.
import CostSimulator from '../screens/plan/CostSimulator'; // Screen to simulate healthcare costs based on the user's plan.
import DigitalCard from '../screens/plan/DigitalCard'; // Screen to display the user's digital insurance card.
import Benefits from '../screens/plan/Benefits'; // Screen to display available benefits.
import { useJourney } from '../hooks/useJourney'; // Custom hook to get the current journey context.
import { routes } from '../constants/routes'; // Defines the route names used within the application.

// LD1: Creates a stack navigator instance using `createNativeStackNavigator` from `@react-navigation/stack`.
const Stack = createNativeStackNavigator();

/**
 * A React component that defines the navigation stack for the 'My Plan & Benefits' journey.
 */
const PlanNavigator: React.FC = () => {
  // LD1: Retrieves the journey name from the `useJourney` hook.
  const { journey } = useJourney();

  // LD1: Defines the screen options for the navigator, setting the header to be hidden.
  const screenOptions = {
    headerShown: false,
  };

  // LD1: Returns the `Stack.Navigator` component defining the navigation stack for the Plan journey.
  // LD2: Each `Stack.Screen` component represents a screen in the journey.
  return (
    <Stack.Navigator initialRouteName={routes.PLAN_DASHBOARD} screenOptions={screenOptions}>
      {/* LD1: Defines the `PlanDashboard` screen, which is the main dashboard for the Plan journey. */}
      <Stack.Screen name={routes.PLAN_DASHBOARD} component={PlanDashboard} />

      {/* LD1: Defines the `Coverage` screen, which displays insurance coverage details. */}
      <Stack.Screen name={routes.COVERAGE} component={Coverage} />

      {/* LD1: Defines the `ClaimHistory` screen, which displays the history of submitted claims. */}
      <Stack.Screen name={routes.CLAIMS} component={ClaimHistory} />

      {/* LD1: Defines the `ClaimDetail` screen, which displays details of a specific claim. */}
      <Stack.Screen name={routes.CLAIM_DETAIL} component={ClaimDetail} />

      {/* LD1: Defines the `ClaimSubmission` screen, which allows users to submit new claims. */}
      <Stack.Screen name={routes.CLAIM_SUBMISSION} component={ClaimSubmission} />

      {/* LD1: Defines the `CostSimulator` screen, which simulates healthcare costs based on the user's plan. */}
      <Stack.Screen name={routes.COST_SIMULATOR} component={CostSimulator} />

      {/* LD1: Defines the `DigitalCard` screen, which displays the user's digital insurance card. */}
      <Stack.Screen name={routes.DIGITAL_CARD} component={DigitalCard} />

      {/* LD1: Defines the `Benefits` screen, which displays available benefits. */}
      <Stack.Screen name={routes.BENEFITS} component={Benefits} />
    </Stack.Navigator>
  );
};

// LD1: Exports the `PlanNavigator` component for use in the application.
export { PlanNavigator };