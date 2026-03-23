// DEMO_MODE — Mock react-native-device-info for Expo Go (native module not available)
module.exports = {
    default: {
        isEmulator: async () => true,
        isRooted: async () => false,
        isJailBroken: async () => false,
        getDeviceId: () => 'simulator',
        getUniqueId: async () => 'demo-device-001',
        getBrand: () => 'Apple',
        getModel: () => 'iPhone Simulator',
        getSystemVersion: () => '26.0',
        getVersion: () => '1.0.0',
        getBuildNumber: () => '1',
    },
};
