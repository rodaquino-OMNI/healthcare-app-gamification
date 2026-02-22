import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.default};
`;

const BackButton = styled.TouchableOpacity`
  width: ${sizing.component.sm};
  height: ${sizing.component.sm};
  align-items: center;
  justify-content: center;
`;

const BackText = styled.Text`
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: center;
`;

const HeaderSpacer = styled.View`
  width: ${sizing.component.sm};
`;

const CenterContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${spacing.xl};
`;

const EmptyIconContainer = styled.View`
  width: 96px;
  height: 96px;
  border-radius: ${borderRadius.full};
  background-color: ${({ theme }) => theme.colors.background.subtle};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.xl};
`;

const EmptyIcon = styled.Text`
  font-size: 42px;
`;

const EmptyTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
  text-align: center;
  margin-bottom: ${spacing.sm};
`;

const EmptyDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${spacing['2xl']};
`;

const GoHomeButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  padding-vertical: ${spacing.sm};
  padding-horizontal: ${spacing['2xl']};
`;

const GoHomeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

// --- Component ---

export const NotificationEmptyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleGoHome = useCallback(() => {
    navigation.navigate(ROUTES.HOME as never);
  }, [navigation]);

  return (
    <Container>
      <Header>
        <BackButton
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          testID="notification-empty-back"
        >
          <BackText>{'\u003C'}</BackText>
        </BackButton>
        <HeaderTitle
          accessibilityRole="header"
          testID="notification-empty-header"
        >
          {t('notification.empty.header')}
        </HeaderTitle>
        <HeaderSpacer />
      </Header>

      <CenterContent>
        <EmptyIconContainer testID="notification-empty-icon">
          <EmptyIcon accessibilityElementsHidden>{'\uD83D\uDD14'}</EmptyIcon>
        </EmptyIconContainer>

        <EmptyTitle testID="notification-empty-title">
          {t('notification.empty.title')}
        </EmptyTitle>

        <EmptyDescription testID="notification-empty-description">
          {t('notification.empty.description')}
        </EmptyDescription>

        <GoHomeButton
          onPress={handleGoHome}
          accessibilityRole="button"
          accessibilityLabel={t('notification.empty.goHome')}
          testID="notification-empty-go-home"
        >
          <GoHomeText>{t('notification.empty.goHome')}</GoHomeText>
        </GoHomeButton>
      </CenterContent>
    </Container>
  );
};

export default NotificationEmptyScreen;
