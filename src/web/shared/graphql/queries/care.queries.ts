/**
 * @file Care Queries
 * @description GraphQL queries for the Care Now journey, including queries for retrieving
 * appointments, a single appointment, and healthcare providers.
 */

import { gql } from '@apollo/client'; // v3.7.17
import {
  AppointmentFragment,
  ProviderFragment
} from '../fragments/care.fragments';

/**
 * GraphQL query to retrieve all appointments for a user
 */
export const GET_APPOINTMENTS = gql`
  query GetAppointments($userId: ID!) {
    appointments(userId: $userId) {
      ...AppointmentFragment
    }
  }
  ${AppointmentFragment}
`;

/**
 * GraphQL query to retrieve a single appointment by ID
 */
export const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      ...AppointmentFragment
    }
  }
  ${AppointmentFragment}
`;

/**
 * GraphQL query to retrieve available healthcare providers
 * with optional filtering by specialty and location
 */
export const GET_PROVIDERS = gql`
  query GetProviders($specialty: String, $location: String) {
    providers(specialty: $specialty, location: $location) {
      ...ProviderFragment
    }
  }
  ${ProviderFragment}
`;
