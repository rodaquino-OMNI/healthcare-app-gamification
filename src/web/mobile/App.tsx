// eslint-disable-next-line import/no-unresolved
import { useFonts } from 'expo-font';
// eslint-disable-next-line import/no-unresolved
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react'; // v18.2.0
import { StatusBar, View } from 'react-native'; // v0.71+

import { ErrorBoundary } from './src/components/shared/ErrorBoundary';
import { config } from './src/constants/config';
import { AuthProvider } from './src/context/AuthContext';
import { JourneyProvider } from './src/context/JourneyContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { AppThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { warnIfCompromised } from './src/utils/device-security';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
void (SplashScreen as unknown as { preventAutoHideAsync: () => Promise<void> }).preventAutoHideAsync();

/**
 * Inner component that has access to ThemeContext for StatusBar styling.
 */
const StatusBarManager: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { isDark, theme } = useAppTheme();
    const barStyle = isDark ? 'light-content' : 'dark-content';

    if (config.platform === 'ios') {
        StatusBar.setBarStyle(barStyle, true);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
    // TODO [ASSET-003]: Add PlusJakartaSans-Light.ttf (weight 300) and
    // PlusJakartaSans-ExtraBold.ttf (weight 800) to src/web/mobile/src/assets/fonts/
    // Download from: https://fonts.google.com/specimen/Plus+Jakarta+Sans
    // Then uncomment the Light and ExtraBold lines below.
    const [fontsLoaded]: [boolean] = (useFonts as unknown as (map: Record<string, unknown>) => [boolean])({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        // 'PlusJakartaSans-Light': require('./src/assets/fonts/PlusJakartaSans-Light.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        'PlusJakartaSans-Regular': require('./src/assets/fonts/PlusJakartaSans-Regular.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        'PlusJakartaSans-Medium': require('./src/assets/fonts/PlusJakartaSans-Medium.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        'PlusJakartaSans-SemiBold': require('./src/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        'PlusJakartaSans-Bold': require('./src/assets/fonts/PlusJakartaSans-Bold.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        // 'PlusJakartaSans-ExtraBold': require('./src/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        'Nunito-Bold': require('./src/assets/fonts/Nunito-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            await (SplashScreen as unknown as { hideAsync: () => Promise<void> }).hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        void warnIfCompromised();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={() => void onLayoutRootView()}>
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
        </View>
    );
};

export default App;
