/**
 * Care API Module
 * 
 * This module provides functions for interacting with the Care service,
 * including methods for fetching providers, booking appointments, and
 * managing telemedicine sessions.
 * 
 * This is part of the Care Now Journey which provides immediate healthcare access
 * through appointment booking, telemedicine, and other care-related features.
 */

import { gql, ApolloClient } from '@apollo/client'; // v3.7.0
import { apiConfig } from 'src/web/shared/config/apiConfig';
import { API_TIMEOUT } from 'src/web/shared/constants/index';
import { Appointment } from 'src/web/shared/types/care.types';
import { 
  GET_APPOINTMENTS, 
  GET_APPOINTMENT, 
  GET_PROVIDERS 
} from 'src/web/shared/graphql/queries/care.queries';
import { 
  BOOK_APPOINTMENT, 
  CANCEL_APPOINTMENT 
} from 'src/web/shared/graphql/mutations/care.mutations';

// Apollo client instance for making GraphQL requests
// This would typically be imported from a central client configuration
// but is created here for the purposes of this file
const client = new ApolloClient({
  uri: apiConfig.journeys.care,
  cache: new (ApolloClient as any).InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      timeout: API_TIMEOUT
    },
    mutate: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      timeout: API_TIMEOUT
    }
  }
});

/**
 * Fetches a list of appointments for a given user ID.
 * 
 * @param userId - The ID of the user whose appointments to fetch
 * @returns A promise that resolves to an array of Appointment objects
 */
export async function getAppointments(userId: string): Promise<Appointment[]> {
  try {
    const { data } = await client.query({
      query: GET_APPOINTMENTS,
      variables: { userId }
    });
    
    return data.getAppointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

/**
 * Fetches a single appointment by its ID.
 * 
 * @param id - The ID of the appointment to fetch
 * @returns A promise that resolves to an Appointment object
 */
export async function getAppointment(id: string): Promise<Appointment> {
  try {
    const { data } = await client.query({
      query: GET_APPOINTMENT,
      variables: { id }
    });
    
    return data.getAppointment;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
}

/**
 * Fetches a list of providers based on specialty and location.
 * 
 * @param specialty - The medical specialty to filter providers by
 * @param location - The location to filter providers by
 * @returns A promise that resolves to an array of provider objects
 */
export async function getProviders(specialty: string, location: string): Promise<any[]> {
  try {
    const { data } = await client.query({
      query: GET_PROVIDERS,
      variables: { specialty, location }
    });
    
    return data.getProviders;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
}

/**
 * Books a new appointment with the given provider, date, type and reason.
 * 
 * @param providerId - The ID of the healthcare provider
 * @param dateTime - The date and time of the appointment (ISO format)
 * @param type - The type of appointment (e.g., 'in-person', 'video')
 * @param reason - The reason for the appointment (optional)
 * @returns A promise that resolves to the newly booked Appointment object
 */
export async function bookAppointment(
  providerId: string, 
  dateTime: string, 
  type: string, 
  reason: string
): Promise<Appointment> {
  try {
    const { data } = await client.mutate({
      mutation: BOOK_APPOINTMENT,
      variables: { providerId, dateTime, type, reason }
    });
    
    return data.bookAppointment;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
}

/**
 * Cancels an existing appointment with the given ID.
 * 
 * @param id - The ID of the appointment to cancel
 * @returns A promise that resolves to the cancelled Appointment object
 */
export async function cancelAppointment(id: string): Promise<Appointment> {
  try {
    const { data } = await client.mutate({
      mutation: CANCEL_APPOINTMENT,
      variables: { id }
    });
    
    return data.cancelAppointment;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
}