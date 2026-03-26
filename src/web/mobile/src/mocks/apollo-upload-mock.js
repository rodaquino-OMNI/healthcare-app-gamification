/**
 * DEMO_MODE mock for apollo-upload-client/createUploadLink.mjs
 * v19 renamed to UploadHttpLink — this stub satisfies the old import path.
 */
const { HttpLink } = require('@apollo/client');
module.exports = function createUploadLink(options) {
    return new HttpLink(options);
};
module.exports.default = module.exports;
