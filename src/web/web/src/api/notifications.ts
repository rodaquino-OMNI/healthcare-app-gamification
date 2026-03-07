/**
 * Notification Service API
 *
 * This module provides functions for interacting with the notification service,
 * allowing clients to fetch user notifications and mark notifications as read.
 */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios'; // axios version 1.6.7
import { baseURL } from 'shared/config/apiConfig';

/**
 * Fetches notifications for a user.
 *
 * @param userId - The ID of the user to fetch notifications for
 * @returns A promise that resolves to the notifications data
 */
export const getNotifications = async (userId: string): Promise<unknown> => {
    const url = `${baseURL}/notifications/user/${userId}`;
    const response = await axios.get(url);
    return response.data;
};

/**
 * Marks a notification as read.
 *
 * @param notificationId - The ID of the notification to mark as read
 * @returns A promise that resolves when the notification is marked as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<unknown> => {
    const url = `${baseURL}/notifications/${notificationId}/read`;
    const response = await axios.post(url);
    return response.data;
};
