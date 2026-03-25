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

    // DEMO_MODE — Dependency overrides for autolinking
    dependencies: {
        // Icon library for journey-specific icons and navigation elements
        'react-native-vector-icons': {
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
