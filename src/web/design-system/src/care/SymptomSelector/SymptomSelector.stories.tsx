import type { Meta, StoryObj } from '@storybook/react';
import { SymptomSelector } from './SymptomSelector';

const meta: Meta<typeof SymptomSelector> = {
    title: 'Care/SymptomSelector',
    component: SymptomSelector,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
        onSymptomsSelected: { action: 'symptoms-selected' },
    },
};

export default meta;
type Story = StoryObj<typeof SymptomSelector>;

const commonSymptoms = [
    { id: '1', name: 'Febre' },
    { id: '2', name: 'Tosse' },
    { id: '3', name: 'Dor de cabeça' },
    { id: '4', name: 'Fadiga' },
    { id: '5', name: 'Dor no corpo' },
    { id: '6', name: 'Náusea' },
    { id: '7', name: 'Falta de ar' },
    { id: '8', name: 'Dor de garganta' },
];

const cardiacSymptoms = [
    { id: '1', name: 'Dor no peito' },
    { id: '2', name: 'Palpitações' },
    { id: '3', name: 'Falta de ar aos esforços' },
    { id: '4', name: 'Inchaço nos pés' },
    { id: '5', name: 'Tontura' },
    { id: '6', name: 'Desmaio' },
];

export const Default: Story = {
    args: {
        symptoms: commonSymptoms,
        journey: 'care',
        onSymptomsSelected: () => {},
    },
};

export const WithSelectedSymptoms: Story = {
    render: (args) => {
        return <SymptomSelector {...args} />;
    },
    args: {
        symptoms: commonSymptoms,
        journey: 'care',
        onSymptomsSelected: () => {},
    },
};

export const CardiacSymptoms: Story = {
    args: {
        symptoms: cardiacSymptoms,
        journey: 'care',
        onSymptomsSelected: () => {},
    },
};

export const HealthJourney: Story = {
    args: {
        symptoms: [
            { id: '1', name: 'Dor nas articulações' },
            { id: '2', name: 'Fraqueza muscular' },
            { id: '3', name: 'Perda de peso inesperada' },
            { id: '4', name: 'Sudorese excessiva' },
            { id: '5', name: 'Insônia' },
        ],
        journey: 'health',
        onSymptomsSelected: () => {},
    },
};

export const LargeList: Story = {
    args: {
        symptoms: [
            { id: '1', name: 'Febre alta' },
            { id: '2', name: 'Tosse seca' },
            { id: '3', name: 'Dor de cabeça intensa' },
            { id: '4', name: 'Fadiga extrema' },
            { id: '5', name: 'Dor muscular' },
            { id: '6', name: 'Náusea e vômito' },
            { id: '7', name: 'Dificuldade para respirar' },
            { id: '8', name: 'Dor de garganta' },
            { id: '9', name: 'Calafrios' },
            { id: '10', name: 'Perda de olfato' },
            { id: '11', name: 'Perda de paladar' },
            { id: '12', name: 'Congestão nasal' },
        ],
        journey: 'care',
        onSymptomsSelected: () => {},
    },
};
