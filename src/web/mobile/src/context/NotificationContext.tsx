import { ReactNode, createContext, useState, useEffect, useCallback, useContext } from 'react';
import { api } from '../api/index';
import { useAuth } from '../hooks/useAuth';
import { Notification, NotificationStatus } from '../../shared/types/notification.types';

/**
 * Defines the structure of the notification context value.
 */
interface NotificationContextType {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

/**
 * React context for managing notifications.
 */
export const NotificationContext = createContext<NotificationContextType | null>(null);

/**
 * Provides the notification context to its children.
 */
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for storing notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Get authentication context for user info
  const auth = useAuth();
  
  /**
   * Get the current user ID from the authentication token
   */
  const getUserId = useCallback(() => {
    if (!auth.session?.accessToken) return null;
    
    const userData = auth.getUserFromToken(auth.session.accessToken);
    return userData?.id || null;
  }, [auth.session, auth.getUserFromToken]);
  
  /**
   * Fetch notifications for the current user
   */
  const fetchNotifications = useCallback(async () => {
    if (!auth.isAuthenticated) {
      console.warn('Cannot fetch notifications: User is not authenticated');
      return;
    }
    
    try {
      const userId = getUserId();
      
      if (!userId) {
        console.warn('Cannot fetch notifications: User ID not found');
        return;
      }
      
      const notificationData = await api.notifications.getNotifications(userId);
      setNotifications(notificationData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }, [auth.isAuthenticated, getUserId]);
  
  /**
   * Mark a notification as read
   * @param id - The ID of the notification to mark as read
   */
  const markAsRead = useCallback(async (id: string) => {
    if (!auth.isAuthenticated) {
      console.warn('Cannot mark notification as read: User is not authenticated');
      return;
    }
    
    try {
      await api.notifications.markNotificationAsRead(id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { 
                ...notification, 
                status: NotificationStatus.READ, 
                readAt: new Date() 
              } 
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }, [auth.isAuthenticated]);
  
  /**
   * Delete a notification
   * @param id - The ID of the notification to delete
   * 
   * Note: This is a placeholder implementation as the API doesn't 
   * currently provide a deleteNotification endpoint
   */
  const deleteNotification = useCallback(async (id: string) => {
    if (!auth.isAuthenticated) {
      console.warn('Cannot delete notification: User is not authenticated');
      return;
    }
    
    try {
      // In a real implementation, this would call an API endpoint
      // such as api.notifications.deleteNotification(id)
      console.warn('API endpoint for deleting notifications not implemented');
      
      // For now, just update the UI by removing the notification from state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }, [auth.isAuthenticated]);
  
  // Fetch notifications when authentication state changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchNotifications();
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
    }
  }, [auth.isAuthenticated, fetchNotifications]);
  
  // The value provided to consuming components
  const contextValue: NotificationContextType = {
    notifications,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to access the notification context.
 * Throws an error if used outside of a NotificationProvider.
 */
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  
  return context;
};