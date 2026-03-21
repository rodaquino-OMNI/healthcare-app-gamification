'use strict';
class CodedError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'CodedError';
    }
}
class UnavailabilityError extends CodedError {
    constructor(moduleName, propertyName) {
        super('ERR_UNAVAILABLE', `${moduleName}.${propertyName} is not available`);
        this.name = 'UnavailabilityError';
    }
}
module.exports = {
    __esModule: true,
    CodedError,
    UnavailabilityError,
    requireOptionalNativeModule: jest.fn(() => null),
    requireNativeModule: jest.fn(() => ({})),
    NativeModulesProxy: {},
    EventEmitter: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(() => ({ remove: jest.fn() })),
        removeAllListeners: jest.fn(),
        emit: jest.fn(),
    })),
    Platform: { OS: 'ios' },
};
