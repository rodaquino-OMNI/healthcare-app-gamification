/* eslint-disable no-duplicate-imports -- duplicate imports are intentional in separate declare module blocks */
// Type declarations for modules without their own type definitions

// ---------------------------------------------------------------------------
// @shared/* modules that don't have physical files yet
// ---------------------------------------------------------------------------

// @shared/constants/journeys
declare module '@shared/constants/journeys' {
    export const JOURNEY_IDS: {
        HEALTH: string;
        CARE: string;
        PLAN: string;
    };

    export const JOURNEY_NAMES: {
        HEALTH: string;
        CARE: string;
        PLAN: string;
    };

    export const JOURNEY_COLORS: Record<string, string>;
}

// @shared/constants/api
declare module '@shared/constants/api' {
    export const API_BASE_URL: string;
    export const API_TIMEOUT: number;
    export const API_ENDPOINTS: Record<string, string>;
}

// @shared/constants/index
declare module '@shared/constants/index' {
    export const JOURNEY_NAMES: {
        HEALTH: string;
        CARE: string;
        PLAN: string;
    };
    export const JOURNEY_IDS: {
        HEALTH: string;
        CARE: string;
        PLAN: string;
    };
}

// @shared/types
declare module '@shared/types' {
    export type JourneyId = string;
    export type { AuthSession, AuthState } from '@shared/types/auth.types';
    export type { HealthMetric, MedicalEvent, HealthGoal, DeviceConnection } from '@shared/types/health.types';
    export type { Appointment, Medication, TelemedicineSession, TreatmentPlan } from '@shared/types/care.types';
    export type {
        Claim,
        Plan,
        Coverage,
        Benefit,
        ClaimStatus,
        ClaimType,
        PlanType,
        CoverageType,
    } from '@shared/types/plan.types';
    export type { Achievement, Quest, Reward, GameProfile } from '@shared/types/gamification.types';
    export type {
        Notification,
        NotificationPreference,
        NotificationFilter,
        FilterOption,
    } from '@shared/types/notification.types';
}

// @shared/types/index
declare module '@shared/types/index' {
    export type JourneyId = string;
    export type FilterOption = {
        id: string;
        name: string;
        type: string;
        label: string;
        value: string;
        icon?: string;
    };
}

// @shared/types/auth.types
declare module '@shared/types/auth.types' {
    export interface AuthSession {
        accessToken: string;
        refreshToken: string;
        userId: string;
        expiresAt: number;
    }
    export interface AuthState {
        session: AuthSession | null;
        status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
    }
}

// @shared/types/health.types
declare module '@shared/types/health.types' {
    export interface HealthMetric {
        id: string;
        type: string;
        value: number;
        unit: string;
        timestamp: string;
        [key: string]: any;
    }
    export interface MedicalEvent {
        id: string;
        type: string;
        date: string;
        description: string;
        [key: string]: any;
    }
    export interface HealthGoal {
        id: string;
        type: string;
        target: number;
        current: number;
        [key: string]: any;
    }
    export interface DeviceConnection {
        id: string;
        deviceType: string;
        connected: boolean;
        [key: string]: any;
    }
    export enum HealthMetricType {
        HEART_RATE = 'HEART_RATE',
        BLOOD_PRESSURE = 'BLOOD_PRESSURE',
        WEIGHT = 'WEIGHT',
        TEMPERATURE = 'TEMPERATURE',
        BLOOD_GLUCOSE = 'BLOOD_GLUCOSE',
        OXYGEN_SATURATION = 'OXYGEN_SATURATION',
        STEPS = 'STEPS',
    }
}

// @shared/types/care.types
declare module '@shared/types/care.types' {
    export interface Appointment {
        id: string;
        providerId: string;
        patientId: string;
        dateTime: string;
        type: string;
        status: string;
        reason?: string;
        notes?: string;
        [key: string]: any;
    }
    export interface Medication {
        id: string;
        name: string;
        dosage: string;
        frequency: string;
        [key: string]: any;
    }
    export interface TelemedicineSession {
        id: string;
        appointmentId: string;
        status: string;
        startTime?: string;
        endTime?: string;
        [key: string]: any;
    }
    export interface TreatmentPlan {
        id: string;
        patientId: string;
        providerId: string;
        description: string;
        [key: string]: any;
    }
    export interface Provider {
        id: string;
        name: string;
        specialty: string;
        [key: string]: any;
    }
}

