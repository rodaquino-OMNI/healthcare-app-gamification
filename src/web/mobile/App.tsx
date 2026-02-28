import React, { useEffect } from 'react'; // v18.2.0
import { StatusBar, Platform } from 'react-native'; // v0.71+

import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { JourneyProvider } from './src/context/JourneyContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { AppThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { ErrorBoundary } from './src/components/shared/ErrorBoundary';
import { config } from './src/constants/config';
import { warnIfCompromised } from './src/utils/device-security';

/**
 * Inner component that has access to ThemeContext for StatusBar styling.
 */
const StatusBarManager: React.FC = () => {
  const { isDark, theme } = useAppTheme();
  const barStyle = isDark ? 'light-content' : 'dark-content';

  if (config.platform === 'ios') {
    StatusBar.setBarStyle(barStyle, true);
  } else {
    StatusBar.setBackgroundColor(theme.colors.background.default);
    StatusBar.setBarStyle(barStyle);
  }

  return null;
};

/**
 * The root component of the AUSTA SuperApp mobile application.
 * It sets up the theme, authentication, journey, and notification contexts,
 * and renders the root navigator.
 *
 * Requirements Addressed:
 * - Cross-Platform Framework (F-402): Provides a cross-platform framework for building the mobile application.
 */
const App: React.FC = () => {
  useEffect(() => {
    warnIfCompromised();
  }, []);

  return (
    <ErrorBoundary>
      <AppThemeProvider>
        <StatusBarManager />
        <AuthProvider>
          <JourneyProvider>
            <NotificationProvider>
              <RootNavigator />
            </NotificationProvider>
          </JourneyProvider>
        </AuthProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
};

export default App;