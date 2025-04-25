import React from 'react'; // v18.2.0
import { StatusBar } from 'react-native'; // v0.71+
import { ThemeProvider } from 'styled-components'; // v6.0+

import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { JourneyProvider } from './src/context/JourneyContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { config } from './src/constants/config';
import { JOURNEY_NAMES } from 'src/web/shared/constants/journeys';
import { AuthSession } from 'src/web/shared/types/index';
import { baseTheme } from 'src/web/design-system/src/themes/index';

/**
 * The root component of the AUSTA SuperApp mobile application.
 * It sets up the authentication, journey, and notification contexts,
 * and renders the root navigator.
 *
 * Requirements Addressed:
 * - Cross-Platform Framework (F-402): Provides a cross-platform framework for building the mobile application.
 */
const App: React.FC = () => {
  // LD1: Sets the status bar style based on the platform.
  // IE1: The config object is imported from 'src/web/mobile/src/constants/config'
  // and is used to determine the platform.
  if (config.platform === 'ios') {
    StatusBar.setBarStyle('light-content', true);
  } else {
    StatusBar.setBackgroundColor('#000000');
    StatusBar.setBarStyle('light-content');
  }

  // LD1: Returns the main application structure, wrapping the RootNavigator with the AuthProvider, JourneyProvider, and NotificationProvider.
  return (
    <ThemeProvider theme={baseTheme}>
      <AuthProvider>
        <JourneyProvider>
          <NotificationProvider>
            {/* LD1: Renders the RootNavigator component, which handles the main navigation logic. */}
            {/* IE1: The RootNavigator component is imported from 'src/web/mobile/src/navigation/RootNavigator'
                and is responsible for switching between the authentication flow and the main app flow. */}
            <RootNavigator />
          </NotificationProvider>
        </JourneyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;