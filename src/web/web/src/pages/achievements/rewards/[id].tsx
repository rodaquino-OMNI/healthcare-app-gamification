import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { XPCounter } from 'design-system/gamification/XPCounter';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import type { Reward } from 'shared/types/gamification.types';

import { useGameProfile } from '@/hooks/useGamification';

const MOCK_REWARDS: Record<string, Reward & { terms: string; category: string }> = {
    r1: {
        id: 'r1',
        title: 'Premium Health Report',
        description:
            'Get a detailed analysis of your health metrics with personalized recommendations from our clinical team. Includes trend analysis, risk factors, and actionable health goals.',
        journey: 'health',
        icon: 'chart',
        xp: 500,
        terms: 'Report will be generated within 3 business days after redemption. Data from at least 30 days of metric tracking is required.',
        category: 'Reports',
    },
    r2: {
        id: 'r2',
        title: 'Priority Appointment',
        description:
            'Skip the regular queue and book a priority appointment slot with any available doctor in our network. Guaranteed scheduling within 48 hours.',
        journey: 'care',
        icon: 'calendar',
        xp: 750,
        terms: 'Valid for one appointment booking within 30 days of redemption. Subject to doctor availability. Cannot be transferred.',
        category: 'Appointments',
    },
    r3: {
        id: 'r3',
        title: 'Plan Upgrade Discount',
        description:
            'Receive a 10% discount on your next insurance plan upgrade or annual renewal. Applicable to all plan tiers.',
        journey: 'plan',
        icon: 'tag',
        xp: 1000,
        terms: 'Discount applied at next billing cycle. Valid for 90 days from redemption. Cannot be combined with other promotions.',
        category: 'Insurance',
    },
    r4: {
        id: 'r4',
        title: 'Wellness Kit',
        description:
            'Receive a curated wellness kit including a digital thermometer, pulse oximeter, and wellness journal delivered to your registered address.',
        journey: 'health',
        icon: 'gift',
        xp: 1500,
        terms: 'Shipping within 7-10 business days. Available for addresses within Brazil only. Kit contents may vary based on availability.',
        category: 'Physical',
    },
    r5: {
        id: 'r5',
        title: 'Free Telemedicine Session',
        description:
            'One complimentary telemedicine video consultation with a specialist of your choice from our partner network.',
        journey: 'care',
        icon: 'video',
        xp: 800,
        terms: 'Session must be scheduled within 60 days of redemption. Standard session duration of 30 minutes. Specialist availability may vary.',
        category: 'Consultations',
    },
    r6: {
        id: 'r6',
        title: 'Dental Coverage Add-on',
        description:
            'One full month of comprehensive dental coverage added to your current insurance plan at no extra cost.',
        journey: 'plan',
        icon: 'shield',
        xp: 2000,
        terms: 'Coverage begins on the first day of the next billing cycle. Includes basic preventive and diagnostic services. Pre-existing conditions may apply.',
        category: 'Insurance',
    },
    r7: {
        id: 'r7',
        title: 'Fitness Class Pass',
        description:
            'Access pass for 5 group fitness classes at any of our 200+ partner gyms and studios across major cities.',
        journey: 'health',
        icon: 'dumbbell',
        xp: 600,
        terms: 'Pass valid for 60 days from redemption. One class per day maximum. Check partner gym availability in the app.',
        category: 'Fitness',
    },
    r8: {
        id: 'r8',
        title: 'Nutritionist Consultation',
        description:
            'A personalized nutrition assessment and meal plan from a certified nutritionist, tailored to your health profile and goals.',
        journey: 'care',
        icon: 'apple',
        xp: 900,
        terms: 'Consultation via telemedicine within 14 days of redemption. Includes one follow-up session. Meal plan delivered digitally.',
        category: 'Consultations',
    },
};

const JOURNEY_COLORS: Record<string, string> = {
    health: colors.journeys.health.primary,
    care: colors.journeys.care.primary,
    plan: colors.journeys.plan.primary,
};

const JOURNEY_LABELS: Record<string, string> = {
    health: 'My Health',
    care: 'Care Now',
    plan: 'My Plan',
};

