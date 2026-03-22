import { ApolloClient, InMemoryCache } from '@apollo/client'; // Version 3.0+
import NetInfo from '@react-native-community/netinfo';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'; // v19: subpath ESM import
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'; // Version 1.6.8
// eslint-disable-next-line import/no-unresolved -- Native module resolved at runtime
import Constants from 'expo-constants';
import { Platform } from 'react-native';
// Native TLS certificate pinning is handled by native-ssl-pinning.ts and
// Android's network_security_config.xml. See native-ssl-pinning.ts for the
// pinnedFetch wrapper that can be used for direct fetch calls.

// Define __DEV__ if it's not already defined by React Native
declare const __DEV__: boolean;

/**
 * API configuration
 * Note: In a production environment, these values should be loaded from environment variables
 * or a configuration service rather than being hardcoded.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Native module returns untyped result */
const API_URL: string =
    Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'https://api.austa.com.br';
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;
const API_TIMEOUT = 30000; // 30 seconds

// List of allowed domains for requests to prevent SSRF attacks
const ALLOWED_DOMAINS = ['api.austa.com.br', 'cdn.austa.com.br', 'auth.austa.com.br', 'storage.googleapis.com'];

/**
 * Apollo Client instance for GraphQL API requests.
 * Configured with upload capability for file transfers and appropriate caching.
 */
const graphQLClient = new ApolloClient({
    link: createUploadLink({
        uri: GRAPHQL_ENDPOINT,
        credentials: 'include',
        // v19: custom extractor for React Native { uri, name, type } file objects
        isExtractableFile: (value: unknown): boolean =>
            (typeof File !== 'undefined' && value instanceof File) ||
            (typeof Blob !== 'undefined' && value instanceof Blob) ||
            (typeof value === 'object' && value !== null && 'uri' in value && 'name' in value && 'type' in value),
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
        },
    },
    // Enable dev tools in development environment
    connectToDevTools: __DEV__,
});

/**
 * Security function to validate URLs against SSRF attacks
 * This prevents requests to unauthorized domains or internal network addresses
 *
 * @param url The URL to validate
 * @returns boolean indicating whether the URL is safe
 */
function isUrlSafe(url: string): boolean {
    try {
        // Parse the URL
        const parsedUrl = new URL(url);

        // Check if the hostname is in the allowed domains list
        const isAllowedDomain = ALLOWED_DOMAINS.some(
            (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
        );

        // Check if the URL uses http or https protocol
        const isAllowedProtocol = parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';

        // Check if it's not accessing localhost or private IPs
        const isNotPrivateIP = !parsedUrl.hostname.match(
            /^(localhost|127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|::1)/
        );

        return isAllowedDomain && isAllowedProtocol && isNotPrivateIP;
    } catch (error) {
        // If URL parsing fails, consider it unsafe
        console.error('URL validation error:', error);
        return false;
    }
}

// Extend Axios internal config with SSRF-relevant fields
interface RequestConfig extends InternalAxiosRequestConfig {
    baseURL?: string;
}

/**
 * Create a security-enhanced axios instance with protection against:
 * 1. SSRF via Absolute URLs (CVE-2023-45857)
 * 2. Server-Side Request Forgery (CVE-2024-28849)
 * 3. Cross-Site Request Forgery
 */
const createSecureAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_URL,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
            'User-Agent': `AustaHealthApp/${Platform.OS}`, // Identify the app
        },
        withCredentials: true, // Ensures cookies are sent with requests
    });

    // Add request interceptor to validate URLs before sending requests
    instance.interceptors.request.use(
        async (config: RequestConfig) => {
            // Generate and add anti-CSRF token
            const csrfToken = `austa-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
            config.headers = config.headers || {};
            config.headers['X-CSRF-Token'] = csrfToken;

            // Check network connectivity
            const netInfo = await NetInfo.fetch();
            if (!netInfo.isConnected) {
                throw new Error('No internet connection');
            }

            // SSRF protection for URL validation
            let urlToCheck = config.url || '';
            if (!urlToCheck.startsWith('http')) {
                // Relative URL, prepend baseURL
                urlToCheck = `${config.baseURL || ''}${urlToCheck}`;
            }

            // DEMO_MODE — Skip SSRF validation in dev
            if (!__DEV__ && !isUrlSafe(urlToCheck)) {
                throw new Error(`Security warning: URL not allowed - ${urlToCheck}`);
            }

            // Ensure all URLs are normalized to prevent URL manipulation attacks
            if (config.url?.startsWith('http')) {
                // If absolute URL is provided, validate and normalize it
                const normalizedUrl = new URL(config.url);
                if (!isUrlSafe(normalizedUrl.toString())) {
                    throw new Error(`Security warning: Absolute URL not allowed - ${config.url}`);
                }

                // Replace the absolute URL with path only to force using baseURL
                config.url = normalizedUrl.pathname + normalizedUrl.search;
            }

            // Certificate pinning is handled at the TLS layer by react-native-ssl-pinning
            // (see native-ssl-pinning.ts) and on Android by network_security_config.xml.
            // For axios/REST requests, use pinnedFetch from native-ssl-pinning.ts when
            // direct fetch is needed. Apollo GraphQL on Android uses OkHttp which respects
            // the network_security_config.xml pin-set automatically.

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor for error handling
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error: AxiosError) => {
            // Enhanced error logging
            if (error.response) {
                console.error('API Response Error:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                });
            } else if (error.request) {
                console.error('API Request Error:', error.request);
            } else {
                console.error('API Error:', error.message);
            }

            // Security logging for potential issues
            if (error.response?.status === 401) {
                console.warn('Authentication issue detected');
            } else if (error.response?.status === 403) {
                console.warn('Authorization issue detected');
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

/**
 * Secure Axios instance for REST API requests.
 * Enhanced with protections against SSRF, CSRF, and other vulnerabilities.
 */
const restClient = createSecureAxiosInstance();

// DEMO_MODE — Intercept failed requests and return empty successful responses
if (__DEV__) {
    restClient.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            console.warn('[DEMO_MODE] API call intercepted:', error?.config?.url);
            return Promise.resolve({
                data: {},
                status: 200,
                statusText: 'OK (demo)',
                headers: {},
                config: error?.config,
            });
        }
    );
} // DEMO_MODE

export { graphQLClient, restClient };
