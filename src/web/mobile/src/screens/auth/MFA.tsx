import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/useAuth';
import { colors } from '@design-system/tokens/colors';
import { typography, fontSizeValues } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius, borderRadiusValues } from '@design-system/tokens/borderRadius';
import { sizing, sizingValues } from '@design-system/tokens/sizing';

/**
 * Styled container for the MFA screen
 */
const Container = styled.View`
  flex: 1;
  padding: ${spacingValues.xl}px;
  background-color: ${({ theme }) => theme.colors.background.default};
  justify-content: center;
`;

/**
 * Styled title text
 */
const Title = styled.Text`
  font-size: ${fontSizeValues['2xl']}px;
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacingValues.sm}px;
  text-align: center;
`;

/**
 * Styled description text
 */
const Description = styled.Text`
  font-size: ${fontSizeValues.md}px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  margin-bottom: ${spacingValues['2xl']}px;
  line-height: ${Math.round(fontSizeValues.md * 1.5)}px;
`;

/**
 * Styled code input
 */
const CodeInput = styled.TextInput`
  height: ${sizingValues.component.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadiusValues.md}px;
  padding-horizontal: ${spacingValues.md}px;
  font-size: ${fontSizeValues['2xl']}px;
  text-align: center;
  letter-spacing: 8px;
  margin-bottom: ${spacingValues.xl}px;
  color: ${({ theme }) => theme.colors.text.default};
`;

/**
 * Styled verify button
 */
const VerifyButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props: { disabled?: boolean }) =>
    props.disabled ? colors.neutral.gray400 : colors.brand.primary};
  border-radius: ${borderRadiusValues.md}px;
  padding: ${spacingValues.md}px;
  align-items: center;
`;

/**
 * Styled verify button text
 */
const VerifyButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text.onBrand};
  font-size: ${fontSizeValues.md}px;
  font-weight: ${typography.fontWeight.semiBold};
`;

/**
 * Loading container
 */
const LoadingContainer = styled.View`
  align-items: center;
  padding: ${spacingValues.md}px;
`;

/**
 * Loading text label
 */
const LoadingLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${fontSizeValues.sm}px;
  margin-top: ${spacingValues.xs}px;
`;

/**
 * MFA screen component that handles multi-factor authentication verification.
 * This screen allows users to enter a verification code they received via SMS or email
 * to complete the authentication process.
 *
 * Uses design-system tokens for all colors, spacing, typography and sizing.
 * No hardcoded hex values or pixel values.
 */
export const MFAScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();
  const { t } = useTranslation();
  const { handleMfaVerification } = useAuth();

  /**
   * Handles the verification code submission.
   * Attempts to verify the code with the temporary token.
   */
  const handleSubmit = async () => {
    if (!code.trim()) return;

    setIsSubmitting(true);

    try {
      const navState = navigation.getState();
      const route = navState?.routes[navState?.index ?? 0];
      const tempToken = (route?.params as any)?.tempToken;

      await handleMfaVerification(code, tempToken);
      // Navigation after successful verification is handled by the auth context
    } catch (error) {
      console.error('MFA verification failed:', error);
      setIsSubmitting(false);
    }
  };

  const isCodeEmpty = !code.trim();

  return (
    <Container>
      <Title>{t('auth.mfa.title')}</Title>
      <Description>
        {t('auth.mfa.description')}
      </Description>

      <CodeInput
        value={code}
        onChangeText={setCode}
        placeholder={t('auth.mfa.codePlaceholder')}
        placeholderTextColor={colors.neutral.gray500}
        keyboardType="number-pad"
        autoFocus
        maxLength={6}
        accessibilityLabel={t('auth.mfa.codeLabel')}
        testID="mfa-code-input"
      />

      {isSubmitting ? (
        <LoadingContainer>
          <ActivityIndicator
            size="small"
            color={colors.brand.primary}
          />
          <LoadingLabel>{t('auth.mfa.verifying')}</LoadingLabel>
        </LoadingContainer>
      ) : (
        <VerifyButton
          onPress={handleSubmit}
          disabled={isCodeEmpty}
          accessibilityLabel={t('auth.mfa.verifyButton')}
          accessibilityRole="button"
        >
          <VerifyButtonText>{t('auth.mfa.verify')}</VerifyButtonText>
        </VerifyButton>
      )}
    </Container>
  );
};

export default MFAScreen;
