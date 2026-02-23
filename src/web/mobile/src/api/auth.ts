/**
 * Authentication API module for the AUSTA SuperApp mobile application
 * Provides functions for user authentication, registration, and session management
 * that implement the Authentication System (F-201) requirement.
 */

import { AuthSession } from '@shared/types/auth.types';
import { API_BASE_URL } from '@shared/constants/api';
import fetch from 'cross-fetch'; // v3.1.5

/**
 * Authenticates a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to an AuthSession object
 * @throws Error if authentication fails
 */
export async function login(email: string, password: string): Promise<AuthSession> {
  // 1. Construct the API endpoint URL for login
  const url = `${API_BASE_URL}/auth/login`;
  
  // 2. Send a POST request to the login endpoint with the email and password
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  // 3. Parse the JSON response
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    const message = data.message || 'Authentication failed';
    throw new Error(message);
  }
  
  // 4. Return the authentication session
  return data.session;
}

/**
 * Registers a new user
 * @param userData - Object containing user registration data (name, email, password, etc.)
 * @returns Promise resolving to an AuthSession object
 * @throws Error if registration fails
 */
export async function register(userData: object): Promise<AuthSession> {
  // 1. Construct the API endpoint URL for registration
  const url = `${API_BASE_URL}/auth/register`;
  
  // 2. Send a POST request to the registration endpoint with the user data
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  // 3. Parse the JSON response
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    const message = data.message || 'Registration failed';
    throw new Error(message);
  }
  
  // 4. Return the authentication session
  return data.session;
}

/**
 * Verifies a multi-factor authentication code
 * @param code - The MFA verification code entered by the user
 * @param tempToken - Temporary token received after initial authentication
 * @returns Promise resolving to an AuthSession object
 * @throws Error if verification fails
 */
export async function verifyMfa(code: string, tempToken: string): Promise<AuthSession> {
  // 1. Construct the API endpoint URL for MFA verification
  const url = `${API_BASE_URL}/auth/verify-mfa`;
  
  // 2. Send a POST request to the MFA verification endpoint with the code and temporary token
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tempToken}`
    },
    body: JSON.stringify({ code })
  });
  
  // 3. Parse the JSON response
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    const message = data.message || 'MFA verification failed';
    throw new Error(message);
  }
  
  // 4. Return the authentication session
  return data.session;
}

/**
 * Refreshes the authentication token
 * @returns Promise resolving to a new AuthSession object
 * @throws Error if token refresh fails
 */
export async function refreshToken(): Promise<AuthSession> {
  // 1. Construct the API endpoint URL for token refresh
  const url = `${API_BASE_URL}/auth/refresh`;
  
  // 2. Send a POST request to the token refresh endpoint
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Include cookies for the refresh token
  });
  
  // 3. Parse the JSON response
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    const message = data.message || 'Token refresh failed';
    throw new Error(message);
  }
  
  // 4. Return the new authentication session
  return data.session;
}

/**
 * Authenticates a user with a social provider (OAuth 2.0)
 * @param provider - The social provider (e.g., 'google', 'apple', 'facebook')
 * @param tokenData - Provider-specific token data (contains tokens or authorization codes)
 * @returns Promise resolving to an AuthSession object
 * @throws Error if social authentication fails
 */
export async function socialLogin(
  provider: string,
  tokenData: object
): Promise<AuthSession> {
  // 1. Construct the API endpoint URL for social login
  const url = `${API_BASE_URL}/auth/social/${provider}`;
  
  // 2. Send a POST request to the social login endpoint with the provider and token data
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tokenData)
  });
  
  // 3. Parse the JSON response
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    const message = data.message || 'Social authentication failed';
    throw new Error(message);
  }
  
  // 4. Return the authentication session
  return data.session;
}