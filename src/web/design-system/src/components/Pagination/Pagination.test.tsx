import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
    it('renders numbered pagination', () => {
        render(<Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />);
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
        expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument();
        expect(screen.getByTestId('pagination-page-5')).toBeInTheDocument();
    });

    it('highlights current page', () => {
        render(<Pagination totalPages={5} currentPage={3} onPageChange={jest.fn()} />);
        expect(screen.getByTestId('pagination-page-3')).toHaveAttribute('aria-current', 'page');
    });

    it('calls onPageChange when page button is clicked', () => {
        const onPageChange = jest.fn();
        render(<Pagination totalPages={5} currentPage={1} onPageChange={onPageChange} />);
        fireEvent.click(screen.getByTestId('pagination-page-3'));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('disables prev button on first page', () => {
        render(<Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />);
        expect(screen.getByTestId('pagination-prev')).toBeDisabled();
    });

    it('disables next button on last page', () => {
        render(<Pagination totalPages={5} currentPage={5} onPageChange={jest.fn()} />);
        expect(screen.getByTestId('pagination-next')).toBeDisabled();
    });

    it('renders dots variant', () => {
        render(<Pagination totalPages={5} currentPage={2} onPageChange={jest.fn()} variant="dots" />);
        expect(screen.getByTestId('pagination-dot-2')).toBeInTheDocument();
    });

    it('returns null for single page', () => {
        const { container } = render(<Pagination totalPages={1} currentPage={1} onPageChange={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });
});
