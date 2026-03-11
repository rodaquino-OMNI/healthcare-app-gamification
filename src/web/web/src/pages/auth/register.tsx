import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'design-system/components/Button';
import FormField from 'design-system/components/Input';
import { Input } from 'design-system/components/Input/Input';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { WEB_AUTH_ROUTES } from 'shared/constants/routes';
import * as yup from 'yup';

import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/layouts/AuthLayout';

// Define the form values interface
interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Create a validation schema for form validation
const validationSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
    password: yup
        .string()
        .required('Senha é obrigatória')
        .min(8, 'A senha deve ter pelo menos 8 caracteres')
        .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
        .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
        .matches(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
    confirmPassword: yup
        .string()
        .required('Confirme sua senha')
        .oneOf([yup.ref('password')], 'As senhas não coincidem'),
});

/**
 * Register component - Renders the registration page with form for new users
 */
const Register: React.FC = () => {
    const router = useRouter();
    const { register: registerUser } = useAuth();
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Initialize form with validation
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    // Handle form submission
    const onSubmit = async (data: RegisterFormValues): Promise<void> => {
        try {
            setSubmitError(null);
            // Only send name, email, and password to the API
            const { name, email, password } = data;
            await registerUser({ name, email, password });
            void router.push(WEB_AUTH_ROUTES.LOGIN);
        } catch (error: unknown) {
            setSubmitError(
                (
                    error as {
                        response?: { data?: { message?: string } };
                    }
                )?.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
            );
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Text as="h2" fontSize="xl" fontWeight="bold" marginBottom="lg" textAlign="center">
                    Criar Nova Conta
                </Text>

                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <FormField label="Nome" error={errors.name?.message}>
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Seu nome completo"
                                aria-label="Nome completo"
                            />
                        </FormField>
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <FormField label="E-mail" error={errors.email?.message}>
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                type="email"
                                placeholder="seu@email.com"
                                aria-label="E-mail"
                            />
                        </FormField>
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <FormField label="Senha" error={errors.password?.message}>
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                type="password"
                                placeholder="Senha"
                                aria-label="Senha"
                            />
                        </FormField>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <FormField label="Confirme sua senha" error={errors.confirmPassword?.message}>
                            <Input
                                value={field.value}
                                onChange={field.onChange}
                                type="password"
                                placeholder="Confirme sua senha"
                                aria-label="Confirme sua senha"
                            />
                        </FormField>
                    )}
                />

                {submitError && (
                    <div
                        style={{
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: colors.semantic.error,
                            borderRadius: '8px',
                        }}
                    >
                        <Text color="neutral.white">{submitError}</Text>
                    </div>
                )}

                <Box marginTop="lg">
                    <Button
                        onPress={() => void handleSubmit(onSubmit)()}
                        variant="primary"
                        journey="health"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Criar Conta
                    </Button>
                </Box>

                <Box display="flex" justifyContent="center" marginTop="lg">
                    <Text fontSize="sm">
                        Já tem uma conta?{' '}
                        <Link href={WEB_AUTH_ROUTES.LOGIN}>
                            <Text as="span" color="brand.primary" fontWeight="medium">
                                Faça login
                            </Text>
                        </Link>
                    </Text>
                </Box>
            </form>
        </AuthLayout>
    );
};

export default Register;
