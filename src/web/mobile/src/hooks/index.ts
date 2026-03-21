/**
 * @file index.ts
 * @description Exports all custom hooks from the `src/web/mobile/src/hooks` directory,
 * providing a single point of import for all hooks.
 */

import { useAppointments } from './useAppointments';
import { useAuth } from './useAuth';
import { useClaims } from './useClaims';
import { useCoverage } from './useCoverage';
import { useDevices } from './useDevices';
import { useGamification } from './useGamification';
import { useHealthMetrics } from './useHealthMetrics';
import { useJourney } from './useJourney';
import { useNotifications } from './useNotifications';
import { useTelemedicineSession } from './useTelemedicine';

export {
    useAppointments,
    useAuth,
    useClaims,
    useCoverage,
    useDevices,
    useGamification,
    useHealthMetrics,
    useJourney,
    useNotifications,
    useTelemedicineSession,
};
