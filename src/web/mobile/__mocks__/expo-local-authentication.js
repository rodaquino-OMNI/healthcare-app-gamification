'use strict';
module.exports = {
    __esModule: true,
    authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
    hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
    isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
    supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1, 2])),
    cancelAuthenticate: jest.fn(),
    getEnrolledLevelAsync: jest.fn(() => Promise.resolve(2)),
    SecurityLevel: { NONE: 0, SECRET: 1, BIOMETRIC: 2 },
    AuthenticationType: { FINGERPRINT: 1, FACIAL_RECOGNITION: 2, IRIS: 3 },
};
