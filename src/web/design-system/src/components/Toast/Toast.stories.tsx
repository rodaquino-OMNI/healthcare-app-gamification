import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Toast } from './Toast';
import { Button } from '../Button/Button';

const meta: Meta<typeof Toast> = {
    title: 'Components/Toast',
    component: Toast,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['success', 'error', 'warning', 'info'],
        },
        message: { control: 'text' },
        visible: { control: 'boolean' },
        duration: { control: 'number' },
        onDismiss: { action: 'dismissed' },
    },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
    args: {
        type: 'info',
        message: 'This is an informational message.',
        visible: true,
    },
};

export const Success: Story = {
    args: {
        type: 'success',
        message: 'Your appointment has been booked successfully.',
        visible: true,
    },
};

export const Error: Story = {
    args: {
        type: 'error',
        message: 'Failed to save your changes. Please try again.',
        visible: true,
    },
};

export const Warning: Story = {
    args: {
        type: 'warning',
        message: 'Your session will expire in 5 minutes.',
        visible: true,
    },
};

export const Info: Story = {
    args: {
        type: 'info',
        message: 'Your health data has been synced.',
        visible: true,
    },
};

export const WithAction: Story = {
    args: {
        type: 'info',
        message: 'New appointment reminder.',
        visible: true,
        action: { label: 'View', onPress: () => console.log('Action clicked') },
    },
};

const InteractiveToast = (): React.ReactElement => {
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['success', 'error', 'warning', 'info'] as const).map((t) => (
                    <Button
                        key={t}
                        journey="health"
                        size="sm"
                        onPress={() => {
                            setType(t);
                            setVisible(true);
                        }}
                    >
                        {t}
                    </Button>
                ))}
            </div>
            <Toast
                type={type}
                message={`This is a ${type} toast message.`}
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={4000}
            />
        </div>
    );
};

export const Interactive: Story = {
    render: () => <InteractiveToast />,
};
