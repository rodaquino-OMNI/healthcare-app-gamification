/**
 * Manual mock for react-native-mmkv
 * Used as a fallback when the jest.mock() in jest.setup.js
 * does not intercept (e.g. manual imports via moduleNameMapper).
 */
const storage = {};

class MMKV {
  constructor() {
    this._store = { ...storage };
  }

  set(key, value) {
    this._store[key] = value;
  }

  getString(key) {
    const val = this._store[key];
    return typeof val === 'string' ? val : undefined;
  }

  getNumber(key) {
    const val = this._store[key];
    return typeof val === 'number' ? val : undefined;
  }

  getBoolean(key) {
    const val = this._store[key];
    return typeof val === 'boolean' ? val : undefined;
  }

  contains(key) {
    return key in this._store;
  }

  delete(key) {
    delete this._store[key];
  }

  clearAll() {
    this._store = {};
  }

  getAllKeys() {
    return Object.keys(this._store);
  }
}

module.exports = { MMKV };
