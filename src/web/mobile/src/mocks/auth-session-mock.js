/**
 * DEMO_MODE mock for expo-auth-session
 * Provides stub implementations so the JS bundle can load in simulator.
 */
module.exports = {
    makeRedirectUri: () => 'exp://localhost:8081',
    useAuthRequest: () => [null, null, () => Promise.resolve({ type: 'dismiss' })],
    useAutoDiscovery: () => null,
    ResponseType: { Code: 'code', Token: 'token' },
    AuthSessionResult: {},
    startAsync: () => Promise.resolve({ type: 'dismiss' }),
    fetchDiscoveryAsync: () => Promise.resolve({}),
};
