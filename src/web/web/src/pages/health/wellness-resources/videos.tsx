import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

type Category = 'All' | 'Yoga' | 'Meditation' | 'Fitness' | 'Nutrition';
const CATEGORIES: Category[] = ['All', 'Yoga', 'Meditation', 'Fitness', 'Nutrition'];

const VIDEOS = [
    { id: 'v1', title: 'Morning Yoga Flow', category: 'Yoga', duration: '15 min' },
    { id: 'v2', title: 'Guided Body Scan Meditation', category: 'Meditation', duration: '10 min' },
    { id: 'v3', title: 'Full Body HIIT Workout', category: 'Fitness', duration: '20 min' },
    { id: 'v4', title: 'Healthy Smoothie Recipes', category: 'Nutrition', duration: '8 min' },
    { id: 'v5', title: 'Evening Stretching Routine', category: 'Yoga', duration: '12 min' },
    { id: 'v6', title: 'Breathing for Sleep', category: 'Meditation', duration: '7 min' },
];

const VideoLibraryPage: React.FC = () => {
    const router = useRouter();
    const [category, setCategory] = useState<Category>('All');

    const filtered = VIDEOS.filter((v) => category === 'All' || v.category === category);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/wellness-resources')}
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
                Video Library
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
                Guided wellness videos for every level
            </Text>

            <Box display="flex" style={{ gap: spacing.xs, marginBottom: spacing.xl, flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat}
                        variant={category === cat ? 'primary' : 'secondary'}
                        journey="health"
                        onPress={() => setCategory(cat)}
                        accessibilityLabel={`Filter ${cat}`}
                    >
                        {cat}
                    </Button>
                ))}
            </Box>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                {filtered.map((video) => (
                    <Card
                        key={video.id}
                        journey="health"
                        elevation="sm"
                        padding="sm"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/health/wellness-resources/video-player?id=${video.id}`)}
                    >
                        <div
                            style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                borderRadius: '8px',
                                marginBottom: spacing.xs,
                                backgroundColor: colors.gray[10],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: colors.journeys.health.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.9,
                                }}
                            >
                                <Text fontSize="md" color={colors.white}>
                                    &#9654;
                                </Text>
                            </div>
                        </div>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.text}>
                            {video.title}
                        </Text>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ marginTop: spacing['3xs'] }}
                        >
                            <Text fontSize="xs" color={colors.journeys.health.primary}>
                                {video.category}
                            </Text>
                            <Text fontSize="xs" color={colors.gray[40]}>
                                {video.duration}
                            </Text>
                        </Box>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VideoLibraryPage;
