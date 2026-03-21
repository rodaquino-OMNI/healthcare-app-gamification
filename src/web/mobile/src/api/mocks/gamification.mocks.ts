/**
 * Centralized mock data for the Gamification system.
 * Extracted from screen-level MOCK_ constants for reuse and single source of truth.
 */

import type { Reward, Quest } from '@shared/types/gamification.types';

// ---------------------------------------------------------------------------
// Extended types
// ---------------------------------------------------------------------------

export interface CategorizedQuest extends Quest {
    category: 'daily' | 'weekly' | 'special';
}

export interface LeaderboardEntry {
    id: string;
    name: string;
    level: number;
    xp: number;
    rank: number;
    journey: 'health' | 'care' | 'plan';
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_REWARDS: Reward[] = [
    {
        id: 'r-001',
        title: 'Priority Scheduling',
        description: 'Priority access for your next appointment',
        journey: 'care',
        icon: '\u{1F4C5}',
        xp: 500,
    },
    {
        id: 'r-002',
        title: 'Health Report',
        description: 'Detailed monthly health insights report',
        journey: 'health',
        icon: '\u{1F4CA}',
        xp: 300,
    },
    {
        id: 'r-003',
        title: 'Plan Upgrade',
        description: 'One month premium plan features',
        journey: 'plan',
        icon: '\u{1F31F}',
        xp: 1000,
    },
    {
        id: 'r-004',
        title: 'Wellness Kit',
        description: 'Digital wellness resource pack',
        journey: 'health',
        icon: '\u{1F381}',
        xp: 750,
    },
    {
        id: 'r-005',
        title: 'Telehealth Credit',
        description: 'Credit for your next telemedicine visit',
        journey: 'care',
        icon: '\u{1F4F1}',
        xp: 600,
    },
    {
        id: 'r-006',
        title: 'Copay Discount',
        description: 'Discount on your next copayment',
        journey: 'plan',
        icon: '\u{1F4B0}',
        xp: 800,
    },
    {
        id: 'r-007',
        title: 'Fitness Badge',
        description: 'Exclusive digital badge for your profile',
        journey: 'health',
        icon: '\u{1F3C5}',
        xp: 150,
    },
    {
        id: 'r-008',
        title: 'Care Package',
        description: 'Personalized care recommendations',
        journey: 'care',
        icon: '\u{1F49D}',
        xp: 400,
    },
    {
        id: 'r-009',
        title: 'Custom Avatar',
        description: 'Special avatar frame for your profile',
        journey: 'health',
        icon: '\u{1F464}',
        xp: 200,
    },
    {
        id: 'r-010',
        title: 'Benefits Guide',
        description: 'Plan benefits optimization guide',
        journey: 'plan',
        icon: '\u{1F4D6}',
        xp: 350,
    },
];

export const MOCK_QUESTS: CategorizedQuest[] = [
    {
        id: 'q-001',
        title: 'Morning Health Check',
        description: 'Log your vitals before 9 AM today',
        journey: 'health',
        icon: '\u{1F3AF}',
        progress: 1,
        total: 1,
        completed: false,
        category: 'daily',
    },
    {
        id: 'q-002',
        title: 'Hydration Hero',
        description: 'Drink 8 glasses of water today',
        journey: 'health',
        icon: '\u{1F4A7}',
        progress: 5,
        total: 8,
        completed: false,
        category: 'daily',
    },
    {
        id: 'q-003',
        title: 'Medication Adherence',
        description: 'Take all prescribed medications on time',
        journey: 'care',
        icon: '\u{1F48A}',
        progress: 2,
        total: 3,
        completed: false,
        category: 'daily',
    },
    {
        id: 'q-004',
        title: 'Step Master',
        description: 'Walk 50,000 steps this week',
        journey: 'health',
        icon: '\u{1F6B6}',
        progress: 32000,
        total: 50000,
        completed: false,
        category: 'weekly',
    },
    {
        id: 'q-005',
        title: 'Wellness Explorer',
        description: 'Read 5 health articles this week',
        journey: 'health',
        icon: '\u{1F4DA}',
        progress: 3,
        total: 5,
        completed: false,
        category: 'weekly',
    },
    {
        id: 'q-006',
        title: 'Plan Review',
        description: 'Review your insurance coverage details this week',
        journey: 'plan',
        icon: '\u{1F4CB}',
        progress: 0,
        total: 1,
        completed: false,
        category: 'weekly',
    },
    {
        id: 'q-007',
        title: 'Care Champion',
        description: 'Schedule and attend 3 appointments this month',
        journey: 'care',
        icon: '\u{1F3C6}',
        progress: 1,
        total: 3,
        completed: false,
        category: 'special',
    },
    {
        id: 'q-008',
        title: 'Health Data Pioneer',
        description: 'Connect 2 health devices to the app',
        journey: 'health',
        icon: '\u{1F4F1}',
        progress: 2,
        total: 2,
        completed: true,
        category: 'special',
    },
    {
        id: 'q-009',
        title: 'Benefits Maximizer',
        description: 'Use 3 different plan benefits this month',
        journey: 'plan',
        icon: '\u{2B50}',
        progress: 3,
        total: 3,
        completed: true,
        category: 'special',
    },
    {
        id: 'q-010',
        title: 'Daily Mood Log',
        description: 'Record your mood every day this week',
        journey: 'health',
        icon: '\u{1F60A}',
        progress: 0,
        total: 7,
        completed: false,
        category: 'weekly',
    },
    {
        id: 'q-011',
        title: 'First Appointment',
        description: 'Book your first telemedicine appointment',
        journey: 'care',
        icon: '\u{1F4F9}',
        progress: 0,
        total: 1,
        completed: false,
        category: 'special',
    },
    {
        id: 'q-012',
        title: 'Sleep Tracker',
        description: 'Log your sleep for 7 consecutive nights',
        journey: 'health',
        icon: '\u{1F634}',
        progress: 7,
        total: 7,
        completed: true,
        category: 'weekly',
    },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { id: 'lb-01', name: 'Ana P.', level: 12, xp: 8450, rank: 1, journey: 'health' },
    { id: 'lb-02', name: 'Carlos M.', level: 11, xp: 7800, rank: 2, journey: 'care' },
    { id: 'lb-03', name: 'Beatriz S.', level: 10, xp: 7200, rank: 3, journey: 'health' },
    { id: 'lb-04', name: 'Diego R.', level: 9, xp: 6100, rank: 4, journey: 'plan' },
    { id: 'lb-05', name: 'Fernanda L.', level: 8, xp: 5500, rank: 5, journey: 'health' },
    { id: 'lb-06', name: 'Gustavo O.', level: 7, xp: 4900, rank: 6, journey: 'care' },
    { id: 'lb-07', name: 'Helena C.', level: 7, xp: 4750, rank: 7, journey: 'plan' },
    { id: 'lb-08', name: 'Igor N.', level: 6, xp: 3800, rank: 8, journey: 'health' },
    { id: 'lb-09', name: 'Julia F.', level: 5, xp: 3200, rank: 9, journey: 'care' },
    { id: 'lb-10', name: 'Rodrigo S.', level: 5, xp: 1250, rank: 10, journey: 'health' },
];
