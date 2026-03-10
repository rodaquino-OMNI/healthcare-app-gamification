import { useCallback, useEffect, useState } from 'react';

import { getProfile, UserProfile } from '@/api/auth';
import { savePersonalInfo } from '@/api/settings';

/** Shape returned by the useProfile hook */
export interface UseProfileReturn {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    updateProfile: (data: { name: string; dob: string; gender: string; bloodType: string }) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

/**
 * Hook that fetches and manages the current user's profile data.
 * Provides methods to refresh and update the profile via the settings API.
 */
export const useProfile = (): UseProfileReturn => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao carregar perfil');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    const updateProfile = useCallback(
        async (data: { name: string; dob: string; gender: string; bloodType: string }): Promise<void> => {
            setError(null);
            try {
                await savePersonalInfo(data);
                await fetchProfile();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Falha ao atualizar perfil');
                throw err;
            }
        },
        [fetchProfile]
    );

    return {
        profile,
        isLoading,
        error,
        updateProfile,
        refreshProfile: fetchProfile,
    };
};
