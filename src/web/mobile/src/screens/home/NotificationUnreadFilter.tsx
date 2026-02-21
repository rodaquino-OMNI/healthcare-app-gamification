import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';
import { ROUTES } from '../../constants/routes';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[20]};
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
  color: ${colors.neutral.gray900};
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  text-align: center;
`;

const MarkAllButton = styled.TouchableOpacity`
  padding-vertical: ${spacing['3xs']};
  padding-horizontal: ${spacing.xs};
`;

const MarkAllText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

const NotificationCard = styled.TouchableOpacity`
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-horizontal: ${spacing.md};
  margin-bottom: ${spacing.sm};
  border-left-width: 4px;
  shadow-color: ${colors.neutral.black};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 3px;
  elevation: 2;
`;

const CardRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

const UnreadDot = styled.View<{ dotColor: string }>`
  width: 8px;
  height: 8px;
  border-radius: ${borderRadius.full};
  background-color: ${(props) => props.dotColor};
  margin-right: ${spacing.sm};
  margin-top: ${spacing['2xs']};
`;

const CardContent = styled.View`
  flex: 1;
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing['3xs']};
`;

const TypeBadge = styled.View<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  padding-horizontal: ${spacing.xs};
  padding-vertical: ${spacing['4xs']};
  border-radius: ${borderRadius.xs};
`;

const TypeBadgeText = styled.Text<{ textColor: string }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${(props) => props.textColor};
`;

const TimestampText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[40]};
`;

const NotificationTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing['4xs']};
`;

const PreviewText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
  line-height: 20px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${spacing['3xl']};
`;

const EmptyIcon = styled.Text`
  font-size: 48px;
  margin-bottom: ${spacing.md};
`;

const EmptyTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing.xs};
`;

const EmptyDescription = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[40]};
  text-align: center;
`;

// --- Types ---

type NotificationType = 'care' | 'health' | 'plan' | 'system';

interface UnreadNotification {
  id: string;
  type: NotificationType;
  title: string;
  preview: string;
  timestamp: string;
}

// --- Helpers ---

const getTypeColor = (type: NotificationType): string => {
  switch (type) {
    case 'care':
      return colors.journeys.care.primary;
    case 'health':
      return colors.journeys.health.primary;
    case 'plan':
      return colors.journeys.plan.primary;
    case 'system':
      return colors.gray[50];
  }
};

const getTypeLabelKey = (type: NotificationType): string => {
  switch (type) {
    case 'care':
      return 'notification.type.care';
    case 'health':
      return 'notification.type.health';
    case 'plan':
      return 'notification.type.plan';
    case 'system':
      return 'notification.type.system';
  }
};

// --- Mock Data ---

const MOCK_UNREAD: UnreadNotification[] = [
  {
    id: 'unread-1',
    type: 'care',
    title: 'Consulta amanha',
    preview: 'Lembrete: sua consulta com Dr. Ana Silva e amanha as 10:00.',
    timestamp: '2h',
  },
  {
    id: 'unread-2',
    type: 'health',
    title: 'Meta de passos atingida',
    preview: 'Parabens! Voce atingiu 10.000 passos hoje.',
    timestamp: '4h',
  },
  {
    id: 'unread-3',
    type: 'plan',
    title: 'Reembolso aprovado',
    preview: 'Seu pedido de reembolso #4523 foi aprovado.',
    timestamp: '6h',
  },
  {
    id: 'unread-4',
    type: 'system',
    title: 'Atualizacao do app',
    preview: 'Uma nova versao do AUSTA esta disponivel.',
    timestamp: '1d',
  },
  {
    id: 'unread-5',
    type: 'health',
    title: 'Hora do medicamento',
    preview: 'Lembrete: tomar Losartana 50mg agora.',
    timestamp: '1d',
  },
  {
    id: 'unread-6',
    type: 'care',
    title: 'Resultado de exame',
    preview: 'Seus resultados de exame de sangue estao disponiveis.',
    timestamp: '2d',
  },
];

// --- Component ---

export const NotificationUnreadFilterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(MOCK_UNREAD);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMarkAllRead = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleNotificationPress = useCallback(
    (id: string) => {
      navigation.navigate(ROUTES.NOTIFICATION_DETAIL as never, {
        notificationId: id,
      } as never);
    },
    [navigation],
  );

  const renderNotification = useCallback(
    ({ item }: { item: UnreadNotification }) => {
      const typeColor = getTypeColor(item.type);
      return (
        <NotificationCard
          style={{ borderLeftColor: typeColor }}
          onPress={() => handleNotificationPress(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`${t('notification.unread.notification')}: ${item.title}`}
          testID={`unread-notification-${item.id}`}
        >
          <CardRow>
            <UnreadDot dotColor={typeColor} />
            <CardContent>
              <CardHeader>
                <TypeBadge bgColor={`${typeColor}20`}>
                  <TypeBadgeText textColor={typeColor}>
                    {t(getTypeLabelKey(item.type))}
                  </TypeBadgeText>
                </TypeBadge>
                <TimestampText>{item.timestamp}</TimestampText>
              </CardHeader>
              <NotificationTitle>{item.title}</NotificationTitle>
              <PreviewText numberOfLines={2}>{item.preview}</PreviewText>
            </CardContent>
          </CardRow>
        </NotificationCard>
      );
    },
    [handleNotificationPress, t],
  );

  const keyExtractor = useCallback(
    (item: UnreadNotification) => item.id,
    [],
  );

  return (
    <Container>
      <Header>
        <BackButton
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          testID="unread-filter-back"
        >
          <BackText>{'\u003C'}</BackText>
        </BackButton>
        <HeaderTitle
          accessibilityRole="header"
          testID="unread-filter-title"
        >
          {t('notification.unread.title')}
        </HeaderTitle>
        {notifications.length > 0 ? (
          <MarkAllButton
            onPress={handleMarkAllRead}
            accessibilityRole="button"
            accessibilityLabel={t('notification.unread.markAllRead')}
            testID="unread-mark-all"
          >
            <MarkAllText>
              {t('notification.unread.markAll')}
            </MarkAllText>
          </MarkAllButton>
        ) : (
          <BackButton style={{ opacity: 0 }} disabled>
            <BackText>{' '}</BackText>
          </BackButton>
        )}
      </Header>

      {notifications.length === 0 ? (
        <EmptyContainer testID="unread-filter-empty">
          <EmptyIcon accessibilityElementsHidden>{'\u2705'}</EmptyIcon>
          <EmptyTitle>
            {t('notification.unread.emptyTitle')}
          </EmptyTitle>
          <EmptyDescription>
            {t('notification.unread.emptyDescription')}
          </EmptyDescription>
        </EmptyContainer>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingTop: spacingValues.md,
            paddingBottom: spacingValues['4xl'],
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Container>
  );
};

export default NotificationUnreadFilterScreen;
