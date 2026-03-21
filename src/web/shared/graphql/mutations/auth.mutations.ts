import { gql } from '@apollo/client'; // @apollo/client v3.7.0 - Used to define GraphQL queries and mutations

/**
 * GraphQL mutation for user login with email and password
 */
export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            accessToken
            refreshToken
            expiresAt
        }
    }
`;

/**
 * GraphQL mutation for user registration
 */
export const REGISTER_MUTATION = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
            accessToken
            refreshToken
            expiresAt
        }
    }
`;

/**
 * GraphQL mutation for user logout
 */
export const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout
    }
`;

/**
 * GraphQL mutation for refreshing authentication tokens
 */
export const REFRESH_TOKEN_MUTATION = gql`
    mutation RefreshToken {
        refreshToken {
            accessToken
            refreshToken
            expiresAt
        }
    }
`;

/**
 * GraphQL mutation for verifying MFA code
 */
export const VERIFY_MFA_MUTATION = gql`
    mutation VerifyMFA($code: String!) {
        verifyMFA(code: $code) {
            accessToken
            refreshToken
            expiresAt
        }
    }
`;

/**
 * GraphQL mutation for requesting password reset
 */
export const REQUEST_PASSWORD_RESET_MUTATION = gql`
    mutation RequestPasswordReset($email: String!) {
        requestPasswordReset(email: $email)
    }
`;

/**
 * GraphQL mutation for resetting password
 */
export const RESET_PASSWORD_MUTATION = gql`
    mutation ResetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password)
    }
`;

/**
 * GraphQL mutation for updating user profile
 */
export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($name: String, $email: String) {
        updateUser(name: $name, email: $email) {
            id
            name
            email
        }
    }
`;

/**
 * GraphQL mutation for changing user password
 */
export const CHANGE_PASSWORD_MUTATION = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }
`;

/**
 * GraphQL mutation for setting up MFA
 */
export const SETUP_MFA_MUTATION = gql`
    mutation SetupMFA {
        setupMFA
    }
`;

/**
 * GraphQL mutation for disabling MFA
 */
export const DISABLE_MFA_MUTATION = gql`
    mutation DisableMFA {
        disableMFA
    }
`;

/**
 * GraphQL mutation for social login
 */
export const SOCIAL_LOGIN_MUTATION = gql`
    mutation SocialLogin($provider: String!, $token: String!) {
        socialLogin(provider: $provider, token: $token) {
            accessToken
            refreshToken
            expiresAt
        }
    }
`;

/**
 * GraphQL mutation for biometric login
 */
export const BIOMETRIC_LOGIN_MUTATION = gql`
    mutation BiometricLogin($biometricData: String!) {
        biometricLogin(biometricData: $biometricData) {
            accessToken
            refreshToken
            expiresAt
        }
    }
`;
