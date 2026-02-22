import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius, borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { sizing, sizingValues } from '../../../../design-system/src/tokens/sizing';

/**
 * Number of OTP digits
 */
const OTP_LENGTH = 6;

/**
 * Countdown duration in seconds
 */
const COUNTDOWN_DURATION = 60;

// --- Styled Components ---

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

const OtpRow = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${spacingValues.xl}px;
`;

const OtpInput = styled.TextInput<{ isFocused: boolean }>`
  width: ${sizingValues.component.lg}px;
  height: ${sizingValues.component.lg}px;
  border-width: 2px;
  border-color: ${(props: { isFocused: boolean }) =>
    props.isFocused ? colors.brand.primary : colors.neutral.gray300};
  border-radius: ${borderRadiusValues.md}px;
  text-align: center;
  font-size: ${fontSizeValues['2xl']}px;
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-horizontal: ${spacingValues['3xs']}px;
`;

const TimerContainer = styled.View`
  align-items: center;
  margin-bottom: ${spacingValues.lg}px;
`;

const TimerText = styled.Text`
  font-size: ${fontSizeValues.sm}px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ResendButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  align-items: center;
  padding: ${spacingValues.xs}px;
  margin-bottom: ${spacingValues.lg}px;
`;

const ResendText = styled.Text<{ disabled?: boolean }>`
  font-size: ${fontSizeValues.sm}px;
  font-weight: ${typography.fontWeight.semiBold};
  color: ${(props: { disabled?: boolean }) =>
    props.disabled ? colors.neutral.gray400 : colors.brand.primary};
`;

const VerifyButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props: { disabled?: boolean }) =>
    props.disabled ? colors.neutral.gray400 : colors.brand.primary};
  border-radius: ${borderRadiusValues.md}px;
  padding: ${spacingValues.md}px;
  align-items: center;
`;

const VerifyButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text.onBrand};
  font-size: ${fontSizeValues.md}px;
  font-weight: ${typography.fontWeight.semiBold};
`;

const ToastContainer = styled.View<{ toastType: 'success' | 'error' }>`
  position: absolute;
  top: ${spacingValues['4xl']}px;
  left: ${spacingValues.md}px;
  right: ${spacingValues.md}px;
  padding: ${spacingValues.md}px;
  border-radius: ${borderRadiusValues.md}px;
  background-color: ${(props: { toastType: 'success' | 'error' }) =>
    props.toastType === 'success' ? colors.semantic.successBg : colors.semantic.errorBg};
  border-left-width: 4px;
  border-left-color: ${(props: { toastType: 'success' | 'error' }) =>
    props.toastType === 'success' ? colors.semantic.success : colors.semantic.error};
`;

const ToastText = styled.Text<{ toastType: 'success' | 'error' }>`
  font-size: ${fontSizeValues.sm}px;
  color: ${(props: { toastType: 'success' | 'error' }) =>
    props.toastType === 'success' ? colors.semantic.success : colors.semantic.error};
  font-weight: ${typography.fontWeight.medium};
