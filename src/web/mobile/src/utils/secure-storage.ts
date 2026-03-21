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
import * as SecureStore from 'expo-secure-store';
import type { MMKV as MMKVInstance } from 'react-native-mmkv';

interface MMKVConfig {
    id: string;
    encryptionKey?: string;
}

// react-native-mmkv v4.x exports MMKV as type-only in declarations but the
// JS module exports a constructable class. Use require() + cast for the constructor.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MMKVConstructor = (require('react-native-mmkv') as { MMKV: new (config: MMKVConfig) => MMKVInstance }).MMKV;

/**
 * Keychain-backed MMKV encryption key.
 *
 * MASVS-STORAGE-1 / MASVS-CRYPTO-1: The encryption key is derived
 * from the iOS Keychain / Android Keystore via expo-secure-store,
 * ensuring it is hardware-protected and never exposed in plaintext.
 *
 * On first launch a cryptographically random 256-bit key is generated
 * and persisted in the Keychain with WHEN_UNLOCKED_THIS_DEVICE_ONLY
 * accessibility, meaning it cannot be extracted from backups.
 */
const MMKV_ENCRYPTION_KEY_ID = 'austa-mmkv-encryption-key';

async function getOrCreateEncryptionKey(): Promise<string> {
    const existing = await SecureStore.getItemAsync(MMKV_ENCRYPTION_KEY_ID);
    if (existing) {
        return existing;
    }

    // Generate a random 256-bit key for first-time setup
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const newKey = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

    await SecureStore.setItemAsync(MMKV_ENCRYPTION_KEY_ID, newKey, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return newKey;
}

let secureInstance: MMKVInstance | null = null;

/**
 * Initialise the encrypted MMKV instance with a Keychain-derived key.
 * Must be called early in the app lifecycle (e.g. App.tsx) before any
 * storage access. Safe to call multiple times — subsequent calls are no-ops.
 */
export async function initSecureStorage(): Promise<void> {
    if (secureInstance) {
        return;
    }
    const encryptionKey = await getOrCreateEncryptionKey();
    secureInstance = new MMKVConstructor({ id: 'austa-secure-storage', encryptionKey });
}

function getInstance(): MMKVInstance {
    if (!secureInstance) {
        // Fallback: create without encryption if init hasn't been called yet.
        // This handles the edge case where code accesses storage before async init.
        console.warn('[SecureStorage] Accessed before initSecureStorage(). Using unencrypted fallback.');
        secureInstance = new MMKVConstructor({ id: 'austa-secure-storage' });
    }
    return secureInstance;
}

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
        const value = getInstance().getString(key);
        return value === undefined ? null : value;
    },

    /** Set a string value by key. */
    setString(key: string, value: string): void {
        getInstance().set(key, value);
    },

    /** Delete a key from storage. */
    delete(key: string): void {
        getInstance().remove(key);
    },

    /** Check if a key exists. */
    contains(key: string): boolean {
        return getInstance().contains(key);
    },

    /** Clear all data in the encrypted storage. */
    clearAll(): void {
        getInstance().clearAll();
    },

    /** Get all keys in the encrypted storage. */
    getAllKeys(): string[] {
        return getInstance().getAllKeys();
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
    // Ensure encrypted storage is initialised before migration
    await initSecureStorage();

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
        console.error('[SecureStorage] Migration from AsyncStorage failed:', String(error));
    }
}

export default SecureStorage;
