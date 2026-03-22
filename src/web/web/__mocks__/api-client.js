/**
 * Mock for src/api/client.ts
 *
 * Prevents the real HttpLink / ApolloClient instantiation from running in
 * Jest's jsdom environment where `fetch` is not available, which causes an
 * Invariant Violation at module-load time.
 *
 * Intercepted by moduleNameMapper for every import form:
 *   - '@/api/client'
 *   - './client'
 *   - '../client'
 */

const restClient = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    },
};

const graphQLClient = {
    query: jest.fn(() => Promise.resolve({ data: {} })),
    mutate: jest.fn(() => Promise.resolve({ data: {} })),
    watchQuery: jest.fn(() => ({ subscribe: jest.fn() })),
    readQuery: jest.fn(() => null),
    writeQuery: jest.fn(),
    cache: { reset: jest.fn() },
};

module.exports = {
    restClient,
    graphQLClient,
    default: { restClient, graphQLClient },
};
