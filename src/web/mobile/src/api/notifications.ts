import { Notification } from 'src/web/shared/types/notification.types';
import { API_BASE_URL } from 'src/web/shared/constants/api';
import { restClient } from 'src/web/mobile/src/api/client';
import { AxiosResponse } from 'axios'; // Version 1.4.0

/**
 * Fetches notifications for a given user ID.
 * 
 * @param userId - The ID of the user whose notifications to fetch
 * @returns Promise that resolves to an array of Notification objects
 */
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const endpoint = `${API_BASE_URL}/notifications?userId=${userId}`;
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
    const endpoint = `${API_BASE_URL}/notifications/${notificationId}/read`;
    await restClient.post(endpoint);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};