// DEMO_MODE — Mock react-native-vision-camera for Expo Go (native module not available)
const React = require('react');

module.exports = {
    Camera: React.forwardRef(() => null),
    useCameraDevice: () => null,
    useCameraDevices: () => ({ back: null, front: null }),
    useCameraPermission: () => ({
        hasPermission: false,
        requestPermission: async () => false,
    }),
    useCodeScanner: () => null,
    useCameraFormat: () => null,
    sortFormats: (a) => a,
    Templates: {},
};
