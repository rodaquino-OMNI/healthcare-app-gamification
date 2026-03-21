import { NavigationContainer } from '@react-navigation/native'; // v6.1.7
import React from 'react'; // v18.2.0

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useAuth } from '../hooks/useAuth';

/**
 * Determines the navigation structure based on the authentication status.
 * @returns {JSX.Element} Either the AuthNavigator or MainNavigator based on authentication status.
 */
export const RootNavigator: React.FC = () => {
    // LD1: Uses the useAuth hook to get the authentication state.
    const { isAuthenticated } = useAuth();

    // LD1: Renders the AuthNavigator if the user is not authenticated.
    if (!isAuthenticated) {
        // IE1: The AuthNavigator component handles the authentication flow.
        return (
            <NavigationContainer>
                <AuthNavigator />
            </NavigationContainer>
        );
    }

    // LD1: Renders the MainNavigator if the user is authenticated.
    return (
        <NavigationContainer>
            <MainNavigator />
        </NavigationContainer>
    );
};
