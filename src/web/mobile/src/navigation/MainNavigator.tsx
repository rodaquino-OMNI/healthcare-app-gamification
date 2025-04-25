import React from 'react'; // v18.2.0
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // v6.5.8
import { useNavigation } from '@react-navigation/native'; // v6.1.7

import { AuthNavigator } from './AuthNavigator';
import HealthNavigator from './HealthNavigator';
import CareNavigator from './CareNavigator';
import PlanNavigator from './PlanNavigator';
import { Home } from '../screens/home/Home';
import { useAuth } from '../hooks/useAuth';
import { MOBILE_AUTH_ROUTES } from 'src/web/shared/constants/routes';
import { NotificationsScreen } from '../screens/home/Notifications';
import { ProfileScreen } from '../screens/home/Profile';
import Achievements from '../screens/home/Achievements';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';

// LD1: Creates a Bottom Tab Navigator using createBottomTabNavigator from React Navigation.
const Tab = createBottomTabNavigator();

// LD1: Defines the main tab navigator for the app.
export const MainNavigator: React.FC = () => {
  // LD1: Retrieves the authentication status using the `useAuth` hook.
  const { isAuthenticated } = useAuth();
  // LD1: Retrieves the navigation object using the `useNavigation` hook.
  const navigation = useNavigation();

  // LD1: If the user is not authenticated, renders the AuthNavigator.
  if (!isAuthenticated) {
    // IE1: The AuthNavigator component handles the authentication flow.
    return <AuthNavigator />;
  }

  // LD1: If the user is authenticated, renders the Tab Navigator with the defined screens.
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* LD1: Defines the screens within the main app flow, associating each screen component with a route name. */}
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name={JOURNEY_IDS.HEALTH} component={HealthNavigator} />
      <Tab.Screen name={JOURNEY_IDS.CARE} component={CareNavigator} />
      <Tab.Screen name={JOURNEY_IDS.PLAN} component={PlanNavigator} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Achievements" component={Achievements} />
    </Tab.Navigator>
  );
};