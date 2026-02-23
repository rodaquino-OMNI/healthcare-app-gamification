/**
 * Centralized mock data for the Health journey.
 * Extracted from screen-level MOCK_ constants for reuse and single source of truth.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  adherence: boolean;
  status: 'active' | 'completed' | 'paused';
  refillDate?: string;
  refillProgress?: number;
}

export interface DoseSlot {
  id: string;
  medicationName: string;
  dosage: string;
  time: string;
  status: 'taken' | 'missed' | 'pending';
}

export interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_glucose' | 'weight' | 'temperature' | 'oxygen';
  value: string;
  unit: string;
  recordedAt: string;
  trend: 'up' | 'down' | 'stable';
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    dosage: '500mg',
    schedule: 'Twice daily',
    frequency: 'twice_daily',
    startDate: '2025-12-01',
    adherence: true,
    status: 'active',
    refillDate: '2026-03-15',
    refillProgress: 0.6,
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    schedule: 'Once daily',
    frequency: 'once_daily',
    startDate: '2025-10-15',
    adherence: true,
    status: 'active',
    refillDate: '2026-03-01',
    refillProgress: 0.45,
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    schedule: 'Once daily at bedtime',
    frequency: 'once_daily',
    startDate: '2025-11-20',
    adherence: false,
    status: 'active',
    refillDate: '2026-02-28',
    refillProgress: 0.2,
  },
  {
    id: '4',
    name: 'Amoxicillin',
    dosage: '500mg',
    schedule: 'Three times daily',
    frequency: 'three_times_daily',
    startDate: '2026-01-10',
    endDate: '2026-01-20',
    adherence: true,
    status: 'completed',
  },
  {
    id: '5',
    name: 'Omeprazole',
    dosage: '20mg',
    schedule: 'Once daily before breakfast',
    frequency: 'once_daily',
    startDate: '2025-09-01',
    endDate: '2026-01-01',
    adherence: true,
    status: 'completed',
  },
  {
    id: '6',
    name: 'Sertraline',
    dosage: '50mg',
    schedule: 'Once daily',
    frequency: 'once_daily',
    startDate: '2026-01-15',
    adherence: true,
    status: 'paused',
    refillDate: '2026-04-01',
    refillProgress: 0.8,
  },
];

/**
 * Generates a 7-day dose schedule centered on the current week.
 * Each day contains 4 dose slots matching the medication regimen.
 */
export const generateMockSchedule = (): Record<string, DoseSlot[]> => {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const schedule: Record<string, DoseSlot[]> = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const fullDate = `${yyyy}-${mm}-${dd}`;

    schedule[fullDate] = [
      { id: `${fullDate}-1`, medicationName: 'Metformin', dosage: '500mg', time: '08:00 AM', status: i < 4 ? 'taken' : i === 4 ? 'missed' : 'pending' },
      { id: `${fullDate}-2`, medicationName: 'Lisinopril', dosage: '10mg', time: '08:00 AM', status: i < 5 ? 'taken' : 'pending' },
      { id: `${fullDate}-3`, medicationName: 'Metformin', dosage: '500mg', time: '02:00 PM', status: i < 3 ? 'taken' : 'pending' },
      { id: `${fullDate}-4`, medicationName: 'Atorvastatin', dosage: '20mg', time: '08:00 PM', status: i < 2 ? 'taken' : i === 2 ? 'missed' : 'pending' },
    ];
  }

  return schedule;
};

export const MOCK_SCHEDULE: Record<string, DoseSlot[]> = generateMockSchedule();

export const MOCK_HEALTH_METRICS: HealthMetric[] = [
  { id: 'hm-01', type: 'blood_pressure', value: '120/80', unit: 'mmHg', recordedAt: '2026-02-22T08:30:00', trend: 'stable' },
  { id: 'hm-02', type: 'heart_rate', value: '72', unit: 'bpm', recordedAt: '2026-02-22T08:30:00', trend: 'stable' },
  { id: 'hm-03', type: 'blood_glucose', value: '95', unit: 'mg/dL', recordedAt: '2026-02-22T07:00:00', trend: 'down' },
  { id: 'hm-04', type: 'weight', value: '74.5', unit: 'kg', recordedAt: '2026-02-21T07:15:00', trend: 'down' },
  { id: 'hm-05', type: 'temperature', value: '36.5', unit: '\u00B0C', recordedAt: '2026-02-22T08:00:00', trend: 'stable' },
  { id: 'hm-06', type: 'oxygen', value: '98', unit: '%', recordedAt: '2026-02-22T08:30:00', trend: 'stable' },
];
