// Type declarations for modules without their own type definitions

// Type declarations for @apollo/client
declare module '@apollo/client' {
  export interface ApolloClientOptions<TCacheShape> {
    link: any;
    cache: any;
    defaultOptions?: any;
    connectToDevTools?: boolean;
    name?: string;
    version?: string;
    queryDeduplication?: boolean;
    [key: string]: any;
  }

  export class ApolloClient<TCacheShape> {
    constructor(options: ApolloClientOptions<TCacheShape>);
    watchQuery: any;
    query: any;
    mutate: any;
    subscribe: any;
    readQuery: any;
    readFragment: any;
    writeQuery: any;
    writeFragment: any;
    resetStore: any;
    clearStore: any;
    stop: any;
    [key: string]: any;
  }

  export class InMemoryCache {
    constructor(options?: any);
    read: any;
    write: any;
    diff: any;
    watch: any;
    reset: any;
    restore: any;
    extract: any;
    [key: string]: any;
  }
}

// Type declarations for apollo-upload-client
declare module 'apollo-upload-client' {
  export function createUploadLink(options: {
    uri: string;
    credentials?: string;
    headers?: Record<string, string>;
    [key: string]: any;
  }): any;
}

// Type declarations for axios
declare module 'axios' {
  export interface AxiosRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: Record<string, string>;
    params?: any;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    [key: string]: any;
  }

  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
    request?: any;
  }

  export interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
    toJSON: () => object;
  }

  export interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<AxiosResponse>;
    (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    defaults: AxiosRequestConfig;
    interceptors: {
      request: any;
      response: any;
    };
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  }

  const axios: {
    create(config?: AxiosRequestConfig): AxiosInstance;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    defaults: AxiosRequestConfig;
    interceptors: {
      request: any;
      response: any;
    };
  };

  export default axios;
}

// Type declarations for react-native
declare module 'react-native' {
  export function del(url: string, config?: any): Promise<any>;
  export const Platform: {
    OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
    Version: number;
    isPad: boolean;
    isTV: boolean;
    select<T>(specifics: { ios?: T; android?: T; native?: T; default?: T; [platform: string]: T | undefined }): T;
  };
}

// Type declarations for @react-native-community/netinfo
declare module '@react-native-community/netinfo' {
  export interface NetInfoState {
    type: string;
    isConnected: boolean;
    isInternetReachable: boolean;
    details: any;
  }

  export function fetch(): Promise<NetInfoState>;
  export function addEventListener(
    listener: (state: NetInfoState) => void
  ): () => void;

  const NetInfo: {
    fetch: typeof fetch;
    addEventListener: typeof addEventListener;
  };

  export default NetInfo;
}