import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuth, useHealthMetrics } from '@/hooks';

const RELATED = [
    { id: 'r1', title: 'Mindfulness for Beginners', category: 'Mental Health' },
    { id: 'r2', title: 'Post-Workout Recovery', category: 'Fitness' },
    { id: 'r3', title: 'Hydration and Health', category: 'Nutrition' },
];

const ArticleDetailPage: React.FC = () => {
    const router = useRouter();
    const { session } = useAuth();
    const userId = session?.userId || '';
    const { metrics: _metrics, loading: _metricsLoading } = useHealthMetrics(userId, []);
    const { id } = router.query;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/wellness-resources/articles')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to articles"
            >
                Back
            </button>

            <div
                style={{
                    width: '100%',
                    height: 200,
                    borderRadius: '12px',
                    marginTop: spacing.md,
                    marginBottom: spacing.lg,
                    backgroundColor: colors.gray[10],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text fontSize="md" color={colors.gray[40]}>
                    Article Image
                </Text>
            </div>

            <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>
                Wellness
            </Text>
            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing['3xs'] }}
            >
                Article #{id || '\u2014'}
            </Text>
            <Box display="flex" style={{ gap: spacing.md, marginTop: spacing.xs, marginBottom: spacing.xl }}>
                <Text fontSize="xs" color={colors.gray[50]}>
                    By Dr. Sarah Johnson
                </Text>
                <Text fontSize="xs" color={colors.gray[40]}>
                    Feb 15, 2026
                </Text>
                <Text fontSize="xs" color={colors.gray[40]}>
                    6 min read
                </Text>
            </Box>

            <Card journey="health" elevation="sm" padding="lg" style={{ marginBottom: spacing.xl }}>
                <Text fontSize="md" color={colors.gray[60]} style={{ lineHeight: '1.7', marginBottom: spacing.md }}>
                    Wellness is a holistic approach to health that encompasses physical, mental, and emotional
                    well-being. This article explores evidence-based strategies for improving your overall quality of
                    life through sustainable habits.
                </Text>
                <Text fontSize="md" color={colors.gray[60]} style={{ lineHeight: '1.7', marginBottom: spacing.md }}>
                    Research shows that small, consistent changes in daily routines can lead to significant improvements
                    in health outcomes. From morning rituals to evening wind-down practices, every moment offers an
                    opportunity for wellness.
                </Text>
                <Text fontSize="md" color={colors.gray[60]} style={{ lineHeight: '1.7' }}>
                    The key is to start with one area, build momentum, and gradually expand your wellness practices.
                    Remember that progress, not perfection, is the goal.
                </Text>
            </Card>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => window.alert('Shared!')}
                    accessibilityLabel="Share article"
                >
                    Share
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => window.alert('Bookmarked!')}
                    accessibilityLabel="Bookmark article"
                >
                    Bookmark
                </Button>
            </Box>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Related Articles
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                {RELATED.map((item) => (
                    <Card
                        key={item.id}
                        journey="health"
                        elevation="sm"
                        padding="sm"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/health/wellness-resources/${item.id}`)}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" fontWeight="semiBold" color={colors.journeys.health.text}>
                                {item.title}
                            </Text>
                            <Text fontSize="xs" color={colors.journeys.health.primary}>
                                {item.category}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = () => ({
    paths: [],
    fallback: 'blocking' as const,
});

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default ArticleDetailPage;
