import { API_BASE_URL } from 'shared/constants/api';
import { AuthSession } from 'shared/types/auth.types';

import { restClient as client } from '@/api/client';

/** User profile data returned by the profile endpoint */
export interface UserProfile {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
    dob?: string;
    birthDate?: string;
    avatarUrl?: string;
    language?: string;
    notificationsEnabled?: boolean;
    createdAt?: string;
    [key: string]: unknown;
}

/** Data for registering a new user. */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
    birthDate?: string;
    acceptedTerms: boolean;
}

/** Token data for social (OAuth 2.0) login. */
export interface SocialTokenData {
    idToken?: string;
    accessToken?: string;
    authorizationCode?: string;
    provider: string;
}

/** Data for updating the user's profile. */
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

/**
 * Authenticates a user with email and password.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns A promise that resolves with the authentication session data
 */
export const login = async (email: string, password: string): Promise<AuthSession> => {
    const response = await client.post<AuthSession>(`${API_BASE_URL}/auth/login`, { email, password });

    return response.data;
};

/**
 * Logs out the current user.
 *
 * @returns A promise that resolves when the logout is complete
 */
export const logout = async (): Promise<void> => {
    await client.post(`${API_BASE_URL}/auth/logout`);
};

/**
 * Retrieves the profile of the currently authenticated user.
 *
 * @returns A promise that resolves with the user profile data
 */
export const getProfile = async (): Promise<UserProfile> => {
    const response = await client.get<UserProfile>(`${API_BASE_URL}/auth/profile`);

    return response.data;
};

/**
 * Changes the password for the currently authenticated user.
 *
 * @param currentPassword - The user's current password
 * @param newPassword - The desired new password
 * @returns A promise that resolves when the password has been changed
 */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    await client.put(`${API_BASE_URL}/auth/change-password`, {
        currentPassword,
        newPassword,
    });
};

/**
 * Enables two-factor authentication for the current user.
 *
 * @returns A promise that resolves with the QR code and secret for 2FA setup
 */
export const enable2FA = async (): Promise<{
    qrCode?: string;
    secret?: string;
}> => {
    const response = await client.post<{
        qrCode?: string;
        secret?: string;
    }>(`${API_BASE_URL}/auth/2fa/enable`);

    return response.data;
};

/**
 * Disables two-factor authentication for the current user.
 *
 * @returns A promise that resolves when 2FA has been disabled
 */
export const disable2FA = async (): Promise<void> => {
    await client.post(`${API_BASE_URL}/auth/2fa/disable`);
};

/**
 * Configures the two-factor authentication method for the current user.
 *
 * @param method - The 2FA method to configure (e.g., 'sms', 'authenticator')
 * @param phone - Optional phone number required for SMS-based 2FA
 * @returns A promise that resolves when 2FA has been configured
 */
export const configure2FA = async (method: string, phone?: string): Promise<void> => {
    await client.put(`${API_BASE_URL}/auth/2fa/configure`, {
        method,
        phone,
    });
};

/**
 * Permanently deletes the currently authenticated user's account.
 *
 * @param password - The user's password for verification
 * @param reason - Optional reason for account deletion
 * @returns A promise that resolves when the account has been deleted
 */
export const deleteAccount = async (password: string, reason?: string): Promise<void> => {
    await client.delete(`${API_BASE_URL}/users/me`, {
        data: { password, reason },
    });
};

/**
 * Registers a new user account.
 *
 * @param userData - Registration data (name, email, password, etc.)
 * @returns A promise that resolves with the authentication session data
 */
