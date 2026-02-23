// Type declarations for modules without their own type definitions

// Type declarations for apollo-upload-client
declare module 'apollo-upload-client' {
  export function createUploadLink(options: {
    uri: string;
    credentials?: string;
    headers?: Record<string, string>;
    [key: string]: any;
  }): any;
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
