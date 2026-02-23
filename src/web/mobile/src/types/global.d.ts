// This file provides global type declarations for the project
// It helps TypeScript recognize module declarations more effectively

// Reference to our detailed module declarations
/// <reference path="./module-declarations.d.ts" />

// Apollo Client
declare module '@apollo/client' {
  import { DocumentNode } from 'graphql';

  export class ApolloClient<TCacheShape> {
    constructor(options: any);
    query(options: any): Promise<any>;
    mutate(options: any): Promise<any>;
    watchQuery(options: any): any;
  }

  export class InMemoryCache {
    constructor(options?: any);
  }

  export class ApolloError extends Error {
    constructor(options: any);
    graphQLErrors: any[];
    networkError: Error | null;
    message: string;
  }

  export function useQuery<TData = any, TVariables = any>(
    query: DocumentNode,
    options?: any
  ): {
    data: TData | undefined;
    loading: boolean;
    error: ApolloError | undefined;
    refetch: (variables?: TVariables) => Promise<any>;
  };

  export function useMutation<TData = any, TVariables = any>(
    mutation: DocumentNode,
    options?: any
  ): [
    (options?: any) => Promise<any>,
    {
      data: TData | undefined;
      loading: boolean;
      error: ApolloError | undefined;
    }
  ];

  export function gql(
    template: TemplateStringsArray,
    ...substitutions: any[]
  ): DocumentNode;

  export class ApolloProvider extends React.Component<any> {}
  export function useApolloClient(): ApolloClient<any>;
}

// Apollo Upload Client
declare module 'apollo-upload-client' {
  export class ReactNativeFile {
    constructor(options: { uri: string; name: string; type: string });
    uri: string;
    name: string;
    type: string;
  }

  export function createUploadLink(options: {
    uri: string;
    credentials?: string;
    headers?: Record<string, string>;
    [key: string]: any;
  }): any;
}

// Axios
declare module 'axios' {
  export interface AxiosRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: Record<string, string>;
    params?: any;
    data?: any;
    timeout?: number;
    [key: string]: any;
  }

  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
  }

  export interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
  }

  export interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<AxiosResponse>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    defaults: AxiosRequestConfig;
    interceptors: {
      request: any;
      response: any;
    };
  }

  export function create(config?: AxiosRequestConfig): AxiosInstance;

  const axios: AxiosInstance & {
    create: typeof create;
    isAxiosError(payload: any): payload is AxiosError;
  };
  export default axios;
}

// React Native - do NOT declare module here; it shadows the real types.
// The actual types come from node_modules/react-native/types/index.d.ts

// NetInfo
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

// Hookform resolvers
declare module '@hookform/resolvers' {
  export function yupResolver(schema: any): any;
  export function zodResolver(schema: any): any;
}

declare module '@hookform/resolvers/yup' {
  export function yupResolver(schema: any): any;
}

// React Native Community DateTimePicker
declare module '@react-native-community/datetimepicker' {
  import { Component } from 'react';

  interface DateTimePickerProps {
    value: Date;
    mode?: 'date' | 'time' | 'datetime';
    display?: 'default' | 'spinner' | 'calendar' | 'clock';
    onChange?: (event: any, date?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    is24Hour?: boolean;
    [key: string]: any;
  }

  export default class DateTimePicker extends Component<DateTimePickerProps> {}
}

// React Native Picker
declare module '@react-native-picker/picker' {
  import { Component } from 'react';

  interface PickerProps {
    selectedValue?: any;
    onValueChange?: (value: any, index: number) => void;
    enabled?: boolean;
    style?: any;
    [key: string]: any;
  }

  export class Picker extends Component<PickerProps> {
    static Item: Component<{ label: string; value: any }>;
  }
}

// Declare global namespace for any global types
declare namespace NodeJS {
  interface Global {
    // Add any global types here if needed
  }
}
