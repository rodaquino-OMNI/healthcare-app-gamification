import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing['4xl']};
  align-items: center;
`;

const WarningBox = styled.View`
  width: 100%;
  padding: ${spacing.md};
  background-color: ${colors.semantic.error};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.xl};
`;

const WarningBoxText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
  text-align: center;
  line-height: 20px;
`;

const CountdownContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: ${spacing.xl};
`;

const CountdownCircle = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 3px;
  border-color: ${colors.semantic.error};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.sm};
`;

const CountdownNumber = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.semantic.error};
`;

const CountdownText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  text-align: center;
`;

const FieldContainer = styled.View`
  width: 100%;
  margin-bottom: ${spacing.xl};
`;

const Label = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.neutral.gray700};
  margin-bottom: ${spacing.xs};
  text-align: center;
`;

const ConfirmWord = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.semantic.error};
`;

const StyledInput = styled.TextInput<{ hasError?: boolean }>`
  height: ${sizing.component.md};
  border-width: 2px;
  border-color: ${(props) =>
    props.hasError ? colors.semantic.error : colors.gray[20]};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  background-color: ${colors.neutral.white};
  text-align: center;
`;

const DangerButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 100%;
  background-color: ${(props) =>
    props.disabled ? colors.gray[30] : colors.semantic.error};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
`;

const DangerButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const SecondaryButton = styled.TouchableOpacity`
  width: 100%;
  border-width: 1px;
  border-color: ${colors.gray[20]};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
  margin-top: ${spacing.sm};
`;

const SecondaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[60]};
`;

// --- Constants ---

const CONFIRM_WORD = 'EXCLUIR';
const COUNTDOWN_SECONDS = 10;

/**
 * DeleteConfirm screen -- final account deletion confirmation with
 * countdown timer and typed confirmation word requirement.
 */
export const DeleteConfirmScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isDeleteEnabled = countdown === 0 && confirmText === CONFIRM_WORD;

  const handleDelete = async () => {
    try {
      await signOut();
      Alert.alert(
        t('settings.deleteConfirm.successTitle'),
        t('settings.deleteConfirm.successMessage'),
      );
    } catch {
      Alert.alert(
        t('settings.deleteConfirm.errorTitle'),
        t('settings.deleteConfirm.errorMessage'),
      );
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
        >
          <ContentWrapper>
            <WarningBox>
              <WarningBoxText>{t('settings.deleteConfirm.title')}</WarningBoxText>
            </WarningBox>

            <CountdownContainer>
              <CountdownCircle>
                <CountdownNumber>{countdown}</CountdownNumber>
              </CountdownCircle>
              <CountdownText>
                {countdown > 0
                  ? t('settings.deleteConfirm.waitMessage', { seconds: countdown })
                  : t('settings.deleteConfirm.waitComplete')}
              </CountdownText>
            </CountdownContainer>

            <FieldContainer>
              <Label>
                {t('settings.deleteConfirm.typeToConfirm')}{' '}
                <ConfirmWord>{CONFIRM_WORD}</ConfirmWord>{' '}
                {t('settings.deleteConfirm.toConfirmSuffix')}
              </Label>
              <StyledInput
                value={confirmText}
                onChangeText={setConfirmText}
                placeholder={CONFIRM_WORD}
                placeholderTextColor={colors.gray[40]}
                autoCapitalize="characters"
                accessibilityLabel={t('settings.deleteConfirm.typeToConfirm')}
                testID="delete-confirm-input"
              />
            </FieldContainer>

            <DangerButton
              onPress={handleDelete}
              disabled={!isDeleteEnabled}
              accessibilityRole="button"
              accessibilityLabel={t('settings.deleteConfirm.deleteForever')}
              testID="delete-confirm-button"
            >
              <DangerButtonText>{t('settings.deleteConfirm.deleteForever')}</DangerButtonText>
            </DangerButton>

            <SecondaryButton
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel={t('settings.deleteConfirm.cancel')}
              testID="delete-confirm-cancel"
            >
              <SecondaryButtonText>{t('settings.deleteConfirm.cancel')}</SecondaryButtonText>
            </SecondaryButton>
          </ContentWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default DeleteConfirmScreen;
