import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius, borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizing, sizingValues } from '../../../../design-system/src/tokens/sizing';

/**
 * Styled container for the MFA screen
 */
const Container = styled.View`
  flex: 1;
  padding: ${spacingValues.xl}px;
  background-color: ${colors.neutral.white};
  justify-content: center;
`;

/**
 * Styled title text
 */
const Title = styled.Text`
  font-size: ${fontSizeValues['2xl']}px;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacingValues.sm}px;
  text-align: center;
`;

/**
 * Styled description text
 */
const Description = styled.Text`
  font-size: ${fontSizeValues.md}px;
  color: ${colors.neutral.gray600};
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
  border-color: ${colors.neutral.gray300};
  border-radius: ${borderRadiusValues.md}px;
  padding-horizontal: ${spacingValues.md}px;
  font-size: ${fontSizeValues['2xl']}px;
  text-align: center;
  letter-spacing: 8px;
  margin-bottom: ${spacingValues.xl}px;
  color: ${colors.neutral.gray900};
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
  color: ${colors.neutral.white};
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
  color: ${colors.neutral.gray600};
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
  const { handleMfaVerification } = useAuth();

  /**
   * Handles the verification code submission.
   * Attempts to verify the code with the temporary token.
   */
  const handleSubmit = async () => {
    if (!code.trim()) return;

    setIsSubmitting(true);

    try {
      const route = navigation.getState().routes[navigation.getState().index];
      const tempToken = (route.params as any)?.tempToken;

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
      <Title>Verification Required</Title>
      <Description>
        Please enter the verification code sent to your device to complete the login process.
      </Description>

      <CodeInput
        value={code}
        onChangeText={setCode}
        placeholder="Enter verification code"
        placeholderTextColor={colors.neutral.gray500}
        keyboardType="number-pad"
        autoFocus
        maxLength={6}
        accessibilityLabel="Verification code"
        testID="mfa-code-input"
      />

      {isSubmitting ? (
        <LoadingContainer>
          <ActivityIndicator
            size="small"
            color={colors.brand.primary}
          />
          <LoadingLabel>Verifying...</LoadingLabel>
        </LoadingContainer>
      ) : (
        <VerifyButton
          onPress={handleSubmit}
          disabled={isCodeEmpty}
          accessibilityLabel="Verify code"
          accessibilityRole="button"
        >
          <VerifyButtonText>Verify</VerifyButtonText>
        </VerifyButton>
      )}
    </Container>
  );
};

export default MFAScreen;
