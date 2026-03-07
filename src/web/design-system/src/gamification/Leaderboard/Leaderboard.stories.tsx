import type { Meta, StoryObj } from '@storybook/react';
import { Leaderboard } from './Leaderboard';

const meta: Meta<typeof Leaderboard> = {
    title: 'Gamification/Leaderboard',
    component: Leaderboard,
    tags: ['autodocs'],
    argTypes: {
        journey: {
            control: 'select',
            options: ['health', 'care', 'plan'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Leaderboard>;

const baseLeaderboardData = [
    { userId: 'u1', username: 'Ana Silva', score: 3840, rank: 1 },
    { userId: 'u2', username: 'Carlos Mendes', score: 3560, rank: 2 },
    { userId: 'u3', username: 'Beatriz Costa', score: 3210, rank: 3 },
    { userId: 'u4', username: 'Diego Ferreira', score: 2980, rank: 4 },
    { userId: 'u5', username: 'Elena Rocha', score: 2740, rank: 5 },
];

const leaderboardWithCurrentUser = [
    { userId: 'u1', username: 'Ana Silva', score: 3840, rank: 1 },
    { userId: 'u2', username: 'Carlos Mendes', score: 3560, rank: 2 },
    { userId: 'u3', username: 'Você', score: 3210, rank: 3, isCurrentUser: true },
    { userId: 'u4', username: 'Diego Ferreira', score: 2980, rank: 4 },
    { userId: 'u5', username: 'Elena Rocha', score: 2740, rank: 5 },
];

const leaderboardWithAchievements = [
    {
        userId: 'u1',
        username: 'Ana Silva',
        score: 3840,
        rank: 1,
        achievement: {
            id: 'top-health',
            title: 'Campeã da Saúde',
            description: 'Primeiro lugar no ranking de saúde',
            icon: 'heart',
            progress: 1,
            total: 1,
            unlocked: true,
            journey: 'health',
        },
    },
    { userId: 'u2', username: 'Carlos Mendes', score: 3560, rank: 2 },
    { userId: 'u3', username: 'Beatriz Costa', score: 3210, rank: 3 },
];

export const Default: Story = {
    args: {
        leaderboardData: baseLeaderboardData,
        journey: 'health',
    },
};

export const WithCurrentUser: Story = {
    args: {
        leaderboardData: leaderboardWithCurrentUser,
        journey: 'health',
    },
};

export const WithAchievements: Story = {
    args: {
        leaderboardData: leaderboardWithAchievements,
        journey: 'health',
    },
};

export const CareJourney: Story = {
    args: {
        leaderboardData: [
            { userId: 'u1', username: 'Maria Santos', score: 2100, rank: 1 },
            { userId: 'u2', username: 'João Oliveira', score: 1850, rank: 2 },
            { userId: 'u3', username: 'Paula Lima', score: 1620, rank: 3 },
        ],
        journey: 'care',
    },
};

export const PlanJourney: Story = {
    args: {
        leaderboardData: [
            { userId: 'u1', username: 'Ricardo Gomes', score: 4200, rank: 1 },
            { userId: 'u2', username: 'Fernanda Castro', score: 3900, rank: 2 },
            { userId: 'u3', username: 'Marcos Alves', score: 3600, rank: 3 },
        ],
        journey: 'plan',
    },
};
