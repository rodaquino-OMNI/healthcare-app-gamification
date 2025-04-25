import React from 'react'; // version 18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // version 6.3.16

import { Dashboard } from '../screens/health/Dashboard';
import { MedicalHistoryScreen } from '../screens/health/MedicalHistory';
import { HealthGoalsScreen } from '../screens/health/HealthGoals';
import { DeviceConnectionScreen } from '../screens/health/DeviceConnection';
import { MetricDetail } from '../screens/health/MetricDetail';
import { AddMetricScreen } from '../screens/health/AddMetric';
import { ROUTES } from '../constants/routes';
import { JOURNEY_COLORS } from '../constants/journeys';

// LD1: Creates a Stack Navigator using createStackNavigator from React Navigation.
const Stack = createStackNavigator();

// LD1: Defines the stack navigator for the My Health journey.
export default function HealthNavigator() {
  // LD1: Renders the Stack Navigator with the defined screens.
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.HEALTH_DASHBOARD}
      screenOptions={{
        headerShown: false, // LD1: Configures the navigator with health journey-specific styling (green theme).
        cardStyle: { backgroundColor: JOURNEY_COLORS.MyHealth },
      }}
    >
      {/* LD1: Defines the screens within the My Health journey, associating each screen component with a route name. */}
      <Stack.Screen name={ROUTES.HEALTH_DASHBOARD} component={Dashboard} />
      <Stack.Screen name={ROUTES.HEALTH_MEDICAL_HISTORY} component={MedicalHistoryScreen} />
      <Stack.Screen name={ROUTES.HEALTH_HEALTH_GOALS} component={HealthGoalsScreen} />
      <Stack.Screen name={ROUTES.HEALTH_DEVICE_CONNECTION} component={DeviceConnectionScreen} />
      <Stack.Screen name={ROUTES.HEALTH_METRIC_DETAIL} component={MetricDetail} />
      <Stack.Screen name={ROUTES.HEALTH_METRIC_DETAIL} component={AddMetricScreen} />
    </Stack.Navigator>
  );
}