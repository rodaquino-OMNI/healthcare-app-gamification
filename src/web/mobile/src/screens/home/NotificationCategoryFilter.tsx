import React, { useState, useMemo, useCallback } from 'react';
import { FlatList, ScrollView } from 'react-native';
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

const HeaderSpacer = styled.View`
  width: ${sizing.component.sm};
`;

const FilterContainer = styled.View`
  padding-vertical: ${spacing.sm};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[20]};
`;

const FilterPill = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.xs};
  border-radius: ${borderRadius.full};
  background-color: ${(props) =>
    props.active ? colors.brand.primary : colors.gray[10]};
  margin-right: ${spacing.xs};
`;

const FilterPillText = styled.Text<{ active: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${(props) =>
    props.active ? colors.neutral.white : colors.gray[50]};
`;

const NotificationCard = styled.TouchableOpacity<{ borderColor: string }>`
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin-horizontal: ${spacing.md};
  margin-bottom: ${spacing.sm};
  border-left-width: 4px;
  border-left-color: ${(props) => props.borderColor};
  shadow-color: ${colors.neutral.black};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 3px;
  elevation: 2;
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
`;

// --- Types ---

type CategoryType = 'all' | 'health' | 'care' | 'plan' | 'system';

interface CategoryNotification {
  id: string;
  category: Exclude<CategoryType, 'all'>;
  title: string;
  preview: string;
  timestamp: string;
}

interface FilterTab {
  key: CategoryType;
  labelKey: string;
}

// --- Helpers ---

const getCategoryColor = (category: Exclude<CategoryType, 'all'>): string => {
  switch (category) {
    case 'health':
      return colors.journeys.health.primary;
    case 'care':
      return colors.journeys.care.primary;
    case 'plan':
      return colors.journeys.plan.primary;
    case 'system':
      return colors.gray[50];
  }
};

// --- Mock Data ---

const FILTER_TABS: FilterTab[] = [
  { key: 'all', labelKey: 'notification.category.all' },
  { key: 'health', labelKey: 'notification.category.health' },
  { key: 'care', labelKey: 'notification.category.care' },
  { key: 'plan', labelKey: 'notification.category.plan' },
  { key: 'system', labelKey: 'notification.category.system' },
];

const MOCK_NOTIFICATIONS: CategoryNotification[] = [
  {
    id: 'cat-1',
    category: 'health',
    title: 'Meta de passos',
    preview: 'Voce atingiu 8.000 de 10.000 passos hoje.',
    timestamp: '1h',
  },
  {
    id: 'cat-2',
    category: 'care',
    title: 'Consulta confirmada',
    preview: 'Sua consulta com Dr. Carlos Lima foi confirmada para 25 Fev.',
    timestamp: '3h',
  },
  {
    id: 'cat-3',
    category: 'plan',
    title: 'Cobertura atualizada',
    preview: 'Seu plano agora inclui cobertura odontologica.',
    timestamp: '5h',
  },
  {
    id: 'cat-4',
    category: 'system',
    title: 'Manutencao programada',
    preview: 'O app estara em manutencao dia 28 Fev das 02:00 as 04:00.',
    timestamp: '8h',
  },
  {
    id: 'cat-5',
    category: 'health',
    title: 'Medicamento tomado',
    preview: 'Losartana 50mg registrada com sucesso.',
    timestamp: '12h',
  },
  {
    id: 'cat-6',
    category: 'care',
    title: 'Resultado disponivel',
    preview: 'Seu hemograma completo esta pronto para visualizacao.',
    timestamp: '1d',
  },
  {
    id: 'cat-7',
    category: 'plan',
    title: 'Fatura disponivel',
    preview: 'A fatura de Fev/2026 esta disponivel para pagamento.',
    timestamp: '2d',
  },
  {
    id: 'cat-8',
    category: 'system',
    title: 'Novidade no app',
    preview: 'Agora voce pode agendar consultas por video.',
    timestamp: '3d',
  },
];

// --- Component ---

export const NotificationCategoryFilterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return MOCK_NOTIFICATIONS;
    return MOCK_NOTIFICATIONS.filter((n) => n.category === activeCategory);
  }, [activeCategory]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNotificationPress = useCallback(
    (id: string) => {
      navigation.navigate(ROUTES.NOTIFICATION_DETAIL as never, {
        notificationId: id,
      } as never);
    },
    [navigation],
  );

  const renderNotification = useCallback(
    ({ item }: { item: CategoryNotification }) => {
      const catColor = getCategoryColor(item.category);
      return (
        <NotificationCard
          borderColor={catColor}
          onPress={() => handleNotificationPress(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}`}
          testID={`category-notification-${item.id}`}
        >
          <CardHeader>
            <TypeBadge bgColor={`${catColor}20`}>
              <TypeBadgeText textColor={catColor}>
                {t(`notification.category.${item.category}`)}
              </TypeBadgeText>
            </TypeBadge>
            <TimestampText>{item.timestamp}</TimestampText>
          </CardHeader>
          <NotificationTitle>{item.title}</NotificationTitle>
          <PreviewText numberOfLines={2}>{item.preview}</PreviewText>
        </NotificationCard>
      );
    },
    [handleNotificationPress, t],
  );

  const keyExtractor = useCallback(
    (item: CategoryNotification) => item.id,
    [],
  );

  return (
    <Container>
      <Header>
        <BackButton
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          testID="category-filter-back"
        >
          <BackText>{'\u003C'}</BackText>
        </BackButton>
        <HeaderTitle
          accessibilityRole="header"
          testID="category-filter-title"
        >
          {t('notification.categoryFilter.title')}
        </HeaderTitle>
        <HeaderSpacer />
      </Header>

      <FilterContainer>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacingValues.md,
          }}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <FilterPill
                key={tab.key}
                active={isActive}
                onPress={() => setActiveCategory(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={t(tab.labelKey)}
                testID={`category-filter-tab-${tab.key}`}
              >
                <FilterPillText active={isActive}>
                  {t(tab.labelKey)}
                </FilterPillText>
              </FilterPill>
            );
          })}
        </ScrollView>
      </FilterContainer>

      {filteredNotifications.length === 0 ? (
        <EmptyContainer testID="category-filter-empty">
          <EmptyIcon accessibilityElementsHidden>{'\uD83D\uDD14'}</EmptyIcon>
          <EmptyTitle>
            {t('notification.categoryFilter.empty')}
          </EmptyTitle>
        </EmptyContainer>
      ) : (
        <FlatList
          data={filteredNotifications}
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

export default NotificationCategoryFilterScreen;
