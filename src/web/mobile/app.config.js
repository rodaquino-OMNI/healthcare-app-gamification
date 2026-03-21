// Dynamic Expo config — wraps app.json and injects environment variables.
// Run "eas init" to set EAS_PROJECT_ID, or configure in .env
//
// EAS secrets are only available as build-time process.env in this file.
// To expose them at runtime, add them to `extra` below — the app reads
// them via Constants.expoConfig.extra (expo-constants).
const appJson = require('./app.json');

const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID || 'YOUR_EAS_PROJECT_ID_HERE';
if (!EAS_PROJECT_ID || EAS_PROJECT_ID === 'YOUR_EAS_PROJECT_ID_HERE') {
    if (process.env.APP_ENV === 'production') {
        throw new Error('EAS_PROJECT_ID must be set for production builds. Run: eas init');
    }
}

// Bridge SSL certificate pin hashes from EAS secrets into runtime config.
// Set via: eas secret:create --scope project --name SSL_PIN_API_PRIMARY --value "sha256/..."
const SSL_PIN_KEYS = [
    'SSL_PIN_API_PRIMARY',
    'SSL_PIN_API_BACKUP',
    'SSL_PIN_AUTH_PRIMARY',
    'SSL_PIN_AUTH_BACKUP',
    'SSL_PIN_CDN_PRIMARY',
    'SSL_PIN_CDN_BACKUP',
];
const sslPins = {};
SSL_PIN_KEYS.forEach((key) => {
    if (process.env[key]) {
        sslPins[key] = process.env[key];
    }
});

module.exports = ({ config }) => {
    return {
        ...config,
        ...appJson.expo,
        updates: {
            ...appJson.expo.updates,
            url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
        },
        extra: {
            ...appJson.expo.extra,
            eas: {
                projectId: EAS_PROJECT_ID,
            },
            sslPins,
        },
    };
};
