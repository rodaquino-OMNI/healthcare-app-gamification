// DEMO_MODE — Mock @react-native-community/netinfo for Expo Go
const state = {
    type: 'wifi',
    isConnected: true,
    isInternetReachable: true,
    details: { isConnectionExpensive: false },
};

module.exports = {
    default: {
        fetch: async () => state,
        refresh: async () => state,
        addEventListener: () => () => {},
        useNetInfo: () => state,
    },
};
