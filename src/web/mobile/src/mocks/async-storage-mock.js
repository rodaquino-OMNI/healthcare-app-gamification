// DEMO_MODE — Mock @react-native-async-storage/async-storage for Expo Go
const store = new Map();

module.exports = {
    default: {
        getItem: async (key) => store.get(key) ?? null,
        setItem: async (key, value) => {
            store.set(key, value);
        },
        removeItem: async (key) => {
            store.delete(key);
        },
        clear: async () => {
            store.clear();
        },
        getAllKeys: async () => [...store.keys()],
        multiGet: async (keys) => keys.map((k) => [k, store.get(k) ?? null]),
        multiSet: async (pairs) => {
            pairs.forEach(([k, v]) => store.set(k, v));
        },
        multiRemove: async (keys) => {
            keys.forEach((k) => store.delete(k));
        },
    },
};
