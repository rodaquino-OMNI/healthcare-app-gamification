import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
    const defaultItems = [{ label: 'Home', href: '/' }, { label: 'Health', href: '/health' }, { label: 'Dashboard' }];

    it('renders all breadcrumb items', () => {
        render(<Breadcrumb items={defaultItems} />);
        expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Health')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders separators between items', () => {
        render(<Breadcrumb items={defaultItems} />);
        const separators = screen.getAllByTestId('breadcrumb-separator');
        expect(separators).toHaveLength(2);
        expect(separators[0]).toHaveTextContent('/');
    });

    it('renders custom separator', () => {
        render(<Breadcrumb items={defaultItems} separator=">" />);
        const separators = screen.getAllByTestId('breadcrumb-separator');
        expect(separators[0]).toHaveTextContent('>');
    });

    it('marks last item as current page', () => {
        render(<Breadcrumb items={defaultItems} />);
        const lastItem = screen.getByTestId('breadcrumb-item-2');
        expect(lastItem).toHaveAttribute('aria-current', 'page');
    });

    it('calls onItemPress when non-last item is clicked', () => {
        const onItemPress = jest.fn();
        render(<Breadcrumb items={defaultItems} onItemPress={onItemPress} />);
        fireEvent.click(screen.getByTestId('breadcrumb-item-0'));
        expect(onItemPress).toHaveBeenCalledWith(defaultItems[0], 0);
    });

    it('has correct accessibility label', () => {
        render(<Breadcrumb items={defaultItems} accessibilityLabel="Custom nav" />);
        expect(screen.getByTestId('breadcrumb')).toHaveAttribute('aria-label', 'Custom nav');
    });

    describe('dividerType', () => {
        it('defaults to slash separator', () => {
            render(<Breadcrumb items={defaultItems} />);
            const separators = screen.getAllByTestId('breadcrumb-separator');
            expect(separators[0]).toHaveTextContent('/');
        });

        it('renders slash when dividerType="slash"', () => {
            render(<Breadcrumb items={defaultItems} dividerType="slash" />);
            const separators = screen.getAllByTestId('breadcrumb-separator');
            expect(separators[0]).toHaveTextContent('/');
        });

        it('renders colon when dividerType="colon"', () => {
            render(<Breadcrumb items={defaultItems} dividerType="colon" />);
            const separators = screen.getAllByTestId('breadcrumb-separator');
            expect(separators[0]).toHaveTextContent(':');
        });

        it('renders chevron when dividerType="icon"', () => {
            render(<Breadcrumb items={defaultItems} dividerType="icon" />);
            const separators = screen.getAllByTestId('breadcrumb-separator');
            expect(separators[0]).toHaveTextContent('\u203A');
        });

        it('explicit separator prop overrides dividerType', () => {
            render(<Breadcrumb items={defaultItems} dividerType="colon" separator=">" />);
            const separators = screen.getAllByTestId('breadcrumb-separator');
            expect(separators[0]).toHaveTextContent('>');
        });

        it('uses dividerType when separator is default slash', () => {
            render(<Breadcrumb items={defaultItems} dividerType="icon" separator="/" />);
            const separators = screen.getAllByTestId('breadcrumb-separator');
            expect(separators[0]).toHaveTextContent('\u203A');
        });
    });
});
