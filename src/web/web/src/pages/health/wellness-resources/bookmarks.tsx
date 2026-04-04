import { Button } from 'design-system/components/Button/Button';
import { Card } from 'design-system/components/Card/Card';
import { Box } from 'design-system/primitives/Box/Box';
import { Text } from 'design-system/primitives/Text/Text';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth, useHealthMetrics } from '@/hooks';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';

const INITIAL_BOOKMARKS = [
    { id: 'b1', title: 'Building a Consistent Exercise Habit', type: 'Article', savedAt: 'Feb 20, 2026' },
    { id: 'b2', title: 'Morning Yoga Flow', type: 'Video', savedAt: 'Feb 18, 2026' },
    { id: 'b3', title: '7-Day Mindfulness Challenge', type: 'Program', savedAt: 'Feb 15, 2026' },
    { id: 'b4', title: 'Managing Daily Stress', type: 'Article', savedAt: 'Feb 12, 2026' },
    { id: 'b5', title: 'Full Body HIIT Workout', type: 'Video', savedAt: 'Feb 10, 2026' },
];

const TYPE_COLORS: Record<string, string> = {
    Article: colors.journeys.health.primary,
    Video: colors.journeys.health.accent,
    Program: colors.journeys.health.secondary,
};

const WellnessBookmarksPage: React.FC = () => {
    const { t: _t } = useTranslation();
    const router = useRouter();
    const { session } = useAuth();
    const userId = session?.userId || '';
    const { metrics: _metrics, loading: _metricsLoading } = useHealthMetrics(userId, []);
    const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);

    const removeBookmark = (id: string): void => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => void router.push('/health/wellness-resources')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to wellness resources"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Bookmarks
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Your saved wellness content
            </Text>

            {bookmarks.length === 0 ? (
                <Card journey="health" elevation="sm" padding="lg" style={{ textAlign: 'center' }}>
                    <Text fontSize="md" color={colors.gray[40]} style={{ marginBottom: spacing.md }}>
                        No bookmarks yet. Browse resources and save your favorites.
                    </Text>
                    <Button
                        journey="health"
                        onPress={() => void router.push('/health/wellness-resources')}
                        accessibilityLabel="Browse resources"
                    >
                        Browse Resources
                    </Button>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {bookmarks.map((bookmark) => (
                        <Card key={bookmark.id} journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <div style={{ flex: 1 }}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        style={{ gap: spacing.xs, marginBottom: spacing['3xs'] }}
                                    >
                                        <div
                                            style={{
                                                padding: `2px ${spacing['3xs']}`,
                                                borderRadius: '4px',
                                                backgroundColor: TYPE_COLORS[bookmark.type] || colors.gray[20],
                                            }}
                                        >
                                            <Text fontSize="xs" fontWeight="semiBold" color={colors.neutral.white}>
                                                {bookmark.type}
                                            </Text>
                                        </div>
                                        <Text fontSize="xs" color={colors.gray[40]}>
                                            {bookmark.savedAt}
                                        </Text>
                                    </Box>
                                    <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.text}>
                                        {bookmark.title}
                                    </Text>
                                </div>
                                <button
                                    onClick={() => removeBookmark(bookmark.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: colors.semantic.error,
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        padding: spacing['3xs'],
                                    }}
                                    aria-label={`Remove ${bookmark.title} from bookmarks`}
                                >
                                    Remove
                                </button>
                            </Box>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default WellnessBookmarksPage;
