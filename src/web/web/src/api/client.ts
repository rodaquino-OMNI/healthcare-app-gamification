import { ApolloClient, InMemoryCache } from '@apollo/client'; // v3.7.17
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'; // v18.0.1
import axios from 'axios'; // v1.4.0
import { apiConfig } from 'shared/config/apiConfig';

/** Local interface matching ApolloLink shape for type-safe assignment */
interface GraphQLLink {
    request: (...args: unknown[]) => unknown;
}

/** Local interface matching AxiosRequestConfig for interceptor typing */
interface RequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers: Record<string, string>;
    params?: Record<string, unknown>;
    data?: unknown;
    timeout?: number;
}

/** Local interface matching AxiosResponse for interceptor typing */
interface ResponseShape {
    data: unknown;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: RequestConfig;
}

/** Local interface for Axios interceptor manager */
interface InterceptorManager<T> {
    use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: unknown) => unknown): number;
}

/** Local interface matching AxiosInstance for type-safe interceptor access */
interface TypedHttpClient {
    interceptors: {
        request: InterceptorManager<RequestConfig>;
        response: InterceptorManager<ResponseShape>;
    };
}

/**
 * Apollo Client instance for GraphQL API requests
 *
 * This client is configured to handle both standard GraphQL queries/mutations
 * and file uploads (via apollo-upload-client). It uses an in-memory cache to
 * store query results for better performance.
 *
 * The client uses 'cache-and-network' fetch policy by default, which means it will
 * immediately show cached data while fetching fresh data from the server in the background.
 *
 * @version Apollo Client 3.7.17
 */
export const graphQLClient = new ApolloClient({
    // Upload link supports multipart form requests for file uploads
    link: createUploadLink({
        uri: `${apiConfig.baseURL}/graphql`,
        credentials: 'include', // Include cookies for authentication if needed
    }) as unknown as GraphQLLink,
    // In-memory cache stores query results for faster subsequent access
    cache: new InMemoryCache({
        typePolicies: {
            // Type policies can be defined here to customize cache behavior
            // for specific types in the GraphQL schema
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network', // Balance between fresh data and good UX
            errorPolicy: 'all', // Handle errors in the UI rather than throwing
        },
        query: {
            fetchPolicy: 'network-only', // Default to always fetching fresh data
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

/**
 * Axios instance for REST API requests
 *
 * This client is configured for standard REST API calls to endpoints that are
 * not covered by the GraphQL API. It's particularly useful for file uploads,
 * downloads, and integration with legacy or third-party APIs.
 *
 * @version Axios 1.4.0
 */
export const restClient = axios.create({
    baseURL: apiConfig.baseURL,
    headers: {
        'Content-Type': 'application/json', // Default to JSON requests
    },
    timeout: 30000, // 30 second timeout for healthcare operations
});

// Cast restClient to a typed interface for safe interceptor access
const typedClient = restClient as unknown as TypedHttpClient;

// Add request interceptor to attach authentication tokens when available
typedClient.interceptors.request.use(
    (config: RequestConfig): RequestConfig => {
        // You can add token logic here, for example:
        // const token = getAuthToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common error scenarios
typedClient.interceptors.response.use(
    (response: ResponseShape): ResponseShape => response,
    (error: unknown) => {
        // Handle common errors (401, 403, 500, etc.)
        // Could implement global error handling, logging, or retry logic here
        return Promise.reject(error);
    }
);
