// DEMO_MODE — Mock @react-native-community/netinfo for Expo Go
const state = {
    type: 'wifi',
    isConnected: true,
    isInternetReachable: true,
    details: { isConnectionExpensive: false },
};

const NetInfo = {
    fetch: async () => state,
    refresh: async () => state,
    addEventListener: () => () => {},
    useNetInfo: () => state,
};
module.exports = NetInfo;
module.exports.default = NetInfo;
