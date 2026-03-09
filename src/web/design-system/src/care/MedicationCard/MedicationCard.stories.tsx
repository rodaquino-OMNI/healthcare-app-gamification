import type { Meta, StoryObj } from '@storybook/react';

import { MedicationCard } from './MedicationCard';

const meta: Meta<typeof MedicationCard> = {
    title: 'Care/MedicationCard',
    component: MedicationCard,
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        dosage: { control: 'text' },
        schedule: { control: 'text' },
        adherence: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof MedicationCard>;

export const Default: Story = {
    args: {
        name: 'Losartana',
        dosage: '50mg',
        schedule: '1 comprimido pela manhã',
        adherence: true,
    },
};

export const Adherent: Story = {
    args: {
        name: 'Atorvastatina',
        dosage: '40mg',
        schedule: '1 comprimido à noite',
        adherence: true,
    },
};

export const NonAdherent: Story = {
    args: {
        name: 'Metformina',
        dosage: '500mg',
        schedule: '1 comprimido com o almoço e jantar',
        adherence: false,
    },
};

export const MultiDose: Story = {
    args: {
        name: 'Amoxicilina',
        dosage: '500mg',
        schedule: '1 cápsula de 8 em 8 horas por 7 dias',
        adherence: true,
    },
};

export const ComplexSchedule: Story = {
    args: {
        name: 'Aspirina',
        dosage: '100mg',
        schedule: '1 comprimido após o café da manhã',
        adherence: false,
    },
};

export const Insulin: Story = {
    args: {
        name: 'Insulina Glargina',
        dosage: '20 unidades',
        schedule: '1 aplicação subcutânea ao deitar',
        adherence: true,
    },
};
