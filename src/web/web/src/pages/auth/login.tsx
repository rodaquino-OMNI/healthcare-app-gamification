import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { loginValidationSchema } from 'src/web/shared/utils/validation';
import { useAuth } from 'src/web/web/src/hooks/useAuth';
import AuthLayout from 'src/web/web/src/layouts/AuthLayout';
import { WEB_AUTH_ROUTES } from 'src/web/shared/constants/routes';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Input } from 'src/web/design-system/src/components/Input/Input';
import Box from 'src/web/design-system/src/primitives/Box/Box';
import Text from 'src/web/design-system/src/primitives/Text/Text';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    try {
      await login(data);
      // Navigation is handled by the useAuth hook
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  // Display either form validation errors or API errors
  const displayError = submitError || authError;

  return (
    <AuthLayout>
      <Box marginBottom="lg">
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Sign In to AUSTA
        </Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom="md">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                placeholder="Email"
                aria-label="Email"
                journey="health"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.email && (
            <Text color="semantic.error" fontSize="sm" marginTop="xs">
              {errors.email.message}
            </Text>
          )}
        </Box>

        <Box marginBottom="md">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                placeholder="Password"
                aria-label="Password"
                journey="health"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.password && (
            <Text color="semantic.error" fontSize="sm" marginTop="xs">
              {errors.password.message}
            </Text>
          )}
        </Box>

        {displayError && (
          <Box marginBottom="md">
            <Text color="semantic.error" fontSize="sm">
              {displayError}
            </Text>
          )}

        <Box marginBottom="md">
          <Button
            variant="primary"
            journey="health"
            loading={isLoading}
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            Sign In
          </Button>
        </Box>

        <Box display="flex" justifyContent="center">
          <Text fontSize="sm">
            Don't have an account?{' '}
            <Text
              as="a"
              fontSize="sm"
              color="journeys.health.primary"
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(WEB_AUTH_ROUTES.REGISTER)}
            >
              Register
            </Text>
          </Text>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default Login;