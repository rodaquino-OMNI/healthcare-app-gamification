import React, { useCallback } from 'react'; // react v18.0.0
import { FlatList, TouchableOpacity, View, StyleSheet } from 'react-native'; // react-native v0.70.0
import { useNavigation } from '@react-navigation/native'; // @react-navigation/native v6.0.0
import {
  Card,
  Text,
  Icon,
  Badge,
} from '@design-system/components';
import EmptyState from '../shared/EmptyState';
import { LoadingIndicator } from '../shared/LoadingIndicator';
import { useNotifications } from '../../hooks/useNotifications';
import { useJourney } from '../../hooks/useJourney';
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from '@shared/types/notification.types';
import { formatRelativeDate } from '../../utils/date';

/**
 * Interface defining the props for the NotificationList component
 */
interface NotificationListProps {
  /**
   * Optional filter criteria for notifications
   */
  filter?: object;
  /**
   * Optional callback when a notification is pressed
   */
  onNotificationPress?: (notification: Notification) => void;
  /**
   * Optional limit on the number of notifications to display
   */
  maxItems?: number;
  /**
   * Whether to show the empty state when no notifications exist
   */
  showEmptyState?: boolean;
}

/**
 * Returns the appropriate icon name based on notification type
 * @param NotificationType type
 * @returns Icon name to be used for the notification type
 */
const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.ACHIEVEMENT_UNLOCKED:
      return 'trophy';
    case NotificationType.APPOINTMENT_REMINDER:
      return 'calendar';
    case NotificationType.CLAIM_STATUS_UPDATE:
      return 'document';
    case NotificationType.LEVEL_UP:
      return 'level-up';
    default:
      return 'notifications';
  }
};

/**
 * Component that renders a list of notifications with journey-specific styling
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  filter,
  onNotificationPress,
  maxItems,
  showEmptyState,
}) => {
  // Use the useNotifications hook to get notifications, loading state, and markAsRead function
  const { notifications, loading, error, markAsRead } = useNotifications();

  // Use the useJourney hook to get the current journey context
  const { journey } = useJourney();

  // Use the useNavigation hook for handling deep links
  const navigation = useNavigation();

  // Filter notifications based on the filter prop if provided
  const filteredNotifications = filter
    ? notifications.filter((notification) => (filter as (n: Notification) => boolean)(notification))
    : notifications;

  // Limit the number of notifications based on maxItems prop if provided
  const limitedNotifications = maxItems
    ? filteredNotifications.slice(0, maxItems)
    : filteredNotifications;

  // Define a renderItem function to render each notification
  const renderItem = useCallback(
    ({ item }: { item: Notification }) => {
      // Handle notification press by marking as read and navigating to deep link if available
      const handlePress = async () => {
        try {
          await markAsRead(item.id);
          if (item.deepLink) {
            (navigation as any).navigate(item.deepLink);
          }
          if (onNotificationPress) {
            onNotificationPress(item);
          }
        } catch (err) {
          console.error('Error handling notification press:', err);
        }
      };

      return (
        <TouchableOpacity onPress={handlePress} style={styles.notificationItem}>
          <Card journey={item.journey as 'health' | 'care' | 'plan' | undefined}>
            <View style={styles.notificationHeader}>
              <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                  <Icon name={getNotificationIcon(item.type)} size={24} />
                </View>
                <Text style={styles.notificationTitle}>{item.title}</Text>
              </View>
              {item.status !== NotificationStatus.READ && (
                <Badge style={styles.unreadIndicator} />
              )}
            </View>
            <Text style={styles.notificationBody}>{item.body}</Text>
            <Text style={styles.notificationTime}>
              {formatRelativeDate(new Date(item.createdAt))}
            </Text>
          </Card>
        </TouchableOpacity>
      );
    },
    [markAsRead, navigation, onNotificationPress]
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (limitedNotifications.length === 0 && showEmptyState) {
    return (
      <EmptyState
        icon="notifications"
        title="No notifications yet"
        description="Check back later for updates"
      />
    );
  }

  return (
    <FlatList
      data={limitedNotifications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationItem: {
    marginBottom: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#757575',
  },
  notificationBody: {
    marginTop: 4,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 4,
    right: 4,
  },
});