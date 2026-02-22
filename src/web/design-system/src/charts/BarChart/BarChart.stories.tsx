import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: {
    journey: {
      control: 'select',
      options: ['health', 'care', 'plan'],
    },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    data: [42, 65, 31, 78, 55, 90, 48],
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    colors: ['#0ACF83'],
    journey: 'health',
    title: 'Atividade Semanal',
  },
};

export const HealthJourney: Story = {
  args: {
    data: [72, 75, 68, 80, 74, 71, 76],
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    colors: ['#0ACF83'],
    journey: 'health',
    title: 'Frequência Cardíaca Média (bpm)',
  },
};

export const CareJourney: Story = {
  args: {
    data: [2, 1, 3, 1, 2, 0, 1],
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    colors: ['#FF8C00'],
    journey: 'care',
    title: 'Medicamentos Tomados',
  },
};

export const PlanJourney: Story = {
  args: {
    data: [1200, 850, 2100, 600, 950],
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    colors: ['#1A7AC6'],
    journey: 'plan',
    title: 'Reembolsos por Mês (R$)',
  },
};

export const LongLabels: Story = {
  args: {
    data: [45, 62, 38, 71, 55],
    labels: ['Cardiologia', 'Ortopedia', 'Neurologia', 'Pediatria', 'Dermatologia'],
    colors: ['#FF8C00'],
    journey: 'care',
    title: 'Consultas por Especialidade',
  },
};
