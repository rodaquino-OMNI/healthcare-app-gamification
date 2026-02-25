/**
 * @file useNotifications.ts
 * @description Custom React hook for fetching and managing notification data.
 * Uses @tanstack/react-query v5 for data fetching, caching, and mutations.
 */

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // v5.22+
import { getNotifications, markNotificationAsRead } from '../api/notifications';
import { Notification, NotificationStatus } from '@shared/types/notification.types';
import { useAuth } from './useAuth';

/**
 * Custom hook to fetch and manage notifications for the current user.
 *
 * @returns An object containing notifications, loading state, error state, and utility functions.
 */
export const useNotifications = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  // Derive userId from the JWT in the current session
  const userId: string | undefined = auth.session?.accessToken
    ? auth.getUserFromToken(auth.session.accessToken)?.sub
    : undefined;

  const {
    data,
    isPending,
    error,
    refetch,
  } = useQuery<Notification[], Error>({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(userId as string) as Promise<Notification[]>,
    enabled: !!userId && auth.isAuthenticated,
    staleTime: 1 * 60 * 1000,  // Notifications are fresh for 1 minute
    gcTime: 10 * 60 * 1000,    // Unused data remains in cache for 10 minutes
  });

  // Log errors via useEffect (v5 removed onError from useQuery)
  useEffect(() => {
    if (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [error]);

  // Mutation to mark a single notification as read with optimistic cache update
  const markAsReadMutation = useMutation<void, Error, string>({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: (_data, notificationId) => {
      // Optimistically update the cache entry for this notification
      queryClient.setQueryData<Notification[]>(
        ['notifications', userId],
        (previous) =>
          previous
            ? previous.map((notification) =>
                notification.id === notificationId
                  ? {
                      ...notification,
                      status: NotificationStatus.READ,
                      readAt: new Date().toISOString(),
                    }
                  : notification,
              )
            : [],
      );
    },
    onError: (err) => {
      console.error('Error marking notification as read:', err);
    },
  });

  const markAsRead = (notificationId: string): Promise<void> =>
    markAsReadMutation.mutateAsync(notificationId);

  return {
    notifications: data ?? [],
    isLoading: isPending,
    error,
    markAsRead,
    refetch,
  };
};
