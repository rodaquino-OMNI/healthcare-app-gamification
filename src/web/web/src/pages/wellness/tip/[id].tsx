import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface TipData {
    title: string;
    category: string;
    readTime: string;
    content: string[];
    relatedIds: string[];
    relatedTitles: string[];
}

const TIPS_DB: Record<string, TipData> = {
    '1': {
        title: 'The Power of Deep Breathing',
        category: 'Stress Management',
        readTime: '3 min',
        content: [
            'Deep breathing is one of the most effective and accessible tools for managing stress. It activates the parasympathetic nervous system, which helps lower heart rate and blood pressure.',
            'Try the 4-7-8 technique: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. Repeat this cycle 3-4 times.',
            'Practice deep breathing whenever you feel stressed, before sleep, or during breaks at work. Consistency is key to seeing lasting benefits.',
        ],
        relatedIds: ['2', '3'],
        relatedTitles: ['Mindful Meditation for Beginners', 'Morning Routines for Wellness'],
    },
    '2': {
        title: 'Mindful Meditation for Beginners',
        category: 'Mindfulness',
        readTime: '5 min',
        content: [
            'Meditation does not require emptying your mind. Instead, it is about observing your thoughts without judgment and gently returning focus to the present moment.',
            'Start with just 5 minutes a day. Find a quiet spot, sit comfortably, close your eyes, and focus on your breathing. When thoughts arise, acknowledge them and return to your breath.',
            'Over time, you can increase the duration and explore guided meditations, body scans, and loving-kindness practices.',
        ],
        relatedIds: ['1', '4'],
        relatedTitles: ['The Power of Deep Breathing', 'Sleep Hygiene Essentials'],
    },
};

const DEFAULT_TIP: TipData = {
    title: 'Tip Not Found',
    category: 'General',
    readTime: '1 min',
    content: ['This wellness tip could not be found. Please return to the insights page to browse available tips.'],
    relatedIds: [],
    relatedTitles: [],
};

const TipDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const tipId = typeof id === 'string' ? id : '';
    const tip = TIPS_DB[tipId] ?? DEFAULT_TIP;

    const handleShare = () => {
        window.alert('Share feature coming soon.');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/wellness/insights')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to insights"
            >
                Back
            </button>

            <div style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
                <Text fontSize="xs" color={colors.journeys.health.primary} fontWeight="semiBold">
                    {tip.category}
                </Text>
            </div>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                {tip.title}
            </Text>

            <Box display="flex" style={{ gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xl }}>
                <Text fontSize="sm" color={colors.gray[50]}>
                    Wellness Tip
                </Text>
                <Text fontSize="sm" color={colors.gray[40]}>
                    {tip.readTime} read
                </Text>
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing['2xl'] }}>
                {tip.content.map((para, i) => (
                    <Text key={i} fontSize="md" color={colors.gray[60]} style={{ lineHeight: '1.7' }}>
                        {para}
                    </Text>
                ))}
            </div>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={handleShare} accessibilityLabel="Share tip">
                    Share Tip
                </Button>
            </Box>

            {tip.relatedIds.length > 0 && (
                <>
                    <Text
                        fontSize="lg"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Related Tips
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {tip.relatedIds.map((rid, i) => (
                            <div
                                key={rid}
                                onClick={() => router.push(`/wellness/tip/${rid}`)}
                                style={{ cursor: 'pointer' }}
                                role="link"
                                tabIndex={0}
                                aria-label={tip.relatedTitles[i]}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') router.push(`/wellness/tip/${rid}`);
                                }}
                            >
                                <Card journey="health" elevation="sm" padding="md">
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {tip.relatedTitles[i]}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                                        Read More
                                    </Text>
                                </Card>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default TipDetailPage;
