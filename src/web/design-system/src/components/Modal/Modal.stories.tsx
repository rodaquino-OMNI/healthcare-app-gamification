import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
    title: 'Components/Modal',
    component: Modal,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['center', 'bottomSheet'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        visible: { control: 'boolean' },
        title: { control: 'text' },
        onClose: { action: 'closed' },
    },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const DefaultModal = (): React.ReactElement => {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <Button journey="health" onPress={() => setVisible(true)}>
                Open Modal
            </Button>
            <Modal visible={visible} onClose={() => setVisible(false)} title="Confirmation" journey="health">
                <p style={{ margin: 0 }}>Are you sure you want to proceed with this action?</p>
            </Modal>
        </div>
    );
};

export const Default: Story = {
    render: () => <DefaultModal />,
};

const WithTitleModal = (): React.ReactElement => {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <Button journey="care" onPress={() => setVisible(true)}>
                Open Care Modal
            </Button>
            <Modal visible={visible} onClose={() => setVisible(false)} title="Appointment Details" journey="care">
                <p>Dr. Carlos - Cardiology</p>
                <p>Tuesday, March 15 at 2:00 PM</p>
            </Modal>
        </div>
    );
};

export const WithTitle: Story = {
    render: () => <WithTitleModal />,
};

const BottomSheetModal = (): React.ReactElement => {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <Button journey="plan" onPress={() => setVisible(true)}>
                Open Bottom Sheet
            </Button>
            <Modal
                visible={visible}
                onClose={() => setVisible(false)}
                title="Insurance Options"
                journey="plan"
                variant="bottomSheet"
            >
                <p>Select your coverage plan below.</p>
            </Modal>
        </div>
    );
};

export const BottomSheet: Story = {
    render: () => <BottomSheetModal />,
};