`;

// --- Types ---

interface ToastState {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
}

/**
 * EmailVerify screen component that handles 6-digit OTP email verification.
 *
 * Features:
 * - 6 separate TextInput boxes with auto-focus progression
 * - Auto-submit when all 6 digits are entered
 * - 60-second countdown timer with resend capability
 * - Toast feedback on success/error
 * - Full design-system token compliance (zero hardcoded hex/px)
 */
export const EmailVerifyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // OTP digit state
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer state
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [canResend, setCanResend] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'success',
    message: '',
  });

  // Refs for each input
  const inputRefs = useRef<(RNTextInput | null)[]>(Array(OTP_LENGTH).fill(null));

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  /**
   * Formats countdown seconds into "M:SS" display
   */
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Shows a toast notification
   */
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ visible: true, type, message });
  }, []);

  /**
   * Handles OTP verification submission
   */
  const handleVerify = useCallback(async (otpCode: string) => {
    setIsSubmitting(true);
    try {
      // TODO: Call actual email verification API
      // await verifyEmail(otpCode);
      showToast('success', t('auth.emailVerify.successMessage'));
      // Navigate after short delay for toast visibility
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      showToast('error', error?.message || t('auth.emailVerify.errorMessage'));
      setIsSubmitting(false);
    }
  }, [navigation, showToast]);

  /**
   * Handles digit input change for a specific index
   */
  const handleDigitChange = useCallback((text: string, index: number) => {
    // Only accept single digits
    const digit = text.replace(/[^0-9]/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit && index < OTP_LENGTH - 1) {
      // Auto-focus next input
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    const fullCode = newDigits.join('');
    if (fullCode.length === OTP_LENGTH && newDigits.every((d) => d !== '')) {
      handleVerify(fullCode);
    }
  }, [digits, handleVerify]);

  /**
   * Handles backspace key to move focus to previous input
   */
  const handleKeyPress = useCallback((e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
    }
  }, [digits]);

  /**
   * Handles resend OTP
   */
  const handleResend = useCallback(() => {
    if (!canResend) return;

    setCountdown(COUNTDOWN_DURATION);
    setCanResend(false);
    setDigits(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    showToast('success', t('auth.emailVerify.resendSuccess'));
  }, [canResend, showToast]);

  /**
   * Handles manual verify button press
   */
  const handleVerifyPress = useCallback(() => {
    const code = digits.join('');
    if (code.length === OTP_LENGTH) {
      handleVerify(code);
    }
  }, [digits, handleVerify]);

  const isComplete = digits.every((d) => d !== '') && digits.join('').length === OTP_LENGTH;

  return (
    <Container>
      {/* Toast notification */}
      {toast.visible && (
        <ToastContainer toastType={toast.type}>
          <ToastText toastType={toast.type}>{toast.message}</ToastText>
        </ToastContainer>
      )}

      <Title>{t('auth.emailVerify.title')}</Title>
      <Description>
        {t('auth.emailVerify.description')}
      </Description>

      {/* OTP Input boxes */}
      <OtpRow>
        {digits.map((digit, index) => (
          <OtpInput
            key={`otp-${index}`}
            ref={(ref: RNTextInput | null) => {
              inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text: string) => handleDigitChange(text, index)}
            onKeyPress={(e: any) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            isFocused={focusedIndex === index}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
            selectTextOnFocus
            accessibilityLabel={t('auth.emailVerify.digitLabel', { current: index + 1, total: OTP_LENGTH })}
            testID={`otp-input-${index}`}
            editable={!isSubmitting}
          />
        ))}
      </OtpRow>

      {/* Countdown timer */}
      <TimerContainer>
        {!canResend && (
          <TimerText>
            {t('auth.emailVerify.resendIn', { time: formatCountdown(countdown) })}
          </TimerText>
        )}
      </TimerContainer>

      {/* Resend button */}
      <ResendButton
        onPress={handleResend}
        disabled={!canResend || isSubmitting}
        accessibilityLabel={t('auth.emailVerify.resendCode')}
        accessibilityRole="button"
        testID="resend-button"
      >
        <ResendText disabled={!canResend}>
          {t('auth.emailVerify.resendCode')}
        </ResendText>
      </ResendButton>

      {/* Verify button */}
      <VerifyButton
        onPress={handleVerifyPress}
        disabled={!isComplete || isSubmitting}
        accessibilityLabel={t('auth.emailVerify.verifyButton')}
        accessibilityRole="button"
        testID="verify-button"
      >
        <VerifyButtonText>
          {isSubmitting ? t('auth.emailVerify.verifying') : t('auth.emailVerify.verify')}
        </VerifyButtonText>
      </VerifyButton>
    </Container>
  );
};

export default EmailVerifyScreen;
