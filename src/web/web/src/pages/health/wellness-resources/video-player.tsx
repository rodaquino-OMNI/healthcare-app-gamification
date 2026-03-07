import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const RELATED_VIDEOS = [
    { id: 'rv1', title: 'Gentle Morning Stretch', duration: '10 min' },
    { id: 'rv2', title: 'Core Strengthening Basics', duration: '15 min' },
    { id: 'rv3', title: 'Mindful Walking Guide', duration: '8 min' },
];

const VideoPlayerPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/wellness-resources/videos')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to video library"
            >
                Back
            </button>

            <div
                style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: '12px',
                    marginTop: spacing.md,
                    marginBottom: spacing.lg,
                    backgroundColor: colors.gray[10],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: colors.journeys.health.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: 0.9,
                    }}
                >
                    <Text fontSize="2xl" color={colors.white}>
                        &#9654;
                    </Text>
                </div>
            </div>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                Video #{id || '\u2014'}
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
                This guided wellness video helps you build healthy habits through structured exercises and mindfulness
                techniques. Follow along at your own pace.
            </Text>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => window.alert('Shared!')}
                    accessibilityLabel="Share video"
                >
                    Share
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={() => window.alert('Bookmarked!')}
                    accessibilityLabel="Bookmark video"
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
                Related Videos
            </Text>
            <div style={{ display: 'flex', gap: spacing.sm, overflowX: 'auto', paddingBottom: spacing.xs }}>
                {RELATED_VIDEOS.map((video) => (
                    <Card
                        key={video.id}
                        journey="health"
                        elevation="sm"
                        padding="sm"
                        style={{ minWidth: 180, flexShrink: 0, cursor: 'pointer' }}
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
                            }}
                        >
                            <Text fontSize="sm" color={colors.gray[40]}>
                                &#9654;
                            </Text>
                        </div>
                        <Text fontSize="sm" fontWeight="bold" color={colors.journeys.health.text}>
                            {video.title}
                        </Text>
                        <Text fontSize="xs" color={colors.gray[40]} style={{ marginTop: spacing['3xs'] }}>
                            {video.duration}
                        </Text>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VideoPlayerPage;
