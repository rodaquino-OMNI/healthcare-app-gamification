import React from 'react'; // v18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // v6.0.0

import Login from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword';
import { MFAScreen } from '../screens/auth/MFA';
import WelcomeSplashScreen from '../screens/auth/WelcomeSplash';
import OnboardingScreen from '../screens/auth/Onboarding';
import WelcomeCTAScreen from '../screens/auth/WelcomeCTA';
import EmailVerifyScreen from '../screens/auth/EmailVerify';
import SetPasswordScreen from '../screens/auth/SetPassword';
import ProfileSetupScreen from '../screens/profile/ProfileSetup';
import ProfileVariant1Screen from '../screens/profile/ProfileVariant1';
import ProfileVariant2Screen from '../screens/profile/ProfileVariant2';
import ProfileAddressScreen from '../screens/profile/ProfileAddress';
import ProfileDocumentsScreen from '../screens/profile/ProfileDocuments';
import ProfilePhotoScreen from '../screens/profile/ProfilePhoto';
import ProfileConfirmationScreen from '../screens/profile/ProfileConfirmation';
import { MOBILE_AUTH_ROUTES, MOBILE_PROFILE_ROUTES } from 'src/web/shared/constants/routes';
import { ROUTES } from '../constants/routes';

// Create a stack navigator
const Stack = createStackNavigator();

/**
 * A React component that defines the navigation stack for the authentication flow.
 * The flow starts with WelcomeSplash -> Onboarding -> WelcomeCTA -> Login/Register.
 * Includes email verification, password setup, and full profile setup screens.
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.AUTH_WELCOME}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROUTES.AUTH_WELCOME} component={WelcomeSplashScreen} />
      <Stack.Screen name={ROUTES.AUTH_ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.AUTH_WELCOME_CTA} component={WelcomeCTAScreen} />
      <Stack.Screen name={MOBILE_AUTH_ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={MOBILE_AUTH_ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={MOBILE_AUTH_ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={MOBILE_AUTH_ROUTES.MFA} component={MFAScreen} />

      {/* Verification */}
      <Stack.Screen name={MOBILE_AUTH_ROUTES.EMAIL_VERIFY} component={EmailVerifyScreen} />
      <Stack.Screen name={MOBILE_AUTH_ROUTES.SET_PASSWORD} component={SetPasswordScreen} />

      {/* Profile Setup */}
      <Stack.Screen name={MOBILE_PROFILE_ROUTES.SETUP} component={ProfileSetupScreen} />
      <Stack.Screen name={MOBILE_PROFILE_ROUTES.HEALTH} component={ProfileVariant1Screen} />
      <Stack.Screen name={MOBILE_PROFILE_ROUTES.INSURANCE} component={ProfileVariant2Screen} />
      <Stack.Screen name={MOBILE_PROFILE_ROUTES.ADDRESS} component={ProfileAddressScreen} />
      <Stack.Screen name={MOBILE_PROFILE_ROUTES.DOCUMENTS} component={ProfileDocumentsScreen} />
      <Stack.Screen name={MOBILE_PROFILE_ROUTES.PHOTO} component={ProfilePhotoScreen} />
      <Stack.Screen name={MOBILE_PROFILE_ROUTES.CONFIRMATION} component={ProfileConfirmationScreen} />
    </Stack.Navigator>
  );
};

/**
 * A React component that renders the navigation stack for the authentication flow.
 */
export const AuthNavigator: React.FC = () => {
  return (
    <AuthStack />
  );
};