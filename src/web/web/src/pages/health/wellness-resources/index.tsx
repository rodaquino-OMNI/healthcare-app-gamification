import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React from 'react';

import { useAuth, useHealthMetrics } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const CATEGORIES = [
    { label: 'Articles', description: 'Expert health articles', href: '/health/wellness-resources/articles' },
    { label: 'Videos', description: 'Guided wellness videos', href: '/health/wellness-resources/videos' },
    { label: 'Programs', description: 'Structured wellness programs', href: '/health/wellness-resources/programs' },
];

const FEATURED = [
    { id: 'f1', title: 'Mindful Morning Routine', type: 'Article', readTime: '5 min' },
    { id: 'f2', title: 'Desk Stretching Series', type: 'Video', duration: '12 min' },
    { id: 'f3', title: '30-Day Sleep Improvement', type: 'Program', duration: '30 days' },
];

const RECENT = [
    { title: 'Breathing Techniques for Anxiety', date: '2 hours ago' },
    { title: 'Healthy Meal Prep Guide', date: '1 day ago' },
    { title: 'Yoga for Beginners', date: '3 days ago' },
];

const WellnessResourcesHomePage: React.FC = () => {
    const router = useRouter();
    const { session } = useAuth();
    const userId = session?.userId || '';
    const { metrics: _metrics, loading: _metricsLoading } = useHealthMetrics(userId, []);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to health home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Wellness Resources
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Explore articles, videos, and programs to support your wellness journey
            </Text>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Categories
            </Text>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: spacing.sm,
                    marginBottom: spacing['2xl'],
                }}
            >
                {CATEGORIES.map((cat) => (
                    <Card
                        key={cat.label}
                        journey="health"
                        elevation="sm"
                        padding="md"
                        style={{ cursor: 'pointer' }}
                        onClick={() => void router.push(cat.href)}
                    >
                        <Text fontSize="md" fontWeight="bold" color={colors.journeys.health.primary}>
                            {cat.label}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                            {cat.description}
                        </Text>
                    </Card>
                ))}
            </div>

            <Text
                fontSize="lg"
                fontWeight="semiBold"
                color={colors.journeys.health.text}
                style={{ marginBottom: spacing.sm }}
            >
                Featured Content
            </Text>
            <div
                style={{
                    display: 'flex',
                    gap: spacing.sm,
                    overflowX: 'auto',
                    marginBottom: spacing['2xl'],
                    paddingBottom: spacing.xs,
                }}
            >
                {FEATURED.map((item) => (
                    <Card
                        key={item.id}
                        journey="health"
                        elevation="sm"
                        padding="md"
                        style={{ minWidth: 200, flexShrink: 0, cursor: 'pointer' }}
                        onClick={() => void router.push(`/health/wellness-resources/${item.id}`)}
                    >
                        <Text fontSize="xs" fontWeight="semiBold" color={colors.journeys.health.primary}>
                            {item.type}
                        </Text>
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={colors.journeys.health.text}
                            style={{ marginTop: spacing['3xs'] }}
                        >
                            {item.title}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                            {item.readTime || item.duration}
                        </Text>
                    </Card>
                ))}
            </div>

            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: spacing.sm }}>
                <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text}>
                    Recent Activity
                </Text>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => void router.push('/health/wellness-resources/bookmarks')}
                    accessibilityLabel="View bookmarks"
                >
                    Bookmarks
                </Button>
            </Box>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                {RECENT.map((item) => (
                    <Card key={item.title} journey="health" elevation="sm" padding="sm">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" color={colors.journeys.health.text}>
                                {item.title}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {item.date}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default WellnessResourcesHomePage;
