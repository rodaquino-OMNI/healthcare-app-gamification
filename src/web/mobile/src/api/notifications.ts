/**
 * @file notifications.ts
 * @description API functions for the Notifications system, enabling interaction with backend
 * services for fetching, managing, and configuring user notifications and push token registration.
 */

import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements
import { restClient } from './client';
import { Notification } from '@shared/types/notification.types';

// ---------------------------------------------------------------------------
// Local type definitions
// ---------------------------------------------------------------------------

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

export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  channels: Array<'push' | 'email' | 'sms' | 'in_app'>;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Fetches notifications for a given user ID.
 *
 * @param userId - The ID of the user whose notifications to fetch
 * @returns Promise that resolves to an array of Notification objects
 */
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Using a path-based endpoint instead of constructing absolute URLs
    // This prevents SSRF vulnerabilities (CVE-2023-45857)
    const endpoint = `/notifications?userId=${userId}`;
    const response: AxiosResponse<Notification[]> = await restClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Marks a notification as read for a given notification ID.
 *
 * @param notificationId - The ID of the notification to mark as read
 * @returns Promise that resolves when the notification is successfully marked as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    // Using a path-based endpoint instead of constructing absolute URLs
    // This prevents SSRF vulnerabilities (CVE-2023-45857)
    const endpoint = `/notifications/${notificationId}/read`;
    await restClient.post(endpoint);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Marks all notifications as read for a given user.
 *
 * @param userId - The ID of the user whose notifications to mark as read
 * @returns Promise that resolves when all notifications are marked as read
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
 * @returns Promise that resolves when the notification is deleted
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
export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences> => {
  try {
    const { data } = await restClient.get(`/users/${userId}/notification-preferences`);
    return data;
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
    const { data } = await restClient.put(
      `/users/${userId}/notification-preferences`,
      prefs
    );
    return data;
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
    const { data } = await restClient.get('/notification-categories');
    return data;
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
    const { data } = await restClient.get(
      `/notifications/unread-count?userId=${userId}`
    );
    return data;
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
 * @param platform - The device platform ('ios' or 'android')
 * @returns Promise that resolves when the token is registered
 */
export const registerPushToken = async (
  userId: string,
  token: string,
  platform: 'ios' | 'android'
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
    const { data } = await restClient.get('/notifications/history', {
      params: { userId, page, limit },
    });
    return data;
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
