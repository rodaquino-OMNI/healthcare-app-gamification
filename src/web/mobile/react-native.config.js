const path = require('path');

module.exports = {
    // Project configuration for iOS and Android platforms
    project: {
        ios: {
            sourceDir: './ios',
            podfile: './ios/Podfile',
            xcodeProject: './ios/mobile.xcodeproj',
            deploymentTarget: '13.0', // Minimum iOS version supported
        },
        android: {
            sourceDir: './android',
            manifestPath: './android/app/src/main/AndroidManifest.xml',
            packageName: 'br.com.austa.superapp',
            buildGradlePath: './android/app/build.gradle',
            settingsGradlePath: './android/settings.gradle',
        },
    },

    // DEMO_MODE — Disable Firebase auto-linking (modular_headers conflict with expo-dev-menu)
    dependencies: {
        '@react-native-firebase/app': { platforms: { ios: null } },
        '@react-native-firebase/analytics': { platforms: { ios: null } },
        '@react-native-firebase/crashlytics': { platforms: { ios: null } },
        // DEMO_MODE — Pods that cannot resolve (NitroModules unavailable, Agora CDN broken)
        'react-native-mmkv': { platforms: { ios: null } },
        'react-native-agora': { platforms: { ios: null } },
        // Icon library for journey-specific icons and navigation elements
        'react-native-vector-icons': {
            platforms: {
                ios: {},
                android: {},
            },
        },
        // Linear gradient for journey-specific backgrounds and UI elements
        'react-native-linear-gradient': {
            platforms: {
                ios: {},
                android: {},
            },
        },
        // Gesture handler for enhanced touch interactions across all journeys
        'react-native-gesture-handler': {
            platforms: {
                ios: {},
                android: {},
            },
        },
        // Animation library for gamification elements and UI transitions
        'react-native-reanimated': {
            platforms: {
                ios: {},
                android: {},
            },
        },
        // SVG support for health metrics visualization and journey icons
        'react-native-svg': {
            platforms: {
                ios: {},
                android: {},
            },
        },
    },

    // Assets to be bundled with the application
    assets: [
        // Journey-specific fonts for consistent typography
        './src/assets/fonts',
        // Images for journey UI elements and gamification badges
        './src/assets/images',
        // Animations for gamification rewards and journey transitions
        './src/assets/animations',
    ],
};