// @shared/types/plan.types
declare module '@shared/types/plan.types' {
    export type ClaimStatus = 'pending' | 'approved' | 'denied' | 'additional_info_required';
    export type ClaimType = string;
    export type PlanType = string;
    export type CoverageType = string;
    export interface Claim {
        id: string;
        type: ClaimType;
        status: ClaimStatus;
        amount: number;
        planId: string;
        submittedAt: string;
        documents: any[];
        [key: string]: any;
    }
    export interface Plan {
        id: string;
        name: string;
        type: PlanType;
        [key: string]: any;
    }
    export interface Coverage {
        id: string;
        type: CoverageType;
        [key: string]: any;
    }
    export interface Benefit {
        id: string;
        planId: string;
        type: string;
        description: string;
        limitations?: string;
        usage?: string;
        [key: string]: any;
    }
}

// @shared/types/gamification.types
declare module '@shared/types/gamification.types' {
    export interface Achievement {
        id: string;
        title: string;
        description: string;
        journey: string;
        icon: string;
        progress: number;
        total: number;
        unlocked: boolean;
    }
    export interface Quest {
        id: string;
        title: string;
        description: string;
        journey: string;
        icon: string;
        progress: number;
        total: number;
        completed: boolean;
    }
    export interface Reward {
        id: string;
        title: string;
        description: string;
        journey: string;
        icon: string;
        xp: number;
    }
    export interface GameProfile {
        level: number;
        xp: number;
        achievements: Achievement[];
        quests: Quest[];
        userId?: string;
        points?: number;
        badges?: string[];
        streak?: number;
        [key: string]: any;
    }
}

// @shared/types/notification.types
declare module '@shared/types/notification.types' {
    export enum NotificationType {
        APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
        MEDICATION_REMINDER = 'MEDICATION_REMINDER',
        HEALTH_ALERT = 'HEALTH_ALERT',
        CLAIM_UPDATE = 'CLAIM_UPDATE',
        CLAIM_STATUS_UPDATE = 'CLAIM_STATUS_UPDATE',
        ACHIEVEMENT = 'ACHIEVEMENT',
        ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
        LEVEL_UP = 'LEVEL_UP',
        GENERAL = 'GENERAL',
    }
    export enum NotificationChannel {
        PUSH = 'PUSH',
        EMAIL = 'EMAIL',
        SMS = 'SMS',
        IN_APP = 'IN_APP',
    }
    export enum NotificationStatus {
        UNREAD = 'UNREAD',
        READ = 'READ',
        ARCHIVED = 'ARCHIVED',
    }
    export enum NotificationPriority {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
        URGENT = 'URGENT',
    }
    export interface Notification {
        id: string;
        type: NotificationType;
        title: string;
        body: string;
        status: NotificationStatus;
        priority: NotificationPriority;
        createdAt: string;
        readAt?: Date | string;
        journey?: string;
        deepLink?: string;
        userId?: string;
        read?: boolean;
        [key: string]: any;
    }
    export interface NotificationPreference {
        channel: NotificationChannel;
        enabled: boolean;
        [key: string]: any;
    }
    export interface JourneyNotificationPreference {
        journey: string;
        preferences: NotificationPreference[];
    }
    export interface SendNotificationRequest {
        userId: string;
        type: NotificationType;
        title: string;
        body: string;
        [key: string]: any;
    }
    export interface NotificationTemplate {
        id: string;
        type: NotificationType;
        titleTemplate: string;
        bodyTemplate: string;
    }
    export interface NotificationFilter {
        type?: NotificationType;
        status?: NotificationStatus;
        priority?: NotificationPriority;
    }
    export interface NotificationCount {
        total: number;
        unread: number;
    }
    export interface AchievementNotificationData {
        achievementId: string;
        title: string;
        [key: string]: any;
    }
    export interface LevelUpNotificationData {
        newLevel: number;
        [key: string]: any;
    }
    export interface AppointmentReminderData {
        appointmentId: string;
        dateTime: string;
        [key: string]: any;
    }
    export interface ClaimStatusUpdateData {
        claimId: string;
        newStatus: string;
        [key: string]: any;
    }
    export type FilterOption = {
        id: string;
        name: string;
        type: string;
        label: string;
        value: string;
        icon?: string;
    };
}

// @shared/utils/validation
declare module '@shared/utils/validation' {
    export function claimValidationSchema(): any;
    export function userValidationSchema(): any;
    export function isValidCPF(cpf: string): boolean;
    export function isNotEmpty(value: string): boolean;
    export function isValidDate(date: string | Date): boolean;
    export function useClaimValidationSchema(): any;
    export function useUserValidationSchema(): any;
}

