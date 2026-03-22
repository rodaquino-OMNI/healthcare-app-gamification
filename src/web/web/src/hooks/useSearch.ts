import { useCallback, useRef, useState } from 'react';

import { restClient } from '@/api/client';

export interface SearchResult {
    id: string;
    title: string;
    description: string;
    journey: string;
    deepLink: string;
}

/** Shape returned by the useSearch hook */
export interface UseSearchReturn {
    query: string;
    setQuery: (q: string) => void;
    results: SearchResult[];
    isSearching: boolean;
    error: string | null;
    search: (q?: string) => Promise<void>;
    clearResults: () => void;
}

/**
 * Client-side search hook that manages search query state and fetches results
 * from the /search endpoint using the restClient.
 */
export const useSearch = (): UseSearchReturn => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback(
        (overrideQuery?: string): Promise<void> => {
            const q = overrideQuery ?? query;
            if (!q.trim()) {
                return Promise.resolve();
            }

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            return new Promise<void>((resolve) => {
                debounceRef.current = setTimeout(async () => {
                    setIsSearching(true);
                    setError(null);

                    try {
                        const response = await restClient.get<{ results: SearchResult[] }>('/search', {
                            params: { q: q.trim() },
                        });
                        setResults(response.data.results ?? []);
                    } catch (err) {
                        setError(err instanceof Error ? err.message : 'Erro ao buscar resultados');
                        setResults([]);
                    } finally {
                        setIsSearching(false);
                    }
                    resolve();
                }, 300);
            });
        },
        [query]
    );

    const clearResults = useCallback((): void => {
        setResults([]);
        setError(null);
    }, []);

    return {
        query,
        setQuery,
        results,
        isSearching,
        error,
        search,
        clearResults,
    };
};
