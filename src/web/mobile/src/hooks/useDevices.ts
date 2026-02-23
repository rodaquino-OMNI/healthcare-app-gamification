import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { getConnectedDevices, connectDevice } from '../api/health';
import { useAuth } from '../context/AuthContext';
import { DeviceConnection } from '@shared/types/health.types';

/**
 * A React hook that fetches connected devices for a user and provides a function to connect new devices.
 * This hook supports the My Health Journey functionality (F-101) for device management.
 * 
 * @returns An object containing the list of connected devices, loading state, error state, and a function to connect new devices.
 */
export function useDevices() {
  const { session } = useAuth();
  const userId = session?.accessToken ? useAuth().getUserFromToken(session.accessToken)?.sub : undefined;
  
  const [devices, setDevices] = useState<DeviceConnection[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  
  // Fetch connected devices when component mounts or userId changes
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    getConnectedDevices(userId)
      .then(result => {
        setDevices(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching devices:', err);
        setError(err);
        setLoading(false);
      });
  }, [userId]);
  
  /**
   * Connect a new device to the user's account
   * @param deviceData - Data needed to connect the device (type, id, name, etc.)
   * @returns The newly connected device object
   * @throws Error if connection fails or user is not authenticated
   */
  const connect = async (deviceData: any): Promise<DeviceConnection> => {
    if (!userId) {
      throw new Error('User must be authenticated to connect a device');
    }
    
    try {
      const newDevice = await connectDevice(userId, deviceData);
      
      // Update the devices list to include the newly connected device
      setDevices(prev => prev ? [...prev, newDevice] : [newDevice]);
      
      return newDevice;
    } catch (err) {
      console.error('Error connecting device:', err);
      setError(err);
      throw err;
    }
  };
  
  return {
    devices,
    loading,
    error,
    connect
  };
}