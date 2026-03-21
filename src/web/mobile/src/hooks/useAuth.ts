/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { useContext } from 'react'; // v18.2.0

import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook that provides access to the authentication context.
 *
 * This hook simplifies access to authentication-related state and methods
 * throughout the application. It abstracts the context consumption logic and
 * provides type-safe access to authentication functionality.
 *
 * @returns The authentication context object containing user state and auth methods
 * @throws Error if used outside of AuthProvider
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type inferred
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
