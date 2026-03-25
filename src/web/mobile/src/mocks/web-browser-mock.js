/**
 * DEMO_MODE mock for expo-web-browser
 * Provides stub implementations so the JS bundle can load in simulator.
 */
module.exports = {
    openBrowserAsync: () => Promise.resolve({ type: 'cancel' }),
    openAuthSessionAsync: () => Promise.resolve({ type: 'cancel' }),
    dismissBrowser: () => {},
    dismissAuthSession: () => {},
    maybeCompleteAuthSession: () => ({ type: 'failed' }),
    warmUpAsync: () => Promise.resolve(),
    coolDownAsync: () => Promise.resolve(),
    WebBrowserResultType: { CANCEL: 'cancel', DISMISS: 'dismiss', OPENED: 'opened', LOCKED: 'locked' },
};
