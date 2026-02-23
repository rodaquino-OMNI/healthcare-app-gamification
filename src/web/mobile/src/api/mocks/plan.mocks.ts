/**
 * Centralized mock data for the Plan journey.
 * Extracted from screen-level MOCK_ constants for reuse and single source of truth.
 */

import type {
  Claim,
  Coverage,
  Benefit,
} from '@shared/types/plan.types';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_CLAIMS: Claim[] = [
  {
    id: '1',
    planId: 'plan-001',
    type: 'medical',
    amount: 250.0,
    status: 'approved',
    submittedAt: '2025-12-15',
    documents: [],
  },
  {
    id: '2',
    planId: 'plan-001',
    type: 'dental',
    amount: 180.0,
    status: 'pending',
    submittedAt: '2026-01-10',
    documents: [],
  },
  {
    id: '3',
    planId: 'plan-001',
    type: 'vision',
    amount: 420.0,
    status: 'denied',
    submittedAt: '2026-01-22',
    documents: [],
  },
  {
    id: '4',
    planId: 'plan-001',
    type: 'prescription',
    amount: 95.5,
    status: 'approved',
    submittedAt: '2026-02-01',
    documents: [],
  },
  {
    id: '5',
    planId: 'plan-001',
    type: 'medical',
    amount: 1200.0,
    status: 'pending',
    submittedAt: '2026-02-10',
    documents: [],
  },
];

export const MOCK_COVERAGE: Coverage[] = [
  { id: 'cov-01', planId: 'plan-001', type: 'medical_visit', details: 'Consultas medicas ilimitadas na rede credenciada', coPayment: 35.0 },
  { id: 'cov-02', planId: 'plan-001', type: 'specialist_visit', details: 'Consultas com especialistas com encaminhamento', coPayment: 50.0 },
  { id: 'cov-03', planId: 'plan-001', type: 'emergency_care', details: 'Pronto-socorro 24h sem carencia', coPayment: 80.0 },
  { id: 'cov-04', planId: 'plan-001', type: 'preventive_care', details: 'Exames preventivos anuais conforme ANS', coPayment: 0 },
  { id: 'cov-05', planId: 'plan-001', type: 'prescription_drugs', details: 'Medicamentos com desconto na rede conveniada', limitations: 'Ate R$ 500/mes', coPayment: 15.0 },
  { id: 'cov-06', planId: 'plan-001', type: 'mental_health', details: 'Sessoes de terapia e psiquiatria', limitations: '24 sessoes/ano', coPayment: 40.0 },
  { id: 'cov-07', planId: 'plan-001', type: 'lab_tests', details: 'Exames laboratoriais na rede credenciada', coPayment: 10.0 },
  { id: 'cov-08', planId: 'plan-001', type: 'imaging', details: 'Exames de imagem (raio-x, ultrassom, ressonancia)', coPayment: 25.0 },
];

export const MOCK_BENEFITS: Benefit[] = [
  { id: 'ben-01', planId: 'plan-001', type: 'telehealth', description: 'Teleconsultas 24/7 com clinico geral sem custo adicional' },
  { id: 'ben-02', planId: 'plan-001', type: 'wellness', description: 'Programa de bem-estar com descontos em academias parceiras', usage: '3 de 12 meses utilizados' },
  { id: 'ben-03', planId: 'plan-001', type: 'dental', description: 'Cobertura odontologica basica incluindo limpeza semestral', limitations: '2 limpezas/ano' },
  { id: 'ben-04', planId: 'plan-001', type: 'pharmacy', description: 'Desconto de 20% em farmacias conveniadas', usage: 'Utilizado 4 vezes este mes' },
  { id: 'ben-05', planId: 'plan-001', type: 'maternity', description: 'Cobertura completa para pre-natal, parto e pos-parto', limitations: 'Carencia de 300 dias' },
  { id: 'ben-06', planId: 'plan-001', type: 'checkup', description: 'Check-up anual completo sem custo adicional', usage: 'Proximo disponivel em Junho 2026' },
];
