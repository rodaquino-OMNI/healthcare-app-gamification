/**
 * Tests for src/web/web/src/api/notifications.ts
 *
 * The web notifications module uses restClient (axios).
 * We mock restClient to validate endpoints, methods, and the polling subscription logic.
 */

import { restClient } from '../client';
import { getNotifications, markNotificationAsRead, subscribeToNotifications } from '../notifications';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../client', () => ({
    restClient: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

// ---------------------------------------------------------------------------
// getNotifications
// ---------------------------------------------------------------------------

describe('getNotifications', () => {
    it('should GET /notifications/user/:userId', async () => {
        const notifications = [{ id: 'n1', title: 'Alert' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: notifications });

        const result = await getNotifications('u1');

        expect(restClient.get).toHaveBeenCalledWith('/notifications/user/u1');
        expect(result).toEqual(notifications);
    });

    it('should throw on error', async () => {
        (restClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(getNotifications('u1')).rejects.toThrow('Network error');
    });
});

// ---------------------------------------------------------------------------
// markNotificationAsRead
// ---------------------------------------------------------------------------

describe('markNotificationAsRead', () => {
    it('should POST /notifications/:id/read and return updated notification', async () => {
        const notification = { id: 'n1', read: true };
        (restClient.post as jest.Mock).mockResolvedValue({ data: notification });

        const result = await markNotificationAsRead('n1');

        expect(restClient.post).toHaveBeenCalledWith('/notifications/n1/read');
        expect(result).toEqual(notification);
    });
});

// ---------------------------------------------------------------------------
// subscribeToNotifications
// ---------------------------------------------------------------------------

describe('subscribeToNotifications', () => {
    it('should return an unsubscribe function', () => {
        (restClient.get as jest.Mock).mockResolvedValue({ data: [] });

        const unsubscribe = subscribeToNotifications('u1', jest.fn());

        expect(typeof unsubscribe).toBe('function');
        unsubscribe();
    });

    it('should not fire callback on first poll (baseline)', async () => {
        const notifications = [{ id: 'n1' }, { id: 'n2' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: notifications });

        const callback = jest.fn();
        const unsubscribe = subscribeToNotifications('u1', callback, 5000);

        // Let the initial poll resolve
        await Promise.resolve();
        await Promise.resolve();

        expect(callback).not.toHaveBeenCalled();
        unsubscribe();
    });

    it('should fire callback for new notifications on subsequent polls', async () => {
        // First poll: baseline
        (restClient.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: 'n1' }] });

        const callback = jest.fn();
        const unsubscribe = subscribeToNotifications('u1', callback, 1000);

        // Let first poll resolve
        await Promise.resolve();
        await Promise.resolve();

        // Second poll: new notification
        (restClient.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: 'n1' }, { id: 'n2' }] });

        jest.advanceTimersByTime(1000);
        await Promise.resolve();
        await Promise.resolve();

        expect(callback).toHaveBeenCalledWith({ id: 'n2' });

        unsubscribe();
    });

    it('should stop polling after unsubscribe', async () => {
        (restClient.get as jest.Mock).mockResolvedValue({ data: [] });

        const callback = jest.fn();
        const unsubscribe = subscribeToNotifications('u1', callback, 1000);

        // Let initial poll resolve
        await Promise.resolve();

        unsubscribe();

        jest.advanceTimersByTime(5000);
        await Promise.resolve();

        // Only the initial poll should have happened, plus no further calls
        expect(restClient.get).toHaveBeenCalledTimes(1);
    });
});
