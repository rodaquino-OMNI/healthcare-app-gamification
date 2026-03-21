'use strict';
module.exports = {
    __esModule: true,
    useFonts: jest.fn(() => [true, null]),
    loadAsync: jest.fn(() => Promise.resolve()),
    isLoaded: jest.fn(() => true),
    isLoading: jest.fn(() => false),
};
