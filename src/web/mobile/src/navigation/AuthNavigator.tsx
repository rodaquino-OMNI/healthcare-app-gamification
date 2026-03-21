import { createStackNavigator } from '@react-navigation/stack'; // v6.0.0
import React from 'react'; // v18.2.0

import type { AuthStackParamList } from './types';
import { ROUTES } from '../constants/routes';
import EmailVerifyScreen from '../screens/auth/EmailVerify';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword';
import GoalSelectionScreen from '../screens/auth/GoalSelection';
import Login from '../screens/auth/Login';
import { MFAScreen } from '../screens/auth/MFA';
import OnboardingScreen from '../screens/auth/Onboarding';
import OnboardingConfirmationScreen from '../screens/auth/OnboardingConfirmation';
import PersonalizationIntroScreen from '../screens/auth/PersonalizationIntro';
import RegisterScreen from '../screens/auth/Register';
import SetPasswordScreen from '../screens/auth/SetPassword';
import SocialAuth from '../screens/auth/SocialAuth';
import WelcomeCTAScreen from '../screens/auth/WelcomeCTA';
import WelcomeSplashScreen from '../screens/auth/WelcomeSplash';
import ProfileAddressScreen from '../screens/profile/ProfileAddress';
import ProfileConfirmationScreen from '../screens/profile/ProfileConfirmation';
import ProfileDocumentsScreen from '../screens/profile/ProfileDocuments';
import ProfilePhotoScreen from '../screens/profile/ProfilePhoto';
import ProfileSetupScreen from '../screens/profile/ProfileSetup';
import ProfileVariant1Screen from '../screens/profile/ProfileVariant1';
import ProfileVariant2Screen from '../screens/profile/ProfileVariant2';

// Create a stack navigator
const Stack = createStackNavigator<AuthStackParamList>();

/**
 * A React component that defines the navigation stack for the authentication flow.
 * The flow starts with WelcomeSplash -> Onboarding -> WelcomeCTA -> Login/Register.
 * Includes email verification, password setup, and full profile setup screens.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- return type inferred from implementation
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
            <Stack.Screen name={ROUTES.AUTH_LOGIN} component={Login} />
            <Stack.Screen name={ROUTES.AUTH_REGISTER} component={RegisterScreen} />
            <Stack.Screen name={ROUTES.AUTH_FORGOT_PASSWORD} component={ForgotPasswordScreen} />
            <Stack.Screen name={ROUTES.AUTH_MFA} component={MFAScreen} />

            {/* Verification */}
            <Stack.Screen name={ROUTES.AUTH_EMAIL_VERIFY} component={EmailVerifyScreen} />
            <Stack.Screen name={ROUTES.AUTH_SET_PASSWORD} component={SetPasswordScreen} />

            {/* Social Authentication */}
            <Stack.Screen name={ROUTES.AUTH_SOCIAL} component={SocialAuth} />

            {/* Personalization */}
            <Stack.Screen name={ROUTES.AUTH_PERSONALIZATION_INTRO} component={PersonalizationIntroScreen} />
            <Stack.Screen name={ROUTES.AUTH_GOAL_SELECTION} component={GoalSelectionScreen} />
            <Stack.Screen name={ROUTES.AUTH_ONBOARDING_CONFIRMATION} component={OnboardingConfirmationScreen} />

            {/* Profile Setup */}
            <Stack.Screen name={ROUTES.PROFILE_SETUP} component={ProfileSetupScreen} />
            <Stack.Screen name={ROUTES.PROFILE_HEALTH} component={ProfileVariant1Screen} />
            <Stack.Screen name={ROUTES.PROFILE_INSURANCE} component={ProfileVariant2Screen} />
            <Stack.Screen name={ROUTES.PROFILE_ADDRESS} component={ProfileAddressScreen} />
            <Stack.Screen name={ROUTES.PROFILE_DOCUMENTS} component={ProfileDocumentsScreen} />
            <Stack.Screen name={ROUTES.PROFILE_PHOTO} component={ProfilePhotoScreen} />
            <Stack.Screen name={ROUTES.PROFILE_CONFIRMATION} component={ProfileConfirmationScreen} />
        </Stack.Navigator>
    );
};

/**
 * A React component that renders the navigation stack for the authentication flow.
 */
export const AuthNavigator: React.FC = () => {
    return <AuthStack />;
};
