import { Platform, PermissionsAndroid } from 'react-native';

/**
 * Checks if the app has been granted necessary permissions on Android.
 * Specifically, it checks for the `READ_EXTERNAL_STORAGE` permission,
 * which is required to access files on the device's storage.
 *
 * Note: This function currently only checks for READ_EXTERNAL_STORAGE permission.
 * It may need to be extended to handle other permissions as required by the application,
 * such as camera access for telemedicine, location for nearby providers, etc.
 *
 * @returns A promise that resolves to `true` if the permission is granted, and `false` otherwise.
 */
export const checkAndroidPermissions = async (): Promise<boolean> => {
    // Check if the platform is Android
    if (Platform.OS !== 'android') {
        // If not Android, return true (permissions not relevant)
        return true;
    }

    try {
        // Try to grant the READ_EXTERNAL_STORAGE permission
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
            title: 'Storage Permission',
            message: 'AUSTA SuperApp needs access to your storage to access files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        });

        // Return true if permission is granted, false otherwise
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
        // Catch any errors during permission request and return false
        console.error('Error requesting permission:', error);
        return false;
    }
};
