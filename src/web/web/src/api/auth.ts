/* eslint-disable @typescript-eslint/no-unsafe-return */
import { API_BASE_URL } from 'shared/constants/api';
import { AuthSession } from 'shared/types/auth.types';

import { restClient as client } from './client';

/**
 * Authenticates a user with email and password.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns A promise that resolves with the authentication session data
 */
export const login = async (email: string, password: string): Promise<AuthSession> => {
    const response = await client.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
    });

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
export const getProfile = async (): Promise<unknown> => {
    const response = await client.get(`${API_BASE_URL}/auth/profile`);

    return response.data;
};

/**
 * Changes the password for the currently authenticated user.
 *
 * @param currentPassword - The user's current password
 * @param newPassword - The desired new password
 * @returns A promise that resolves when the password has been changed
 */
// eslint-disable-next-line max-len
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
export const enable2FA = async (): Promise<{ qrCode?: string; secret?: string }> => {
    const response = await client.post(`${API_BASE_URL}/auth/2fa/enable`);

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
