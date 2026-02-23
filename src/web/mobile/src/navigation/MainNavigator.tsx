import React from 'react'; // v18.2.0
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // v6.5.8
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // v6.9.13
import type { HomeStackParamList, MainTabParamList } from './types';

import HealthNavigator from './HealthNavigator';
import CareNavigator from './CareNavigator';
import { PlanNavigator } from './PlanNavigator';
import GamificationNavigator from './GamificationNavigator';
import SettingsNavigator from './SettingsNavigator';

let WellnessNavigator: React.FC = () => null;
try {
  const mod = require('./WellnessNavigator');
  WellnessNavigator = mod.default || mod.WellnessNavigator || WellnessNavigator;
} catch { /* WellnessNavigator not yet available */ }

import HomeScreen from '../screens/home/Home';
import { NotificationsScreen } from '../screens/home/Notifications';
import { ProfileScreen } from '../screens/home/Profile';
import { JOURNEY_IDS } from '@shared/constants/journeys';
import { ROUTES } from '../constants/routes';

// Lazy-loaded screens for the Home stack.
// These screens are pushed on top of the Home tab.
let HomeMetricsScreen: React.FC = () => null;
let HomeAlertScreen: React.FC = () => null;
let NotificationDetailScreen: React.FC = () => null;
let SearchScreen: React.FC = () => null;
let SearchResultsScreen: React.FC = () => null;
let WeeklySummaryScreen: React.FC = () => null;
let HomeBottomSheetScreen: React.FC = () => null;
let HomeMedicationRemindersScreen: React.FC = () => null;
let HomeAppointmentWidgetScreen: React.FC = () => null;
let HomeHealthTipsScreen: React.FC = () => null;
let HomeEmptyScreen: React.FC = () => null;
let NotificationUnreadScreen: React.FC = () => null;
let NotificationCategoryFilterScreen: React.FC = () => null;
let NotificationEmptyScreen: React.FC = () => null;
let NotificationSettingsScreen: React.FC = () => null;
let SearchDoctorResultsScreen: React.FC = () => null;
let SearchArticleResultsScreen: React.FC = () => null;
let SearchMedicationResultsScreen: React.FC = () => null;
let SearchNoResultsScreen: React.FC = () => null;

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

try {
  const mod = require('../screens/home/WeeklySummary');
  WeeklySummaryScreen = mod.WeeklySummaryScreen || mod.default || WeeklySummaryScreen;
} catch {}

try {
  const mod = require('../screens/home/HomeBottomSheet');
  HomeBottomSheetScreen = mod.HomeBottomSheetScreen || mod.default || HomeBottomSheetScreen;
} catch {}

try {
  const mod = require('../screens/home/HomeMedicationReminders');
  HomeMedicationRemindersScreen = mod.HomeMedicationRemindersScreen || mod.default || HomeMedicationRemindersScreen;
} catch {}

try {
  const mod = require('../screens/home/HomeAppointmentWidget');
  HomeAppointmentWidgetScreen = mod.HomeAppointmentWidgetScreen || mod.default || HomeAppointmentWidgetScreen;
} catch {}

try {
  const mod = require('../screens/home/HomeHealthTips');
  HomeHealthTipsScreen = mod.HomeHealthTipsScreen || mod.default || HomeHealthTipsScreen;
} catch {}

try {
  const mod = require('../screens/home/HomeEmpty');
  HomeEmptyScreen = mod.HomeEmptyScreen || mod.default || HomeEmptyScreen;
} catch {}

try {
  const mod = require('../screens/home/NotificationUnreadFilter');
  NotificationUnreadScreen = mod.NotificationUnreadFilterScreen || mod.default || NotificationUnreadScreen;
} catch {}

try {
  const mod = require('../screens/home/NotificationCategoryFilter');
  NotificationCategoryFilterScreen = mod.NotificationCategoryFilterScreen || mod.default || NotificationCategoryFilterScreen;
} catch {}

try {
  const mod = require('../screens/home/NotificationEmpty');
  NotificationEmptyScreen = mod.NotificationEmptyScreen || mod.default || NotificationEmptyScreen;
} catch {}

