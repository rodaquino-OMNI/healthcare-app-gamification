import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { userValidationSchema } from 'src/web/shared/utils/validation';
import { register } from 'src/web/mobile/src/api/auth';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Input } from 'src/web/design-system/src/components/Input/Input';
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox';
import { MOBILE_AUTH_ROUTES } from 'src/web/shared/constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';

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
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const { control, handleSubmit, formState: { errors, isValid, isSubmitting }, register: registerInput } = useForm({
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

  const onSubmit = async (data: any) => {
    try {
      const session = await register(data);
      navigation.navigate(MOBILE_AUTH_ROUTES.LOGIN);
    } catch (error: any) {
      console.error('Registration failed', error.message);
    }
  };

  return (
    <Container>
      <Title>{t('register.title')}</Title>

      <InputContainer>
        <Input
          placeholder={t('register.name')}
          onChangeText={(text: string) => {}}
          aria-label={t('register.name')}
          testID="register-name-input"
          {...registerInput('name')}
        />
        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
      </InputContainer>

      <InputContainer>
        <Input
          placeholder={t('register.email')}
          onChangeText={(text: string) => {}}
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
          onChangeText={(text: string) => {}}
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
          onChangeText={(text: string) => {}}
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
        <LinkButton onPress={() => navigation.navigate(MOBILE_AUTH_ROUTES.LOGIN)}>
          {t('register.login') || 'Log In'}
        </LinkButton>
      </LinkContainer>
    </Container>
  );
};

export default RegisterScreen;
