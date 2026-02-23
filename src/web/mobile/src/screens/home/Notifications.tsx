import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { HomeNavigationProp } from '../../navigation/types';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { Notification, NotificationStatus } from '@shared/types/notification.types';
import { useNotifications } from '@hooks/useNotifications';
import { useNotificationContext } from '@context/NotificationContext';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { typography, fontSizeValues } from '@design-system/tokens/typography';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { ROUTES } from '../../constants/routes';
import { useTranslation } from 'react-i18next';

/**
 * Tipos de filtro para notificacoes
 */
type FilterType = 'all' | 'unread' | 'read';

/**
 * Mapeamento de tipo de notificacao para cor da jornada
 */
const getNotificationTypeColor = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'appointment':
    case 'care':
      return colors.journeys.care.primary;
    case 'medication':
    case 'health':
      return colors.journeys.health.primary;
    case 'alert':
    case 'error':
      return colors.semantic.error;
    case 'plan':
      return colors.journeys.plan.primary;
    default:
      return colors.gray[40];
  }
};

/**
 * Retorna o label em pt-BR para o tipo de notificacao
 */
const getNotificationTypeLabel = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'appointment':
    case 'care':
      return 'Consulta';
    case 'medication':
    case 'health':
      return 'Medicamento';
    case 'alert':
    case 'error':
      return 'Alerta';
    case 'plan':
      return 'Plano';
    default:
      return 'Geral';
  }
};

/**
 * Formata a data da notificacao para exibicao relativa em pt-BR
 */
const formatNotificationDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return diffDays === 1 ? 'Ontem' : `${diffDays} dias atras`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} atras`;
  } else if (diffMin > 0) {
    return `${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'} atras`;
  } else {
    return 'Agora mesmo';
  }
};

/**
 * Tela de notificacoes do AUSTA SuperApp.
 * Exibe lista de notificacoes com filtros, badges de tipo,
 * estado vazio, e acao de marcar todas como lidas.
 */
