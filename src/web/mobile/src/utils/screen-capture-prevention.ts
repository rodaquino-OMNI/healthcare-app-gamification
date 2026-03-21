/**
 * Screen capture prevention for sensitive healthcare screens.
 *
 * Uses expo-screen-capture to prevent screenshots and screen recording
 * on iOS. On Android, FLAG_SECURE is applied automatically by the library.
 *
 * MASVS-STORAGE-2: Prevent sensitive data leakage via screenshots.
 *
 * Apply useSecureScreen() at the top of sensitive screen components:
 * - screens/health/* (health metrics, records, cycle tracking, sleep)
 * - screens/plan/* (insurance details, claims, coverage)
 * - screens/settings/SettingsPrivacy.tsx
 * - screens/auth/* (login, MFA, biometric setup)
 * - screens/wellness/* (companion chat, journal, insights)
 *
 * @see https://docs.expo.dev/versions/latest/sdk/screen-capture/
 */
/* eslint-disable import/no-unresolved */
import { usePreventScreenCapture, addScreenshotListener } from 'expo-screen-capture';
/* eslint-enable import/no-unresolved */
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * Hook to prevent screen capture on sensitive screens.
 * Activates on mount, deactivates on unmount.
 *
 * On iOS: prevents screen recording and screenshots.
 * On Android: applies FLAG_SECURE to the activity window.
 *
 * @param notify - If true, shows an alert when a screenshot is attempted (iOS only). Default: false.
 */
export function useSecureScreen(notify = false): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    usePreventScreenCapture();

    useEffect(() => {
        if (!notify || Platform.OS !== 'ios') {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const subscription = addScreenshotListener(() => {
            Alert.alert(
                'Screenshot Detected',
                'Screenshots of sensitive health data are not recommended for your privacy.',
                [{ text: 'OK', style: 'default' }]
            );
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return () => subscription.remove();
    }, [notify]);
}
