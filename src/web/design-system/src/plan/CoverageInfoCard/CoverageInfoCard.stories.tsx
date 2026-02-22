import type { Meta, StoryObj } from '@storybook/react';
import { CoverageInfoCard } from './CoverageInfoCard';

const meta: Meta<typeof CoverageInfoCard> = {
  title: 'Plan/CoverageInfoCard',
  component: CoverageInfoCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CoverageInfoCard>;

export const Default: Story = {
  args: {
    coverage: {
      type: 'medical_visit',
      details: 'Cobertura para consultas médicas com profissionais da rede credenciada em todas as especialidades disponíveis.',
    },
  },
};

export const WithLimitations: Story = {
  args: {
    coverage: {
      type: 'specialist_visit',
      details: 'Consultas com especialistas médicos em cardiologia, ortopedia, neurologia, dermatologia e demais especialidades.',
      limitations: 'Máximo de 24 consultas por especialidade ao ano. Necessita referência do médico de família para algumas especialidades.',
    },
  },
};

export const WithCoPayment: Story = {
  args: {
    coverage: {
      type: 'emergency_care',
      details: 'Atendimento de urgência e emergência 24 horas em hospitais credenciados, sem necessidade de autorização prévia.',
      coPayment: 30.0,
    },
  },
};

export const FullDetails: Story = {
  args: {
    coverage: {
      type: 'prescription_drugs',
      details: 'Cobertura parcial para medicamentos com prescrição médica em farmácias credenciadas.',
      limitations: 'Cobertura de até 80% para medicamentos genéricos e 60% para marcas. Medicamentos de alto custo sujeitos a análise.',
      coPayment: 15.0,
    },
  },
};

export const MentalHealth: Story = {
  args: {
    coverage: {
      type: 'mental_health',
      details: 'Acesso a sessões de psicoterapia, consultas psiquiátricas e programas de apoio à saúde mental.',
      limitations: 'Até 20 sessões de psicoterapia por ano. Psiquiatria conforme indicação clínica.',
    },
  },
};

export const LabTests: Story = {
  args: {
    coverage: {
      type: 'lab_tests',
      details: 'Realização de exames laboratoriais e análises clínicas na rede credenciada sem custo adicional.',
      limitations: 'Exames de alta complexidade (PCR, citogenética) requerem autorização prévia com prazo de 5 dias úteis.',
      coPayment: 0,
    },
  },
};

export const Imaging: Story = {
  args: {
    coverage: {
      type: 'imaging',
      details: 'Cobertura para exames de imagem incluindo raio-X, ultrassonografia, tomografia e ressonância magnética.',
      limitations: 'Ressonância e PET-scan requerem autorização prévia. Limite de 2 exames de imagem complexos por semestre.',
      coPayment: 50.0,
    },
  },
};
