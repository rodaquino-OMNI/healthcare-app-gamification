import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Notification, NotificationStatus } from 'src/web/shared/types/notification.types';
import { useNotifications } from 'src/web/mobile/src/hooks/useNotifications';
import { useNotificationContext } from 'src/web/mobile/src/context/NotificationContext';
import { JOURNEY_COLORS } from 'src/web/shared/constants/journeys';
import { markNotificationAsRead } from 'src/web/mobile/src/api/notifications';

const Notifications = () => {
  const navigation = useNavigation();
  const { notifications, loading, error, refresh } = useNotifications();
  const notificationContext = useNotificationContext();

  // Refresh notifications when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
    });

    return unsubscribe;
  }, [navigation, refresh]);

  // Handle notification press - mark as read and navigate to relevant screen
  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Mark as read if not already read
      if (notification.status !== NotificationStatus.READ) {
        await notificationContext.markAsRead(notification.id);
      }
      
      // Navigate based on the notification's deepLink
      if (notification.deepLink) {
        // In a real implementation, we'd need to parse the deepLink and extract
        // the route name and params. For simplicity, we're assuming the deepLink
        // is directly usable as a route name.
        // @ts-ignore - navigation.navigate expects specific route names
        navigation.navigate(notification.deepLink);
      }
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  // Format the notification date for display
  const formatNotificationDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };

  // Get the appropriate color based on notification journey
  const getJourneyColor = (journey: string) => {
    switch (journey.toLowerCase()) {
      case 'health':
        return JOURNEY_COLORS.HEALTH;
      case 'care':
        return JOURNEY_COLORS.CARE;
      case 'plan':
        return JOURNEY_COLORS.PLAN;
      default:
        return '#9E9E9E'; // Default gray color
    }
  };

  // Render an individual notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const journeyColor = getJourneyColor(item.journey);
    const isRead = item.status === NotificationStatus.READ;
    const formattedDate = formatNotificationDate(new Date(item.createdAt));
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem, 
          { borderLeftColor: journeyColor },
          isRead && styles.readNotification
        ]} 
        onPress={() => handleNotificationPress(item)}
        accessibilityLabel={`Notification: ${item.title}`}
      >
        {!isRead && (
          <View 
            style={[styles.unreadIndicator, { backgroundColor: journeyColor }]} 
          />
        )}
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, isRead && styles.readText]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationBody, isRead && styles.readText]}>
            {item.body}
          </Text>
          <Text style={styles.notificationTime}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (loading && (!notifications || notifications.length === 0)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Could not load notifications</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (!notifications || notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No notifications yet</Text>
        <Text style={styles.emptySubtext}>
          We'll notify you about important updates and activities
        </Text>
      </View>
    );
  }

  // Notification list
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  readNotification: {
    backgroundColor: '#F9F9F9',
    shadowOpacity: 0.05,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    alignSelf: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  notificationBody: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9E9E9E',
    alignSelf: 'flex-end',
  },
  readText: {
    color: '#757575',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#616161',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Notifications;