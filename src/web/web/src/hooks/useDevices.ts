import { useState, useEffect } from 'react';
import { DeviceConnection } from 'shared/types/health.types';

import { getConnectedDevices } from '@/api/health';
import { useAuth } from '@/hooks/useAuth';

/** Shape returned by the useDevices hook */
interface UseDevicesReturn {
    data: DeviceConnection[] | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Hook for fetching connected devices for a specific user
 * Supports the Wearable Device Integration requirement in the Health Journey.
 *
 * @returns Query result containing connected devices data or error information
 */
export const useDevices = (): UseDevicesReturn => {
    const { session } = useAuth();
    const userId = session?.userId || '';

    const [data, setData] = useState<DeviceConnection[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            return;
        }

        let cancelled = false;
        setLoading(true);

        getConnectedDevices(userId)
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                }
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setError(err);
                    console.error('Error fetching connected devices:', err);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return { data, loading, error };
};
