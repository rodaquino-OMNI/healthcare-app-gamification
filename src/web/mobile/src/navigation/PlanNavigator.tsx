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
import { ROUTES } from '../constants/routes';

const Stack = createStackNavigator<PlanStackParamList>();

const PlanNavigator: React.FC = () => {
  const { journey } = useJourney();

  const screenOptions = {
    headerShown: false,
  };

  return (
    <Stack.Navigator initialRouteName={ROUTES.PLAN_DASHBOARD} screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.PLAN_DASHBOARD} component={PlanDashboard} />
      <Stack.Screen name={ROUTES.PLAN_COVERAGE} component={Coverage} />
      <Stack.Screen name={ROUTES.PLAN_CLAIMS} component={ClaimHistory} />
      <Stack.Screen name={ROUTES.PLAN_CLAIM_DETAIL} component={ClaimDetail} />
      <Stack.Screen name={ROUTES.PLAN_CLAIM_SUBMISSION} component={ClaimSubmission} />
      <Stack.Screen name={ROUTES.PLAN_COST_SIMULATOR} component={CostSimulator} />
      <Stack.Screen name={ROUTES.PLAN_DIGITAL_CARD} component={DigitalCard} />
      <Stack.Screen name={ROUTES.PLAN_BENEFITS} component={Benefits} />
    </Stack.Navigator>
  );
};

export { PlanNavigator };
