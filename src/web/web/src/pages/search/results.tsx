import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { MainLayout } from '@/layouts/MainLayout';
import { WEB_GLOBAL_ROUTES } from 'shared/constants/routes';
import { restClient } from '@/api/client';

const PageContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: ${spacing.xl} ${spacing.md};
`;

const BackLink = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.brand.primary};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: ${spacing.lg};

    &:hover {
        text-decoration: underline;
    }
`;

const SearchHeader = styled.div`
    margin-bottom: ${spacing.xl};
`;

const QueryText = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing['3xs']} 0;
`;

const ResultCount = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[40]};
    margin: 0;
`;

const ResultsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm};
`;

const ResultCard = styled.div`
    background-color: ${colors.neutral.white};
    border: 1px solid ${colors.gray[20]};
    border-radius: 10px;
    padding: ${spacing.md};
    cursor: pointer;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        border-color: ${colors.brand.primary};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
`;

const ResultTitle = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing['3xs']} 0;
`;

const ResultDescription = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    margin: 0;
    line-height: ${typography.lineHeight.base};
`;

const ResultJourney = styled.span<{ color: string }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${(props) => props.color};
    text-transform: uppercase;
    letter-spacing: ${typography.letterSpacing.wide};
`;

const EmptyState = styled.div`
    text-align: center;
    padding: ${spacing['4xl']} 0;
`;

const EmptyTitle = styled.p`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[60]};
    margin: 0 0 ${spacing.xs} 0;
`;

const EmptyDescription = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[40]};
    margin: 0;
`;

interface SearchResult {
    id: string;
    title: string;
    description: string;
    journey: string;
    deepLink: string;
}

/**
 * Search results page - displays results from a search query.
 * Mirrors the mobile SearchResults screen.
 */
export default function SearchResultsPage() {
    const router = useRouter();
    const query = (router.query.q as string) || '';
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getJourneyColor = (journey: string): string => {
        switch (journey) {
            case 'health':
                return colors.journeys.health.primary;
            case 'care':
                return colors.journeys.care.primary;
            case 'plan':
                return colors.journeys.plan.primary;
            default:
                return colors.brand.primary;
        }
    };

    useEffect(() => {
        if (!query) return;

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        restClient
            .get<{ results: SearchResult[] }>('/search', {
                params: { q: query },
                signal: controller.signal,
            })
            .then((res) => {
                setResults(res.data.results ?? []);
            })
            .catch((err) => {
                if (err.name !== 'CanceledError') {
                    setError('Erro ao buscar resultados. Tente novamente.');
                }
            })
            .finally(() => {
                setLoading(false);
            });

        return () => controller.abort();
    }, [query]);

    return (
        <MainLayout>
            <PageContainer>
                <BackLink onClick={() => router.push(WEB_GLOBAL_ROUTES.SEARCH)}>Voltar para busca</BackLink>

                <SearchHeader>
                    <QueryText>Resultados para "{query}"</QueryText>
                    <ResultCount>{loading ? 'Buscando...' : `${results.length} resultados encontrados`}</ResultCount>
                </SearchHeader>

                {error ? (
                    <EmptyState>
                        <EmptyTitle>Erro na busca</EmptyTitle>
                        <EmptyDescription>{error}</EmptyDescription>
                    </EmptyState>
                ) : !loading && results.length === 0 ? (
                    <EmptyState>
                        <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>
                        <EmptyDescription>
                            Tente buscar por termos diferentes ou explore as categorias.
                        </EmptyDescription>
                    </EmptyState>
                ) : (
                    <ResultsList>
                        {results.map((result) => (
                            <ResultCard key={result.id} onClick={() => router.push(result.deepLink)}>
                                <ResultJourney color={getJourneyColor(result.journey)}>{result.journey}</ResultJourney>
                                <ResultTitle>{result.title}</ResultTitle>
                                <ResultDescription>{result.description}</ResultDescription>
                            </ResultCard>
                        ))}
                    </ResultsList>
                )}
            </PageContainer>
        </MainLayout>
    );
}
