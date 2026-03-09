import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { FileUpload, UploadProgress } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
    title: 'Components/FileUpload',
    component: FileUpload,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        multiple: { control: 'boolean' },
        disabled: { control: 'boolean' },
        accept: { control: 'text' },
        maxSize: { control: 'number' },
        onFilesSelected: { action: 'files selected' },
    },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
    args: {
        journey: 'health',
        multiple: false,
        onFilesSelected: (files) => console.log('Files:', files),
    },
};

export const Multiple: Story = {
    args: {
        journey: 'care',
        multiple: true,
        accept: 'image/*,.pdf',
        onFilesSelected: (files) => console.log('Files:', files),
    },
};

export const Disabled: Story = {
    args: {
        journey: 'plan',
        disabled: true,
        onFilesSelected: () => {},
    },
};

const WithProgressDemo = (): React.ReactElement => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
            <FileUpload journey="health" onFilesSelected={() => {}} />
            <UploadProgress
                fileName="medical-report.pdf"
                progress={65}
                status="uploading"
                onCancel={() => console.log('cancelled')}
            />
            <UploadProgress fileName="blood-test.pdf" progress={100} status="completed" />
            <UploadProgress fileName="xray.png" progress={30} status="error" onRetry={() => console.log('retrying')} />
        </div>
    );
};

export const WithProgress: Story = {
    render: () => <WithProgressDemo />,
};
