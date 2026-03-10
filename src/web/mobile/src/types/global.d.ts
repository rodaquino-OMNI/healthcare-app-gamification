// This file provides global type declarations for the project
// It helps TypeScript recognize module declarations more effectively

// Note: module-declarations.d.ts is auto-included via tsconfig "include" glob

// Apollo Upload Client — no bundled types
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
    }): import('@apollo/client').ApolloLink;
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
    export function addEventListener(listener: (state: NetInfoState) => void): () => void;

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

// React Native Community DateTimePicker & React Native Picker
// Both use Component from 'react' — consolidated into a single import block
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
    // eslint-disable-next-line no-duplicate-imports
    import { Component } from 'react';

    interface PickerProps {
        selectedValue?: any;
        onValueChange?: (value: any, index: number) => void;
        enabled?: boolean;
        style?: any;
        [key: string]: any;
    }

    export class Picker extends Component<PickerProps> {
        static Item: React.ComponentType<{ label: string; value: any; [key: string]: any }>;
    }
}

// Expo Auth Session
declare module 'expo-auth-session' {
    export function makeRedirectUri(options?: { scheme?: string; path?: string }): string;
    export function useAuthRequest(
        config: Record<string, unknown>,
        discovery: Record<string, unknown> | null
    ): [unknown, unknown, (options?: Record<string, unknown>) => Promise<unknown>];
    export class AuthRequest {
        constructor(config: Record<string, unknown>);
        promptAsync(
            discovery: Record<string, unknown> | null,
            options?: Record<string, unknown>
        ): Promise<{
            type: string;
            params?: Record<string, string>;
            error?: { message: string };
        }>;
    }
    export const ResponseType: { Code: string; Token: string };
}

// Expo Web Browser
declare module 'expo-web-browser' {
    export function maybeCompleteAuthSession(): { type: string };
    export function openBrowserAsync(url: string): Promise<unknown>;
}

// Expo Document Picker
declare module 'expo-document-picker' {
    interface DocumentPickerAsset {
        uri: string;
        name: string;
        size?: number;
        mimeType?: string;
    }
    export function getDocumentAsync(options?: Record<string, unknown>): Promise<{
        type?: string;
        canceled: boolean;
        assets: DocumentPickerAsset[] | null;
        uri?: string;
        name?: string;
        size?: number;
    }>;
}

// Declare global namespace for any global types
declare namespace NodeJS {
    interface Global {
        // Add any global types here if needed
    }
}