export const NotificationsScreen: React.FC = () => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { notifications, loading, error, refresh } = useNotifications();
  const notificationContext = useNotificationContext();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Atualizar notificacoes quando a tela recebe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
    });
    return unsubscribe;
  }, [navigation, refresh]);

  // Filtrar notificacoes com base no filtro ativo
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    switch (activeFilter) {
      case 'unread':
        return notifications.filter((n) => n.status !== NotificationStatus.READ);
      case 'read':
        return notifications.filter((n) => n.status === NotificationStatus.READ);
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  // Conta de nao lidas para exibicao no header
  const unreadCount = useMemo(() => {
    if (!notifications) return 0;
    return notifications.filter((n) => n.status !== NotificationStatus.READ).length;
  }, [notifications]);

  // Marcar notificacao como lida e navegar para detalhe
  const handleNotificationPress = async (notification: Notification) => {
    try {
      if (notification.status !== NotificationStatus.READ) {
        await notificationContext.markAsRead(notification.id);
      }
      navigation.navigate('NotificationDetail', {
        notificationId: notification.id,
      });
    } catch (err) {
      console.error('Erro ao processar notificacao:', err);
    }
  };

  // Marcar todas como lidas
  const handleMarkAllRead = async () => {
    if (!notifications) return;
    const unread = notifications.filter((n) => n.status !== NotificationStatus.READ);
    for (const n of unread) {
      try {
        await notificationContext.markAsRead(n.id);
      } catch (err) {
        console.error('Erro ao marcar notificacao como lida:', err);
      }
    }
  };

  // Renderizar item de notificacao
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const typeColor = getNotificationTypeColor(item.type || item.journey);
    const typeLabel = getNotificationTypeLabel(item.type || item.journey);
    const isRead = item.status === NotificationStatus.READ;
    const formattedDate = formatNotificationDate(new Date(item.createdAt));

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { borderLeftColor: typeColor },
          isRead && styles.readNotification,
        ]}
        onPress={() => handleNotificationPress(item)}
        accessibilityLabel={`Notificacao: ${item.title}`}
        accessibilityRole="button"
      >
        <View style={styles.notificationRow}>
          {!isRead && (
            <View style={[styles.unreadIndicator, { backgroundColor: typeColor }]} />
          )}
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
                <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                  {typeLabel}
                </Text>
              </View>
              <Text style={styles.notificationTime}>{formattedDate}</Text>
            </View>
            <Text style={[styles.notificationTitle, isRead && styles.readText]}>
              {item.title}
            </Text>
            <Text
              style={[styles.notificationBody, isRead && styles.readText]}
              numberOfLines={2}
            >
              {item.body}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Abas de filtro
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('notifications.filterAll') },
    { key: 'unread', label: t('notifications.filterUnread') },
    { key: 'read', label: t('notifications.filterRead') },
  ];

  // Estado de carregamento
  if (loading && (!notifications || notifications.length === 0)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
          <Text style={styles.loadingText}>{t('notifications.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{t('notifications.loadError')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>{t('common.buttons.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header com titulo e botao marcar todas como lidas */}
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>{t('notifications.title')}</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} accessibilityRole="button">
            <Text style={styles.markAllText}>{t('notifications.markAllRead')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Abas de filtro */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista vazia */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconPlaceholder}>
            <Text style={styles.emptyIconText}>{'🔔'}</Text>
          </View>
          <Text style={styles.emptyText}>{t('notifications.empty')}</Text>
          <Text style={styles.emptySubtext}>
            {t('notifications.emptySubtext')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refresh}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  screenTitle: {
    fontSize: fontSizeValues.xl,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: theme.colors.text.default,
  },
  markAllText: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(typography.fontWeight.medium) as '500',
    color: colors.brand.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  filterTab: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.full,
    marginRight: spacingValues.xs,
  },
  filterTabActive: {
    backgroundColor: colors.brand.primary + '15',
  },
  filterTabText: {
    fontSize: fontSizeValues.sm,
    fontWeight: String(typography.fontWeight.medium) as '500',
    color: theme.colors.text.muted,
  },
  filterTabTextActive: {
    color: colors.brand.primary,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingValues.xl,
  },
  listContainer: {
    padding: spacingValues.md,
  },
  notificationItem: {
    backgroundColor: theme.colors.background.default,
    borderRadius: borderRadiusValues.md,
    marginBottom: spacingValues.sm,
    padding: spacingValues.md,
    borderLeftWidth: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  readNotification: {
    backgroundColor: theme.colors.background.muted,
    shadowOpacity: 0.03,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacingValues.sm,
    marginTop: spacingValues['2xs'],
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues['3xs'],
  },
  typeBadge: {
    paddingHorizontal: spacingValues.xs,
    paddingVertical: spacingValues['4xs'],
    borderRadius: borderRadiusValues.xs,
  },
  typeBadgeText: {
    fontSize: fontSizeValues.xs,
    fontWeight: String(typography.fontWeight.semiBold) as '600',
  },
  notificationTitle: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.bold) as '700',
    marginBottom: spacingValues['3xs'],
    color: theme.colors.text.default,
  },
  notificationBody: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.muted,
    marginBottom: spacingValues.xs,
    lineHeight: fontSizeValues.sm * typography.lineHeight.base,
  },
  notificationTime: {
    fontSize: fontSizeValues.xs,
    color: theme.colors.text.subtle,
  },
  readText: {
    color: theme.colors.text.subtle,
  },
  errorText: {
    fontSize: fontSizeValues.md,
    color: colors.semantic.error,
    marginBottom: spacingValues.md,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.muted,
    marginTop: spacingValues.sm,
  },
  emptyIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingValues.md,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: fontSizeValues.lg,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: theme.colors.text.default,
    marginBottom: spacingValues.xs,
  },
  emptySubtext: {
    fontSize: fontSizeValues.sm,
    color: theme.colors.text.subtle,
    textAlign: 'center',
    lineHeight: fontSizeValues.sm * typography.lineHeight.base,
  },
  retryButton: {
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.sm,
  },
  retryButtonText: {
    color: theme.colors.text.onBrand,
    fontWeight: String(typography.fontWeight.bold) as '700',
    fontSize: fontSizeValues.sm,
  },
});

export default NotificationsScreen;
