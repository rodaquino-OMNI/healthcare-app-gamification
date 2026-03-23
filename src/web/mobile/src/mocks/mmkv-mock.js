// DEMO_MODE — Mock MMKV for simulator demo (native module disabled)
const store = {};

class MMKV {
    constructor() {}
    getString(key) {
        return store[key];
    }
    set(key, value) {
        store[key] = String(value);
    }
    remove(key) {
        delete store[key];
    }
    contains(key) {
        return key in store;
    }
    clearAll() {
        Object.keys(store).forEach((k) => delete store[k]);
    }
    getAllKeys() {
        return Object.keys(store);
    }
}

module.exports = { MMKV };
