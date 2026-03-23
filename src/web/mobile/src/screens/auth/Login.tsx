import { Button } from '@design-system/components/Button/Button';
import { Input } from '@design-system/components/Input';
import { Box } from '@design-system/primitives/Box/Box';
import { Text } from '@design-system/primitives/Text/Text';
import { colors } from '@design-system/tokens/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useAuth } from '@hooks/useAuth';

import { ROUTES } from '../../constants/routes';
import type { AuthNavigationProp } from '../../navigation/types';

/**
 * LoginScreen provides the user interface for the login screen, allowing users
 * to authenticate with their email and password.
 *
 * It handles form input, validation, and API calls to the authentication service
 * as required by the Authentication System (F-201) specification.
 */
const LoginScreen = (): React.ReactElement => {
    // Get navigation and auth hooks
    const navigation = useNavigation<AuthNavigationProp>();
    const { signIn } = useAuth();
    const { t } = useTranslation();
    const [networkError, setNetworkError] = useState(false);

    // Form validation schema using zod
    const validationSchema = z.object({
        email: z.string().min(1, t('common.validation.required')).email(t('common.validation.email')),
        password: z
            .string()
            .min(1, t('common.validation.required'))
            .min(8, t('common.validation.minLength', { count: 8 })),
    });

    type LoginFormData = z.infer<typeof validationSchema>;

    // Initialize form handling with react-hook-form
    const {
        watch,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm<LoginFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const emailValue = watch('email');
    const passwordValue = watch('password');

    const onSubmit = async (values: LoginFormData): Promise<void> => {
        try {
            setNetworkError(false);
            // Attempt to sign in with provided credentials
            await signIn(values.email, values.password);
            // Navigation after successful login is handled by the auth context
        } catch (error: unknown) {
            // Distinguish network errors from credential errors
            const isNetworkErr =
                error instanceof TypeError ||
                (error !== null &&
                    typeof error === 'object' &&
                    'message' in error &&
                    typeof (error as { message: unknown }).message === 'string' &&
                    /network|timeout|abort|ECONNREFUSED/i.test((error as { message: string }).message));

            if (isNetworkErr) {
                setNetworkError(true);
            } else {
                setError('email', {
                    message: t('auth.login.invalidCredentials'),
                });
            }
        }
    };

    return (
        <Box padding="lg" backgroundColor="background.default" flex="1" justifyContent="center">
            {/* Header section */}
            <Box marginBottom="xl" alignItems="center">
                <Text fontSize="3xl" fontWeight="bold">
                    AUSTA
                </Text>
                <Text fontSize="lg" marginTop="md">
                    {t('auth.login.title')}
                </Text>
            </Box>

            {/* Email input field */}
            <Box marginBottom="md">
                <Text fontWeight="medium" marginBottom="xs">
                    {t('common.labels.email')}
                </Text>
                <Input
                    testID="login-email-input"
                    value={emailValue}
                    onChange={handleSubmit(() => {})}
                    placeholder={t('auth.login.emailPlaceholder')}
                    aria-label={t('common.labels.email')}
                    type="email"
                />
                {touchedFields.email && errors.email && (
                    <Text testID="login-error-message" color={colors.semantic.error} fontSize="sm" marginTop="xs">
                        {errors.email.message}
                    </Text>
                )}
            </Box>

            {/* Network error banner */}
            {networkError && (
                <Box
                    data-testid="network-error-message"
                    padding="md"
                    marginBottom="md"
                    borderRadius="md"
                    backgroundColor="background.subtle"
                    role="alert"
                >
                    <Text color={colors.semantic.error} fontSize="sm" textAlign="center">
                        {t('auth.login.networkError')}
                    </Text>
                </Box>
            )}

            {/* Password input field */}
            <Box marginBottom="lg">
                <Text fontWeight="medium" marginBottom="xs">
                    {t('auth.login.password')}
                </Text>
                <Input
                    testID="login-password-input"
                    value={passwordValue}
                    onChange={handleSubmit(() => {})}
                    placeholder={t('auth.login.passwordPlaceholder')}
                    aria-label={t('auth.login.password')}
                    type="password"
                />
                {touchedFields.password && errors.password && (
                    <Text color={colors.semantic.error} fontSize="sm" marginTop="xs">
                        {errors.password.message}
                    </Text>
                )}
            </Box>

            {/* Login button */}
            <Box marginBottom="lg">
                <Button
                    testID="login-submit-button"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    journey="health"
                >
                    {t('auth.login.submit')}
                </Button>
            </Box>

            {/* Forgot password link */}
            <Box alignItems="center" marginBottom="md">
                <Button
                    testID="login-forgot-password"
                    onPress={() => navigation.navigate(ROUTES.AUTH_FORGOT_PASSWORD)}
                    variant="tertiary"
                    journey="health"
                >
                    {t('auth.login.forgotPassword')}
                </Button>
            </Box>

            {/* Register account link */}
            <Box flexDirection="row" justifyContent="center" alignItems="center">
                <Text marginRight="sm">{t('auth.login.noAccount')}</Text>
                <Button
                    testID="login-register-link"
                    onPress={() => navigation.navigate(ROUTES.AUTH_REGISTER)}
                    variant="tertiary"
                    journey="health"
                >
                    {t('auth.login.register')}
                </Button>
            </Box>
        </Box>
    );
};

export default LoginScreen;
