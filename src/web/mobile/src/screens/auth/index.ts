// src/web/mobile/src/screens/auth/index.ts

import ForgotPasswordScreen from './ForgotPassword';
import LoginScreen from './Login';
import MFAScreen from './MFA';
import OnboardingScreen from './Onboarding';
import RegisterScreen from './Register';
import WelcomeCTAScreen from './WelcomeCTA';
import WelcomeSplashScreen from './WelcomeSplash';

/**
 * Exports all the authentication screens for easy import into other parts of the mobile application.
 */
export {
    WelcomeSplashScreen, // Exports the WelcomeSplashScreen component (animated splash).
    OnboardingScreen, // Exports the OnboardingScreen component (5-step carousel).
    WelcomeCTAScreen, // Exports the WelcomeCTAScreen component (login/register CTA).
    LoginScreen, // Exports the LoginScreen component.
    RegisterScreen, // Exports the RegisterScreen component.
    ForgotPasswordScreen, // Exports the ForgotPasswordScreen component.
    MFAScreen, // Exports the MFAScreen component.
};
