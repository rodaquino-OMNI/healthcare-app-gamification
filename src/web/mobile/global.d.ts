/**
 * Global type declarations for the Austa Health mobile app
 *
 * This is an ambient declaration file (script, NOT a module).
 * Do NOT add `export` or `import` at the top level.
 */

// React Native global __DEV__ variable
declare const __DEV__: boolean;

// expo-constants is not installed; declare a minimal stub
declare module 'expo-constants' {
    interface ExpoConfig {
        extra?: Record<string, string>;
    }
    const Constants: {
        expoConfig?: ExpoConfig;
    };
    export default Constants;
}

// react-native-ssl-pinning is not installed; declare a minimal stub
declare module 'react-native-ssl-pinning' {
    export function fetch(url: string, options?: Record<string, unknown>): Promise<Response>;
}
