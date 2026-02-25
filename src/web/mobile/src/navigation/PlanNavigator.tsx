import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { PlanStackParamList } from './types';

import PlanDashboard from '../screens/plan/Dashboard';
import Coverage from '../screens/plan/Coverage';
import ClaimHistory from '../screens/plan/ClaimHistory';
import { ClaimDetail } from '../screens/plan/ClaimDetail';
import { ClaimSubmissionScreen as ClaimSubmission } from '../screens/plan/ClaimSubmission';
import CostSimulator from '../screens/plan/CostSimulator';
import DigitalCard from '../screens/plan/DigitalCard';
import Benefits from '../screens/plan/Benefits';
import { useJourney } from '../hooks/useJourney';

const Stack = createStackNavigator<PlanStackParamList>();

const PlanNavigator: React.FC = () => {
  const { journey } = useJourney();

  const screenOptions = {
    headerShown: false,
  };

  return (
    <Stack.Navigator initialRouteName="PlanDashboard" screenOptions={screenOptions}>
      <Stack.Screen name="PlanDashboard" component={PlanDashboard} />
      <Stack.Screen name="Coverage" component={Coverage} />
      <Stack.Screen name="ClaimHistory" component={ClaimHistory} />
      <Stack.Screen name="ClaimDetail" component={ClaimDetail} />
      <Stack.Screen name="ClaimSubmission" component={ClaimSubmission} />
      <Stack.Screen name="CostSimulator" component={CostSimulator} />
      <Stack.Screen name="DigitalCard" component={DigitalCard} />
      <Stack.Screen name="Benefits" component={Benefits} />
    </Stack.Navigator>
  );
};

export { PlanNavigator };
