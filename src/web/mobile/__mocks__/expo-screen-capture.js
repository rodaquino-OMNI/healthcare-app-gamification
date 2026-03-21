'use strict';
module.exports = {
    __esModule: true,
    preventScreenCaptureAsync: jest.fn(() => Promise.resolve()),
    allowScreenCaptureAsync: jest.fn(() => Promise.resolve()),
    usePreventScreenCapture: jest.fn(),
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
    addScreenshotListener: jest.fn(() => ({ remove: jest.fn() })),
};
