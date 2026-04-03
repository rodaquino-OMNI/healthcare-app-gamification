/**
 * Notification Service API
 *
 * This module provides functions for interacting with the notification service,
 * allowing clients to fetch user notifications, mark notifications as read,
 * and subscribe to notification updates via polling.
 */

import { AxiosResponse } from 'axios'; // axios version 1.6.7
import { Notification } from 'shared/types';

import { restClient } from './client';

/** Default polling interval for notification subscription (in milliseconds). */
const DEFAULT_POLL_INTERVAL_MS = 15_000;

/** Notification preferences for a user. */
export interface NotificationPreferences {
    userId: string;
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    appointmentReminders: boolean;
    medicationReminders: boolean;
    claimUpdates: boolean;
    healthAlerts: boolean;
    gamificationUpdates: boolean;
    marketingMessages: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
}

/** Available notification category. */
export interface NotificationCategory {
    id: string;
    name: string;
    description: string;
    defaultEnabled: boolean;
    channels: Array<'push' | 'email' | 'sms' | 'in_app'>;
}

/**
 * Fetches notifications for a user.
 *
 * @param userId - The ID of the user to fetch notifications for
 * @returns A promise that resolves to the notifications data
 */
export const getNotifications = async (userId: string): Promise<Notification[]> => {
    try {
        const response: AxiosResponse<Notification[]> = await restClient.get(`/notifications/user/${userId}`);
        return response.data;
    } catch {
        return [];
    }
};

/**
 * Marks a notification as read.
 *
 * @param notificationId - The ID of the notification to mark as read
 * @returns A promise that resolves with the updated notification data
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    try {
        const response: AxiosResponse<Notification> = await restClient.post(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

/**
 * Subscribes to notification updates for a user via polling.
 *
 * Periodically fetches notifications from `GET /notifications/user/:userId` and
 * invokes the callback with any notifications that were not present in the
 * previous poll (compared by `id`). The first poll establishes the baseline
 * and does not trigger the callback.
 *
 * @param userId - The ID of the user to subscribe to notifications for
 * @param callback - A callback function invoked with each new notification
 * @param intervalMs - Polling interval in milliseconds (defaults to 15 000)
 * @returns A cleanup function that stops polling when called
 */
export const subscribeToNotifications = (
    userId: string,
    callback: (notification: Notification) => void,
    intervalMs: number = DEFAULT_POLL_INTERVAL_MS
): (() => void) => {
    let knownIds = new Set<string>();
    let isFirstPoll = true;
    let stopped = false;

    const poll = async (): Promise<void> => {
        if (stopped) {
            return;
        }

        try {
            const notifications = await getNotifications(userId);

            if (isFirstPoll) {
                // Seed the known set so existing notifications are not treated as new.
                knownIds = new Set(notifications.map((n) => n.id));
                isFirstPoll = false;
            } else {
                for (const notification of notifications) {
                    if (!knownIds.has(notification.id)) {
                        knownIds.add(notification.id);
                        callback(notification);
                    }
                }
            }
        } catch (error) {
            // Log but do not stop polling -- transient network errors are expected.
            console.error('Error polling notifications:', error);
        }
    };

    // Perform an initial poll immediately, then continue on the interval.
    void poll();
    const intervalHandle = setInterval(() => void poll(), intervalMs);

    return () => {
        stopped = true;
        clearInterval(intervalHandle);
    };
};

/**
 * Marks all notifications as read for a given user.
 *
 * @param userId - The ID of the user whose notifications to mark as read
 * @returns A promise that resolves when all notifications are marked as read
 */
