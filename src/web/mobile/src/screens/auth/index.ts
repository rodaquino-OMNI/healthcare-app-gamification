// src/web/mobile/src/screens/auth/index.ts

import LoginScreen from './Login.tsx';
import RegisterScreen from './Register.tsx';
import ForgotPasswordScreen from './ForgotPassword.tsx';
import MFAScreen from './MFA.tsx';
import WelcomeSplashScreen from './WelcomeSplash';
import OnboardingScreen from './Onboarding';
import WelcomeCTAScreen from './WelcomeCTA';

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