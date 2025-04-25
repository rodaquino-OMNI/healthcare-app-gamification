import { AuthSession } from 'src/web/shared/types/auth.types';
import { API_BASE_URL } from 'src/web/shared/constants/api';
import client from 'src/web/mobile/src/api/client';

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
export const getProfile = async (): Promise<any> => {
  const response = await client.get(`${API_BASE_URL}/auth/profile`);
  
  return response.data;
};