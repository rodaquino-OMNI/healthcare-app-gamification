// DEMO_MODE — Mock react-native-ssl-pinning for Expo Go (native module not available)
module.exports = {
    fetch: (url, options) => globalThis.fetch(url, options),
    getCookies: async () => ({}),
    removeCookies: async () => {},
};
