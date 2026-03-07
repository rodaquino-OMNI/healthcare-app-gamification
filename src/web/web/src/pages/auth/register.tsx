import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/web/web/src/hooks/useAuth';
import Input from 'src/web/design-system/src/components/Input';
import { Button } from 'src/web/design-system/src/components/Button';
import FormField from 'src/web/design-system/src/components/Input';
import AuthLayout from 'src/web/web/src/layouts/AuthLayout';
import { WEB_AUTH_ROUTES } from 'src/web/shared/constants/routes';
import Box from 'src/web/design-system/src/primitives/Box/Box';
import Text from 'src/web/design-system/src/primitives/Text/Text';

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
    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setSubmitError(null);
            // Only send name, email, and password to the API
            const { name, email, password } = data;
            await registerUser({ name, email, password });
            router.push(WEB_AUTH_ROUTES.LOGIN);
        } catch (error: any) {
            setSubmitError(error.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    <Box marginY="md" padding="sm" backgroundColor="semantic.error" borderRadius="md">
                        <Text color="neutral.white">{submitError}</Text>
                    </Box>
                )}

                <Box marginTop="lg">
                    <Button
                        onPress={handleSubmit(onSubmit)}
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
