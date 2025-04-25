import React, { useState, useCallback } from 'react'; // React v18+
import { useNavigation } from '@react-navigation/native'; // @react-navigation/native v6+
import { useForm } from 'react-hook-form'; // react-hook-form v7+
import { yupResolver } from '@hookform/resolvers/yup'; // @hookform/resolvers/yup v3+
import styled from 'styled-components/native'; // styled-components v5+
import { i18n } from 'i18next'; // i18next v23+
import { useTranslation } from 'react-i18next'; // react-i18next v14+

import { userValidationSchema } from 'src/web/shared/utils/validation.ts';
import { register } from 'src/web/mobile/src/api/auth.ts';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth.ts';
import { Button, ButtonProps } from 'src/web/design-system/src/components/Button/Button.tsx';
import { Input, InputProps } from 'src/web/design-system/src/components/Input/Input.tsx';
import { Checkbox } from 'src/web/design-system/src/components/Checkbox/Checkbox.tsx';

// Styled components for consistent UI
const Container = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
  padding: 20px;
`;

const Title = styled.Text`
  fontSize: 24px;
  fontWeight: bold;
  marginBottom: 20px;
`;

const InputContainer = styled.View`
  width: 100%;
  marginBottom: 15px;
`;

const CheckboxContainer = styled.View`
  flexDirection: row;
  alignItems: center;
  marginBottom: 15px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  marginTop: 20px;
`;

const LinkContainer = styled.View`
  marginTop: 20px;
`;

/**
 * A React component that renders the registration screen.
 * @returns {JSX.Element} The rendered registration screen.
 */
export const RegisterScreen: React.FC = () => {
  // Access navigation functions
  const navigation = useNavigation();

  // Access authentication functions
  const { signIn } = useAuth();

  // Access translation function
  const { t } = useTranslation();

  // Initialize form state using `useForm` and `yupResolver` for validation.
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

  // Define a submit handler that calls the `register` API function.
  const onSubmit = async (data: any) => {
    try {
      // Call the `register` API function with the form data.
      const session = await register(data);

      // Navigate to the login screen upon successful registration.
      navigation.navigate('Login');
    } catch (error: any) {
      // Handle registration errors
      console.error('Registration failed', error.message);
    }
  };

  // Render the registration form with input fields for name, email, CPF, phone, password, and confirm password.
  return (
    <Container>
      <Title>{t('register.title')}</Title>

      <InputContainer>
        <Input
          placeholder={t('register.name')}
          onChangeText={(text) => console.log('Name changed', text)}
          aria-label={t('register.name')}
          testID="register-name-input"
          {...registerInput('name')}
        />
        {errors.name && <Text>{errors.name.message}</Text>}
      </InputContainer>

      <InputContainer>
        <Input
          placeholder={t('register.email')}
          onChangeText={(text) => console.log('Email changed', text)}
          aria-label={t('register.email')}
          testID="register-email-input"
          type="email"
          {...registerInput('email')}
        />
        {errors.email && <Text>{errors.email.message}</Text>}
      </InputContainer>

      <InputContainer>
        <Input
          placeholder={t('register.password')}
          onChangeText={(text) => console.log('Password changed', text)}
          aria-label={t('register.password')}
          testID="register-password-input"
          type="password"
          {...registerInput('password')}
        />
        {errors.password && <Text>{errors.password.message}</Text>}
      </InputContainer>

      <InputContainer>
        <Input
          placeholder={t('register.confirmPassword')}
          onChangeText={(text) => console.log('Confirm Password changed', text)}
          aria-label={t('register.confirmPassword')}
          testID="register-confirm-password-input"
          type="password"
          {...registerInput('confirmPassword')}
        />
        {errors.confirmPassword && <Text>{errors.confirmPassword.message}</Text>}
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
        >
          {t('register.submit')}
        </Button>
      </ButtonContainer>

      <LinkContainer>
        <Touchable onPress={() => navigation.navigate('Login')}>
          <Text>{t('register.alreadyHaveAccount')}</Text>
        </Touchable>
      </LinkContainer>
    </Container>
  );
};