import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Table } from './Table';

describe('Table', () => {
    const columns = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'age', header: 'Age', sortable: true },
        { key: 'email', header: 'Email' },
    ];

    const data = [
        { name: 'Alice', age: 30, email: 'alice@example.com' },
        { name: 'Bob', age: 25, email: 'bob@example.com' },
    ];

    it('renders the table with headers', () => {
        render(<Table columns={columns} data={data} />);
        expect(screen.getByTestId('table')).toBeInTheDocument();
        expect(screen.getByTestId('table-header-name')).toHaveTextContent('Name');
        expect(screen.getByTestId('table-header-age')).toHaveTextContent('Age');
    });

    it('renders data rows', () => {
        render(<Table columns={columns} data={data} />);
        expect(screen.getByTestId('table-cell-0-name')).toHaveTextContent('Alice');
        expect(screen.getByTestId('table-cell-1-name')).toHaveTextContent('Bob');
    });

    it('shows empty state when no data', () => {
        render(<Table columns={columns} data={[]} />);
        expect(screen.getByTestId('table-empty')).toHaveTextContent('No data available');
    });

    it('calls onSort when sortable column header is clicked', () => {
        const onSort = jest.fn();
        render(<Table columns={columns} data={data} onSort={onSort} />);
        fireEvent.click(screen.getByTestId('table-header-name'));
        expect(onSort).toHaveBeenCalledWith('name', 'asc');
    });

    it('toggles sort direction on subsequent clicks', () => {
        const onSort = jest.fn();
        render(<Table columns={columns} data={data} onSort={onSort} />);
        fireEvent.click(screen.getByTestId('table-header-name'));
        fireEvent.click(screen.getByTestId('table-header-name'));
        expect(onSort).toHaveBeenCalledWith('name', 'desc');
    });

    it('renders sort indicators for sortable columns', () => {
        render(<Table columns={columns} data={data} onSort={jest.fn()} />);
        expect(screen.getByTestId('table-sort-name')).toBeInTheDocument();
    });

    it('has correct accessibility label', () => {
        render(<Table columns={columns} data={data} accessibilityLabel="User table" />);
        expect(screen.getByTestId('table')).toHaveAttribute('aria-label', 'User table');
    });
});
