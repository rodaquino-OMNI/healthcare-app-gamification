import type { Meta, StoryObj } from '@storybook/react';
import { InsuranceCard } from './InsuranceCard';

const meta: Meta<typeof InsuranceCard> = {
  title: 'Plan/InsuranceCard',
  component: InsuranceCard,
  tags: ['autodocs'],
  argTypes: {
    onShare: { action: 'share' },
  },
};

export default meta;
type Story = StoryObj<typeof InsuranceCard>;

const defaultPlan = {
  id: 'plan-001',
  name: 'Plano Essencial Plus',
  type: 'Individual',
  planNumber: '0123456789',
  validityStart: '2026-01-01',
  validityEnd: '2026-12-31',
};

const defaultUser = {
  id: 'u1',
  name: 'Maria Aparecida Silva',
  cpf: '123.456.789-00',
};

export const Default: Story = {
  args: {
    plan: defaultPlan,
    user: defaultUser,
    onShare: () => {},
  },
};

export const WithShare: Story = {
  args: {
    plan: defaultPlan,
    user: defaultUser,
    onShare: () => alert('Compartilhando cartão digital...'),
  },
};

export const FamilyPlan: Story = {
  args: {
    plan: {
      id: 'plan-002',
      name: 'Plano Família Completo',
      type: 'Familiar',
      planNumber: '9876543210',
      validityStart: '2026-01-01',
      validityEnd: '2026-12-31',
    },
    user: {
      id: 'u2',
      name: 'João Carlos Pereira',
      cpf: '987.654.321-00',
    },
    onShare: () => {},
  },
};

export const PremiumPlan: Story = {
  args: {
    plan: {
      id: 'plan-003',
      name: 'Plano Premium Empresarial',
      type: 'Empresarial',
      planNumber: '5544332211',
      validityStart: '2026-03-01',
      validityEnd: '2027-02-28',
    },
    user: {
      id: 'u3',
      name: 'Ana Beatriz Rodrigues',
      cpf: '456.789.123-00',
    },
    onShare: () => {},
  },
};

export const ShortName: Story = {
  args: {
    plan: {
      id: 'plan-004',
      name: 'Plano Básico',
      type: 'Individual',
      planNumber: '1122334455',
      validityStart: '2026-06-01',
      validityEnd: '2027-05-31',
    },
    user: {
      id: 'u4',
      name: 'Li Wei',
      cpf: '321.654.987-00',
    },
    onShare: () => {},
  },
};
