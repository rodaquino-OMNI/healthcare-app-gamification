import { Button } from '@design-system/components/Button/Button';
import { Checkbox } from '@design-system/components/Checkbox/Checkbox';
import { Input } from '@design-system/components/Input';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { userValidationSchema } from '@shared/utils/validation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { register } from '@api/auth';
import { useAuth } from '@hooks/useAuth';

import { ROUTES } from '../../constants/routes';
import type { AuthNavigationProp } from '../../navigation/types';

// Styled components using design-system tokens
const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: ${spacingValues.lg}px;
    background-color: ${({ theme }) => theme.colors.background.default};
`;

const Title = styled.Text`
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    margin-bottom: ${spacingValues.lg}px;
    color: ${({ theme }) => theme.colors.text.default};
`;

const InputContainer = styled.View`
    width: 100%;
    margin-bottom: ${spacingValues.sm}px;
`;

const ErrorText = styled.Text`
    color: ${colors.semantic.error};
    font-size: ${typography.fontSize['text-xs']};
    margin-top: ${spacingValues['3xs']}px;
`;

const CheckboxContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${spacingValues.sm}px;
`;

const ButtonContainer = styled.View`
    width: 100%;
    margin-top: ${spacingValues.lg}px;
`;

const LinkContainer = styled.View`
    margin-top: ${spacingValues.lg}px;
    flex-direction: row;
    align-items: center;
`;

const LinkText = styled.Text`
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: ${typography.fontSize['text-md']};
`;

const LinkButton = styled.Text`
    color: ${colors.brand.primary};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
`;

/**
 * A React component that renders the registration screen.
 * Uses react-hook-form with yup validation and design-system tokens.
 */
export const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { signIn: _signIn } = useAuth();
    const { t } = useTranslation();

    const {
        control: _control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        register: registerInput,
    } = useForm<{ name: string; email: string; password: string; confirmPassword: string }>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- yupResolver typing requires any cast for dynamic schema
        resolver: yupResolver(userValidationSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const [termsAccepted, setTermsAccepted] = useState(false);

    const onSubmit = async (data: Record<string, string>): Promise<void> => {
        try {
            const _session = await register(data);
            navigation.navigate(ROUTES.AUTH_LOGIN);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            console.error('Registration failed', message);
        }
    };

    return (
        <Container>
            <Title>{t('register.title')}</Title>

            <InputContainer>
                <Input
                    placeholder={t('register.name')}
                    onChangeText={(_text: string) => {}}
                    aria-label={t('register.name')}
                    testID="register-name-input"
                    {...registerInput('name')}
                />
                {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            </InputContainer>

            <InputContainer>
                <Input
                    placeholder={t('register.email')}
                    onChangeText={(_text: string) => {}}
                    aria-label={t('register.email')}
                    testID="register-email-input"
                    type="email"
                    {...registerInput('email')}
                />
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </InputContainer>

            <InputContainer>
                <Input
                    placeholder={t('register.password')}
                    onChangeText={(_text: string) => {}}
                    aria-label={t('register.password')}
                    testID="register-password-input"
                    type="password"
                    {...registerInput('password')}
                />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </InputContainer>

            <InputContainer>
                <Input
                    placeholder={t('register.confirmPassword')}
                    onChangeText={(_text: string) => {}}
                    aria-label={t('register.confirmPassword')}
                    testID="register-confirm-password-input"
                    type="password"
                    {...registerInput('confirmPassword')}
                />
                {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
            </InputContainer>

            <CheckboxContainer>
                <Checkbox
                    id="terms"
                    name="terms"
                    value="terms"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    label={t('register.terms')}
                    testID="register-terms-checkbox"
                />
            </CheckboxContainer>

            <ButtonContainer>
                <Button
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid || isSubmitting || !termsAccepted}
                    loading={isSubmitting}
                    testID="register-submit-button"
                    journey="health"
                >
                    {t('register.submit')}
                </Button>
            </ButtonContainer>

            <LinkContainer>
                <LinkText>{t('register.alreadyHaveAccount')} </LinkText>
                <LinkButton onPress={() => navigation.navigate(ROUTES.AUTH_LOGIN)}>
                    {t('register.login') || 'Log In'}
                </LinkButton>
            </LinkContainer>
        </Container>
    );
};

export default RegisterScreen;
