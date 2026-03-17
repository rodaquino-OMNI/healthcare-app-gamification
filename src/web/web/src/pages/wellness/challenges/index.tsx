import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState, useEffect } from 'react';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useWellness } from '@/hooks/useWellness';

type ChallengeStatus = 'Active' | 'Upcoming' | 'Completed';

const STATUS_TABS: ChallengeStatus[] = ['Active', 'Upcoming', 'Completed'];
const PLACEHOLDER_USER_ID = 'me';

const ChallengesPage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ChallengeStatus>('Active');
    const { challenges, loadChallenges } = useWellness();

    useEffect(() => {
        void loadChallenges(PLACEHOLDER_USER_ID);
    }, [loadChallenges]);

    const now = new Date();
    const filtered = challenges.filter((c) => {
        const endDate = new Date(c.endDate);
        const startDate = new Date(c.startDate);
        if (activeTab === 'Completed') {
            return c.progress >= 100 || endDate < now;
        }
        if (activeTab === 'Upcoming') {
            return startDate > now;
        }
        return startDate <= now && endDate >= now && c.progress < 100;
    });

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/wellness')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to wellness home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Wellness Challenges
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Join challenges and earn rewards
            </Text>

            <Box
                display="flex"
                style={{ gap: spacing.sm, marginBottom: spacing.lg }}
                role="tablist"
                aria-label="Challenge status"
            >
                {STATUS_TABS.map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setActiveTab(tab)}
                        accessibilityLabel={tab}
                    >
                        {tab}
                    </Button>
                ))}
            </Box>

            {filtered.length === 0 ? (
                <Card journey="health" elevation="sm" padding="lg">
                    <Text fontSize="md" color={colors.gray[40]} style={{ textAlign: 'center' }}>
                        No {activeTab.toLowerCase()} challenges
                    </Text>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {filtered.map((challenge) => (
                        <div
                            key={challenge.id}
                            onClick={() => void router.push(`/wellness/challenges/${challenge.id}`)}
                            style={{ cursor: 'pointer' }}
                            role="link"
                            tabIndex={0}
                            aria-label={challenge.name}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    void router.push(`/wellness/challenges/${challenge.id}`);
                                }
                            }}
                        >
                            <Card journey="health" elevation="sm" padding="md">
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box style={{ flex: 1 }}>
                                        <Text fontWeight="semiBold" fontSize="md">
                                            {challenge.name}
                                        </Text>
                                        <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing['3xs'] }}>
                                            <Text fontSize="xs" color={colors.journeys.health.primary}>
                                                {challenge.type}
                                            </Text>
                                            <Text fontSize="xs" color={colors.gray[40]}>
                                                {challenge.participants} participants
                                            </Text>
                                        </Box>
                                    </Box>
                                    {challenge.duration > 0 && (
                                        <Text fontSize="xs" fontWeight="semiBold" color={colors.semantic.warning}>
                                            {challenge.duration} days
                                        </Text>
                                    )}
                                </Box>
                                {challenge.progress > 0 && (
                                    <div style={{ marginTop: spacing.sm }}>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            style={{ marginBottom: spacing['3xs'] }}
                                        >
                                            <Text fontSize="xs" color={colors.gray[50]}>
                                                Progress
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="semiBold"
                                                color={colors.journeys.health.primary}
                                            >
                                                {challenge.progress}%
                                            </Text>
                                        </Box>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: 6,
                                                backgroundColor: colors.gray[10],
                                                borderRadius: 3,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${challenge.progress}%`,
                                                    height: 6,
                                                    backgroundColor: colors.journeys.health.primary,
                                                    borderRadius: 3,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <Box display="flex" style={{ marginTop: spacing.xs }}>
                                    <Text fontSize="xs" color={colors.gray[40]}>
                                        {challenge.participants} participants
                                    </Text>
                                </Box>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default ChallengesPage;
