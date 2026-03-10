/**
 * Notification Service API
 *
 * This module provides functions for interacting with the notification service,
 * allowing clients to fetch user notifications, mark notifications as read,
 * and subscribe to notification updates via polling.
 */

import { AxiosResponse } from 'axios'; // axios version 1.6.7
import { restClient } from './client';
import { Notification } from 'shared/types';

/** Default polling interval for notification subscription (in milliseconds). */
const DEFAULT_POLL_INTERVAL_MS = 15_000;

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
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
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
        if (stopped) return;

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
