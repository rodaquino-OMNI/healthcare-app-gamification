import type { Meta, StoryObj } from '@storybook/react';
import { RadialChart } from './RadialChart';

const meta: Meta<typeof RadialChart> = {
    title: 'Charts/RadialChart',
    component: RadialChart,
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
    },
};

export default meta;
type Story = StoryObj<typeof RadialChart>;

const activityData = [
    { x: 'Caminhada', y: 45 },
    { x: 'Natação', y: 20 },
    { x: 'Ciclismo', y: 25 },
    { x: 'Yoga', y: 10 },
];

const claimData = [
    { x: 'Consultas', y: 12 },
    { x: 'Exames', y: 8 },
    { x: 'Medicamentos', y: 5 },
    { x: 'Procedimentos', y: 3 },
];

export const Default: Story = {
    args: {
        data: activityData,
        labelType: 'percentage',
        journey: 'health',
    },
};

export const Percentage: Story = {
    args: {
        data: activityData,
        labelType: 'percentage',
        journey: 'health',
    },
};

export const ValueLabels: Story = {
    args: {
        data: activityData,
        labelType: 'value',
        journey: 'health',
    },
};

export const CategoryLabels: Story = {
    args: {
        data: activityData,
        labelType: 'label',
        journey: 'health',
    },
};

export const NoLabels: Story = {
    args: {
        data: activityData,
        labelType: 'none',
        journey: 'health',
    },
};

export const PlanJourney: Story = {
    args: {
        data: claimData,
        labelType: 'percentage',
        journey: 'plan',
    },
};

export const CareJourney: Story = {
    args: {
        data: [
            { x: 'Clínico Geral', y: 6 },
            { x: 'Cardiologista', y: 3 },
            { x: 'Ortopedista', y: 2 },
            { x: 'Neurologista', y: 1 },
        ],
        labelType: 'percentage',
        journey: 'care',
    },
};
