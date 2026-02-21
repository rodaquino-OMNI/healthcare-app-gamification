import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

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
`;

const PageTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.xl};
`;

const BiometricSection = styled.View`
  margin-bottom: ${spacing.xl};
  padding: ${spacing.md};
  background-color: ${colors.gray[10]};
  border-radius: ${borderRadius.md};
`;

const BiometricRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BiometricInfo = styled.View`
  flex: 1;
  margin-right: ${spacing.md};
`;

const BiometricTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
`;

const BiometricStatus = styled.Text<{ isAvailable: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${(props) =>
    props.isAvailable ? colors.semantic.success : colors.gray[40]};
  margin-top: ${spacing['3xs']};
`;

const InfoSection = styled.View`
  margin-top: ${spacing.lg};
  padding: ${spacing.md};
  background-color: ${colors.gray[10]};
  border-radius: ${borderRadius.md};
`;

const InfoTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.xs};
`;

const InfoText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  line-height: 20px;
`;

/**
 * BiometricPrefs screen -- manage Face ID and Fingerprint
 * biometric authentication preferences.
 */
export const BiometricPrefsScreen: React.FC = () => {
  const { t } = useTranslation();

  const isFaceIdAvailable = Platform.OS === 'ios';
  const isFingerprintAvailable = Platform.OS === 'android';

  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);

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
          <PageTitle>{t('settings.biometric.title')}</PageTitle>

          <BiometricSection>
            <BiometricRow>
              <BiometricInfo>
                <BiometricTitle>{t('settings.biometric.faceId')}</BiometricTitle>
                <BiometricStatus isAvailable={isFaceIdAvailable}>
                  {isFaceIdAvailable
                    ? t('settings.biometric.available')
                    : t('settings.biometric.notAvailable')}
                </BiometricStatus>
              </BiometricInfo>
              <Switch
                value={faceIdEnabled}
                onValueChange={setFaceIdEnabled}
                disabled={!isFaceIdAvailable}
                trackColor={trackColor}
                thumbColor={colors.neutral.white}
                accessibilityLabel={t('settings.biometric.faceId')}
                testID="biometric-faceid-toggle"
              />
            </BiometricRow>
          </BiometricSection>

          <BiometricSection>
            <BiometricRow>
              <BiometricInfo>
                <BiometricTitle>{t('settings.biometric.fingerprint')}</BiometricTitle>
                <BiometricStatus isAvailable={isFingerprintAvailable}>
                  {isFingerprintAvailable
                    ? t('settings.biometric.available')
                    : t('settings.biometric.notAvailable')}
                </BiometricStatus>
              </BiometricInfo>
              <Switch
                value={fingerprintEnabled}
                onValueChange={setFingerprintEnabled}
                disabled={!isFingerprintAvailable}
                trackColor={trackColor}
                thumbColor={colors.neutral.white}
                accessibilityLabel={t('settings.biometric.fingerprint')}
                testID="biometric-fingerprint-toggle"
              />
            </BiometricRow>
          </BiometricSection>

          <InfoSection>
            <InfoTitle>{t('settings.biometric.infoTitle')}</InfoTitle>
            <InfoText>{t('settings.biometric.info')}</InfoText>
          </InfoSection>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default BiometricPrefsScreen;
