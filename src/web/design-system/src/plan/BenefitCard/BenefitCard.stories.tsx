import type { Meta, StoryObj } from '@storybook/react';
import { BenefitCard } from './BenefitCard';

const meta: Meta<typeof BenefitCard> = {
    title: 'Plan/BenefitCard',
    component: BenefitCard,
    tags: ['autodocs'],
    argTypes: {
        onPress: { action: 'pressed' },
    },
};

export default meta;
type Story = StoryObj<typeof BenefitCard>;

export const Default: Story = {
    args: {
        benefit: {
            type: 'Consultas Médicas',
            description: 'Cobertura para consultas com médicos da rede credenciada em diversas especialidades.',
        },
    },
};

export const WithLimitations: Story = {
    args: {
        benefit: {
            type: 'Exames Laboratoriais',
            description: 'Realização de exames laboratoriais e análises clínicas na rede credenciada.',
            limitations:
                'Limite de 12 exames simples por ano. Exames de alta complexidade sujeitos a autorização prévia.',
        },
        onPress: () => {},
    },
};

export const WithUsage: Story = {
    args: {
        benefit: {
            type: 'Internação Hospitalar',
            description:
                'Cobertura para internações hospitalares em casos de emergência ou eletivas conforme indicação médica.',
            limitations: 'Carência de 180 dias para internações eletivas.',
            usage: '2 internações utilizadas de 4 disponíveis no período.',
        },
        onPress: () => {},
    },
};

export const MentalHealth: Story = {
    args: {
        benefit: {
            type: 'Saúde Mental',
            description: 'Acesso a consultas de psicologia e psiquiatria para cuidado da saúde mental.',
            limitations: 'Até 20 sessões de psicologia por ano.',
        },
        onPress: () => {},
    },
};

export const Preventive: Story = {
    args: {
        benefit: {
            type: 'Cuidados Preventivos',
            description: 'Exames preventivos anuais incluídos no plano sem custo adicional, incluindo check-up geral.',
        },
        onPress: () => {},
    },
};

export const Emergency: Story = {
    args: {
        benefit: {
            type: 'Atendimento de Emergência',
            description: 'Cobertura integral para atendimentos de urgência e emergência 24 horas, sem carência.',
        },
    },
};

export const Rehabilitation: Story = {
    args: {
        benefit: {
            type: 'Reabilitação',
            description: 'Sessões de fisioterapia e reabilitação após cirurgias ou lesões.',
            limitations: 'Até 30 sessões por procedimento, com solicitação médica.',
            usage: '8 sessões utilizadas de 30.',
        },
        onPress: () => {},
    },
};
