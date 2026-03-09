import React from 'react';
import styled from 'styled-components';

import { borderRadius } from '../../tokens/borderRadius';
import { colors } from '../../tokens/colors';
import { spacing } from '../../tokens/spacing';
import { typography } from '../../tokens/typography';

export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    variant?: 'numbered' | 'dots';
    journey?: 'health' | 'care' | 'plan';
    accessibilityLabel?: string;
}

const getJourneyColor = (journey?: string): string => {
    if (journey && colors.journeys[journey as keyof typeof colors.journeys]) {
        return colors.journeys[journey as keyof typeof colors.journeys].primary;
    }
    return colors.brand.primary;
};

const PaginationContainer = styled.nav`
    display: flex;
    align-items: center;
    gap: ${spacing.xs};
`;

const PageButton = styled.button<{ isActive: boolean; journey?: string }>`
    min-width: ${spacing['2xl']};
    height: ${spacing['2xl']};
    padding: 0 ${spacing.xs};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    font-weight: ${(props) => (props.isActive ? typography.fontWeight.semiBold : typography.fontWeight.regular)};
    color: ${(props) => (props.isActive ? colors.neutral.white : colors.neutral.gray700)};
    background-color: ${(props) => (props.isActive ? getJourneyColor(props.journey) : 'transparent')};
    border: 1px solid ${(props) => (props.isActive ? getJourneyColor(props.journey) : colors.neutral.gray300)};
    border-radius: ${borderRadius.md};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;

    &:hover:not(:disabled) {
        background-color: ${(props) => (props.isActive ? getJourneyColor(props.journey) : colors.neutral.gray100)};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px ${(props) => getJourneyColor(props.journey)}40;
    }
`;

const NavButton = styled(PageButton)`
    min-width: auto;
    padding: 0 ${spacing.sm};
`;

const Dot = styled.button<{ isActive: boolean; journey?: string }>`
    width: ${spacing.xs};
    height: ${spacing.xs};
    padding: 0;
    border: none;
    border-radius: ${borderRadius.full};
    background-color: ${(props) => (props.isActive ? getJourneyColor(props.journey) : colors.neutral.gray300)};
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px ${(props) => getJourneyColor(props.journey)}40;
    }
`;

const Ellipsis = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm};
    color: ${colors.neutral.gray500};
    padding: 0 ${spacing['3xs']};
`;

export const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange,
    variant = 'numbered',
    journey,
    accessibilityLabel = 'Pagination',
}) => {
    if (totalPages <= 1) {
        return null;
    }

    if (variant === 'dots') {
        return (
            <PaginationContainer aria-label={accessibilityLabel} data-testid="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Dot
                        key={i}
                        isActive={i + 1 === currentPage}
                        journey={journey}
                        onClick={() => onPageChange(i + 1)}
                        aria-label={`Page ${i + 1}`}
                        aria-current={i + 1 === currentPage ? 'page' : undefined}
                        data-testid={`pagination-dot-${i + 1}`}
                    />
                ))}
            </PaginationContainer>
        );
    }

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | 'ellipsis')[] = [1];
        if (currentPage > 3) {
            pages.push('ellipsis');
        }
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) {
            pages.push('ellipsis');
        }
        pages.push(totalPages);
        return pages;
    };

    return (
        <PaginationContainer aria-label={accessibilityLabel} data-testid="pagination">
            <NavButton
                isActive={false}
                journey={journey}
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
                data-testid="pagination-prev"
            >
                &#8249;
            </NavButton>
            {getPageNumbers().map((page, idx) =>
                page === 'ellipsis' ? (
                    <Ellipsis key={`ellipsis-${idx}`} data-testid="pagination-ellipsis">
                        &#8230;
                    </Ellipsis>
                ) : (
                    <PageButton
                        key={page}
                        isActive={page === currentPage}
                        journey={journey}
                        onClick={() => onPageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        data-testid={`pagination-page-${page}`}
                    >
                        {page}
                    </PageButton>
                )
            )}
            <NavButton
                isActive={false}
                journey={journey}
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
                data-testid="pagination-next"
            >
                &#8250;
            </NavButton>
        </PaginationContainer>
    );
};
