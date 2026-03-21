'use strict';
module.exports = {
    __esModule: true,
    getDocumentAsync: jest.fn(() => Promise.resolve({ type: 'cancel' })),
    DocumentPickerOptions: {},
};
