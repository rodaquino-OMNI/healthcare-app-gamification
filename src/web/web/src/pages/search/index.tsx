import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { MainLayout } from '@/layouts/MainLayout';
import { WEB_GLOBAL_ROUTES } from 'shared/constants/routes';

const PageContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: ${spacing['3xl']} ${spacing.md};
`;

const Title = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xl} 0;
    text-align: center;
`;

const SearchForm = styled.form`
    display: flex;
    gap: ${spacing.sm};
    margin-bottom: ${spacing['2xl']};
`;

const SearchInput = styled.input`
    flex: 1;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
    padding: ${spacing.sm} ${spacing.md};
    border: 2px solid ${colors.gray[20]};
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s ease;

    &:focus {
        border-color: ${colors.brand.primary};
        box-shadow: 0 0 0 3px ${colors.brand.primary}20;
    }

    &::placeholder {
        color: ${colors.gray[40]};
    }
`;

const SearchButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background-color: ${colors.brand.primary};
    border: none;
    border-radius: 10px;
    padding: ${spacing.sm} ${spacing.xl};
    cursor: pointer;
    transition: background-color 0.15s ease;
    white-space: nowrap;

    &:hover:not(:disabled) {
        background-color: ${colors.brandPalette[400]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${spacing.md};
`;

const CategoryCard = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing.xs};
    padding: ${spacing.xl} ${spacing.md};
    background-color: ${colors.neutral.white};
    border: 1px solid ${colors.gray[20]};
    border-radius: 12px;
    cursor: pointer;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        border-color: ${colors.brand.primary};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
`;

const CategoryIcon = styled.span<{ bgColor: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: ${(props) => props.bgColor};
    font-size: 24px;
`;

const CategoryLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[60]};
`;

const SectionTitle = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.gray[60]};
    margin: 0 0 ${spacing.md} 0;
`;

const categories = [
    { label: 'Minha Saude', icon: '+', color: colors.journeys.health.background, query: 'saude' },
    { label: 'Consultas', icon: '+', color: colors.journeys.care.background, query: 'consultas' },
    { label: 'Meu Plano', icon: '+', color: colors.journeys.plan.background, query: 'plano' },
    { label: 'Medicamentos', icon: '+', color: colors.journeys.health.background, query: 'medicamentos' },
    { label: 'Exames', icon: '+', color: colors.journeys.care.background, query: 'exames' },
    { label: 'Conquistas', icon: '+', color: colors.journeys.community.background, query: 'conquistas' },
];

/**
 * Search page - allows the user to search across all app content.
 * Mirrors the mobile Search screen.
 */
export default function SearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`${WEB_GLOBAL_ROUTES.SEARCH_RESULTS}?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleCategoryClick = (categoryQuery: string) => {
        router.push(`${WEB_GLOBAL_ROUTES.SEARCH_RESULTS}?q=${encodeURIComponent(categoryQuery)}`);
    };

    return (
        <MainLayout>
            <PageContainer>
                <Title>Buscar</Title>

                <SearchForm onSubmit={handleSearch}>
                    <SearchInput
                        type="text"
                        placeholder="Pesquisar medicos, medicamentos, planos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Campo de busca"
                        autoFocus
                    />
                    <SearchButton type="submit" disabled={!query.trim()}>
                        Buscar
                    </SearchButton>
                </SearchForm>

                <SectionTitle>Categorias</SectionTitle>
                <CategoryGrid>
                    {categories.map((cat) => (
                        <CategoryCard key={cat.query} onClick={() => handleCategoryClick(cat.query)}>
                            <CategoryIcon bgColor={cat.color}>{cat.icon}</CategoryIcon>
                            <CategoryLabel>{cat.label}</CategoryLabel>
                        </CategoryCard>
                    ))}
                </CategoryGrid>
            </PageContainer>
        </MainLayout>
    );
}
