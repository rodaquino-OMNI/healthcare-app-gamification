import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
    title: 'Components/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['numbered', 'dots'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        totalPages: { control: { type: 'number', min: 2, max: 20 } },
        currentPage: { control: { type: 'number', min: 1, max: 20 } },
        onPageChange: { action: 'page changed' },
    },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
    render: () => {
        const [page, setPage] = useState(1);
        return <Pagination totalPages={10} currentPage={page} onPageChange={setPage} journey="health" />;
    },
};

export const Dots: Story = {
    render: () => {
        const [page, setPage] = useState(1);
        return <Pagination totalPages={5} currentPage={page} onPageChange={setPage} variant="dots" journey="care" />;
    },
};

export const ManyPages: Story = {
    render: () => {
        const [page, setPage] = useState(5);
        return <Pagination totalPages={20} currentPage={page} onPageChange={setPage} journey="plan" />;
    },
};

export const FewPages: Story = {
    render: () => {
        const [page, setPage] = useState(2);
        return <Pagination totalPages={3} currentPage={page} onPageChange={setPage} journey="health" />;
    },
};
