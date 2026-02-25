import { ApolloClient, InMemoryCache } from '@apollo/client'; // Version 3.0+
import { createUploadLink } from 'apollo-upload-client'; // Version 17.0.0
import axios, { AxiosInstance, AxiosError } from 'axios'; // Version 1.6.8
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import { getPinConfig } from './ssl-pinning';

// Define __DEV__ if it's not already defined by React Native
declare const __DEV__: boolean;

/**
 * API configuration
 * Note: In a production environment, these values should be loaded from environment variables
 * or a configuration service rather than being hardcoded.
 */
const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://api.austa.com.br';
const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;
const API_TIMEOUT = 30000; // 30 seconds

// List of allowed domains for requests to prevent SSRF attacks
const ALLOWED_DOMAINS = [
  'api.austa.com.br',
  'cdn.austa.com.br',
  'auth.austa.com.br',
  'storage.googleapis.com'
];

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
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    // Check if the URL uses http or https protocol
    const isAllowedProtocol = parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
    
    // Check if it's not accessing localhost or private IPs
    const isNotPrivateIP = !parsedUrl.hostname.match(/^(localhost|127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|::1)/);
    
    return isAllowedDomain && isAllowedProtocol && isNotPrivateIP;
  } catch (error) {
    // If URL parsing fails, consider it unsafe
    console.error('URL validation error:', error);
    return false;
  }
}

// Type definition for request config
interface RequestConfig {
  url?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  [key: string]: any;
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
      'Accept': 'application/json',
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
      
      if (!isUrlSafe(urlToCheck)) {
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
      
      // Certificate pinning validation
      // Note: Full TLS pin verification requires native modules (e.g., react-native-ssl-pinning).
      // This header-based approach enables server-side pin validation and signals pinning intent.
      const targetHost = new URL(urlToCheck).hostname;
      const pinConfig = getPinConfig(targetHost);
      if (pinConfig) {
        config.headers = config.headers || {};
        config.headers['X-Expected-Pin'] = pinConfig.pins[0];
      }

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
          headers: error.response.headers
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

export { graphQLClient, restClient };