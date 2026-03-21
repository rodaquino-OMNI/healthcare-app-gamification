/* eslint-disable @typescript-eslint/no-var-requires -- lazy screen imports use require() inside try-catch for resilience */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import type { SettingsStackParamList } from './types';
import { ROUTES } from '../constants/routes';
import { SettingsScreen } from '../screens/home/Settings';

// Lazy-loaded screens from home/ (existing Settings sub-screens)
let SettingsEditScreen: React.FC = () => null;
let SettingsNotificationsScreen: React.FC = () => null;
let SettingsPrivacyScreen: React.FC = () => null;

try {
    const seModule = require('../screens/home/SettingsEdit');
    SettingsEditScreen = seModule.SettingsEditScreen || seModule.default || SettingsEditScreen;
} catch {
    // SettingsEdit screen not yet available
}

try {
    const snModule = require('../screens/home/SettingsNotifications');
    SettingsNotificationsScreen =
        snModule.SettingsNotificationsScreen || snModule.default || SettingsNotificationsScreen;
} catch {
    // SettingsNotifications screen not yet available
}

try {
    const spModule = require('../screens/home/SettingsPrivacy');
    SettingsPrivacyScreen = spModule.SettingsPrivacyScreen || spModule.default || SettingsPrivacyScreen;
} catch {
    // SettingsPrivacy screen not yet available
}

// Lazy-loaded screens from settings/ (new screens)
let PersonalInfoScreen: React.FC = () => null;
let ChangePasswordScreen: React.FC = () => null;
let TwoFactorScreen: React.FC = () => null;
let BiometricScreen: React.FC = () => null;
let DataExportScreen: React.FC = () => null;
let DeleteAccountScreen: React.FC = () => null;
let DeleteConfirmScreen: React.FC = () => null;
let LanguageScreen: React.FC = () => null;
let ThemeScreen: React.FC = () => null;
let AccessibilityScreen: React.FC = () => null;
let ConnectedDevicesScreen: React.FC = () => null;
let HealthPlanScreen: React.FC = () => null;
let InsuranceDocsScreen: React.FC = () => null;
let DependentsScreen: React.FC = () => null;
let AddDependentScreen: React.FC = () => null;
let EmergencyContactsScreen: React.FC = () => null;
let AddressesScreen: React.FC = () => null;
let AddAddressScreen: React.FC = () => null;
let TermsScreen: React.FC = () => null;
let PrivacyPolicyScreen: React.FC = () => null;
let AboutScreen: React.FC = () => null;
let LogoutScreen: React.FC = () => null;
let FeedbackScreen: React.FC = () => null;
let HelpHomeScreen: React.FC = () => null;
let FAQCategoryScreen: React.FC = () => null;
let FAQDetailScreen: React.FC = () => null;
let ContactSupportScreen: React.FC = () => null;
let LiveChatScreen: React.FC = () => null;
let ReportProblemScreen: React.FC = () => null;

// Settings module screens
try {
    const m = require('../screens/settings/PersonalInfo');
    PersonalInfoScreen = m.PersonalInfoScreen || m.default || PersonalInfoScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ChangePassword');
    ChangePasswordScreen = m.ChangePasswordScreen || m.default || ChangePasswordScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/TwoFactorAuth');
    TwoFactorScreen = m.TwoFactorAuthScreen || m.default || TwoFactorScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/BiometricPrefs');
    BiometricScreen = m.BiometricPrefsScreen || m.default || BiometricScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/DataExport');
    DataExportScreen = m.DataExportScreen || m.default || DataExportScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/DeleteAccount');
    DeleteAccountScreen = m.DeleteAccountScreen || m.default || DeleteAccountScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/DeleteConfirm');
    DeleteConfirmScreen = m.DeleteConfirmScreen || m.default || DeleteConfirmScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/LanguageSelect');
    LanguageScreen = m.LanguageSelectScreen || m.default || LanguageScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ThemeSelect');
    ThemeScreen = m.ThemeSelectScreen || m.default || ThemeScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/Accessibility');
    AccessibilityScreen = m.AccessibilityScreen || m.default || AccessibilityScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ConnectedDevices');
    ConnectedDevicesScreen = m.ConnectedDevicesScreen || m.default || ConnectedDevicesScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/HealthPlanInfo');
    HealthPlanScreen = m.HealthPlanInfoScreen || m.default || HealthPlanScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/InsuranceDocs');
    InsuranceDocsScreen = m.InsuranceDocsScreen || m.default || InsuranceDocsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/Dependents');
    DependentsScreen = m.DependentsScreen || m.default || DependentsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AddDependent');
    AddDependentScreen = m.AddDependentScreen || m.default || AddDependentScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/EmergencyContacts');
    EmergencyContactsScreen = m.EmergencyContactsScreen || m.default || EmergencyContactsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/Addresses');
    AddressesScreen = m.AddressesScreen || m.default || AddressesScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AddAddress');
    AddAddressScreen = m.AddAddressScreen || m.default || AddAddressScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/TermsOfService');
    TermsScreen = m.TermsOfServiceScreen || m.default || TermsScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/PrivacyPolicy');
    PrivacyPolicyScreen = m.PrivacyPolicyScreen || m.default || PrivacyPolicyScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AboutApp');
    AboutScreen = m.AboutAppScreen || m.default || AboutScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/LogoutConfirm');
    LogoutScreen = m.LogoutConfirmScreen || m.default || LogoutScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/AppFeedback');
    FeedbackScreen = m.AppFeedbackScreen || m.default || FeedbackScreen;
} catch {
    /* not yet available */
}

// Help Center screens
try {
    const m = require('../screens/settings/HelpHome');
    HelpHomeScreen = m.HelpHomeScreen || m.default || HelpHomeScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/FAQCategory');
    FAQCategoryScreen = m.FAQCategoryScreen || m.default || FAQCategoryScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/FAQDetail');
    FAQDetailScreen = m.FAQDetailScreen || m.default || FAQDetailScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ContactSupport');
    ContactSupportScreen = m.ContactSupportScreen || m.default || ContactSupportScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/LiveChat');
    LiveChatScreen = m.LiveChatScreen || m.default || LiveChatScreen;
} catch {
    /* not yet available */
}

try {
    const m = require('../screens/settings/ReportProblem');
    ReportProblemScreen = m.ReportProblemScreen || m.default || ReportProblemScreen;
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
const SettingsNavigator: React.FC = () => (
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
