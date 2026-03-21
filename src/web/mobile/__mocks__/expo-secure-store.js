'use strict';
const store = {};
module.exports = {
    __esModule: true,
    getItemAsync: jest.fn((key) => Promise.resolve(store[key] || null)),
    setItemAsync: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((key) => {
        delete store[key];
        return Promise.resolve();
    }),
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
    AFTER_FIRST_UNLOCK: 1,
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 2,
    ALWAYS: 3,
    ALWAYS_THIS_DEVICE_ONLY: 4,
    WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 5,
    WHEN_UNLOCKED: 6,
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 7,
};
