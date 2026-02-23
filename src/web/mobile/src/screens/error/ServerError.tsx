import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Types ---

interface ServerErrorProps {
  onRetry?: () => void;
}

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
  background-color: ${colors.semantic.errorBg};
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
  margin-bottom: ${spacing['2xl']};
  padding-horizontal: ${spacing.md};
`;

const ErrorCode = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  width: 100%;
  max-width: 280px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.sm};
`;

const PrimaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const SecondaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  height: ${sizing.component.lg};
  width: 100%;
  max-width: 280px;
  align-items: center;
  justify-content: center;
`;

const SecondaryButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

// --- Component ---

/**
 * ServerError -- Displayed when a server error (500) occurs.
 * Shows an error icon, descriptive message, "Try Again" primary button,
 * and "Contact Support" secondary button.
 */
export const ServerError: React.FC<ServerErrorProps> = ({ onRetry }) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  const handleContactSupport = useCallback(() => {
    navigation.navigate(ROUTES.HELP_CONTACT);
  }, [navigation]);

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ContentContainer>
          <IconCircle>
            <IconText testID="server-error-icon">{'\u26A0\uFE0F'}</IconText>
          </IconCircle>

          <Title testID="server-error-title">
            {t('error.server.title')}
          </Title>

          <Description testID="server-error-description">
            {t('error.server.description')}
          </Description>

          <ErrorCode testID="server-error-code">
            {t('error.server.errorCode', { code: '500' })}
          </ErrorCode>

          <PrimaryButton
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel={t('error.server.tryAgain')}
            testID="server-error-retry"
          >
            <PrimaryButtonText>
              {t('error.server.tryAgain')}
            </PrimaryButtonText>
          </PrimaryButton>

          <SecondaryButton
            onPress={handleContactSupport}
            accessibilityRole="button"
            accessibilityLabel={t('error.server.contactSupport')}
            testID="server-error-support"
          >
            <SecondaryButtonText>
              {t('error.server.contactSupport')}
            </SecondaryButtonText>
          </SecondaryButton>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
};

export default ServerError;
