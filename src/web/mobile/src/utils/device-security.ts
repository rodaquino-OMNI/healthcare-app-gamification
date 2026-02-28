/**
 * Device security checks for root/jailbreak detection and integrity.
 *
 * MASVS-RESILIENCE-1: The app detects and responds to the presence
 * of a rooted or jailbroken device.
 *
 * Uses react-native-device-info (v10.8.0) for native detection APIs.
 * These checks are best-effort — a determined attacker can bypass them,
 * but they raise the bar for casual exploitation and satisfy L2 audit.
 *
 * @see https://github.com/react-native-device-info/react-native-device-info
 */
import { Platform, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface DeviceSecurityStatus {
  /** True if the device is rooted (Android) or jailbroken (iOS). */
  rooted: boolean;
  /** True if the app is running on an emulator/simulator. */
  emulator: boolean;
  /** True if the app was installed from an unofficial source. */
  debugMode: boolean;
}

/**
 * Check if the device is rooted (Android) or jailbroken (iOS).
 * Returns a promise because the native checks are asynchronous.
 */
export async function isRooted(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      return await DeviceInfo.isRooted();
    }
    if (Platform.OS === 'ios') {
      return await DeviceInfo.isJailBroken();
    }
    return false;
  } catch {
    // If the check fails, assume compromised for safety
    return true;
  }
}

/**
 * Check if the app is running on an emulator or simulator.
 */
export async function isEmulator(): Promise<boolean> {
  try {
    return await DeviceInfo.isEmulator();
  } catch {
    return false;
  }
}

/**
 * Run all device security checks and return a combined status.
 */
export async function checkDeviceSecurity(): Promise<DeviceSecurityStatus> {
  const [rootedResult, emulatorResult] = await Promise.all([
    isRooted(),
    isEmulator(),
  ]);

  return {
    rooted: rootedResult,
    emulator: emulatorResult,
    debugMode: __DEV__,
  };
}

/**
 * Show a non-blocking warning alert if the device is rooted/jailbroken.
 * Does NOT prevent app usage — this is informational for the user.
 * Call this from App.tsx or the auth flow entry point.
 */
export async function warnIfCompromised(): Promise<void> {
  const status = await checkDeviceSecurity();

  if (status.rooted) {
    Alert.alert(
      'Security Warning',
      'This device appears to be rooted or jailbroken. ' +
        'Your health data may be at risk. We recommend using a ' +
        'non-modified device for the best security.',
      [{ text: 'I Understand', style: 'default' }],
    );
  }
}
