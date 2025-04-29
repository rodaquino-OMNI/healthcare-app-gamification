// Define Notification type if it's not available elsewhere
interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
  [key: string]: any;
}

import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements
import { restClient } from './client';

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