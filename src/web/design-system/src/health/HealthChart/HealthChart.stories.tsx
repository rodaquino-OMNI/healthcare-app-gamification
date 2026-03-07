import type { Meta, StoryObj } from '@storybook/react';
import { HealthChart } from './HealthChart';

const meta: Meta<typeof HealthChart> = {
    title: 'Health/HealthChart',
    component: HealthChart,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['line', 'bar', 'radial'],
        },
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        xAxisLabel: { control: 'text' },
        yAxisLabel: { control: 'text' },
        lineColor: { control: 'color' },
    },
};

export default meta;
type Story = StoryObj<typeof HealthChart>;

const heartRateMetrics = [
    { timestamp: '02/16', value: 68 },
    { timestamp: '02/17', value: 72 },
    { timestamp: '02/18', value: 70 },
    { timestamp: '02/19', value: 75 },
    { timestamp: '02/20', value: 73 },
    { timestamp: '02/21', value: 69 },
    { timestamp: '02/22', value: 71 },
];

const stepsMetrics = [
    { day: 'Seg', steps: 8200 },
    { day: 'Ter', steps: 10500 },
    { day: 'Qua', steps: 7800 },
    { day: 'Qui', steps: 11200 },
    { day: 'Sex', steps: 9400 },
    { day: 'Sab', steps: 12100 },
    { day: 'Dom', steps: 6500 },
];

const activityDistribution = [
    { category: 'Cardio', minutes: 45 },
    { category: 'Força', minutes: 30 },
    { category: 'Yoga', minutes: 20 },
    { category: 'Outros', minutes: 15 },
];

export const Default: Story = {
    args: {
        type: 'line',
        data: heartRateMetrics,
        xAxisKey: 'timestamp',
        yAxisKey: 'value',
        xAxisLabel: 'Data',
        yAxisLabel: 'Frequência Cardíaca (bpm)',
        journey: 'health',
    },
};

export const LineType: Story = {
    args: {
        type: 'line',
        data: heartRateMetrics,
        xAxisKey: 'timestamp',
        yAxisKey: 'value',
        xAxisLabel: 'Data',
        yAxisLabel: 'BPM',
        journey: 'health',
    },
};

export const BarType: Story = {
    args: {
        type: 'bar',
        data: stepsMetrics,
        xAxisKey: 'day',
        yAxisKey: 'steps',
        xAxisLabel: 'Dia',
        yAxisLabel: 'Passos',
        journey: 'health',
    },
};

export const RadialType: Story = {
    args: {
        type: 'radial',
        data: activityDistribution,
        xAxisKey: 'category',
        yAxisKey: 'minutes',
        journey: 'health',
    },
};

export const EmptyData: Story = {
    args: {
        type: 'line',
        data: [],
        xAxisKey: 'timestamp',
        yAxisKey: 'value',
        journey: 'health',
    },
};
