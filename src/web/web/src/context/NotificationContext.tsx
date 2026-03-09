import React, { createContext, useContext, ReactNode } from 'react'; // react 18.0+
import { Notification } from 'shared/types';

import { useNotifications } from '../hooks/useNotifications';

/**
 * Type definition for the notification context
 * Provides access to notifications data and related functionality
 */
interface NotificationContextType {
    /** List of user notifications */
    notifications: Notification[];

    /** Loading state for notification data */
    isLoading: boolean;

    /** Function to mark a notification as read */
    markAsRead: (notificationId: string) => Promise<void>;

    /** Count of unread notifications */
    unreadCount: number | undefined;
}

// Create the context with a default value of undefined
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
const CtxProvider = NotificationContext.Provider;

/**
 * Props for the NotificationProvider component
 */
interface NotificationProviderProps {
    /** React children */
    children: ReactNode;
}

/**
 * Provider component that makes notification functionality available to all child components
 * This provider should be placed within the application's component tree, typically near the root
 * but below the AuthProvider since it depends on authentication state.
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    // Use the useNotifications hook to get notification functionality
    const { notifications, isLoading, markAsRead, unreadCount } = useNotifications();

    // The value to be provided to consuming components
    const contextValue: NotificationContextType = {
        notifications,
        isLoading,
        markAsRead,
        unreadCount,
    };

    return <CtxProvider value={contextValue}>{children}</CtxProvider>;
};

/**
 * Custom hook to use the notification context
 * This hook provides access to the user's notifications and related functionality
 *
 * @returns The notification context value including notifications, loading state, and functions
 * @throws Error if used outside of NotificationProvider
 *
 * @example
 * const { notifications, markAsRead, unreadCount } = useNotificationContext();
 *
 * // Display unread count
 * return <Badge count={unreadCount} />;
 */
export const useNotificationContext = (): NotificationContextType => {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }

    return context;
};
