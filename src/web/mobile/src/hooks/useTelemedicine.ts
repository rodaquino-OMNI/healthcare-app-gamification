import { useState, useEffect, useCallback } from 'react'; // ^18.0.0
import { createTelemedicineSession, getTelemedicineSession } from '@api/care';
import { TelemedicineSession } from '@shared/types/care.types';
import { useAuth } from '@hooks/useAuth';
import { useJourney } from '@context/JourneyContext';
import { config } from '@constants/config';
import { formatDate } from '@utils/date';
import { checkAndroidPermissions } from '@utils/permissions';
import LoadingIndicator from '@components/shared/LoadingIndicator';
import ErrorState from '@components/shared/ErrorState';

/**
 * Custom hook for managing telemedicine sessions within the AUSTA SuperApp.
 * 
 * This hook provides functionality for creating and retrieving telemedicine sessions
 * as part of the Care Now Journey (F-102). It handles permission checking, session
 * state management, and real-time updates.
 * 
 * @param sessionId - Optional ID of an existing session to retrieve
 * @returns Object containing session data, loading state, error state, and functions to manage the session
 */
export function useTelemedicineSession(sessionId?: string) {
  // State for session data, loading and error states
  const [session, setSession] = useState<TelemedicineSession | null>(null);
  const [loading, setLoading] = useState<boolean>(!!sessionId);
  const [error, setError] = useState<Error | null>(null);
  
  // Access auth context for user information and authentication
  const { session: authSession } = useAuth();
  
  // Access journey context for journey-specific behavior
  const { journey } = useJourney();
  
  /**
   * Creates a new telemedicine session with the specified provider
   * 
   * @param providerId - ID of the healthcare provider for the session
   * @returns Promise that resolves to the created session or null if failed
   */
  const createSession = useCallback(async (providerId: string): Promise<TelemedicineSession | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify user is authenticated
      if (!authSession) {
        throw new Error('Authentication required for telemedicine session');
      }
      
      // Check required permissions on Android
      if (config.platform === 'android') {
        const hasPermissions = await checkAndroidPermissions();
        if (!hasPermissions) {
          throw new Error('Camera and microphone permissions are required for telemedicine');
        }
      }
      
      // Create a new session
      const newSession = await createTelemedicineSession(providerId);
      setSession(newSession);
      return newSession;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create telemedicine session');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [authSession]);
  
  /**
   * Fetches the current session data from the server
   */
  const refreshSession = useCallback(async (): Promise<void> => {
    if (!sessionId || !authSession) return;
    
    try {
      const freshSession = await getTelemedicineSession(sessionId);
      setSession(freshSession);
    } catch (err) {
      console.error('Failed to refresh telemedicine session:', err);
      // Don't update error state here to avoid disrupting the UI during background refreshes
    }
  }, [sessionId, authSession]);
  
  // Fetch session details when sessionId is provided
  useEffect(() => {
    if (!sessionId) return;
    
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verify user is authenticated
        if (!authSession) {
          throw new Error('Authentication required to retrieve telemedicine session');
        }
        
        // Fetch the session
        const fetchedSession = await getTelemedicineSession(sessionId);
        setSession(fetchedSession);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to retrieve telemedicine session');
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
    
    // Set up periodic refresh for active sessions
    let refreshInterval: NodeJS.Timeout | null = null;
    
    if (sessionId && authSession) {
      // Refresh the session data every 10 seconds to keep it up-to-date
      refreshInterval = setInterval(refreshSession, 10000);
    }
    
    // Clean up the interval when the component unmounts or sessionId changes
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [sessionId, authSession, refreshSession]);
  
  return {
    session,
    loading,
    error,
    createSession,
    refreshSession,
  };
}