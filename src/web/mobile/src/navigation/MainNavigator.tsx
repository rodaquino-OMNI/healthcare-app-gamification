/* eslint-disable @typescript-eslint/no-var-requires -- lazy navigator imports use require() inside try-catch for resilience */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // v6.5.8
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // v6.9.13
import { JOURNEY_IDS } from '@shared/constants/journeys';
import React, { useCallback } from 'react'; // v18.2.0

import CareNavigator from './CareNavigator';
import GamificationNavigator from './GamificationNavigator';
import HealthNavigator from './HealthNavigator';
import { PlanNavigator } from './PlanNavigator';
import SettingsNavigator from './SettingsNavigator';
import type { HomeStackParamList, MainTabParamList } from './types';
import { ROUTES } from '../constants/routes';
import HomeScreen from '../screens/home/Home';
import { NotificationsScreen } from '../screens/home/Notifications';
import { ProfileScreen } from '../screens/home/Profile';
import { haptic } from '../utils/haptics';

/**
 * Safely require a screen module and extract a named or default export.
 * Metro requires static string literals in require() calls, so each call
 * site must use an inline string -- not a variable. This helper is only
 * used to extract the component from an already-required module.
 */
function extractScreen(
    mod: Record<string, React.FC | undefined> | undefined,
    exportNames: string[],
    fallback: React.FC
): React.FC {
    if (!mod) {
        return fallback;
    }
    for (const name of exportNames) {
        if (typeof mod[name] === 'function') {
            return mod[name] as React.FC;
        }
    }
    return fallback;
}

// Lazy-loaded navigators and screens for the Home stack.
// Each require() uses a static string literal so Metro can resolve it at bundle time.
const placeholder: React.FC = () => null;

function safeRequire(fn: () => unknown): Record<string, React.FC | undefined> | undefined {
    try {
        return fn() as Record<string, React.FC | undefined>;
    } catch {
        return undefined;
    }
}

const WellnessNavigator = extractScreen(
    safeRequire(() => require('./WellnessNavigator')),
    ['default', 'WellnessNavigator'],
    placeholder
);

const HomeMetricsScreen = extractScreen(
    safeRequire(() => require('../screens/home/HomeMetrics')),
    ['HomeMetricsScreen', 'default'],
    placeholder
);
const HomeAlertScreen = extractScreen(
    safeRequire(() => require('../screens/home/HomeAlert')),
    ['HomeAlertScreen', 'default'],
    placeholder
);
const NotificationDetailScreen = extractScreen(
    safeRequire(() => require('../screens/home/NotificationDetail')),
    ['NotificationDetailScreen', 'default'],
    placeholder
);
const SearchScreen = extractScreen(
    safeRequire(() => require('../screens/home/Search')),
    ['SearchScreen', 'default'],
    placeholder
);
const SearchResultsScreen = extractScreen(
    safeRequire(() => require('../screens/home/SearchResults')),
    ['SearchResultsScreen', 'default'],
    placeholder
);
const WeeklySummaryScreen = extractScreen(
    safeRequire(() => require('../screens/home/WeeklySummary')),
    ['WeeklySummaryScreen', 'default'],
    placeholder
);
const HomeBottomSheetScreen = extractScreen(
    safeRequire(() => require('../screens/home/HomeBottomSheet')),
    ['HomeBottomSheetScreen', 'default'],
    placeholder
);
const HomeMedicationRemindersScreen = extractScreen(
    safeRequire(() => require('../screens/home/HomeMedicationReminders')),
    ['HomeMedicationRemindersScreen', 'default'],
    placeholder
);
const HomeAppointmentWidgetScreen = extractScreen(
    safeRequire(() => require('../screens/home/HomeAppointmentWidget')),
    ['HomeAppointmentWidgetScreen', 'default'],
    placeholder
);
const HomeHealthTipsScreen = extractScreen(
    safeRequire(() => require('../screens/home/HomeHealthTips')),
    ['HomeHealthTipsScreen', 'default'],
    placeholder
);
const HomeEmptyScreen = extractScreen(
    safeRequire(() => require('../screens/home/HomeEmpty')),
    ['HomeEmptyScreen', 'default'],
    placeholder
);
const NotificationUnreadScreen = extractScreen(
    safeRequire(() => require('../screens/home/NotificationUnreadFilter')),
    ['NotificationUnreadFilterScreen', 'default'],
    placeholder
);
const NotificationCategoryFilterScreen = extractScreen(
    safeRequire(() => require('../screens/home/NotificationCategoryFilter')),
    ['NotificationCategoryFilterScreen', 'default'],
    placeholder
);
const NotificationEmptyScreen = extractScreen(
    safeRequire(() => require('../screens/home/NotificationEmpty')),
    ['NotificationEmptyScreen', 'default'],
    placeholder
);
const NotificationSettingsScreen = extractScreen(
    safeRequire(() => require('../screens/home/NotificationSettings')),
    ['NotificationSettingsScreen', 'default'],
    placeholder
);
const SearchDoctorResultsScreen = extractScreen(
    safeRequire(() => require('../screens/home/SearchDoctorResults')),
    ['SearchDoctorResultsScreen', 'default'],
    placeholder
);
const SearchArticleResultsScreen = extractScreen(
    safeRequire(() => require('../screens/home/SearchArticleResults')),
    ['SearchArticleResultsScreen', 'default'],
    placeholder
);
const SearchMedicationResultsScreen = extractScreen(
    safeRequire(() => require('../screens/home/SearchMedicationResults')),
    ['SearchMedicationResultsScreen', 'default'],
    placeholder
);
const SearchNoResultsScreen = extractScreen(
    safeRequire(() => require('../screens/home/SearchNoResults')),
    ['SearchNoResultsScreen', 'default'],
    placeholder
);

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
    const handleTabPress = useCallback(() => {
        void haptic.selection();
    }, []);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}
            screenListeners={{
                tabPress: handleTabPress,
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
