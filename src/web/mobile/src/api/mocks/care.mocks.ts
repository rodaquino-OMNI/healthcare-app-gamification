/**
 * Centralized mock data for the Care journey.
 * Extracted from screen-level MOCK_ constants for reuse and single source of truth.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: 'in-person' | 'telemedicine';
}

export interface DoctorReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DoctorDetail {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  totalConsultations: string;
  yearsExperience: number;
  bio: string;
  specializations: string[];
  education: string[];
  certifications: string[];
  acceptedInsurance: string[];
  reviews: DoctorReview[];
}

export interface DoctorSummary {
  name: string;
  specialty: string;
}

export interface Specialty {
  id: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_UPCOMING_APPOINTMENTS: Appointment[] = [
  { id: 'apt-1', doctorName: 'Dra. Ana Carolina Silva', specialty: 'Cardiologia', date: '2026-03-05', time: '09:00', status: 'confirmed', type: 'in-person' },
  { id: 'apt-2', doctorName: 'Dr. Ricardo Mendes', specialty: 'Dermatologia', date: '2026-03-08', time: '14:00', status: 'pending', type: 'telemedicine' },
  { id: 'apt-3', doctorName: 'Dra. Juliana Costa', specialty: 'Pediatria', date: '2026-03-10', time: '10:30', status: 'confirmed', type: 'in-person' },
  { id: 'apt-4', doctorName: 'Dr. Fernando Alves', specialty: 'Ortopedia', date: '2026-03-12', time: '11:00', status: 'pending', type: 'telemedicine' },
  { id: 'apt-5', doctorName: 'Dra. Mariana Rocha', specialty: 'Neurologia', date: '2026-03-15', time: '15:00', status: 'confirmed', type: 'in-person' },
];

export const MOCK_PAST_APPOINTMENTS: Appointment[] = [
  { id: 'apt-6', doctorName: 'Dr. Carlos Lima', specialty: 'Clinica Geral', date: '2026-02-10', time: '08:00', status: 'confirmed', type: 'in-person' },
  { id: 'apt-7', doctorName: 'Dra. Beatriz Santos', specialty: 'Ginecologia', date: '2026-02-05', time: '16:00', status: 'confirmed', type: 'telemedicine' },
  { id: 'apt-8', doctorName: 'Dr. Paulo Ferreira', specialty: 'Oftalmologia', date: '2026-01-20', time: '09:30', status: 'confirmed', type: 'in-person' },
];

export const MOCK_CANCELLED_APPOINTMENTS: Appointment[] = [
  { id: 'apt-9', doctorName: 'Dra. Lucia Ribeiro', specialty: 'Endocrinologia', date: '2026-02-15', time: '14:30', status: 'cancelled', type: 'in-person' },
  { id: 'apt-10', doctorName: 'Dr. Marcos Oliveira', specialty: 'Urologia', date: '2026-02-12', time: '10:00', status: 'cancelled', type: 'telemedicine' },
];

export const MOCK_DOCTORS: Record<string, DoctorSummary> = {
  'doc-001': { name: 'Dra. Ana Carolina Silva', specialty: 'Cardiologia' },
  'doc-002': { name: 'Dr. Pedro Santos', specialty: 'Clinica Geral' },
  'doc-003': { name: 'Dra. Ana Oliveira', specialty: 'Dermatologia' },
  'doc-004': { name: 'Dr. Ricardo Mendes', specialty: 'Ortopedia' },
  'doc-005': { name: 'Dra. Juliana Costa', specialty: 'Pediatria' },
};

export const MOCK_DOCTOR_DETAIL: DoctorDetail = {
  id: 'doc-001',
  name: 'Dra. Ana Carolina Silva',
  specialty: 'Cardiologia',
  rating: 4.9,
  totalConsultations: '2.3k',
  yearsExperience: 15,
  bio: 'Cardiologista com mais de 15 anos de experiencia, especializada em cardiologia preventiva e reabilitacao cardiaca. Membro da Sociedade Brasileira de Cardiologia (SBC) e pesquisadora ativa em novas terapias para insuficiencia cardiaca.',
  specializations: [
    'Cardiologia Preventiva',
    'Reabilitacao Cardiaca',
    'Ecocardiografia',
    'Arritmias',
  ],
  education: [
    'Medicina - Universidade de Sao Paulo (USP)',
    'Residencia em Cardiologia - InCor/HCFMUSP',
    'Mestrado em Ciencias Medicas - USP',
  ],
  certifications: [
    'Titulo de Especialista em Cardiologia - SBC',
    'Certificacao em Ecocardiografia - DIC/SBC',
    'BLS/ACLS - American Heart Association',
  ],
  acceptedInsurance: [
    'Unimed',
    'Bradesco Saude',
    'SulAmerica',
    'Amil',
    'Notre Dame Intermedica',
  ],
  reviews: [
    { id: 'rev-001', reviewerName: 'Maria L.', rating: 5, comment: 'Excelente profissional, muito atenciosa e explicou tudo com clareza. Recomendo muito!', date: '15/01/2026' },
    { id: 'rev-002', reviewerName: 'Joao P.', rating: 5, comment: 'Medica muito competente. Me senti acolhido durante toda a consulta.', date: '08/01/2026' },
    { id: 'rev-003', reviewerName: 'Carla S.', rating: 4, comment: 'Otima consulta, mas a espera foi um pouco longa. Fora isso, tudo perfeito.', date: '22/12/2025' },
  ],
};

export const MOCK_SPECIALTIES: Specialty[] = [
  { id: 'sp-01', label: 'Cardiologia' },
  { id: 'sp-02', label: 'Dermatologia' },
  { id: 'sp-03', label: 'Clinica Geral' },
  { id: 'sp-04', label: 'Ginecologia' },
  { id: 'sp-05', label: 'Ortopedia' },
  { id: 'sp-06', label: 'Pediatria' },
  { id: 'sp-07', label: 'Neurologia' },
  { id: 'sp-08', label: 'Oftalmologia' },
  { id: 'sp-09', label: 'Endocrinologia' },
  { id: 'sp-10', label: 'Urologia' },
];
