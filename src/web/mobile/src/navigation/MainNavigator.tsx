import React from 'react'; // v18.2.0
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // v6.5.8
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // v6.9.13
import { useNavigation } from '@react-navigation/native'; // v6.1.7

import { AuthNavigator } from './AuthNavigator';
import HealthNavigator from './HealthNavigator';
import CareNavigator from './CareNavigator';
import PlanNavigator from './PlanNavigator';
import GamificationNavigator from './GamificationNavigator';
import SettingsNavigator from './SettingsNavigator';
import HomeScreen from '../screens/home/Home';
import { useAuth } from '../hooks/useAuth';
import { MOBILE_AUTH_ROUTES } from 'src/web/shared/constants/routes';
import { NotificationsScreen } from '../screens/home/Notifications';
import { ProfileScreen } from '../screens/home/Profile';
import { JOURNEY_IDS } from 'src/web/shared/constants/journeys';
import { ROUTES } from '../constants/routes';

// Lazy-loaded screens for the Home stack.
// These screens are pushed on top of the Home tab.
let HomeMetricsScreen: React.FC = () => null;
let HomeAlertScreen: React.FC = () => null;
let NotificationDetailScreen: React.FC = () => null;
let SearchScreen: React.FC = () => null;
let SearchResultsScreen: React.FC = () => null;

try {
  // Attempt to import screens if they exist (created by another worker)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const metricsModule = require('../screens/home/HomeMetrics');
  HomeMetricsScreen = metricsModule.HomeMetricsScreen || metricsModule.default || HomeMetricsScreen;
} catch {
  // HomeMetrics screen not yet available - placeholder will be used
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const alertModule = require('../screens/home/HomeAlert');
  HomeAlertScreen = alertModule.HomeAlertScreen || alertModule.default || HomeAlertScreen;
} catch {
  // HomeAlert screen not yet available - placeholder will be used
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ndModule = require('../screens/home/NotificationDetail');
  NotificationDetailScreen = ndModule.NotificationDetailScreen || ndModule.default || NotificationDetailScreen;
} catch {
  // NotificationDetail screen not yet available - placeholder will be used
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const searchModule = require('../screens/home/Search');
  SearchScreen = searchModule.SearchScreen || searchModule.default || SearchScreen;
} catch {
  // Search screen not yet available - placeholder will be used
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const srModule = require('../screens/home/SearchResults');
  SearchResultsScreen = srModule.SearchResultsScreen || srModule.default || SearchResultsScreen;
} catch {
  // SearchResults screen not yet available - placeholder will be used
}

// Creates a native stack navigator for the Home tab.
// This allows HomeMetrics and HomeAlert to be pushed on top of the Home screen.
const HomeStackNav = createNativeStackNavigator();

const HomeStack: React.FC = () => (
  <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
    <HomeStackNav.Screen name="HomeMetrics" component={HomeMetricsScreen} />
    <HomeStackNav.Screen name="HomeAlert" component={HomeAlertScreen} />
    <HomeStackNav.Screen name={ROUTES.NOTIFICATION_DETAIL} component={NotificationDetailScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH} component={SearchScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH_RESULTS} component={SearchResultsScreen} />
  </HomeStackNav.Navigator>
);

// Creates a Bottom Tab Navigator using createBottomTabNavigator from React Navigation.
const Tab = createBottomTabNavigator();

// Defines the main tab navigator for the app.
export const MainNavigator: React.FC = () => {
  // Retrieves the authentication status using the `useAuth` hook.
  const { isAuthenticated } = useAuth();
  // Retrieves the navigation object using the `useNavigation` hook.
  const navigation = useNavigation();

  // If the user is not authenticated, renders the AuthNavigator.
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // If the user is authenticated, renders the Tab Navigator with the defined screens.
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name={JOURNEY_IDS.HEALTH} component={HealthNavigator} />
      <Tab.Screen name={JOURNEY_IDS.CARE} component={CareNavigator} />
      <Tab.Screen name={JOURNEY_IDS.PLAN} component={PlanNavigator} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Achievements" component={GamificationNavigator} />
      <Tab.Screen name={ROUTES.SETTINGS} component={SettingsNavigator} />
    </Tab.Navigator>
  );
};
