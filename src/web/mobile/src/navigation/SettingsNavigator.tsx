/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import type { SettingsStackParamList } from './types';
import { ROUTES } from '../constants/routes';
import { SettingsScreen } from '../screens/home/Settings';

/** Shape of every lazily-loaded screen module. */
interface ScreenModule {
    default?: React.ComponentType;
    [key: string]: React.ComponentType | undefined;
}

// Lazy-loaded screens from home/ (existing Settings sub-screens)
let SettingsEditScreen: React.ComponentType = () => null;
let SettingsNotificationsScreen: React.ComponentType = () => null;
let SettingsPrivacyScreen: React.ComponentType = () => null;

try {
    const seModule = require('../screens/home/SettingsEdit') as ScreenModule;
    SettingsEditScreen = seModule.SettingsEditScreen ?? seModule.default ?? SettingsEditScreen;
} catch {
    // SettingsEdit screen not yet available
}

try {
    const snModule = require('../screens/home/SettingsNotifications') as ScreenModule;
    SettingsNotificationsScreen =
        snModule.SettingsNotificationsScreen ?? snModule.default ?? SettingsNotificationsScreen;
} catch {
    // SettingsNotifications screen not yet available
}

try {
    const spModule = require('../screens/home/SettingsPrivacy') as ScreenModule;
    SettingsPrivacyScreen = spModule.SettingsPrivacyScreen ?? spModule.default ?? SettingsPrivacyScreen;
} catch {
    // SettingsPrivacy screen not yet available
}

// Lazy-loaded screens from settings/ (new screens)
let PersonalInfoScreen: React.ComponentType = () => null;
let ChangePasswordScreen: React.ComponentType = () => null;
let TwoFactorScreen: React.ComponentType = () => null;
let BiometricScreen: React.ComponentType = () => null;
let DataExportScreen: React.ComponentType = () => null;
let DeleteAccountScreen: React.ComponentType = () => null;
let DeleteConfirmScreen: React.ComponentType = () => null;
let LanguageScreen: React.ComponentType = () => null;
let ThemeScreen: React.ComponentType = () => null;
let AccessibilityScreen: React.ComponentType = () => null;
let ConnectedDevicesScreen: React.ComponentType = () => null;
let HealthPlanScreen: React.ComponentType = () => null;
let InsuranceDocsScreen: React.ComponentType = () => null;
let DependentsScreen: React.ComponentType = () => null;
let AddDependentScreen: React.ComponentType = () => null;
let EmergencyContactsScreen: React.ComponentType = () => null;
let AddressesScreen: React.ComponentType = () => null;
let AddAddressScreen: React.ComponentType = () => null;
let TermsScreen: React.ComponentType = () => null;
let PrivacyPolicyScreen: React.ComponentType = () => null;
let AboutScreen: React.ComponentType = () => null;
let LogoutScreen: React.ComponentType = () => null;
let FeedbackScreen: React.ComponentType = () => null;
let HelpHomeScreen: React.ComponentType = () => null;
let FAQCategoryScreen: React.ComponentType = () => null;
let FAQDetailScreen: React.ComponentType = () => null;
let ContactSupportScreen: React.ComponentType = () => null;
let LiveChatScreen: React.ComponentType = () => null;
let ReportProblemScreen: React.ComponentType = () => null;

// Settings module screens
try {
    const m = require('../screens/settings/PersonalInfo') as ScreenModule;
    PersonalInfoScreen = m.PersonalInfoScreen ?? m.default ?? PersonalInfoScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ChangePassword') as ScreenModule;
    ChangePasswordScreen = m.ChangePasswordScreen ?? m.default ?? ChangePasswordScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/TwoFactorAuth') as ScreenModule;
    TwoFactorScreen = m.TwoFactorAuthScreen ?? m.default ?? TwoFactorScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/BiometricPrefs') as ScreenModule;
    BiometricScreen = m.BiometricPrefsScreen ?? m.default ?? BiometricScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/DataExport') as ScreenModule;
    DataExportScreen = m.DataExportScreen ?? m.default ?? DataExportScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/DeleteAccount') as ScreenModule;
    DeleteAccountScreen = m.DeleteAccountScreen ?? m.default ?? DeleteAccountScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/DeleteConfirm') as ScreenModule;
    DeleteConfirmScreen = m.DeleteConfirmScreen ?? m.default ?? DeleteConfirmScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/LanguageSelect') as ScreenModule;
    LanguageScreen = m.LanguageSelectScreen ?? m.default ?? LanguageScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ThemeSelect') as ScreenModule;
    ThemeScreen = m.ThemeSelectScreen ?? m.default ?? ThemeScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/Accessibility') as ScreenModule;
    AccessibilityScreen = m.AccessibilityScreen ?? m.default ?? AccessibilityScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ConnectedDevices') as ScreenModule;
    ConnectedDevicesScreen = m.ConnectedDevicesScreen ?? m.default ?? ConnectedDevicesScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/HealthPlanInfo') as ScreenModule;
    HealthPlanScreen = m.HealthPlanInfoScreen ?? m.default ?? HealthPlanScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/InsuranceDocs') as ScreenModule;
    InsuranceDocsScreen = m.InsuranceDocsScreen ?? m.default ?? InsuranceDocsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/Dependents') as ScreenModule;
    DependentsScreen = m.DependentsScreen ?? m.default ?? DependentsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AddDependent') as ScreenModule;
    AddDependentScreen = m.AddDependentScreen ?? m.default ?? AddDependentScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/EmergencyContacts') as ScreenModule;
    EmergencyContactsScreen = m.EmergencyContactsScreen ?? m.default ?? EmergencyContactsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/Addresses') as ScreenModule;
    AddressesScreen = m.AddressesScreen ?? m.default ?? AddressesScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AddAddress') as ScreenModule;
    AddAddressScreen = m.AddAddressScreen ?? m.default ?? AddAddressScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/TermsOfService') as ScreenModule;
    TermsScreen = m.TermsOfServiceScreen ?? m.default ?? TermsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/PrivacyPolicy') as ScreenModule;
    PrivacyPolicyScreen = m.PrivacyPolicyScreen ?? m.default ?? PrivacyPolicyScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AboutApp') as ScreenModule;
    AboutScreen = m.AboutAppScreen ?? m.default ?? AboutScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/LogoutConfirm') as ScreenModule;
    LogoutScreen = m.LogoutConfirmScreen ?? m.default ?? LogoutScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AppFeedback') as ScreenModule;
    FeedbackScreen = m.AppFeedbackScreen ?? m.default ?? FeedbackScreen;
} catch {
    /* not yet available */
}

