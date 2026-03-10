import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useWellness } from '@/hooks/useWellness';

const PLACEHOLDER_USER_ID = 'me';

const ChallengeDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const challengeId = typeof id === 'string' ? id : '';
    const { challengeDetail, loadChallengeDetail, joinChallenge } = useWellness();

    useEffect(() => {
        if (challengeId) {
            void loadChallengeDetail(challengeId);
        }
    }, [challengeId, loadChallengeDetail]);

    const data = challengeDetail;

    if (!data || data.id !== challengeId) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[50]}>
                    Loading...
                </Text>
            </div>
        );
    }

    const handleJoin = (): void => {
        if (data.joined) {
            return;
        }
        void joinChallenge(PLACEHOLDER_USER_ID, challengeId);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/wellness/challenges')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to challenges"
            >
                Back
            </button>

            <div style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
                <Text fontSize="xs" color={colors.journeys.health.primary} fontWeight="semiBold">
                    {data.type}
                </Text>
            </div>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                {data.name}
            </Text>

            <Box display="flex" style={{ gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xl }}>
                <Text fontSize="sm" color={colors.gray[50]}>
                    {data.participants} participants
                </Text>
                <Text fontSize="sm" color={colors.semantic.warning}>
                    {data.duration} days
                </Text>
            </Box>

            {data.progress > 0 && (
                <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                    <Box display="flex" justifyContent="space-between" style={{ marginBottom: spacing.xs }}>
                        <Text fontWeight="semiBold" fontSize="md">
                            Your Progress
                        </Text>
                        <Text fontWeight="bold" fontSize="lg" color={colors.journeys.health.primary}>
                            {data.progress}%
                        </Text>
                    </Box>
                    <div style={{ width: '100%', height: 8, backgroundColor: colors.gray[10], borderRadius: 4 }}>
                        <div
                            style={{
                                width: `${data.progress}%`,
                                height: 8,
                                backgroundColor: colors.journeys.health.primary,
                                borderRadius: 4,
                            }}
                        />
                    </div>
                </Card>
            )}

            <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.sm }}>
                    Description
                </Text>
                <Text fontSize="sm" color={colors.gray[60]} style={{ lineHeight: '1.7' }}>
                    {data.description}
                </Text>
            </Card>

            {data.rules.length > 0 && (
                <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.lg }}>
                    <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.sm }}>
                        Rules
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        {data.rules.map((rule, i) => (
                            <Box key={i} display="flex" style={{ gap: spacing.xs }}>
                                <Text fontSize="sm" color={colors.journeys.health.primary}>
                                    *
                                </Text>
                                <Text fontSize="sm" color={colors.gray[60]}>
                                    {rule}
                                </Text>
                            </Box>
                        ))}
                    </div>
                </Card>
            )}

            {data.rewards.length > 0 && (
                <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
                    <Text fontWeight="semiBold" fontSize="md" style={{ marginBottom: spacing.xs }}>
                        Rewards
                    </Text>
                    {data.rewards.map((reward, i) => (
                        <Text key={i} fontSize="sm" color={colors.gray[60]}>
                            {reward}
                        </Text>
                    ))}
                </Card>
            )}

            <Box display="flex" justifyContent="center">
                <Button
                    variant={data.joined ? 'secondary' : 'primary'}
                    journey="health"
                    onPress={handleJoin}
                    accessibilityLabel={data.joined ? 'Joined' : 'Join challenge'}
                >
                    {data.joined ? 'Joined' : 'Join Challenge'}
                </Button>
            </Box>
        </div>
    );
};

export default ChallengeDetailPage;
