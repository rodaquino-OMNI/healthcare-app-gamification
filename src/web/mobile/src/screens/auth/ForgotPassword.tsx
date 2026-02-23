import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { AuthNavigationProp } from '../../navigation/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styled from 'styled-components/native';

import { useTranslation } from 'react-i18next';
import { Button } from 'src/web/design-system/src/components/Button';
import Input from 'src/web/design-system/src/components/Input';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth';
import { showToast, validationSchema } from 'src/web/mobile/src/utils';
import { ROUTES } from '../../constants/routes';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius, borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';

/**
 * Type definition for the navigation properties of the ForgotPasswordScreen.
 */
type ForgotPasswordScreenProp = {
  navigation: AuthNavigationProp;
};

/**
 * Styled components using design-system tokens
 */
const Container = styled.View`
  flex: 1;
  padding: ${spacingValues.xl}px;
  background-color: ${({ theme }) => theme.colors.background.default};
  justify-content: center;
`;

const Title = styled.Text`
  font-size: ${fontSizeValues['2xl']}px;
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacingValues.xs}px;
  text-align: center;
`;

const Description = styled.Text`
  font-size: ${fontSizeValues.md}px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  margin-bottom: ${spacingValues['2xl']}px;
  line-height: ${Math.round(fontSizeValues.md * 1.5)}px;
`;

const ErrorText = styled.Text`
  color: ${colors.semantic.error};
  font-size: ${fontSizeValues.xs}px;
  margin-top: ${spacingValues['3xs']}px;
`;

const InputWrapper = styled.View`
  margin-bottom: ${spacingValues.lg}px;
`;

const ButtonWrapper = styled.View`
  margin-bottom: ${spacingValues.md}px;
`;

const SuccessContainer = styled.View`
  align-items: center;
  padding: ${spacingValues.xl}px;
`;

const SuccessIcon = styled.Text`
  font-size: ${fontSizeValues['4xl']}px;
  margin-bottom: ${spacingValues.md}px;
`;

const SuccessTitle = styled.Text`
  font-size: ${fontSizeValues.xl}px;
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacingValues.xs}px;
  text-align: center;
`;

const SuccessMessage = styled.Text`
  font-size: ${fontSizeValues.md}px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  margin-bottom: ${spacingValues['2xl']}px;
  line-height: ${Math.round(fontSizeValues.md * 1.5)}px;
`;

/**
 * A screen component that allows users to request a password reset by entering their email address.
 * After successful submission, displays a success state with a "Back to Login" button.
 */
export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProp> = ({ navigation }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema.email),
  });

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { forgotPassword } = useAuth();

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      showToast({
        type: 'success',
        message: t('auth.forgotPassword.successMessage'),
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.message || t('auth.forgotPassword.errorMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container>
        <SuccessContainer>
          <SuccessIcon>
            {'\u2709'}
          </SuccessIcon>
          <SuccessTitle>{t('auth.forgotPassword.checkEmail')}</SuccessTitle>
          <SuccessMessage>
            {t('auth.forgotPassword.checkEmailDescription', { email })}
          </SuccessMessage>
          <ButtonWrapper style={{ width: '100%' }}>
            <Button
              onPress={() => navigation.navigate(ROUTES.AUTH_LOGIN)}
              journey="health"
              testID="back-to-login-button"
            >
              {t('auth.forgotPassword.backToLogin')}
            </Button>
          </ButtonWrapper>
        </SuccessContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{t('auth.forgotPassword.title')}</Title>
      <Description>
        {t('auth.forgotPassword.description')}
      </Description>

      <InputWrapper>
        <Input
          placeholder={t('common.labels.email')}
          value={email}
          onChange={(text) => setEmail(text.nativeEvent.text)}
          aria-label={t('common.labels.email')}
          testID="email-input"
          type="email"
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </InputWrapper>

      <ButtonWrapper>
        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          journey="health"
          testID="submit-button"
        >
          {t('auth.forgotPassword.submit')}
        </Button>
      </ButtonWrapper>

      <ButtonWrapper>
        <Button
          onPress={() => navigation.navigate(ROUTES.AUTH_LOGIN)}
          variant="tertiary"
          journey="health"
          testID="cancel-button"
        >
          {t('auth.forgotPassword.backToLogin')}
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

export default ForgotPasswordScreen;