// Help Center screens
try {
    const m = require('../screens/settings/HelpHome') as ScreenModule;
    HelpHomeScreen = m.HelpHomeScreen ?? m.default ?? HelpHomeScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/FAQCategory') as ScreenModule;
    FAQCategoryScreen = m.FAQCategoryScreen ?? m.default ?? FAQCategoryScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/FAQDetail') as ScreenModule;
    FAQDetailScreen = m.FAQDetailScreen ?? m.default ?? FAQDetailScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ContactSupport') as ScreenModule;
    ContactSupportScreen = m.ContactSupportScreen ?? m.default ?? ContactSupportScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/LiveChat') as ScreenModule;
    LiveChatScreen = m.LiveChatScreen ?? m.default ?? LiveChatScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ReportProblem') as ScreenModule;
    ReportProblemScreen = m.ReportProblemScreen ?? m.default ?? ReportProblemScreen;
} catch {
    /* not yet available */
}

const Stack = createNativeStackNavigator<SettingsStackParamList>();

/**
 * SettingsNavigator - Stack navigator for all Settings and Help Center screens.
 * Initial screen is SettingsMain (the Settings hub).
 * Registers existing settings sub-screens (Edit, Notifications, Privacy)
 * plus all 29 new screens (23 settings + 6 help center).
 */
const SettingsNavigator: React.ComponentType = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Initial screen */}
        <Stack.Screen name="SettingsMain" component={SettingsScreen} />

        {/* Existing settings sub-screens (moved from HomeStack) */}
        <Stack.Screen name={ROUTES.SETTINGS_EDIT} component={SettingsEditScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_NOTIFICATIONS} component={SettingsNotificationsScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_PRIVACY} component={SettingsPrivacyScreen} />

        {/* Account & Security */}
        <Stack.Screen name={ROUTES.SETTINGS_PERSONAL_INFO} component={PersonalInfoScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_CHANGE_PASSWORD} component={ChangePasswordScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_TWO_FACTOR} component={TwoFactorScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_BIOMETRIC} component={BiometricScreen} />

        {/* Data Management */}
        <Stack.Screen name={ROUTES.SETTINGS_DATA_EXPORT} component={DataExportScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_DELETE_ACCOUNT} component={DeleteAccountScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_DELETE_CONFIRM} component={DeleteConfirmScreen} />

        {/* Preferences */}
        <Stack.Screen name={ROUTES.SETTINGS_LANGUAGE} component={LanguageScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_THEME} component={ThemeScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_ACCESSIBILITY} component={AccessibilityScreen} />

        {/* Devices */}
        <Stack.Screen name={ROUTES.SETTINGS_CONNECTED_DEVICES} component={ConnectedDevicesScreen} />

        {/* Health Plan */}
        <Stack.Screen name={ROUTES.SETTINGS_HEALTH_PLAN} component={HealthPlanScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_INSURANCE_DOCS} component={InsuranceDocsScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_DEPENDENTS} component={DependentsScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_ADD_DEPENDENT} component={AddDependentScreen} />

        {/* Contacts & Addresses */}
        <Stack.Screen name={ROUTES.SETTINGS_EMERGENCY_CONTACTS} component={EmergencyContactsScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_ADDRESSES} component={AddressesScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_ADD_ADDRESS} component={AddAddressScreen} />

        {/* Legal & Info */}
        <Stack.Screen name={ROUTES.SETTINGS_TERMS} component={TermsScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_PRIVACY_POLICY} component={PrivacyPolicyScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_ABOUT} component={AboutScreen} />

        {/* Session */}
        <Stack.Screen name={ROUTES.SETTINGS_LOGOUT} component={LogoutScreen} />
        <Stack.Screen name={ROUTES.SETTINGS_FEEDBACK} component={FeedbackScreen} />

        {/* Help Center */}
        <Stack.Screen name={ROUTES.HELP_HOME} component={HelpHomeScreen} />
        <Stack.Screen name={ROUTES.HELP_FAQ_CATEGORY} component={FAQCategoryScreen} />
        <Stack.Screen name={ROUTES.HELP_FAQ_DETAIL} component={FAQDetailScreen} />
        <Stack.Screen name={ROUTES.HELP_CONTACT} component={ContactSupportScreen} />
        <Stack.Screen name={ROUTES.HELP_CHAT} component={LiveChatScreen} />
        <Stack.Screen name={ROUTES.HELP_REPORT} component={ReportProblemScreen} />
    </Stack.Navigator>
);

export default SettingsNavigator;
