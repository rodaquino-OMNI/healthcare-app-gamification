declare module 'apollo-upload-client/createUploadLink.mjs' {
    import { ApolloLink } from '@apollo/client';
    export default function createUploadLink(options?: {
        uri?: string;
        credentials?: string;
        headers?: Record<string, string>;
        fetchOptions?: RequestInit;
        useGETForQueries?: boolean;
    }): ApolloLink;
}
