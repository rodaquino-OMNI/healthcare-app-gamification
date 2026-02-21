import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Types ---

interface NoInternetProps {
  onRetry?: () => void;
}

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
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
  background-color: ${colors.gray[10]};
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
  color: ${colors.neutral.gray900};
  text-align: center;
  margin-bottom: ${spacing.xs};
`;

const Description = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.gray[50]};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${spacing['2xl']};
  padding-horizontal: ${spacing.md};
`;

const RetryButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  width: 100%;
  max-width: 280px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.xl};
`;

const RetryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const CachedNotice = styled.View`
  position: absolute;
  bottom: 40px;
  left: ${spacing['2xl']};
  right: ${spacing['2xl']};
  align-items: center;
`;

const CachedNoticeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[40]};
  text-align: center;
  line-height: 18px;
`;

// --- Component ---

/**
 * NoInternet -- Displayed when the device has no internet connection.
 * Shows a wifi-off icon, descriptive text, a retry button, and a
 * subtle notice about cached data availability.
 */
export const NoInternet: React.FC<NoInternetProps> = ({ onRetry }) => {
  const { t } = useTranslation();

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer>
          <IconCircle>
            <IconText testID="no-internet-icon">{'\u{1F4E1}'}</IconText>
          </IconCircle>

          <Title testID="no-internet-title">
            {t('error.noInternet.title')}
          </Title>

          <Description testID="no-internet-description">
            {t('error.noInternet.description')}
          </Description>

          <RetryButton
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel={t('error.noInternet.retry')}
            testID="no-internet-retry"
          >
            <RetryButtonText>{t('error.noInternet.retry')}</RetryButtonText>
          </RetryButton>
        </ContentContainer>
      </ScrollView>

      <CachedNotice>
        <CachedNoticeText testID="no-internet-cached-notice">
          {t('error.noInternet.cachedNotice')}
        </CachedNoticeText>
      </CachedNotice>
    </Container>
  );
};

export default NoInternet;
