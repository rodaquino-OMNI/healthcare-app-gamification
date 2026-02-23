/**
 * Type declaration for importing .graphql files.
 * Allows TypeScript to resolve GraphQL schema imports.
 */
declare module '*.graphql' {
  const schema: string;
  export default schema;
}