try {
  const mod = require('../screens/home/NotificationSettings');
  NotificationSettingsScreen = mod.NotificationSettingsScreen || mod.default || NotificationSettingsScreen;
} catch {}

try {
  const mod = require('../screens/home/SearchDoctorResults');
  SearchDoctorResultsScreen = mod.SearchDoctorResultsScreen || mod.default || SearchDoctorResultsScreen;
} catch {}

try {
  const mod = require('../screens/home/SearchArticleResults');
  SearchArticleResultsScreen = mod.SearchArticleResultsScreen || mod.default || SearchArticleResultsScreen;
} catch {}

try {
  const mod = require('../screens/home/SearchMedicationResults');
  SearchMedicationResultsScreen = mod.SearchMedicationResultsScreen || mod.default || SearchMedicationResultsScreen;
} catch {}

try {
  const mod = require('../screens/home/SearchNoResults');
  SearchNoResultsScreen = mod.SearchNoResultsScreen || mod.default || SearchNoResultsScreen;
} catch {}

// Creates a native stack navigator for the Home tab.
// This allows HomeMetrics and HomeAlert to be pushed on top of the Home screen.
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => (
  <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
    <HomeStackNav.Screen name="HomeMetrics" component={HomeMetricsScreen} />
    <HomeStackNav.Screen name="HomeAlert" component={HomeAlertScreen} />
    <HomeStackNav.Screen name={ROUTES.NOTIFICATION_DETAIL} component={NotificationDetailScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH} component={SearchScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH_RESULTS} component={SearchResultsScreen} />
    <HomeStackNav.Screen name={ROUTES.HOME_WEEKLY_SUMMARY} component={WeeklySummaryScreen} />
    <HomeStackNav.Screen name={ROUTES.HOME_BOTTOM_SHEET} component={HomeBottomSheetScreen} />
    <HomeStackNav.Screen name={ROUTES.HOME_MEDICATION_REMINDERS} component={HomeMedicationRemindersScreen} />
    <HomeStackNav.Screen name={ROUTES.HOME_APPOINTMENT_WIDGET} component={HomeAppointmentWidgetScreen} />
    <HomeStackNav.Screen name={ROUTES.HOME_HEALTH_TIPS} component={HomeHealthTipsScreen} />
    <HomeStackNav.Screen name={ROUTES.HOME_EMPTY} component={HomeEmptyScreen} />
    <HomeStackNav.Screen name={ROUTES.NOTIFICATION_UNREAD} component={NotificationUnreadScreen} />
    <HomeStackNav.Screen name={ROUTES.NOTIFICATION_CATEGORY_FILTER} component={NotificationCategoryFilterScreen} />
    <HomeStackNav.Screen name={ROUTES.NOTIFICATION_EMPTY} component={NotificationEmptyScreen} />
    <HomeStackNav.Screen name={ROUTES.NOTIFICATION_SETTINGS} component={NotificationSettingsScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH_DOCTOR_RESULTS} component={SearchDoctorResultsScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH_ARTICLE_RESULTS} component={SearchArticleResultsScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH_MEDICATION_RESULTS} component={SearchMedicationResultsScreen} />
    <HomeStackNav.Screen name={ROUTES.SEARCH_NO_RESULTS} component={SearchNoResultsScreen} />
  </HomeStackNav.Navigator>
);

// Creates a Bottom Tab Navigator using createBottomTabNavigator from React Navigation.
const Tab = createBottomTabNavigator<MainTabParamList>();

// Defines the main tab navigator for the app.
export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name={JOURNEY_IDS.HEALTH as keyof MainTabParamList} component={HealthNavigator} />
      <Tab.Screen name={JOURNEY_IDS.CARE as keyof MainTabParamList} component={CareNavigator} />
      <Tab.Screen name={JOURNEY_IDS.PLAN as keyof MainTabParamList} component={PlanNavigator} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Achievements" component={GamificationNavigator} />
      <Tab.Screen name="Wellness" component={WellnessNavigator} />
      <Tab.Screen name={ROUTES.SETTINGS} component={SettingsNavigator} />
    </Tab.Navigator>
  );
};
