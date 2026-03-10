import { Button } from '@design-system/components/Button/Button';
import { Input } from '@design-system/components/Input';
import { Box } from '@design-system/primitives/Box/Box';
import { Text } from '@design-system/primitives/Text/Text';
import { colors } from '@design-system/tokens/colors';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

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

    // Form validation schema using yup
    const validationSchema = yup.object({
        email: yup.string().email(t('common.validation.email')).required(t('common.validation.required')),
        password: yup
            .string()
            .min(8, t('common.validation.minLength', { count: 8 }))
            .required(t('common.validation.required')),
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
            } catch (error: unknown) {
                // Distinguish network errors from credential errors
                const isNetworkError =
                    error instanceof TypeError ||
                    (error !== null &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof (error as { message: unknown }).message === 'string' &&
                        /network|timeout|abort|ECONNREFUSED/i.test((error as { message: string }).message));

                if (isNetworkError) {
                    formik.setStatus('network-error');
                } else {
                    formik.setErrors({
                        email: t('auth.login.invalidCredentials'),
                    });
                }
            }
        },
    });

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
                    value={formik.values.email}
                    onChange={formik.handleChange('email')}
                    placeholder={t('auth.login.emailPlaceholder')}
                    aria-label={t('common.labels.email')}
                    type="email"
                />
                {formik.touched.email && formik.errors.email && (
                    <Text testID="login-error-message" color={colors.semantic.error} fontSize="sm" marginTop="xs">
                        {formik.errors.email}
                    </Text>
                )}
            </Box>

            {/* Network error banner */}
            {formik.status === 'network-error' && (
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
                    value={formik.values.password}
                    onChange={formik.handleChange('password')}
                    placeholder={t('auth.login.passwordPlaceholder')}
                    aria-label={t('auth.login.password')}
                    type="password"
                />
                {formik.touched.password && formik.errors.password && (
                    <Text color={colors.semantic.error} fontSize="sm" marginTop="xs">
                        {formik.errors.password}
                    </Text>
                )}
            </Box>

            {/* Login button */}
            <Box marginBottom="lg">
                <Button
                    testID="login-submit-button"
                    onPress={() => formik.handleSubmit()}
                    disabled={formik.isSubmitting}
                    loading={formik.isSubmitting}
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
