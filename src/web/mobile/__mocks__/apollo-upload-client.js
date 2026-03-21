'use strict';
const createUploadLink = jest.fn(() => ({
    request: jest.fn(),
}));
module.exports = createUploadLink;
module.exports.default = createUploadLink;
module.exports.__esModule = true;
