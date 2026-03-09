import { useState, useEffect, useCallback, useRef } from 'react'; // react 18.2.0
import { Notification, NotificationStatus } from 'shared/types';

import { getNotifications, markNotificationAsRead, subscribeToNotifications } from '../api/notifications';
import { useAuth } from '../hooks/useAuth';

/** Shape returned by the useNotifications hook */
interface UseNotificationsReturn {
    notifications: Notification[];
    isLoading: boolean;
    unreadCount: number;
    markAsRead: (notificationId: string) => Promise<void>;
}

/**
 * A custom React hook for managing and interacting
 * with user notifications.
 *
 * @returns An object containing the notifications, isLoading,
 *   unread count, and markAsRead function.
 */
export const useNotifications = (): UseNotificationsReturn => {
    // State for storing notifications
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // Loading state
    const [isLoading, setIsLoading] = useState(true);
    // Count of unread notifications
    const [unreadCount, setUnreadCount] = useState(0);

    // Reference to store subscription for cleanup
    const subscriptionRef = useRef<(() => void) | null>(null);

    // Get the current user ID from auth
    const { userId } = useAuth();

    // Function to mark a notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);

            // Update the notifications state
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === notificationId
                        ? {
                              ...notification,
                              status: NotificationStatus.READ,
                              readAt: new Date().toISOString(),
                          }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    // Calculate unread count
    const calculateUnreadCount = useCallback((notificationsList: Notification[]) => {
        return notificationsList.filter((notification) => notification.status !== NotificationStatus.READ).length;
    }, []);

    // Handle new notification from real-time updates
    const handleNewNotification = useCallback((notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
    }, []);

    // Fetch notifications on component mount and when user ID changes
    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchNotifications = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const data: Notification[] = await getNotifications(userId);
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchNotifications();
    }, [userId]);

    // Subscribe to real-time notifications
    useEffect(() => {
        if (!userId) {
            return;
        }

        // Subscribe to real-time notifications
        subscriptionRef.current = subscribeToNotifications(
            userId,
            handleNewNotification as (notification: unknown) => void
        );

        // Cleanup function
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current();
            }
        };
    }, [userId, handleNewNotification]);

    // Update unread count whenever notifications change
    useEffect(() => {
        setUnreadCount(calculateUnreadCount(notifications));
    }, [notifications, calculateUnreadCount]);

    return {
        notifications,
        isLoading,
        unreadCount,
        markAsRead,
    };
};
