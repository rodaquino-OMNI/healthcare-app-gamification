'use strict';
module.exports = {
    __esModule: true,
    hideAsync: jest.fn(() => Promise.resolve()),
    preventAutoHideAsync: jest.fn(() => Promise.resolve()),
};
