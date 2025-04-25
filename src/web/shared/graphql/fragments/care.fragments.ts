import { gql } from '@apollo/client'; // v3.7.0 - Used to define GraphQL fragments

/**
 * Fragment containing common fields for Appointment type
 * Used in queries and mutations related to appointment booking and management
 */
export const AppointmentFragment = gql`
  fragment AppointmentFragment on Appointment {
    id
    providerId
    dateTime
    type
    reason
  }
`;

/**
 * Fragment containing common fields for Provider type
 * Used in queries related to healthcare providers
 */
export const ProviderFragment = gql`
  fragment ProviderFragment on Provider {
    id
    name
    specialty
    location
  }
`;

/**
 * Fragment containing common fields for TelemedicineSession type
 * Used in queries and mutations related to telemedicine functionality
 */
export const TelemedicineSessionFragment = gql`
  fragment TelemedicineSessionFragment on TelemedicineSession {
    id
    providerId
    startTime
    endTime
    status
  }
`;