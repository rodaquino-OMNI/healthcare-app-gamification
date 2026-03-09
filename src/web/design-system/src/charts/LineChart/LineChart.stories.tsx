import type { Meta, StoryObj } from '@storybook/react';

import { LineChart } from './LineChart';

const meta: Meta<typeof LineChart> = {
    title: 'Charts/LineChart',
    component: LineChart,
    tags: ['autodocs'],
    argTypes: {
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
type Story = StoryObj<typeof LineChart>;

const heartRateData = [
    { date: '02/16', bpm: 68 },
    { date: '02/17', bpm: 72 },
    { date: '02/18', bpm: 70 },
    { date: '02/19', bpm: 75 },
    { date: '02/20', bpm: 73 },
    { date: '02/21', bpm: 69 },
    { date: '02/22', bpm: 71 },
];

const weightData = [
    { date: '02/15', kg: 82.5 },
    { date: '02/16', kg: 82.1 },
    { date: '02/17', kg: 81.8 },
    { date: '02/18', kg: 81.9 },
    { date: '02/19', kg: 81.5 },
    { date: '02/20', kg: 81.2 },
    { date: '02/21', kg: 80.9 },
];

export const Default: Story = {
    args: {
        data: heartRateData,
        xAxisKey: 'date',
        yAxisKey: 'bpm',
        journey: 'health',
    },
};

export const WithLabels: Story = {
    args: {
        data: heartRateData,
        xAxisKey: 'date',
        yAxisKey: 'bpm',
        xAxisLabel: 'Data',
        yAxisLabel: 'Frequência Cardíaca (bpm)',
        journey: 'health',
    },
};

export const WeightTracking: Story = {
    args: {
        data: weightData,
        xAxisKey: 'date',
        yAxisKey: 'kg',
        xAxisLabel: 'Data',
        yAxisLabel: 'Peso (kg)',
        journey: 'health',
    },
};

export const CareJourney: Story = {
    args: {
        data: [
            { day: 'Seg', count: 2 },
            { day: 'Ter', count: 3 },
            { day: 'Qua', count: 2 },
            { day: 'Qui', count: 4 },
            { day: 'Sex', count: 3 },
        ],
        xAxisKey: 'day',
        yAxisKey: 'count',
        xAxisLabel: 'Dia da Semana',
        yAxisLabel: 'Medicamentos',
        journey: 'care',
    },
};

export const Empty: Story = {
    args: {
        data: [],
        xAxisKey: 'date',
        yAxisKey: 'value',
        journey: 'health',
    },
};
