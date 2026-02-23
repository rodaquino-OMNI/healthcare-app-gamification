import { useState, useEffect, useCallback } from 'react'; // Version ^18.0.0
import { getNotifications, markNotificationAsRead } from '../api/notifications';
import { Notification, NotificationStatus } from '@shared/types/notification.types';

/**
 * A React hook that fetches and manages notifications for the current user.
 * 
 * This hook provides functionalities to fetch notifications, mark them as read,
 * and track loading and error states throughout the process.
 * 
 * @returns An object containing notifications, loading state, error state, and utility functions.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Function to fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // In a real implementation, this would be replaced with the actual
      // method of getting the current user's ID from a context or auth service
      const userId = "current-user-id"; // Placeholder for demonstration
      
      const data = await getNotifications(userId);
      setNotifications(data as unknown as Notification[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update the local state to reflect the change
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { 
                ...notification, 
                status: NotificationStatus.READ, 
                readAt: new Date() 
              } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);
  
  return { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    refresh: fetchNotifications 
  };
};