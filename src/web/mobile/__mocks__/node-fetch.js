'use strict';
const fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob()),
        headers: new Map(),
    })
);
fetch.default = fetch;
module.exports = fetch;
module.exports.default = fetch;
module.exports.__esModule = true;
module.exports.Headers = jest.fn();
module.exports.Request = jest.fn();
module.exports.Response = jest.fn();