export const markAllAsRead = async (userId: string): Promise<void> => {
    try {
        await restClient.post('/notifications/mark-all-read', { userId });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

/**
 * Deletes a specific notification by ID.
 *
 * @param notificationId - The ID of the notification to delete
 * @returns A promise that resolves when the notification is deleted
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
    try {
        await restClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

/**
 * Fetches the notification preferences for a given user.
 *
 * @param userId - The ID of the user whose preferences to fetch
 * @returns Promise that resolves to NotificationPreferences
 */
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences> => {
    try {
        const response = await restClient.get<NotificationPreferences>(`/users/${userId}/notification-preferences`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
        throw error;
    }
};

/**
 * Updates notification preferences for a given user.
 *
 * @param userId - The ID of the user whose preferences to update
 * @param prefs - Partial preferences object with the fields to update
 * @returns Promise that resolves to the updated NotificationPreferences
 */
export const updateNotificationPreferences = async (
    userId: string,
    prefs: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
    try {
        const response = await restClient.put<NotificationPreferences>(
            `/users/${userId}/notification-preferences`,
            prefs
        );
        return response.data;
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        throw error;
    }
};

/**
 * Fetches all available notification categories.
 *
 * @returns Promise that resolves to an array of NotificationCategory objects
 */
export const getNotificationCategories = async (): Promise<NotificationCategory[]> => {
    try {
        const response = await restClient.get<NotificationCategory[]>('/notification-categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching notification categories:', error);
        throw error;
    }
};

/**
 * Fetches the count of unread notifications for a given user.
 *
 * @param userId - The ID of the user
 * @returns Promise that resolves to the unread notification count
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
    try {
        const response = await restClient.get<number>(`/notifications/unread-count?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        throw error;
    }
};

/**
 * Registers a push notification token for a user's device.
 *
 * @param userId - The ID of the user
 * @param token - The device push token to register
 * @param platform - The device platform ('web', 'ios', or 'android')
 * @returns Promise that resolves when the token is registered
 */
export const registerPushToken = async (
    userId: string,
    token: string,
    platform: 'web' | 'ios' | 'android'
): Promise<void> => {
    try {
        await restClient.post('/notifications/push-token', { userId, token, platform });
    } catch (error) {
        console.error('Error registering push token:', error);
        throw error;
    }
};

/**
 * Unregisters the push notification token for a user's device.
 *
 * @param userId - The ID of the user whose push token to remove
 * @returns Promise that resolves when the token is unregistered
 */
export const unregisterPushToken = async (userId: string): Promise<void> => {
    try {
        await restClient.delete(`/notifications/push-token?userId=${userId}`);
    } catch (error) {
        console.error('Error unregistering push token:', error);
        throw error;
    }
};

/**
 * Fetches paginated notification history for a user.
 *
 * @param userId - The ID of the user
 * @param page - The page number to fetch (1-based, defaults to 1)
 * @param limit - The number of notifications per page (defaults to 20)
 * @returns Promise that resolves to a paginated result containing notifications and metadata
 */
export const getNotificationHistory = async (
    userId: string,
    page?: number,
    limit?: number
): Promise<{ notifications: Notification[]; total: number; page: number }> => {
    try {
        const response = await restClient.get<{ notifications: Notification[]; total: number; page: number }>(
            '/notifications/history',
            { params: { userId, page, limit } }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching notification history:', error);
        throw error;
    }
};

/**
 * Clears all notifications for a given user.
 *
 * @param userId - The ID of the user whose notifications to clear
 * @returns Promise that resolves when all notifications are cleared
 */
export const clearAllNotifications = async (userId: string): Promise<void> => {
    try {
        await restClient.delete(`/notifications?userId=${userId}`);
    } catch (error) {
        console.error('Error clearing all notifications:', error);
        throw error;
    }
};

/**
 * Fetches the details of a specific notification by ID.
 *
 * @param notificationId - The ID of the notification to fetch
 * @returns Promise that resolves to the notification details
 */
export const getNotificationDetail = async (notificationId: string): Promise<Notification> => {
    try {
        const response: AxiosResponse<Notification> = await restClient.get(`/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notification detail:', error);
        throw error;
    }
};

/**
 * Snoozes a notification for a specified duration.
 *
 * @param notificationId - The ID of the notification to snooze
 * @param snoozeDuration - The snooze duration in minutes
 * @returns Promise that resolves when the notification is snoozed
 */
export const snoozeNotification = async (notificationId: string, snoozeDuration: number): Promise<void> => {
    try {
        await restClient.post(`/notifications/${notificationId}/snooze`, { snoozeDuration });
    } catch (error) {
        console.error('Error snoozing notification:', error);
        throw error;
    }
};

/**
 * Schedules a notification for future delivery.
 *
 * @param userId - The ID of the user to schedule the notification for
 * @param notification - The notification scheduling payload
 * @returns Promise that resolves to the scheduled notification
 */
export const scheduleNotification = async (
    userId: string,
    notification: { title: string; body: string; scheduledAt: string; type?: string }
): Promise<Notification> => {
    try {
        const response: AxiosResponse<Notification> = await restClient.post('/notifications/schedule', {
            userId,
            ...notification,
        });
        return response.data;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        throw error;
    }
};

/**
 * Fetches notification statistics for a user.
 *
 * @param userId - The ID of the user
 * @returns Promise that resolves to the notification statistics
 */
export const getNotificationStats = async (
    userId: string
): Promise<{ total: number; unread: number; byCategory: Record<string, number> }> => {
    try {
        const response = await restClient.get<{ total: number; unread: number; byCategory: Record<string, number> }>(
            '/notifications/stats',
            { params: { userId } }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching notification stats:', error);
        throw error;
    }
};

/**
 * Fetches all available notification templates.
 *
 * @returns Promise that resolves to an array of notification templates
 */
export const getNotificationTemplates = async (): Promise<
    Array<{ id: string; name: string; template: string; variables: string[] }>
> => {
    try {
        const response =
            await restClient.get<Array<{ id: string; name: string; template: string; variables: string[] }>>(
                '/notification-templates'
            );
        return response.data;
    } catch (error) {
        console.error('Error fetching notification templates:', error);
        throw error;
    }
};
