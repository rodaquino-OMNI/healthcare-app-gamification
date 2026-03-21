/**
 * Encrypted storage wrapper using MMKV for sensitive data.
 * Replaces AsyncStorage for auth tokens and credentials.
 *
 * MASVS-STORAGE-1: Sensitive data must not be stored in plaintext.
 * MMKV provides AES-128/256 encryption at the native layer with
 * mmap-based I/O for sub-millisecond read/write performance.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

/**
 * Encrypted MMKV instance for auth tokens and sensitive data.
 * The encryptionKey should ideally come from the device keystore
 * (Android Keystore / iOS Keychain). For MMKV v2.x the encryption
 * key is a string that MMKV uses internally for AES encryption.
 *
 * NOTE: In a production environment, derive this key from a
 * hardware-backed keystore via react-native-keychain or expo-secure-store.
 * For now we use a static ID-based encryption which still encrypts
 * at-rest storage (significantly better than plaintext AsyncStorage).
 */
const secureInstance = new MMKV({
    id: 'austa-secure-storage',
    encryptionKey: 'austa-device-key-v1',
});

/** Keys used for auth token storage */
const TOKEN_KEYS = {
    AUTH_SESSION: '@AUSTA:auth_session',
    MIGRATION_DONE: '@AUSTA:mmkv_migrated',
} as const;

/**
 * Secure storage interface for encrypted key-value operations.
 * Drop-in replacement for AsyncStorage with synchronous API.
 */
export const SecureStorage = {
    /** Get a string value by key. Returns null if not found. */
    getString(key: string): string | null {
        const value = secureInstance.getString(key);
        return value === undefined ? null : value;
    },

    /** Set a string value by key. */
    setString(key: string, value: string): void {
        secureInstance.set(key, value);
    },

    /** Delete a key from storage. */
    delete(key: string): void {
        secureInstance.delete(key);
    },

    /** Check if a key exists. */
    contains(key: string): boolean {
        return secureInstance.contains(key);
    },

    /** Clear all data in the encrypted storage. */
    clearAll(): void {
        secureInstance.clearAll();
    },

    /** Get all keys in the encrypted storage. */
    getAllKeys(): string[] {
        return secureInstance.getAllKeys();
    },
};

/**
 * Dedicated auth token storage with typed access.
 * Use this instead of raw SecureStorage for auth operations.
 */
export const secureTokenStorage = {
    /** Get the persisted auth session JSON string. */
    getSession(): string | null {
        return SecureStorage.getString(TOKEN_KEYS.AUTH_SESSION);
    },

    /** Persist the auth session as a JSON string. */
    setSession(sessionJson: string): void {
        SecureStorage.setString(TOKEN_KEYS.AUTH_SESSION, sessionJson);
    },

    /** Remove the persisted auth session. */
    removeSession(): void {
        SecureStorage.delete(TOKEN_KEYS.AUTH_SESSION);
    },
};

/**
 * One-time migration from AsyncStorage to encrypted MMKV.
 * Copies the auth session and removes it from AsyncStorage.
 * Safe to call multiple times — skips if already migrated.
 *
 * Call this early in the app lifecycle (e.g., App.tsx or AuthProvider).
 */
export async function migrateFromAsyncStorage(): Promise<void> {
    // Skip if migration was already performed
    if (SecureStorage.contains(TOKEN_KEYS.MIGRATION_DONE)) {
        return;
    }

    try {
        // Migrate auth session
        const session = await AsyncStorage.getItem(TOKEN_KEYS.AUTH_SESSION);
        if (session) {
            SecureStorage.setString(TOKEN_KEYS.AUTH_SESSION, session);
            await AsyncStorage.removeItem(TOKEN_KEYS.AUTH_SESSION);
        }

        // Mark migration as complete
        SecureStorage.setString(TOKEN_KEYS.MIGRATION_DONE, 'true');
    } catch (error) {
        // Log but don't throw — the app can still function with AsyncStorage
        // until migration succeeds on the next launch
        console.error('[SecureStorage] Migration from AsyncStorage failed:', error);
    }
}

export default SecureStorage;