export const register = async (userData: RegisterData): Promise<AuthSession> => {
    const response = await client.post<AuthSession>(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};

/**
 * Verifies a multi-factor authentication code.
 *
 * @param code - The MFA verification code entered by the user
 * @param tempToken - Temporary token received after initial authentication
 * @returns A promise that resolves with the authentication session data
 */
export const verifyMfa = async (code: string, tempToken: string): Promise<AuthSession> => {
    const response = await client.post<AuthSession>(
        `${API_BASE_URL}/auth/verify-mfa`,
        { code },
        { headers: { Authorization: `Bearer ${tempToken}` } }
    );
    return response.data;
};

/**
 * Refreshes the authentication token using the stored refresh token.
 *
 * @returns A promise that resolves with a new authentication session
 */
export const refreshToken = async (): Promise<AuthSession> => {
    const response = await client.post<AuthSession>(`${API_BASE_URL}/auth/refresh`);
    return response.data;
};

/**
 * Authenticates a user with a social provider (OAuth 2.0).
 *
 * @param provider - The social provider (e.g., 'google', 'apple', 'facebook')
 * @param tokenData - Provider-specific token data
 * @returns A promise that resolves with the authentication session data
 */
export const socialLogin = async (provider: string, tokenData: SocialTokenData): Promise<AuthSession> => {
    const response = await client.post<AuthSession>(`${API_BASE_URL}/auth/social/${provider}`, tokenData);
    return response.data;
};

/**
 * Sends a password-reset email to the given address.
 *
 * @param email - The email address to send the reset link to
 * @returns A promise that resolves with a confirmation message
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await client.post<{ message: string }>(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
};

/**
 * Verifies an email address using a one-time token.
 *
 * @param token - The email verification token
 * @returns A promise that resolves with the verification status
 */
export const verifyEmail = async (token: string): Promise<{ verified: boolean }> => {
    const response = await client.post<{ verified: boolean }>(`${API_BASE_URL}/auth/verify-email`, { token });
    return response.data;
};

/**
 * Sets a new password using a reset token.
 *
 * @param token - The password-reset token
 * @param newPassword - The new password to set
 * @returns A promise that resolves with a new authentication session
 */
export const setPassword = async (token: string, newPassword: string): Promise<AuthSession> => {
    const response = await client.post<AuthSession>(`${API_BASE_URL}/auth/set-password`, { token, newPassword });
    return response.data;
};

/**
 * Updates the authenticated user's profile.
 *
 * @param updates - The profile fields to update
 * @returns A promise that resolves with the updated profile
 */
export const updateProfile = async (updates: UpdateProfileData): Promise<UserProfile> => {
    const response = await client.put<UserProfile>(`${API_BASE_URL}/auth/profile`, updates);
    return response.data;
};

/**
 * Registers a biometric public key with the server.
 *
 * @param publicKey - The public key for biometric authentication
 * @returns A promise that resolves with the registration status
 */
export const registerBiometricKey = async (publicKey: string): Promise<{ registered: boolean }> => {
    const response = await client.post<{ registered: boolean }>(`${API_BASE_URL}/auth/biometric/register`, {
        publicKey,
    });
    return response.data;
};

/**
 * Requests a one-time challenge from the server for biometric login.
 *
 * @returns A promise that resolves with a challenge string
 */
export const getBiometricChallenge = async (): Promise<{ challenge: string }> => {
    const response = await client.get<{ challenge: string }>(`${API_BASE_URL}/auth/biometric/challenge`);
    return response.data;
};

/**
 * Verifies a biometric signature against a previously issued challenge.
 *
 * @param signature - The biometric signature
 * @param challenge - The original challenge string
 * @returns A promise that resolves with the authentication session data
 */
export const verifyBiometricSignature = async (signature: string, challenge: string): Promise<AuthSession> => {
    const response = await client.post<AuthSession>(`${API_BASE_URL}/auth/biometric/verify`, { signature, challenge });
    return response.data;
};

/** Session entry returned by the active-sessions endpoint. */
export interface SessionEntry {
    id: string;
    device: string;
    ip: string;
    lastActiveAt: string;
    current: boolean;
}

/**
 * Retrieves the list of active sessions for the authenticated user.
 *
 * @returns A promise that resolves with an array of active session entries
 */
export const getActiveSessions = async (): Promise<SessionEntry[]> => {
    const response = await client.get<SessionEntry[]>(`${API_BASE_URL}/auth/sessions`);
    return response.data;
};

/**
 * Revokes (terminates) a specific session by its identifier.
 *
 * @param sessionId - The ID of the session to revoke
 * @returns A promise that resolves when the session has been revoked
 */
export const revokeSession = async (sessionId: string): Promise<void> => {
    await client.delete(`${API_BASE_URL}/auth/sessions/${sessionId}`);
};
