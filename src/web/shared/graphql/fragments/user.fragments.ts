/**
 * GraphQL fragment for the User type
 * Provides a reusable selection of basic user fields (id, name, email)
 * for use in various user-related queries throughout the application
 */
export const UserFragment = `
  fragment UserFragment on User {
    id
    name
    email
  }
`;