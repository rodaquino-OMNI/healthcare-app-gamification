// DEMO_MODE — Mock react-native-biometrics for Expo Go (native module not available)
class ReactNativeBiometrics {
    async isSensorAvailable() {
        return { available: false, biometryType: null };
    }
    async simplePrompt() {
        return { success: false, error: 'Biometrics not available in simulator' };
    }
    async createKeys() {
        return { publicKey: '' };
    }
    async deleteKeys() {
        return { keysDeleted: true };
    }
    async biometricKeysExist() {
        return { keysExist: false };
    }
    async createSignature() {
        return { success: false, signature: '' };
    }
}

module.exports = {
    default: ReactNativeBiometrics,
    ReactNativeBiometrics,
};
