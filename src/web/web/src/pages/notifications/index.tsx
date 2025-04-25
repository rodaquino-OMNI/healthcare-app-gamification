import React from 'react'; // react ^18.0.0
import {
  EmptyState,
  LoadingIndicator,
  JourneyHeader,
} from 'src/web/web/src/components/shared';
import { MainLayout } from 'src/web/web/src/layouts/MainLayout';
import { useNotifications } from 'src/web/web/src/hooks/useNotifications';
import { ALL_JOURNEYS } from 'src/web/shared/constants/journeys';

/**
 * This component renders the notifications page, displaying a list of notifications or appropriate placeholders.
 */
const NotificationsPage: React.FC = () => {
  // LD1: Uses the `useNotifications` hook to fetch notifications and related state.
  const { notifications, isLoading, markAsRead } = useNotifications();

  // LD1: Renders the `MainLayout` component to provide the overall page structure.
  return (
    <MainLayout>
      {/* LD1: Renders the `JourneyHeader` component to display the page title. */}
      <JourneyHeader title="Notifications" />

      {/* LD1: Conditionally renders a `LoadingIndicator` if the notifications are still loading. */}
      {isLoading ? (
        <LoadingIndicator text="Carregando notifica\u00e7\u00f5es..." fullScreen />
      ) : (
        <>
          {/* LD1: Conditionally renders an `EmptyState` component if there are no notifications. */}
          {notifications.length === 0 ? (
            <EmptyState
              title="Sem notifica\u00e7\u00f5es"
              description="Voc\u00ea n\u00e3o tem nenhuma notifica\u00e7\u00e3o."
            />
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  {notification.title} - {notification.body}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default NotificationsPage;