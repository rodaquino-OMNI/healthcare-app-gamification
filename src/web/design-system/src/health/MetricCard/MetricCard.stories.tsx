import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
    title: 'Health/MetricCard',
    component: MetricCard,
    tags: ['autodocs'],
    argTypes: {
        metricName: { control: 'text' },
        value: { control: 'text' },
        unit: { control: 'text' },
        trend: { control: 'text' },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        showChart: { control: 'boolean' },
        onPress: { action: 'pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
    args: {
        metricName: 'Frequência Cardíaca',
        value: 72,
        unit: 'bpm',
        journey: 'health',
        showChart: false,
    },
};

export const WithTrend: Story = {
    args: {
        metricName: 'Pressão Arterial',
        value: '120/80',
        unit: 'mmHg',
        trend: 'stable',
        journey: 'health',
        showChart: false,
    },
};

export const TrendUp: Story = {
    args: {
        metricName: 'Peso',
        value: 82.5,
        unit: 'kg',
        trend: 'increasing',
        journey: 'health',
        showChart: false,
    },
};

export const TrendDown: Story = {
    args: {
        metricName: 'Glicemia',
        value: 95,
        unit: 'mg/dL',
        trend: 'decreasing',
        journey: 'health',
        showChart: false,
    },
};

export const WithChart: Story = {
    args: {
        metricName: 'Passos Diários',
        value: 8743,
        unit: 'passos',
        trend: 'increasing',
        journey: 'health',
        showChart: true,
    },
};

export const WithPressHandler: Story = {
    args: {
        metricName: 'Qualidade do Sono',
        value: 7.5,
        unit: 'horas',
        trend: 'stable',
        journey: 'health',
        showChart: false,
        onPress: () => {},
    },
};

export const Achievement: Story = {
    args: {
        metricName: 'Passos',
        value: 10500,
        unit: 'passos',
        trend: 'New record achieved!',
        journey: 'health',
        showChart: false,
    },
};
