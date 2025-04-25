import React from 'react'; // v18.2.0
import { createStackNavigator } from '@react-navigation/stack'; // v6.0.0

import Login from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword';
import { MOBILE_AUTH_ROUTES } from 'src/web/shared/constants/routes';

// Create a stack navigator
const Stack = createStackNavigator();

/**
 * A React component that defines the navigation stack for the authentication flow.
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={MOBILE_AUTH_ROUTES.LOGIN}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={MOBILE_AUTH_ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={MOBILE_AUTH_ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={MOBILE_AUTH_ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

/**
 * A React component that renders the navigation stack for the authentication flow.
 */
export const AuthNavigator: React.FC = () => {
  return (
    <AuthStack />
  );
};