/**
 * API module for interacting with the Care Service backend.
 * Provides functions for booking appointments, checking symptoms,
 * and accessing telemedicine features for the Care Now Journey (F-102).
 */

import { AxiosResponse } from 'axios'; // v1.4.0
import { API_BASE_URL } from 'src/web/shared/constants/api';
import { restClient } from 'src/web/mobile/src/api/client';
import { useAuth } from 'src/web/mobile/src/hooks/useAuth';
import { Appointment } from 'src/web/shared/types/care.types';

/**
 * Books an appointment with a healthcare provider.
 * 
 * @param appointmentDetails - Object containing appointment details (providerId, dateTime, type, reason, etc.)
 * @returns A promise that resolves with the created appointment data
 */
export async function bookAppointment(appointmentDetails: object): Promise<Appointment> {
  // Retrieve the JWT token from the authentication context
  const { session } = useAuth();
  
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
  // Retrieve the JWT token from the authentication context
  const { session } = useAuth();
  
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