import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentWrapper = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing['4xl']};
`;

const SectionHeader = styled.View`
  margin-bottom: ${spacing.lg};
`;

const SectionTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const SectionDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: 20px;
`;

const MasterToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${spacing.md};
  padding-horizontal: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.xl};
`;

const MasterToggleLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  flex: 1;
  margin-right: ${spacing.md};
`;

const StatusBadge = styled.View<{ isEnabled: boolean }>`
  padding-horizontal: ${spacing.sm};
  padding-vertical: ${spacing['3xs']};
  border-radius: ${borderRadius.sm};
  background-color: ${(props) =>
    props.isEnabled ? colors.semantic.success : colors.gray[30]};
  margin-right: ${spacing.sm};
`;

const StatusBadgeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const MethodLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.sm};
`;

const MethodCard = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${spacing.md};
  border-width: 2px;
  border-color: ${(props) =>
    props.isSelected ? colors.brand.primary : colors.gray[20]};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.sm};
  background-color: ${(props) =>
    props.isSelected ? colors.gray[10] : colors.neutral.white};
`;

const RadioCircle = styled.View<{ isSelected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${(props) =>
    props.isSelected ? colors.brand.primary : colors.gray[40]};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.sm};
`;

const RadioDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${colors.brand.primary};
`;

const MethodCardContent = styled.View`
  flex: 1;
`;

const MethodCardTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const MethodCardDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: ${spacing['3xs']};
`;

const DetailSection = styled.View`
  margin-top: ${spacing.lg};
  padding: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${borderRadius.md};
`;

const PhoneRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PhoneText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.default};
`;

const LinkButton = styled.TouchableOpacity`
  padding-vertical: ${spacing.xs};
`;

const LinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
`;

const QRPlaceholder = styled.View`
  width: 200px;
  height: 200px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-vertical: ${spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const QRText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.subtle};
`;

const InstructionsText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: 20px;
  text-align: center;
`;

const DangerButton = styled.TouchableOpacity`
  background-color: ${colors.semantic.error};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
  margin-top: ${spacing['2xl']};
`;

const DangerButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

// --- Types ---

type TwoFactorMethod = 'sms' | 'authenticator';

/**
 * TwoFactorAuth screen -- manage 2FA settings including
 * master toggle, method selection (SMS / Authenticator App),
 * and disable confirmation.
 */
export const TwoFactorAuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isEnabled, setIsEnabled] = useState(false);
  const [method, setMethod] = useState<TwoFactorMethod>('sms');

  const handleToggle = (value: boolean) => {
    setIsEnabled(value);
  };

  const handleDisable = () => {
    Alert.alert(
      t('settings.twoFactor.disable'),
      t('settings.twoFactor.disableConfirm'),
      [
        { text: t('settings.twoFactor.cancel'), style: 'cancel' },
        {
          text: t('settings.twoFactor.disable'),
          style: 'destructive',
          onPress: () => setIsEnabled(false),
        },
      ],
    );
  };

  const trackColor = {
    false: colors.gray[20],
    true: colors.brand.primary,
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <ContentWrapper>
          <SectionHeader>
            <SectionTitle>{t('settings.twoFactor.title')}</SectionTitle>
            <SectionDescription>
              {t('settings.twoFactor.description')}
            </SectionDescription>
          </SectionHeader>

          <MasterToggleRow>
            <StatusBadge isEnabled={isEnabled}>
              <StatusBadgeText>
                {isEnabled ? t('settings.twoFactor.enabled') : t('settings.twoFactor.disabled')}
              </StatusBadgeText>
            </StatusBadge>
            <MasterToggleLabel>
              {t('settings.twoFactor.title')}
            </MasterToggleLabel>
            <Switch
              value={isEnabled}
              onValueChange={handleToggle}
              trackColor={trackColor}
              thumbColor={colors.neutral.white}
              accessibilityLabel={t('settings.twoFactor.title')}
              testID="two-factor-toggle"
            />
          </MasterToggleRow>

          {isEnabled && (
            <>
              <MethodLabel>{t('settings.twoFactor.method')}</MethodLabel>

              <MethodCard
                isSelected={method === 'sms'}
                onPress={() => setMethod('sms')}
                accessibilityRole="radio"
                accessibilityState={{ selected: method === 'sms' }}
                accessibilityLabel={t('settings.twoFactor.sms')}
                testID="two-factor-method-sms"
              >
                <RadioCircle isSelected={method === 'sms'}>
                  {method === 'sms' && <RadioDot />}
                </RadioCircle>
                <MethodCardContent>
                  <MethodCardTitle>{t('settings.twoFactor.sms')}</MethodCardTitle>
                  <MethodCardDescription>
                    {t('settings.twoFactor.smsDescription')}
                  </MethodCardDescription>
                </MethodCardContent>
              </MethodCard>

              <MethodCard
                isSelected={method === 'authenticator'}
                onPress={() => setMethod('authenticator')}
                accessibilityRole="radio"
                accessibilityState={{ selected: method === 'authenticator' }}
                accessibilityLabel={t('settings.twoFactor.authenticator')}
                testID="two-factor-method-authenticator"
              >
                <RadioCircle isSelected={method === 'authenticator'}>
                  {method === 'authenticator' && <RadioDot />}
                </RadioCircle>
                <MethodCardContent>
                  <MethodCardTitle>{t('settings.twoFactor.authenticator')}</MethodCardTitle>
                  <MethodCardDescription>
                    {t('settings.twoFactor.authenticatorDescription')}
                  </MethodCardDescription>
                </MethodCardContent>
              </MethodCard>

              {method === 'sms' && (
                <DetailSection>
                  <PhoneRow>
                    <PhoneText>{t('settings.twoFactor.phone')}: +55 ** *****-1234</PhoneText>
                    <LinkButton
                      accessibilityRole="button"
                      accessibilityLabel={t('settings.twoFactor.changeNumber')}
                      testID="two-factor-change-number"
                    >
                      <LinkText>{t('settings.twoFactor.changeNumber')}</LinkText>
                    </LinkButton>
                  </PhoneRow>
                </DetailSection>
              )}

              {method === 'authenticator' && (
                <DetailSection>
                  <QRPlaceholder>
                    <QRText>QR Code</QRText>
                  </QRPlaceholder>
                  <InstructionsText>
                    {t('settings.twoFactor.qrInstructions')}
                  </InstructionsText>
                </DetailSection>
              )}

              <DangerButton
                onPress={handleDisable}
                accessibilityRole="button"
                accessibilityLabel={t('settings.twoFactor.disable')}
                testID="two-factor-disable"
              >
                <DangerButtonText>{t('settings.twoFactor.disable')}</DangerButtonText>
              </DangerButton>
            </>
          )}
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default TwoFactorAuthScreen;
