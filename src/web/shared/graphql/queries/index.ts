import { gql } from '@apollo/client'; // version: latest

// Query to get a user by ID
export const GET_USER_BY_ID = gql`
    query GetUserById($id: ID!) {
        user(id: $id) {
            id
            name
            email
        }
    }
`;

// Query to get all users
export const GET_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            email
        }
    }
`;