// @shared/utils/format
declare module '@shared/utils/format' {
    export function formatNumber(value: number, locale?: string): string;
    export function formatCurrency(value: number, currency?: string, locale?: string): string;
    export function formatPercent(value: number, locale?: string): string;
    export function formatJourneyValue(value: number, journey: string): string;
    export function formatHealthMetric(value: number, unit: string): string;
    export function truncateText(text: string, maxLength: number): string;
    export function formatPhoneNumber(phone: string): string;
    export function formatCPF(cpf: string): string;
    export function formatDate(date: string | Date, format?: string): string;
}

// @shared/config/i18nConfig
declare module '@shared/config/i18nConfig' {
    export const supportedLocales: string[];
    export const defaultLocale: string;
}

// @shared/graphql/*
declare module '@shared/graphql/queries/health.queries' {
    import { DocumentNode } from 'graphql';
    export const GET_HEALTH_METRICS: DocumentNode;
}

declare module '@shared/graphql/mutations/health.mutations' {
    import { DocumentNode } from 'graphql';
    export const CREATE_HEALTH_METRIC: DocumentNode;
}

declare module '@shared/graphql/queries/plan.queries' {
    import { DocumentNode } from 'graphql';
    export const GET_PLAN: DocumentNode;
    export const GET_CLAIMS: DocumentNode;
}

declare module '@shared/graphql/mutations/plan.mutations' {
    import { DocumentNode } from 'graphql';
    export const SUBMIT_CLAIM: DocumentNode;
    export const UPLOAD_CLAIM_DOCUMENT: DocumentNode;
    export const UPDATE_CLAIM: DocumentNode;
    export const CANCEL_CLAIM: DocumentNode;
}

// ---------------------------------------------------------------------------
// Missing component/path modules
// ---------------------------------------------------------------------------

// @design-system/primitives/Box (does not exist, alias to View)
declare module '@design-system/primitives/Box' {
    import { ViewProps } from 'react-native';
    export const Box: React.FC<ViewProps & { [key: string]: any }>;
    export default Box;
}

// @design-system/components (barrel for direct imports)
declare module '@design-system/components' {
    export { Button } from '@austa/design-system';
    export { Card } from '@austa/design-system';
    export { Input } from '@austa/design-system';
    export { Text } from '@austa/design-system';
    export { Icon } from '@austa/design-system';
    export { Stack } from '@austa/design-system';
    export { Select } from '@austa/design-system';
    export { Modal } from '@austa/design-system';
    export { ProgressBar } from '@austa/design-system';
    export { ProgressCircle } from '@austa/design-system';
    export { Avatar } from '@austa/design-system';
    export { Checkbox } from '@austa/design-system';
    export { Tabs } from '@austa/design-system';
    export const Badge: React.FC<any>;
}

// Note: @api/index and @components/forms are resolved via tsconfig paths
// to their physical barrel files. Do NOT add ambient declarations here
// as they would shadow the real file exports.

// @components/lists/AppointmentList
declare module '@components/lists/AppointmentList' {
    const AppointmentList: React.FC<any>;
    export default AppointmentList;
}

// @react-native-picker/picker
declare module '@react-native-picker/picker' {
    import React from 'react';
    export interface PickerItemProps {
        label: string;
        value: any;
        color?: string;
        testID?: string;
    }
    export interface PickerProps {
        selectedValue?: any;
        onValueChange?: (value: any, index: number) => void;
        enabled?: boolean;
        style?: any;
        testID?: string;
        children?: React.ReactNode;
    }
    export class Picker extends React.Component<PickerProps> {
        static Item: React.ComponentType<PickerItemProps>;
    }
}

// @react-native-community/datetimepicker
declare module '@react-native-community/datetimepicker' {
    import React from 'react';
    export interface DateTimePickerProps {
        value: Date;
        mode?: 'date' | 'time' | 'datetime';
        display?: string;
        onChange?: (event: any, date?: Date) => void;
        minimumDate?: Date;
        maximumDate?: Date;
        testID?: string;
        [key: string]: any;
    }
    const DateTimePicker: React.FC<DateTimePickerProps>;
    export default DateTimePicker;
}

// hooks/useTheme (used by ErrorState)
declare module '../../hooks/useTheme' {
    export function useTheme(): {
        theme: {
            colors: {
                journey: Record<string, string>;
                brand: { primary: string };
                background: { default: string };
                text: { primary: string; secondary: string };
                [key: string]: any;
            };
            [key: string]: any;
        };
        toggleTheme: () => void;
    };
}
