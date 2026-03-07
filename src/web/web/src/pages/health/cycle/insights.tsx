import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const CATEGORIES = ['All', 'Menstrual Health', 'Fertility', 'Wellness', 'Nutrition'];

interface Article {
    id: string;
    title: string;
    category: string;
    readTime: string;
    featured: boolean;
    summary: string;
}

const ARTICLES: Article[] = [
    {
        id: '1',
        title: 'Understanding Your Menstrual Cycle',
        category: 'Menstrual Health',
        readTime: '5 min',
        featured: true,
        summary: 'A comprehensive guide to the four phases of your cycle.',
    },
    {
        id: '2',
        title: 'Nutrition During Your Period',
        category: 'Nutrition',
        readTime: '4 min',
        featured: true,
        summary: 'Foods that can help reduce cramps and boost energy.',
    },
    {
        id: '3',
        title: 'Fertility Awareness Methods',
        category: 'Fertility',
        readTime: '6 min',
        featured: false,
        summary: 'Natural family planning techniques explained.',
    },
    {
        id: '4',
        title: 'Exercise and Your Cycle',
        category: 'Wellness',
        readTime: '4 min',
        featured: false,
        summary: 'How to adapt your workout routine to each cycle phase.',
    },
    {
        id: '5',
        title: 'Managing PMS Naturally',
        category: 'Menstrual Health',
        readTime: '5 min',
        featured: false,
        summary: 'Natural remedies and lifestyle changes for PMS relief.',
    },
    {
        id: '6',
        title: 'When to See a Doctor',
        category: 'Menstrual Health',
        readTime: '3 min',
        featured: false,
        summary: 'Signs that warrant a visit to your healthcare provider.',
    },
    {
        id: '7',
        title: 'Hormonal Balance and Diet',
        category: 'Nutrition',
        readTime: '5 min',
        featured: false,
        summary: 'How your diet affects hormonal health throughout the cycle.',
    },
    {
        id: '8',
        title: 'Sleep and Cycle Health',
        category: 'Wellness',
        readTime: '4 min',
        featured: false,
        summary: 'The connection between sleep quality and menstrual health.',
    },
];

const chipStyle = (selected: boolean) => ({
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: '20px',
    border: `1px solid ${selected ? colors.journeys.health.primary : colors.gray[20]}`,
    backgroundColor: selected ? colors.journeys.health.background : colors.gray[0],
    color: selected ? colors.journeys.health.primary : colors.gray[60],
    fontWeight: selected ? 600 : 400,
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
});

const InsightsPage: React.FC = () => {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All' ? ARTICLES : ARTICLES.filter((a) => a.category === activeCategory);

    const featured = ARTICLES.filter((a) => a.featured);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/cycle')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.journeys.health.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: 0,
                }}
                aria-label="Back to cycle home"
            >
                Back
            </button>

            <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colors.journeys.health.text}
                style={{ marginTop: spacing.md }}
            >
                Insights
            </Text>
            <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
                Educational articles about menstrual health
            </Text>

            {featured.length > 0 && (
                <>
                    <Text
                        fontSize="lg"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Featured
                    </Text>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: spacing.sm,
                            marginBottom: spacing.xl,
                        }}
                    >
                        {featured.map((a) => (
                            <div
                                key={a.id}
                                onClick={() => router.push(`/health/cycle/article/${a.id}`)}
                                style={{ cursor: 'pointer' }}
                                role="link"
                                tabIndex={0}
                                aria-label={a.title}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') router.push(`/health/cycle/article/${a.id}`);
                                }}
                            >
                                <Card journey="health" elevation="sm" padding="md">
                                    <div
                                        style={{
                                            width: '100%',
                                            height: 80,
                                            backgroundColor: colors.journeys.health.background,
                                            borderRadius: '6px',
                                            marginBottom: spacing.sm,
                                        }}
                                    />
                                    <Text fontWeight="semiBold" fontSize="sm">
                                        {a.title}
                                    </Text>
                                    <Text fontSize="xs" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                                        {a.readTime} read
                                    </Text>
                                </Card>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div
                style={{
                    display: 'flex',
                    gap: spacing.xs,
                    overflowX: 'auto',
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.xs,
                }}
                role="tablist"
                aria-label="Article categories"
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={chipStyle(activeCategory === cat)}
                        role="tab"
                        aria-selected={activeCategory === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {filtered.map((a) => (
                    <div
                        key={a.id}
                        onClick={() => router.push(`/health/cycle/article/${a.id}`)}
                        style={{ cursor: 'pointer' }}
                        role="link"
                        tabIndex={0}
                        aria-label={a.title}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') router.push(`/health/cycle/article/${a.id}`);
                        }}
                    >
                        <Card journey="health" elevation="sm" padding="md">
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box style={{ flex: 1 }}>
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {a.title}
                                    </Text>
                                    <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>
                                        {a.summary}
                                    </Text>
                                    <Box display="flex" style={{ gap: spacing.sm, marginTop: spacing.xs }}>
                                        <Text fontSize="xs" color={colors.journeys.health.primary}>
                                            {a.category}
                                        </Text>
                                        <Text fontSize="xs" color={colors.gray[40]}>
                                            {a.readTime}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InsightsPage;
