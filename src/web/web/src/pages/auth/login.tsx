import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'design-system/components/Button/Button';
import { Input } from 'design-system/components/Input/Input';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { WEB_AUTH_ROUTES } from 'shared/constants/routes';
import { loginValidationSchema } from 'shared/utils/validation';

import { useAuth } from '@/hooks/useAuth';
import { useSafeNavRouter as useRouter } from '@/hooks/useSafeRouter';
import { AuthLayout } from '@/layouts/AuthLayout';

interface LoginFormData {
    email: string;
    password: string;
}

export const getServerSideProps = () => ({ props: {} });

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

    const onSubmit = async (data: LoginFormData): Promise<void> => {
        setSubmitError(null);
        try {
            await login(data);
            // Navigation is handled by the useAuth hook
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setSubmitError(errorObj.response?.data?.message || 'Login failed. Please check your credentials.');
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

            <form
                onSubmit={(e) => {
                    void handleSubmit(onSubmit)(e);
                }}
            >
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
                    </Box>
                )}

                <Box marginBottom="md">
                    <Button
                        variant="primary"
                        journey="health"
                        loading={isLoading}
                        disabled={isLoading}
                        onPress={() => {
                            void handleSubmit(onSubmit)();
                        }}
                    >
                        Sign In
                    </Button>
                </Box>

                <Box display="flex" justifyContent="center">
                    <Text fontSize="sm">
                        Don&apos;t have an account?{' '}
                        <Text
                            as="span"
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
