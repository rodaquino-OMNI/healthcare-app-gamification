/**
 * Notification Service API
 *
 * This module provides functions for interacting with the notification service,
 * allowing clients to fetch user notifications and mark notifications as read.
 */

import axios from 'axios'; // axios version 1.6.7
import { baseURL } from 'shared/config/apiConfig';
import { Notification } from 'shared/types';

/**
 * Fetches notifications for a user.
 *
 * @param userId - The ID of the user to fetch notifications for
 * @returns A promise that resolves to the notifications data
 */
export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const url = `${baseURL}/notifications/user/${userId}`;
    const response = await axios.get<Notification[]>(url);
    return response.data;
};

/**
 * Marks a notification as read.
 *
 * @param notificationId - The ID of the notification to mark as read
 * @returns A promise that resolves with the updated notification data
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    const url = `${baseURL}/notifications/${notificationId}/read`;
    const response = await axios.post<Notification>(url);
    return response.data;
};

/**
 * Subscribes to real-time notifications for a user.
 *
 * @param _userId - The ID of the user to subscribe to notifications for
 * @param _callback - A callback function invoked when a new notification arrives
 * @returns A cleanup function that unsubscribes from the notification stream
 */
export const subscribeToNotifications = (_userId: string, _callback: (notification: unknown) => void): (() => void) => {
    // TODO: Implement real-time notification subscription (e.g., WebSocket or SSE)
    return () => {};
};
