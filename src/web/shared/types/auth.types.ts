/**
 * Authentication types for the AUSTA SuperApp
 * Defines data structures for user authentication and session management.
 */

/**
 * Represents an authentication session with tokens and expiration
 */
/**
 * Represents a user profile attached to a session
 */
export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
}

export interface AuthSession {
  /**
   * JWT access token for API authorization
   */
  accessToken: string;

  /**
   * JWT refresh token used to obtain a new access token when expired
   */
  refreshToken: string;

  /**
   * Timestamp (in milliseconds since epoch) when the access token expires
   */
  expiresAt: number;

  /**
   * Convenience user ID extracted from the JWT
   */
  userId?: string;

  /**
   * User profile data
   */
  user?: AuthUser;
}

/**
 * Represents the current state of authentication in the application
 */
export interface AuthState {
  /**
   * The current authentication session if available, null otherwise
   */
  session: AuthSession | null;
  
  /**
   * Current authentication status:
   * - 'authenticated': User is logged in with a valid session
   * - 'loading': Authentication state is being determined
   * - 'unauthenticated': User is not logged in
   */
  status: 'authenticated' | 'loading' | 'unauthenticated';
}