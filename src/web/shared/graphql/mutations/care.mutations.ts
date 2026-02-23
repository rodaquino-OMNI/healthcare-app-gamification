import { gql } from '@apollo/client'; // @apollo/client version 3.7.10

/**
 * GraphQL mutation to book an appointment.
 * 
 * This mutation allows users to schedule an appointment with a healthcare provider
 * as part of the Care Now journey. It requires provider ID, date/time, and appointment type,
 * with an optional reason field.
 */
export const BOOK_APPOINTMENT = gql`
    mutation BookAppointment($providerId: String!, $dateTime: String!, $type: String!, $reason: String) {
        bookAppointment(providerId: $providerId, dateTime: $dateTime, type: $type, reason: $reason) {
            id
            providerId
            dateTime
            type
            reason
        }
    }
`;

/**
 * GraphQL mutation to cancel an appointment.
 * 
 * This mutation allows users to cancel a previously booked appointment
 * by providing the appointment ID. It returns the ID of the cancelled appointment
 * to confirm the operation was successful.
 */
export const CANCEL_APPOINTMENT = gql`
    mutation CancelAppointment($id: ID!) {
        cancelAppointment(id: $id) {
            id
        }
    }
`;