/**
 * Reward detail page showing full reward information, cost in XP,
 * terms and conditions, and a claim button.
 */
const RewardDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const rewardId = Array.isArray(id) ? id[0] : id;
    const reward = rewardId ? MOCK_REWARDS[rewardId] : undefined;

    const userId = 'user-123';
    const { data } = useGameProfile(userId);
    const userXp = data?.gameProfile?.xp ?? 0;

    const [claimed, setClaimed] = useState(false);

    if (!reward) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="lg" color={colors.gray[50]}>
                    Reward not found.
                </Text>
                <Link href="/achievements/rewards">
                    <Button variant="secondary" onPress={() => void router.push('/achievements/rewards')}>
                        Back to Rewards
                    </Button>
                </Link>
            </div>
        );
    }

    const canClaim = userXp >= reward.xp && !claimed;
    const journeyColor = JOURNEY_COLORS[reward.journey] ?? colors.gamification.primary;

    const handleClaim = (): void => {
        if (canClaim) {
            setClaimed(true);
        }
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <Button
                variant="secondary"
                onPress={() => void router.push('/achievements/rewards')}
                accessibilityLabel="Back to rewards"
                style={{ marginBottom: spacing.lg }}
            >
                Back to Rewards
            </Button>

            {/* Reward header */}
            <Card elevation="md" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Box display="flex" alignItems="center" style={{ gap: spacing.md, marginBottom: spacing.md }}>
                    <span
                        style={{
                            display: 'inline-block',
                            backgroundColor: journeyColor,
                            color: colors.gray[0],
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        {JOURNEY_LABELS[reward.journey] ?? reward.journey}
                    </span>
                    <span
                        style={{
                            display: 'inline-block',
                            backgroundColor: colors.gray[10],
                            color: colors.gray[70],
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: '12px',
                            fontSize: '12px',
                        }}
                    >
                        {reward.category}
                    </span>
                </Box>
                <Text fontSize="2xl" fontWeight="bold" style={{ marginBottom: spacing.sm }}>
                    {reward.title}
                </Text>
                <Text fontSize="md" color={colors.gray[50]} style={{ marginBottom: spacing.lg }}>
                    {reward.description}
                </Text>
            </Card>

            {/* Cost and claim section */}
            <Card elevation="sm" padding="lg" style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
                <Text fontSize="sm" color={colors.gray[50]} style={{ marginBottom: spacing.xs }}>
                    Cost
                </Text>
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={colors.gamification.primary}
                    style={{ marginBottom: spacing.md }}
                >
                    {reward.xp} XP
                </Text>

                <Box display="flex" justifyContent="center" style={{ marginBottom: spacing.lg }}>
                    <Box>
                        <Text fontSize="sm" color={colors.gray[50]}>
                            Your Balance
                        </Text>
                        <XPCounter currentXP={userXp} nextLevelXP={10000} journey="health" />
                    </Box>
                </Box>

                {claimed ? (
                    <Card padding="md" style={{ backgroundColor: colors.semantic.successBg }}>
                        <Text fontWeight="bold" color={colors.semantic.success}>
                            Reward Claimed Successfully!
                        </Text>
                        <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing.xs }}>
                            Check your notifications for details on how to redeem.
                        </Text>
                    </Card>
                ) : (
                    <Button
                        onPress={handleClaim}
                        disabled={!canClaim}
                        accessibilityLabel={
                            canClaim ? `Claim ${reward.title} for ${reward.xp} XP` : 'Not enough XP to claim'
                        }
                        style={{ width: '100%' }}
                    >
                        {userXp >= reward.xp ? `Claim for ${reward.xp} XP` : `Need ${reward.xp - userXp} more XP`}
                    </Button>
                )}
            </Card>

            {/* Terms and conditions */}
            <Card elevation="sm" padding="lg">
                <Text fontWeight="bold" fontSize="lg" style={{ marginBottom: spacing.md }}>
                    Terms & Conditions
                </Text>
                <Text fontSize="sm" color={colors.gray[50]} style={{ lineHeight: '1.6' }}>
                    {reward.terms}
                </Text>
            </Card>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default RewardDetailPage;
