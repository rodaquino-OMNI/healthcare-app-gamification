/**
 * Authentication API module for the AUSTA SuperApp mobile application.
 * Provides functions for user authentication, registration, session management,
 * and profile operations that implement the Authentication System (F-201) requirement.
 */

import fetch from 'cross-fetch'; // v3.1.5

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.austa.com.br';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    userId: string;
    email?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
    birthDate?: string;
    acceptedTerms: boolean;
}

export interface SocialTokenData {
    idToken?: string;
    accessToken?: string;
    authorizationCode?: string;
    provider: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    birthDate?: string;
    avatarUrl?: string;
    language: string;
    notificationsEnabled: boolean;
    createdAt: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    avatarUrl?: string;
    language?: string;
    notificationsEnabled?: boolean;
    birthDate?: string;
    bloodType?: string;
    allergies?: string;
    chronicConditions?: string[];
    insurance?: {
        provider?: string;
        planNumber?: string;
        groupNumber?: string;
        planType?: string;
        hasInsurance?: boolean;
    };
    address?: {
        cep?: string;
        street?: string;
        number?: string;
        complement?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
    };
    documents?: {
        cpf?: string;
        rg?: string;
        documentType?: string;
        documentUrl?: string;
    };
    emergencyContact?: {
        name?: string;
        phone?: string;
        relationship?: string;
        isPrimary?: boolean;
    };
    biometricEnabled?: boolean;
}

// ---------------------------------------------------------------------------
// Existing functions (fixed: typed params, no `object`)
// ---------------------------------------------------------------------------

/**
 * Authenticates a user with email and password.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to an AuthSession
 * @throws Error if authentication fails
 */
export async function login(email: string, password: string): Promise<AuthSession> {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
    }
    return data.session;
}

/**
 * Registers a new user.
 *
 * @param userData - Registration data (name, email, password, etc.)
 * @returns Promise resolving to an AuthSession
 * @throws Error if registration fails
 */
export async function register(userData: RegisterData): Promise<AuthSession> {
    const url = `${API_BASE_URL}/auth/register`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    return data.session;
}

/**
 * Verifies a multi-factor authentication code.
 *
 * @param code - The MFA verification code entered by the user
 * @param tempToken - Temporary token received after initial authentication
 * @returns Promise resolving to an AuthSession
 * @throws Error if verification fails
 */
export async function verifyMfa(code: string, tempToken: string): Promise<AuthSession> {
    const url = `${API_BASE_URL}/auth/verify-mfa`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'MFA verification failed');
    }
    return data.session;
}

/**
 * Refreshes the authentication token using the stored refresh token cookie.
 *
 * @returns Promise resolving to a new AuthSession
 * @throws Error if token refresh fails
 */
export async function refreshToken(): Promise<AuthSession> {
    const url = `${API_BASE_URL}/auth/refresh`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
    }
    return data.session;
}

/**
 * Authenticates a user with a social provider (OAuth 2.0).
 *
 * @param provider - The social provider (e.g., 'google', 'apple', 'facebook')
 * @param tokenData - Provider-specific token data
 * @returns Promise resolving to an AuthSession
 * @throws Error if social authentication fails
 */
export async function socialLogin(provider: string, tokenData: SocialTokenData): Promise<AuthSession> {
    const url = `${API_BASE_URL}/auth/social/${provider}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Social authentication failed');
    }
    return data.session;
}

// ---------------------------------------------------------------------------
// New functions (7 additions)
// ---------------------------------------------------------------------------

/**
 * Sends a password-reset email to the given address.
 *
 * @param email - The email address to send the reset link to
 * @returns Promise resolving to a confirmation message
 * @throws Error if the request fails
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
    const url = `${API_BASE_URL}/auth/forgot-password`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
    }
    return data;
}

/**
 * Verifies an email address using a one-time token.
 *
 * @param token - The email verification token
 * @returns Promise resolving to the verification status
 * @throws Error if verification fails
 */
export async function verifyEmail(token: string): Promise<{ verified: boolean }> {
    const url = `${API_BASE_URL}/auth/verify-email`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
    }
    return data;
}

/**
 * Sets a new password using a reset token.
 *
 * @param token - The password-reset token
 * @param newPassword - The new password to set
 * @returns Promise resolving to a new AuthSession
 * @throws Error if the request fails
 */
export async function setPassword(token: string, newPassword: string): Promise<AuthSession> {
    const url = `${API_BASE_URL}/auth/set-password`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to set password');
    }
    return data.session;
}

/**
 * Logs out the current user by invalidating the access token server-side.
 *
 * @param accessToken - The current access token to invalidate
 * @throws Error if logout fails
 */
export async function logout(accessToken: string): Promise<void> {
    const url = `${API_BASE_URL}/auth/logout`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
    }
}

/**
 * Fetches the authenticated user's profile.
 *
 * @param accessToken - A valid access token
 * @returns Promise resolving to the user's profile
 * @throws Error if the request fails
 */
export async function getProfile(accessToken: string): Promise<UserProfile> {
    const url = `${API_BASE_URL}/auth/profile`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
    }
    return data;
}

/**
 * Updates the authenticated user's profile.
 *
 * @param accessToken - A valid access token
 * @param updates - The profile fields to update
 * @returns Promise resolving to the updated profile
 * @throws Error if the request fails
 */
export async function updateProfile(accessToken: string, updates: UpdateProfileData): Promise<UserProfile> {
    const url = `${API_BASE_URL}/auth/profile`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
    }
    return data;
}

/**
 * Permanently deletes the authenticated user's account (LGPD right to erasure).
 *
 * @param accessToken - A valid access token
 * @param confirmationCode - A code confirming the user's intent to delete
 * @throws Error if the request fails
 */
export async function deleteAccount(accessToken: string, confirmationCode: string): Promise<void> {
    const url = `${API_BASE_URL}/auth/account`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ confirmationCode }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete account');
    }
}

// ---------------------------------------------------------------------------
// Biometric authentication (challenge-response with keypair)
// ---------------------------------------------------------------------------

/**
 * Registers a biometric public key with the server.
 *
 * @param accessToken - A valid access token
 * @param publicKey - The RSA public key generated by react-native-biometrics
 * @returns Promise resolving to the registration status
 * @throws Error if registration fails
 */
export async function registerBiometricKey(accessToken: string, publicKey: string): Promise<{ registered: boolean }> {
    const url = `${API_BASE_URL}/auth/biometric/register`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ publicKey }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Biometric registration failed');
    }
    return data;
}

/**
 * Requests a one-time challenge from the server for biometric login.
 *
 * @returns Promise resolving to a challenge string
 * @throws Error if the request fails
 */
export async function getBiometricChallenge(): Promise<{ challenge: string }> {
    const url = `${API_BASE_URL}/auth/biometric/challenge`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to get biometric challenge');
    }
    return data;
}

/**
 * Verifies a biometric signature against a previously issued challenge.
 *
 * @param signature - The signature produced by react-native-biometrics
 * @param challenge - The original challenge string
 * @returns Promise resolving to an AuthSession
 * @throws Error if verification fails
 */
export async function verifyBiometricSignature(signature: string, challenge: string): Promise<AuthSession> {
    const url = `${API_BASE_URL}/auth/biometric/verify`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, challenge }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Biometric verification failed');
    }
    return data.session;
}
