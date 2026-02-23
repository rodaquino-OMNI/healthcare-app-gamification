import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { HomeTabScreenNavigationProp } from '../../navigation/types';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { Notification, NotificationStatus } from 'src/web/shared/types/notification.types';
import { useNotifications } from 'src/web/mobile/src/hooks/useNotifications';
import { useNotificationContext } from 'src/web/mobile/src/context/NotificationContext';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { typography, fontSizeValues } from '../../../../design-system/src/tokens/typography';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import { ROUTES } from '../../constants/routes';
import { useTranslation } from 'react-i18next';

/**
 * Parametros da rota de detalhe de notificacao
 */
type NotificationDetailParams = {
  NotificationDetail: {
    notificationId: string;
  };
};

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
 * Retorna o icone representativo do tipo de notificacao
 */
const getNotificationTypeIcon = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'appointment':
    case 'care':
      return '📅';
    case 'medication':
    case 'health':
      return '💊';
    case 'alert':
    case 'error':
      return '⚠️';
    case 'plan':
      return '📋';
    default:
      return '🔔';
  }
};

/**
 * Formata a data da notificacao para exibicao completa em pt-BR
 */
const formatFullDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} as ${hours}:${minutes}`;
};

/**
 * Tela de detalhe de notificacao do AUSTA SuperApp.
 * Exibe o conteudo completo da notificacao com acoes contextuais
 * baseadas no tipo (consulta, medicamento, alerta, plano).
 */
export const NotificationDetailScreen: React.FC = () => {
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<HomeTabScreenNavigationProp>();
  const route = useRoute<RouteProp<NotificationDetailParams, 'NotificationDetail'>>();
  const { notificationId } = route.params;
  const { notifications } = useNotifications();
  const notificationContext = useNotificationContext();

  // Buscar notificacao pelo ID
  const notification = useMemo(() => {
    return notifications?.find((n) => n.id === notificationId) || null;
  }, [notifications, notificationId]);

  const typeColor = getNotificationTypeColor(notification?.type || notification?.journey || '');
  const typeLabel = getNotificationTypeLabel(notification?.type || notification?.journey || '');
  const typeIcon = getNotificationTypeIcon(notification?.type || notification?.journey || '');
  const isRead = notification?.status === NotificationStatus.READ;

  // Marcar como lida
  const handleMarkAsRead = async () => {
    if (notification && notification.status !== NotificationStatus.READ) {
      try {
        await notificationContext.markAsRead(notification.id);
      } catch (err) {
        console.error('Erro ao marcar como lida:', err);
      }
    }
  };

  // Compartilhar notificacao
  const handleShare = async () => {
    if (!notification) return;
    try {
      await Share.share({
        title: notification.title,
        message: `${notification.title}\n\n${notification.body}`,
      });
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  // Acao principal baseada no tipo
  const handlePrimaryAction = () => {
    if (!notification) return;
    const type = (notification.type || notification.journey || '').toLowerCase();
    switch (type) {
      case 'appointment':
      case 'care':
        navigation.navigate(ROUTES.CARE_APPOINTMENTS as never);
        break;
      case 'medication':
      case 'health':
        navigation.navigate(ROUTES.CARE_MEDICATION_TRACKING as never);
        break;
      case 'plan':
        navigation.navigate(ROUTES.PLAN_DASHBOARD as never);
        break;
      default:
        break;
    }
  };

  // Texto do botao de acao principal
  const getPrimaryActionLabel = (): string => {
    const type = (notification?.type || notification?.journey || '').toLowerCase();
    switch (type) {
      case 'appointment':
      case 'care':
        return t('notificationScreens.viewAppointment');
      case 'medication':
      case 'health':
        return t('notificationScreens.takeMedication');
      case 'alert':
      case 'error':
        return t('notificationScreens.viewDetails');
      case 'plan':
        return t('notificationScreens.viewPlan');
      default:
        return t('notificationScreens.viewDetails');
    }
  };

  // Notificacao nao encontrada
  if (!notification) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{t('notificationScreens.notFound')}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{t('common.buttons.back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header do botao voltar */}
        <TouchableOpacity
          style={styles.navBackButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.navBackText}>{t('notificationScreens.backNav')}</Text>
        </TouchableOpacity>

        {/* Card principal */}
        <View style={[styles.card, { borderTopColor: typeColor }]}>
          {/* Icone e badge de tipo */}
          <View style={styles.typeRow}>
            <View style={styles.typeIconContainer}>
              <Text style={styles.typeIconText}>{typeIcon}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
              <Text style={[styles.typeBadgeText, { color: typeColor }]}>{typeLabel}</Text>
            </View>
            {!isRead && (
              <View style={[styles.unreadDot, { backgroundColor: typeColor }]} />
            )}
          </View>

          {/* Titulo */}
          <Text style={styles.title}>{notification.title}</Text>

          {/* Data */}
          <Text style={styles.timestamp}>
            {formatFullDate(new Date(notification.createdAt))}
          </Text>

          {/* Corpo */}
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>{notification.body}</Text>
          </View>
        </View>

        {/* Acoes */}
        <View style={styles.actionsContainer}>
          {/* Botao de acao principal */}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: typeColor }]}
            onPress={handlePrimaryAction}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>{getPrimaryActionLabel()}</Text>
          </TouchableOpacity>

          {/* Botao marcar como lida */}
          {!isRead && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleMarkAsRead}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>{t('notificationScreens.markAsRead')}</Text>
            </TouchableOpacity>
          )}

          {/* Botao compartilhar */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>{t('notificationScreens.share')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.muted,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingValues.xl,
  },
  navBackButton: {
    marginBottom: spacingValues.md,
    paddingVertical: spacingValues.xs,
  },
  navBackText: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.medium) as '500',
    color: colors.brand.primary,
  },
  card: {
    backgroundColor: theme.colors.background.default,
    borderRadius: borderRadiusValues.lg,
    borderTopWidth: 4,
    padding: spacingValues.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacingValues.lg,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingValues.sm,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadiusValues.md,
    backgroundColor: theme.colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacingValues.sm,
  },
  typeIconText: {
    fontSize: 20,
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacingValues.xs,
  },
  title: {
    fontSize: fontSizeValues.xl,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: theme.colors.text.default,
    marginBottom: spacingValues.xs,
    lineHeight: fontSizeValues.xl * typography.lineHeight.heading,
  },
  timestamp: {
    fontSize: fontSizeValues.xs,
    color: theme.colors.text.subtle,
    marginBottom: spacingValues.md,
  },
  bodyContainer: {
    paddingTop: spacingValues.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  bodyText: {
    fontSize: fontSizeValues.md,
    color: theme.colors.text.default,
    lineHeight: fontSizeValues.md * typography.lineHeight.base,
  },
  actionsContainer: {
    gap: spacingValues.sm,
  },
  primaryButton: {
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.lg,
    borderRadius: borderRadiusValues.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.bold) as '700',
    color: theme.colors.text.onBrand,
  },
  secondaryButton: {
    paddingVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.lg,
    borderRadius: borderRadiusValues.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: fontSizeValues.md,
    fontWeight: String(typography.fontWeight.medium) as '500',
    color: theme.colors.text.default,
  },
  errorText: {
    fontSize: fontSizeValues.md,
    color: colors.semantic.error,
    marginBottom: spacingValues.md,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: borderRadiusValues.sm,
  },
  backButtonText: {
    color: theme.colors.text.onBrand,
    fontWeight: String(typography.fontWeight.bold) as '700',
    fontSize: fontSizeValues.sm,
  },
});

export default NotificationDetailScreen;
