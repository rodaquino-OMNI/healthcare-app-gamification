/**
 * Global type declarations for the Austa Health mobile app
 */

// React Native global __DEV__ variable
declare const __DEV__: boolean;

// Add module declarations for packages without type definitions
declare module '@apollo/client' {
  export interface DefaultOptions {
    watchQuery?: WatchQueryOptions;
    query?: QueryOptions;
    mutate?: MutationOptions;
  }

  export interface WatchQueryOptions {
    fetchPolicy?: string;
    errorPolicy?: string;
  }

  export interface QueryOptions {
    fetchPolicy?: string;
    errorPolicy?: string;
  }

  export interface MutationOptions {
    errorPolicy?: string;
  }

  export class InMemoryCache {
    constructor();
  }

  export class ApolloClient<T = any> {
    constructor(options: {
      link: any;
      cache: any;
      defaultOptions?: DefaultOptions;
      connectToDevTools?: boolean;
    });
  }
}

declare module 'apollo-upload-client' {
  export function createUploadLink(options: { 
    uri: string;
    credentials?: string;
    headers?: Record<string, string>;
  }): any;
}

// Custom declaration for localStorage in React Native
// This is used in the care.ts file's getAuthSession function
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

declare global {
  // Add localStorage to global scope for mobile
  var localStorage: Storage;
}

export {};