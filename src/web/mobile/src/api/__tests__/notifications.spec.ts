/**
 * Tests for src/web/mobile/src/api/notifications.ts
 *
 * The mobile notifications module uses restClient (axios).
 * We mock restClient to validate endpoint calls, parameters, and error handling.
 */

import { restClient } from '../client';
import {
    getNotifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationPreferences,
    updateNotificationPreferences,
    getNotificationCategories,
    getUnreadCount,
    registerPushToken,
    unregisterPushToken,
    getNotificationHistory,
    clearAllNotifications,
} from '../notifications';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../client', () => ({
    restClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// getNotifications
// ---------------------------------------------------------------------------

describe('getNotifications', () => {
    it('should GET /notifications with userId query param', async () => {
        const notifications = [{ id: 'n1', title: 'Alert' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: notifications });

        const result = await getNotifications('user-123');

        expect(restClient.get).toHaveBeenCalledWith('/notifications?userId=user-123');
        expect(result).toEqual(notifications);
    });

    it('should throw on error', async () => {
        (restClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(getNotifications('user-123')).rejects.toThrow('Network error');
    });
});

// ---------------------------------------------------------------------------
// markNotificationAsRead
// ---------------------------------------------------------------------------

describe('markNotificationAsRead', () => {
    it('should POST /notifications/:id/read', async () => {
        (restClient.post as jest.Mock).mockResolvedValue({});

        await markNotificationAsRead('n1');

        expect(restClient.post).toHaveBeenCalledWith('/notifications/n1/read');
    });

    it('should throw on error', async () => {
        (restClient.post as jest.Mock).mockRejectedValue(new Error('Server error'));

        await expect(markNotificationAsRead('n1')).rejects.toThrow('Server error');
    });
});

// ---------------------------------------------------------------------------
// markAllAsRead
// ---------------------------------------------------------------------------

describe('markAllAsRead', () => {
    it('should POST /notifications/mark-all-read with userId', async () => {
        (restClient.post as jest.Mock).mockResolvedValue({});

        await markAllAsRead('user-123');

        expect(restClient.post).toHaveBeenCalledWith('/notifications/mark-all-read', { userId: 'user-123' });
    });
});

// ---------------------------------------------------------------------------
// deleteNotification
// ---------------------------------------------------------------------------

describe('deleteNotification', () => {
    it('should DELETE /notifications/:id', async () => {
        (restClient.delete as jest.Mock).mockResolvedValue({});

        await deleteNotification('n1');

        expect(restClient.delete).toHaveBeenCalledWith('/notifications/n1');
    });
});

// ---------------------------------------------------------------------------
// getNotificationPreferences
// ---------------------------------------------------------------------------

describe('getNotificationPreferences', () => {
    it('should GET /users/:id/notification-preferences', async () => {
        const prefs = { pushEnabled: true, emailEnabled: false };
        (restClient.get as jest.Mock).mockResolvedValue({ data: prefs });

        const result = await getNotificationPreferences('user-123');

        expect(restClient.get).toHaveBeenCalledWith('/users/user-123/notification-preferences');
        expect(result).toEqual(prefs);
    });
});

// ---------------------------------------------------------------------------
// updateNotificationPreferences
// ---------------------------------------------------------------------------

describe('updateNotificationPreferences', () => {
    it('should PUT /users/:id/notification-preferences with partial prefs', async () => {
        const updatedPrefs = { pushEnabled: false, emailEnabled: true };
        (restClient.put as jest.Mock).mockResolvedValue({ data: updatedPrefs });

        const result = await updateNotificationPreferences('user-123', { pushEnabled: false });

        expect(restClient.put).toHaveBeenCalledWith('/users/user-123/notification-preferences', { pushEnabled: false });
        expect(result).toEqual(updatedPrefs);
    });
});

// ---------------------------------------------------------------------------
// getNotificationCategories
// ---------------------------------------------------------------------------

describe('getNotificationCategories', () => {
    it('should GET /notification-categories', async () => {
        const categories = [{ id: 'c1', name: 'Health Alerts' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: categories });

        const result = await getNotificationCategories();

        expect(restClient.get).toHaveBeenCalledWith('/notification-categories');
        expect(result).toEqual(categories);
    });
});

// ---------------------------------------------------------------------------
// getUnreadCount
// ---------------------------------------------------------------------------

describe('getUnreadCount', () => {
    it('should GET /notifications/unread-count with userId', async () => {
        (restClient.get as jest.Mock).mockResolvedValue({ data: 5 });

        const result = await getUnreadCount('user-123');

        expect(restClient.get).toHaveBeenCalledWith('/notifications/unread-count?userId=user-123');
        expect(result).toBe(5);
    });
});

// ---------------------------------------------------------------------------
// registerPushToken
// ---------------------------------------------------------------------------

describe('registerPushToken', () => {
    it('should POST /notifications/push-token with userId, token, platform', async () => {
        (restClient.post as jest.Mock).mockResolvedValue({});

        await registerPushToken('user-123', 'expo-push-token', 'ios');

        expect(restClient.post).toHaveBeenCalledWith('/notifications/push-token', {
            userId: 'user-123',
            token: 'expo-push-token',
            platform: 'ios',
        });
    });
});

// ---------------------------------------------------------------------------
// unregisterPushToken
// ---------------------------------------------------------------------------

describe('unregisterPushToken', () => {
    it('should DELETE /notifications/push-token with userId', async () => {
        (restClient.delete as jest.Mock).mockResolvedValue({});

        await unregisterPushToken('user-123');

        expect(restClient.delete).toHaveBeenCalledWith('/notifications/push-token?userId=user-123');
    });
});

// ---------------------------------------------------------------------------
// getNotificationHistory
// ---------------------------------------------------------------------------

describe('getNotificationHistory', () => {
    it('should GET /notifications/history with pagination params', async () => {
        const history = { notifications: [], total: 0, page: 1 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: history });

        const result = await getNotificationHistory('user-123', 1, 20);

        expect(restClient.get).toHaveBeenCalledWith('/notifications/history', {
            params: { userId: 'user-123', page: 1, limit: 20 },
        });
        expect(result).toEqual(history);
    });
});

// ---------------------------------------------------------------------------
// clearAllNotifications
// ---------------------------------------------------------------------------

describe('clearAllNotifications', () => {
    it('should DELETE /notifications with userId', async () => {
        (restClient.delete as jest.Mock).mockResolvedValue({});

        await clearAllNotifications('user-123');

        expect(restClient.delete).toHaveBeenCalledWith('/notifications?userId=user-123');
    });
});
