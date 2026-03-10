/**
 * Mock for apollo-upload-client ESM module.
 * The real module uses ESM (.mjs) which is incompatible with Jest's CJS transform.
 * This mock provides the createUploadLink factory with a no-op implementation.
 */
module.exports = function createUploadLink() {
  return {
    request: () => {},
  };
};
module.exports.default = module.exports;
