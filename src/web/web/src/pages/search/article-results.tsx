import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useSearch } from '@/hooks/useSearch';
import { MainLayout } from '@/layouts/MainLayout';

const PageContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: ${spacing.xl} ${spacing.md};
`;

const Title = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.neutral.gray900};
    margin: 0 0 ${spacing.lg} 0;
`;

const FilterBar = styled.div`
    display: flex;
    gap: ${spacing.sm};
    margin-bottom: ${spacing.lg};
    overflow-x: auto;
    padding-bottom: ${spacing.sm};
`;

const FilterButton = styled.button<{ active: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    padding: ${spacing.xs} ${spacing.md};
    border-radius: ${borderRadius.full};
    border: 1px solid ${(props) => (props.active ? colors.brand.primary : colors.neutral.gray300)};
    background-color: ${(props) => (props.active ? colors.brand.primary : colors.neutral.white)};
    color: ${(props) => (props.active ? colors.neutral.white : colors.neutral.gray600)};
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;

    &:hover {
        border-color: ${colors.brand.primary};
    }
`;

const ArticleCard = styled.div`
    background-color: ${colors.neutral.white};
    border: 1px solid ${colors.neutral.gray200};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    margin-bottom: ${spacing.md};
    cursor: pointer;
    transition: box-shadow 0.15s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

const ArticleTitle = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray900};
    margin: 0 0 ${spacing.xs} 0;
`;

const ArticleSnippet = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.neutral.gray600};
    margin: 0 0 ${spacing.sm} 0;
    line-height: ${typography.lineHeight.base};
`;

const ArticleFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ArticleDate = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.neutral.gray500};
`;

const ReadMoreButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.brand.primary};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 0.7;
    }
`;

interface Article {
    id: string;
    title: string;
    snippet: string;
    date: string;
    readTime: string;
}

const mockArticles: Article[] = [
    {
        id: '1',
        title: 'Como Manter Uma Rotina Saudável em Casa',
        snippet: 'Descubra dicas práticas para criar e manter uma rotina saudável durante o trabalho remoto...',
        date: '15 de fevereiro de 2026',
        readTime: '5 min',
    },
    {
        id: '2',
        title: 'Entenda os Benefícios da Meditação',
        snippet: 'A meditação oferece inúmeros benefícios para a saúde mental e física. Veja como começar...',
        date: '14 de fevereiro de 2026',
        readTime: '7 min',
    },
    {
        id: '3',
        title: 'Nutrição: Alimentos que Fortalecem a Imunidade',
        snippet: 'Conheça os alimentos mais ricos em nutrientes que ajudam a fortalecer o sistema imunológico...',
        date: '13 de fevereiro de 2026',
        readTime: '6 min',
    },
];

export default function ArticleResultsPage(): React.ReactElement {
    const { query } = useSearch();
    const [selectedFilter, setSelectedFilter] = useState('todos');

    return (
        <MainLayout>
            <PageContainer>
                <Title>{query ? `Resultados: Artigos para "${query}"` : 'Resultados: Artigos'}</Title>

                <FilterBar>
                    <FilterButton active={selectedFilter === 'todos'} onClick={() => setSelectedFilter('todos')}>
                        Todos
                    </FilterButton>
                    <FilterButton active={selectedFilter === 'recente'} onClick={() => setSelectedFilter('recente')}>
                        Mais Recentes
                    </FilterButton>
                    <FilterButton active={selectedFilter === 'popular'} onClick={() => setSelectedFilter('popular')}>
                        Populares
                    </FilterButton>
                </FilterBar>

                {mockArticles.map((article) => (
                    <ArticleCard key={article.id}>
                        <ArticleTitle>{article.title}</ArticleTitle>
                        <ArticleSnippet>{article.snippet}</ArticleSnippet>
                        <ArticleFooter>
                            <ArticleDate>
                                {article.date} • {article.readTime} de leitura
                            </ArticleDate>
                            <ReadMoreButton>Ler Mais →</ReadMoreButton>
                        </ArticleFooter>
                    </ArticleCard>
                ))}
            </PageContainer>
        </MainLayout>
    );
}
