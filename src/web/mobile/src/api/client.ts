import { ApolloClient, InMemoryCache } from '@apollo/client'; // Version 3.0+
import { createUploadLink } from 'apollo-upload-client'; // Version 17.0.0
import axios from 'axios'; // Version 1.4.0

/**
 * API configuration
 * Note: In a production environment, these values should be loaded from environment variables
 * or a configuration service rather than being hardcoded.
 */
const API_URL = 'https://api.austa.com.br';
const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Apollo Client instance for GraphQL API requests.
 * Configured with upload capability for file transfers and appropriate caching.
 */
const graphQLClient = new ApolloClient({
  link: createUploadLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    }
  },
  // Enable dev tools in development environment
  connectToDevTools: process.env.NODE_ENV === 'development',
});

/**
 * Axios instance for REST API requests.
 * Configured with base URL and appropriate timeout.
 */
const restClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export { graphQLClient, restClient };