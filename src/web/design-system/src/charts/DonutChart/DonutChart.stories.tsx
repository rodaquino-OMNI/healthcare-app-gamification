import type { Meta, StoryObj } from '@storybook/react';
import { DonutChart } from './DonutChart';

const meta: Meta<typeof DonutChart> = {
    title: 'Charts/DonutChart',
    component: DonutChart,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        labelType: {
            control: 'select',
            options: ['percentage', 'value', 'label', 'none'],
        },
        innerRadius: { control: { type: 'range', min: 40, max: 120, step: 5 } },
        centerLabel: { control: 'text' },
        centerValue: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

const coverageData = [
    { x: 'Consultas', y: 40 },
    { x: 'Exames', y: 30 },
    { x: 'Internações', y: 20 },
    { x: 'Outros', y: 10 },
];

const activityData = [
    { x: 'Cardio', y: 50 },
    { x: 'Força', y: 30 },
    { x: 'Flexibilidade', y: 20 },
];

export const Default: Story = {
    args: {
        data: coverageData,
        labelType: 'percentage',
        journey: 'plan',
        innerRadius: 80,
    },
};

export const WithCenterLabel: Story = {
    args: {
        data: coverageData,
        labelType: 'none',
        journey: 'plan',
        innerRadius: 80,
        centerLabel: 'Cobertura Total',
        centerValue: '100%',
    },
};

export const Percentage: Story = {
    args: {
        data: coverageData,
        labelType: 'percentage',
        journey: 'plan',
        innerRadius: 80,
    },
};

export const HealthActivity: Story = {
    args: {
        data: activityData,
        labelType: 'label',
        journey: 'health',
        innerRadius: 70,
        centerLabel: 'Treinos',
        centerValue: '12',
    },
};

export const SmallInnerRadius: Story = {
    args: {
        data: activityData,
        labelType: 'percentage',
        journey: 'health',
        innerRadius: 40,
    },
};

export const CareJourney: Story = {
    args: {
        data: [
            { x: 'Medicados', y: 7 },
            { x: 'Não Medicados', y: 3 },
        ],
        labelType: 'value',
        journey: 'care',
        innerRadius: 80,
        centerLabel: 'Adesão',
        centerValue: '70%',
    },
};
