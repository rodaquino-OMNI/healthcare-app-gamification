import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

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

const DefaultPagination = (): React.ReactElement => {
    const [page, setPage] = useState(1);
    return <Pagination totalPages={10} currentPage={page} onPageChange={setPage} journey="health" />;
};

export const Default: Story = {
    render: () => <DefaultPagination />,
};

const DotsPagination = (): React.ReactElement => {
    const [page, setPage] = useState(1);
    return <Pagination totalPages={5} currentPage={page} onPageChange={setPage} variant="dots" journey="care" />;
};

export const Dots: Story = {
    render: () => <DotsPagination />,
};

const ManyPagesPagination = (): React.ReactElement => {
    const [page, setPage] = useState(5);
    return <Pagination totalPages={20} currentPage={page} onPageChange={setPage} journey="plan" />;
};

export const ManyPages: Story = {
    render: () => <ManyPagesPagination />,
};

const FewPagesPagination = (): React.ReactElement => {
    const [page, setPage] = useState(2);
    return <Pagination totalPages={3} currentPage={page} onPageChange={setPage} journey="health" />;
};

export const FewPages: Story = {
    render: () => <FewPagesPagination />,
};
