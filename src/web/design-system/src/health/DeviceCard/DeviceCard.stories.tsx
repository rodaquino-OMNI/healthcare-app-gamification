import type { Meta, StoryObj } from '@storybook/react';

import { DeviceCard } from './DeviceCard';

const meta: Meta<typeof DeviceCard> = {
    title: 'Health/DeviceCard',
    component: DeviceCard,
    tags: ['autodocs'],
    argTypes: {
        deviceName: { control: 'text' },
        deviceType: { control: 'text' },
        lastSync: { control: 'text' },
        status: { control: 'text' },
        onPress: { action: 'pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof DeviceCard>;

export const Default: Story = {
    args: {
        deviceName: 'Apple Watch Series 9',
        deviceType: 'Smartwatch',
        lastSync: '5 minutos atrás',
        status: 'Connected',
    },
};

export const WithOnPress: Story = {
    args: {
        deviceName: 'Garmin Forerunner 265',
        deviceType: 'Smartwatch',
        lastSync: '2 minutos atrás',
        status: 'Connected',
        onPress: () => {},
    },
};

export const Disconnected: Story = {
    args: {
        deviceName: 'Omron HEM-7150-T',
        deviceType: 'Blood Pressure Monitor',
        lastSync: '3 horas atrás',
        status: 'Disconnected',
    },
};

export const HeartRateMonitor: Story = {
    args: {
        deviceName: 'Polar H10',
        deviceType: 'Heart Rate Monitor',
        lastSync: '10 minutos atrás',
        status: 'Connected',
    },
};

export const SmartScale: Story = {
    args: {
        deviceName: 'Withings Body+',
        deviceType: 'Smart Scale',
        lastSync: '1 hora atrás',
        status: 'Connected',
    },
};

export const GlucoseMonitor: Story = {
    args: {
        deviceName: 'Dexcom G7',
        deviceType: 'Glucose Monitor',
        lastSync: '15 minutos atrás',
        status: 'Connected',
    },
};
