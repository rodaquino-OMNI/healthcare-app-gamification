/**
 * API module for interacting with the Care Service backend.
 * Provides functions for booking appointments, checking symptoms,
 * and accessing telemedicine features for the Care Now Journey (F-102).
 */

import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements
import { restClient } from './client';

// Define Appointment type if it doesn't exist in the project
interface Appointment {
  id: string;
  providerId: string;
  patientId: string;
  dateTime: string;
  type: string;
  status: string;
  reason?: string;
  notes?: string;
  [key: string]: any;
}

// Define Session type for access tokens
interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  userId?: string;
}

// Auth function to get current session - will be imported by users of this module
export const getAuthSession = (): Session | null => {
  // In a real implementation, this would use the useAuth hook in a component
  // Since we can't use hooks outside of components, we'll provide this helper
  
  // For testing outside of React components
  try {
    // Try to get the token from storage
    const tokenFromStorage = localStorage.getItem('auth_session');
    if (tokenFromStorage) {
      return JSON.parse(tokenFromStorage);
    }
  } catch (error) {
    console.error('Failed to get auth session:', error);
  }
  
  return null;
};

/**
 * Books an appointment with a healthcare provider.
 * 
 * @param appointmentDetails - Object containing appointment details (providerId, dateTime, type, reason, etc.)
 * @returns A promise that resolves with the created appointment data
 */
export async function bookAppointment(appointmentDetails: object): Promise<Appointment> {
  // Get the session (would use useAuth hook in a component)
  const session = getAuthSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  // Send a POST request to the /care/appointments endpoint with the appointment details and authorization header
  const response: AxiosResponse<Appointment> = await restClient.post(
    '/care/appointments',
    appointmentDetails,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    }
  );
  
  // Return the created appointment data on success
  return response.data;
}

/**
 * Checks the symptoms entered by the user and returns possible diagnoses.
 * 
 * @param symptoms - Object containing symptom information
 * @returns A promise that resolves with the symptom check results
 */
export async function checkSymptoms(symptoms: object): Promise<any> {
  // Get the session (would use useAuth hook in a component)
  const session = getAuthSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  // Send a POST request to the /care/symptoms/check endpoint with the symptoms and authorization header
  const response: AxiosResponse<any> = await restClient.post(
    '/care/symptoms/check',
    symptoms,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    }
  );
  
  // Return the symptom check results on success
  return response.data;
}