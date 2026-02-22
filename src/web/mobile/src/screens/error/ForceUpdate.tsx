import React, { useCallback } from 'react';
import { ScrollView, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Constants ---

const APP_STORE_URL = 'https://apps.apple.com/app/austa-superapp/id000000000';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.austa.superapp';

const CURRENT_VERSION = '2.1.0';
const REQUIRED_VERSION = '3.0.0';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${spacing['2xl']};
`;

const IconCircle = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background-color: ${colors.semantic.infoBg};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.xl};
`;

const IconText = styled.Text`
  font-size: 48px;
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: center;
  margin-bottom: ${spacing.xs};
`;

const Description = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${spacing.xl};
  padding-horizontal: ${spacing.md};
`;

const VersionCard = styled.View`
  width: 100%;
  max-width: 280px;
  background-color: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-bottom: ${spacing['2xl']};
`;

const VersionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xs};
`;

const VersionLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const VersionValue = styled.Text<{ isOld?: boolean }>`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${(props) =>
    props.isOld ? colors.semantic.error : colors.semantic.success};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${colors.gray[20]};
  margin-vertical: ${spacing.xs};
`;

const UpdateButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  width: 100%;
  max-width: 280px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.md};
`;

const UpdateButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const StoreHint = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.subtle};
  text-align: center;
  margin-top: ${spacing.xs};
`;

const WhatsNewContainer = styled.View`
  width: 100%;
  max-width: 280px;
  margin-top: ${spacing.xl};
`;

const WhatsNewTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.sm};
`;

const FeatureRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${spacing.xs};
`;

const FeatureBullet = styled.Text`
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.brand.primary};
  margin-right: ${spacing.xs};
  line-height: 22px;
`;

const FeatureText = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.default};
  line-height: 22px;
`;

// --- Component ---

/**
 * ForceUpdate -- Displayed when a mandatory app update is required.
 * Shows current vs required version, "Update Now" button that opens
 * the appropriate store (App Store / Play Store) based on Platform.OS.
 */
export const ForceUpdate: React.FC = () => {
  const { t } = useTranslation();

  const handleUpdate = useCallback(() => {
    const storeUrl = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
    Linking.openURL(storeUrl);
  }, []);

  const storeName = Platform.OS === 'ios'
    ? t('error.forceUpdate.appStore')
    : t('error.forceUpdate.playStore');

  const features = [
    t('error.forceUpdate.feature1'),
    t('error.forceUpdate.feature2'),
    t('error.forceUpdate.feature3'),
  ];

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer>
          <IconCircle>
            <IconText testID="force-update-icon">{'\u{2B07}\uFE0F'}</IconText>
          </IconCircle>

          <Title testID="force-update-title">
            {t('error.forceUpdate.title')}
          </Title>

          <Description testID="force-update-description">
            {t('error.forceUpdate.description')}
          </Description>

          <VersionCard>
            <VersionRow>
              <VersionLabel testID="force-update-current-label">
                {t('error.forceUpdate.currentVersion')}
              </VersionLabel>
              <VersionValue isOld testID="force-update-current-value">
                v{CURRENT_VERSION}
              </VersionValue>
            </VersionRow>
            <Divider />
            <VersionRow>
              <VersionLabel testID="force-update-required-label">
                {t('error.forceUpdate.requiredVersion')}
              </VersionLabel>
              <VersionValue testID="force-update-required-value">
                v{REQUIRED_VERSION}
              </VersionValue>
            </VersionRow>
          </VersionCard>

          <UpdateButton
            onPress={handleUpdate}
            accessibilityRole="button"
            accessibilityLabel={t('error.forceUpdate.updateNow')}
            testID="force-update-button"
          >
            <UpdateButtonText>
              {t('error.forceUpdate.updateNow')}
            </UpdateButtonText>
          </UpdateButton>

          <StoreHint testID="force-update-store-hint">
            {t('error.forceUpdate.storeHint', { store: storeName })}
          </StoreHint>

          <WhatsNewContainer>
            <WhatsNewTitle testID="force-update-whats-new-title">
              {t('error.forceUpdate.whatsNew')}
            </WhatsNewTitle>
            {features.map((feature, index) => (
              <FeatureRow key={index}>
                <FeatureBullet>{'\u2713'}</FeatureBullet>
                <FeatureText testID={`force-update-feature-${index}`}>
                  {feature}
                </FeatureText>
              </FeatureRow>
            ))}
          </WhatsNewContainer>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
};

export default ForceUpdate;
