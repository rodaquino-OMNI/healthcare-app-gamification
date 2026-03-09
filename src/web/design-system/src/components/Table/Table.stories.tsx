import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Table } from './Table';

const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'specialty', header: 'Specialty', sortable: true },
    { key: 'date', header: 'Date' },
    { key: 'status', header: 'Status' },
];

const data = [
    { name: 'Dr. Ana Silva', specialty: 'Cardiology', date: '2024-03-15', status: 'Confirmed' },
    { name: 'Dr. Carlos Mendes', specialty: 'Neurology', date: '2024-03-18', status: 'Pending' },
    { name: 'Dr. Maria Costa', specialty: 'Dermatology', date: '2024-03-20', status: 'Confirmed' },
    { name: 'Dr. João Santos', specialty: 'Orthopedics', date: '2024-03-22', status: 'Cancelled' },
    { name: 'Dr. Patricia Lima', specialty: 'Pediatrics', date: '2024-03-25', status: 'Confirmed' },
];

const meta: Meta<typeof Table> = {
    title: 'Components/Table',
    component: Table,
    tags: ['autodocs'],
    argTypes: {
        striped: { control: 'boolean' },
        hoverable: { control: 'boolean' },
        compact: { control: 'boolean' },
        onSort: { action: 'sorted' },
    },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
    args: {
        columns,
        data,
        hoverable: true,
    },
};

export const Striped: Story = {
    args: {
        columns,
        data,
        striped: true,
        hoverable: true,
    },
};

const SortableTable = (): React.ReactElement => {
    const [sorted, setSorted] = useState<typeof data>(data);
    return (
        <Table
            columns={columns}
            data={sorted}
            hoverable
            onSort={(key, dir) => {
                const copy = [...sorted].sort((a, b) => {
                    const v = a[key as keyof typeof a] < b[key as keyof typeof b] ? -1 : 1;
                    return dir === 'asc' ? v : -v;
                });
                setSorted(copy);
            }}
        />
    );
};

export const Sortable: Story = {
    render: () => <SortableTable />,
};

export const Compact: Story = {
    args: {
        columns,
        data,
        compact: true,
        hoverable: true,
    },
};

export const Empty: Story = {
    args: {
        columns,
        data: [],
    },
};
