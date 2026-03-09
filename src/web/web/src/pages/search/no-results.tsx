import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

import { MainLayout } from '@/layouts/MainLayout';

const PageContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: ${spacing.xl} ${spacing.md};
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
`;

const EmptyIcon = styled.div`
    font-size: 64px;
    margin-bottom: ${spacing.lg};
`;

const EmptyTitle = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.neutral.gray900};
    margin: 0 0 ${spacing.md} 0;
`;

const EmptyDescription = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.neutral.gray600};
    margin: 0 0 ${spacing.xl} 0;
    max-width: 400px;
`;

const SuggestionsContainer = styled.div`
    margin-bottom: ${spacing.xl};
`;

const SuggestionsTitle = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray800};
    margin: 0 0 ${spacing.md} 0;
`;

const SuggestionsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm};
`;

const SuggestionItem = styled.li`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.neutral.gray600};
    padding: ${spacing.sm};
    background-color: ${colors.neutral.gray100};
    border-radius: ${borderRadius.sm};
`;

const PopularSearches = styled.div`
    margin-bottom: ${spacing.xl};
`;

const PopularTitle = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray800};
    margin: 0 0 ${spacing.md} 0;
`;

const SearchTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing.sm};
    justify-content: center;
`;

const SearchTag = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    padding: ${spacing.xs} ${spacing.md};
    border-radius: ${borderRadius.full};
    border: 1px solid ${colors.neutral.gray300};
    background-color: ${colors.neutral.white};
    color: ${colors.brand.primary};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background-color: ${colors.brand.primary};
        color: ${colors.neutral.white};
        border-color: ${colors.brand.primary};
    }
`;

const HomeButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.medium};
    padding: ${spacing.sm} ${spacing.xl};
    background-color: ${colors.brand.primary};
    color: ${colors.neutral.white};
    border: none;
    border-radius: ${borderRadius.md};
    cursor: pointer;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 0.9;
    }
`;

export default function NoResultsPage(): React.ReactElement {
    const router = useRouter();

    const handlePopularSearch = (tag: string): void => {
        void router.push(`/search/results?q=${encodeURIComponent(tag)}`);
    };

    const handleHome = (): void => {
        void router.push('/');
    };

    return (
        <MainLayout>
            <PageContainer>
                <EmptyState>
                    <EmptyIcon>🔍</EmptyIcon>
                    <EmptyTitle>Nenhum Resultado</EmptyTitle>
                    <EmptyDescription>
                        Desculpe, não encontramos nada para sua busca. Tente usar palavras diferentes.
                    </EmptyDescription>

                    <SuggestionsContainer>
                        <SuggestionsTitle>Dicas para melhorar sua busca:</SuggestionsTitle>
                        <SuggestionsList>
                            <SuggestionItem>Verifique a ortografia da sua busca</SuggestionItem>
                            <SuggestionItem>Tente usar termos mais genéricos</SuggestionItem>
                            <SuggestionItem>Use palavras-chave diferentes</SuggestionItem>
                        </SuggestionsList>
                    </SuggestionsContainer>

                    <PopularSearches>
                        <PopularTitle>Buscas Populares:</PopularTitle>
                        <SearchTags>
                            <SearchTag onClick={() => handlePopularSearch('Consulta Médica')}>
                                Consulta Médica
                            </SearchTag>
                            <SearchTag onClick={() => handlePopularSearch('Sintomas')}>Sintomas</SearchTag>
                            <SearchTag onClick={() => handlePopularSearch('Medicamentos')}>Medicamentos</SearchTag>
                            <SearchTag onClick={() => handlePopularSearch('Saúde Mental')}>Saúde Mental</SearchTag>
                        </SearchTags>
                    </PopularSearches>

                    <HomeButton onClick={handleHome}>Voltar ao Início</HomeButton>
                </EmptyState>
            </PageContainer>
        </MainLayout>
    );
}
