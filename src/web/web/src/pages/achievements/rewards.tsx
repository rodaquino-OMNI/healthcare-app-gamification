import React, { useState } from 'react';
import Link from 'next/link';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { RewardCard } from 'src/web/design-system/src/gamification/RewardCard';
import { XPCounter } from 'src/web/design-system/src/gamification/XPCounter';
import { useGameProfile } from 'src/web/web/src/hooks/useGamification';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import type { Reward } from 'src/web/shared/types/gamification.types';

type JourneyFilter = 'all' | 'health' | 'care' | 'plan';
type SortOption = 'xp-asc' | 'xp-desc' | 'name';

const MOCK_REWARDS: Reward[] = [
    {
        id: 'r1',
        title: 'Premium Health Report',
        description: 'Get a detailed analysis of your health metrics with personalized recommendations',
        journey: 'health',
        icon: 'chart',
        xp: 500,
    },
    {
        id: 'r2',
        title: 'Priority Appointment',
        description: 'Skip the queue and book a priority appointment with your preferred doctor',
        journey: 'care',
        icon: 'calendar',
        xp: 750,
    },
    {
        id: 'r3',
        title: 'Plan Upgrade Discount',
        description: 'Get 10% off your next plan upgrade or renewal',
        journey: 'plan',
        icon: 'tag',
        xp: 1000,
    },
    {
        id: 'r4',
        title: 'Wellness Kit',
        description: 'Receive a curated wellness kit with health monitoring accessories',
        journey: 'health',
        icon: 'gift',
        xp: 1500,
    },
    {
        id: 'r5',
        title: 'Free Telemedicine Session',
        description: 'One complimentary telemedicine consultation with a specialist',
        journey: 'care',
        icon: 'video',
        xp: 800,
    },
    {
        id: 'r6',
        title: 'Dental Coverage Add-on',
        description: 'One month of free dental coverage added to your current plan',
        journey: 'plan',
        icon: 'shield',
        xp: 2000,
    },
    {
        id: 'r7',
        title: 'Fitness Class Pass',
        description: 'Access to 5 partner gym classes or fitness sessions',
        journey: 'health',
        icon: 'dumbbell',
        xp: 600,
    },
    {
        id: 'r8',
        title: 'Nutritionist Consultation',
        description: 'A personalized nutrition plan from a certified nutritionist',
        journey: 'care',
        icon: 'apple',
        xp: 900,
    },
];

const JOURNEY_LABELS: Record<JourneyFilter, string> = {
    all: 'All Journeys',
    health: 'My Health',
    care: 'Care Now',
    plan: 'My Plan',
};

const SORT_LABELS: Record<SortOption, string> = {
    'xp-asc': 'XP: Low to High',
    'xp-desc': 'XP: High to Low',
    name: 'Name A-Z',
};

/**
 * Reward catalog page showing all available rewards that can be redeemed with XP.
 * Includes journey filters, sort options, and XP balance header.
 */
const RewardsPage: React.FC = () => {
    const userId = 'user-123';
    const { data } = useGameProfile(userId);
    const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('xp-asc');

    const userXp = data?.gameProfile?.xp ?? 0;

    const filteredRewards = MOCK_REWARDS.filter(
        (reward) => journeyFilter === 'all' || reward.journey === journeyFilter
    ).sort((a, b) => {
        if (sortBy === 'xp-asc') return a.xp - b.xp;
        if (sortBy === 'xp-desc') return b.xp - a.xp;
        return a.title.localeCompare(b.title);
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: spacing.xl }}>
            <Box display="flex" alignItems="center" style={{ marginBottom: spacing.lg, gap: spacing.md }}>
                <Link href="/achievements">
                    <Button variant="secondary" onPress={() => {}}>
                        Back
                    </Button>
                </Link>
                <Text fontSize="2xl" fontWeight="bold">
                    Rewards
                </Text>
            </Box>

            {/* XP Balance header */}
            <Card
                padding="lg"
                style={{ marginBottom: spacing['2xl'], textAlign: 'center', backgroundColor: '#f0eeff' }}
            >
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xs }}>
                    Your XP Balance
                </Text>
                <XPCounter value={userXp} size="lg" animated />
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                    {filteredRewards.filter((r) => r.xp <= userXp).length} rewards available to claim
                </Text>
            </Card>

            {/* Journey filter */}
            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
                {(Object.keys(JOURNEY_LABELS) as JourneyFilter[]).map((jf) => (
                    <button
                        key={jf}
                        onClick={() => setJourneyFilter(jf)}
                        style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: '16px',
                            border: journeyFilter === jf ? '2px solid #6C63FF' : '1px solid #e0e0e0',
                            cursor: 'pointer',
                            backgroundColor: journeyFilter === jf ? '#f0eeff' : '#fff',
                            color: journeyFilter === jf ? '#6C63FF' : (colors.gray[70] ?? '#333'),
                            fontSize: '13px',
                            fontWeight: journeyFilter === jf ? 600 : 400,
                        }}
                    >
                        {JOURNEY_LABELS[jf]}
                    </button>
                ))}
            </Box>

            {/* Sort options */}
            <Box display="flex" alignItems="center" style={{ gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                <Text fontSize="sm" color={colors.gray[50]}>
                    Sort by:
                </Text>
                {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
                    <button
                        key={s}
                        onClick={() => setSortBy(s)}
                        style={{
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: sortBy === s ? 700 : 400,
                            backgroundColor: sortBy === s ? '#6C63FF' : 'transparent',
                            color: sortBy === s ? '#fff' : (colors.gray[50] ?? '#666'),
                            fontSize: '12px',
                        }}
                    >
                        {SORT_LABELS[s]}
                    </button>
                ))}
            </Box>

            {/* Reward cards grid */}
            <Box display="flex" style={{ flexWrap: 'wrap', gap: spacing.lg }}>
                {filteredRewards.map((reward) => (
                    <Link key={reward.id} href={`/achievements/rewards/${reward.id}`} passHref>
                        <div style={{ cursor: 'pointer', flex: '1 1 calc(50% - 12px)', minWidth: '280px' }}>
                            <RewardCard reward={reward} isEarned={reward.xp <= userXp} journey={reward.journey} />
                        </div>
                    </Link>
                ))}
            </Box>

            {filteredRewards.length === 0 && (
                <Card padding="lg" style={{ textAlign: 'center', marginTop: spacing.lg }}>
                    <Text fontSize="md" color={colors.gray[50]}>
                        No rewards match your current filters.
                    </Text>
                </Card>
            )}
        </div>
    );
};

export default RewardsPage;
