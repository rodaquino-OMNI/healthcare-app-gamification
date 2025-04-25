import React from 'react';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { useAuth } from '../hooks/useAuth';
import { MOBILE_AUTH_ROUTES } from 'src/web/shared/constants/routes';
import { Input } from 'src/web/design-system/src/components/Input/Input';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { LoadingIndicator } from '../components/shared/LoadingIndicator';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';

/**
 * LoginScreen provides the user interface for the login screen, allowing users
 * to authenticate with their email and password.
 * 
 * It handles form input, validation, and API calls to the authentication service
 * as required by the Authentication System (F-201) specification.
 */
const LoginScreen = () => {
  // Get navigation and auth hooks
  const navigation = useNavigation();
  const { signIn } = useAuth();
  
  // Form validation schema using yup
  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });
  
  // Initialize form handling with formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Attempt to sign in with provided credentials
        await signIn(values.email, values.password);
        // Navigation after successful login is handled by the auth context
      } catch (error) {
        // Handle login error
        formik.setErrors({
          email: 'Invalid email or password',
        });
      }
    },
  });
  
  return (
    <Box padding="lg" backgroundColor="neutral.white" flex={1} justifyContent="center">
      {/* Header section */}
      <Box marginBottom="xl" alignItems="center">
        <Text fontSize="3xl" fontWeight="bold">
          AUSTA
        </Text>
        <Text fontSize="lg" marginTop="md">
          Log in to your account
        </Text>
      </Box>
      
      {/* Email input field */}
      <Box marginBottom="md">
        <Text fontWeight="medium" marginBottom="xs">
          Email
        </Text>
        <Input
          value={formik.values.email}
          onChange={formik.handleChange('email')}
          placeholder="Enter your email"
          aria-label="Email"
          type="email"
        />
        {formik.touched.email && formik.errors.email && (
          <Text color="semantic.error" fontSize="sm" marginTop="xs">
            {formik.errors.email}
          </Text>
        )}
      </Box>
      
      {/* Password input field */}
      <Box marginBottom="lg">
        <Text fontWeight="medium" marginBottom="xs">
          Password
        </Text>
        <Input
          value={formik.values.password}
          onChange={formik.handleChange('password')}
          placeholder="Enter your password"
          aria-label="Password"
          type="password"
        />
        {formik.touched.password && formik.errors.password && (
          <Text color="semantic.error" fontSize="sm" marginTop="xs">
            {formik.errors.password}
          </Text>
        )}
      </Box>
      
      {/* Login button */}
      <Box marginBottom="lg">
        <Button
          onPress={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
          journey="health"
        >
          Log In
        </Button>
      </Box>
      
      {/* Forgot password link */}
      <Box alignItems="center" marginBottom="md">
        <Button
          onPress={() => navigation.navigate(MOBILE_AUTH_ROUTES.FORGOT_PASSWORD)}
          variant="tertiary"
          journey="health"
        >
          Forgot Password?
        </Button>
      </Box>
      
      {/* Register account link */}
      <Box flexDirection="row" justifyContent="center" alignItems="center">
        <Text marginRight="sm">
          Don't have an account?
        </Text>
        <Button
          onPress={() => navigation.navigate(MOBILE_AUTH_ROUTES.REGISTER)}
          variant="tertiary"
          journey="health"
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default LoginScreen;