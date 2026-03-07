import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'design-system/components/Card/Card';
import { Button } from 'design-system/components/Button/Button';
import { Text } from 'design-system/primitives/Text/Text';
import { Box } from 'design-system/primitives/Box/Box';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';

interface ArticleData {
    title: string;
    category: string;
    readTime: string;
    author: string;
    content: string[];
    relatedIds: string[];
    relatedTitles: string[];
}

const ARTICLES_DB: Record<string, ArticleData> = {
    '1': {
        title: 'Understanding Your Menstrual Cycle',
        category: 'Menstrual Health',
        readTime: '5 min',
        author: 'Dr. Sarah Costa',
        content: [
            'The menstrual cycle is a complex process that prepares the body for pregnancy each month. It typically lasts about 28 days, though anywhere from 21 to 35 days is considered normal.',
            'The cycle consists of four main phases: menstrual, follicular, ovulation, and luteal. Each phase is driven by different hormones and has distinct characteristics.',
            'During the menstrual phase (days 1-5), the uterine lining sheds. The follicular phase (days 1-13) involves follicle growth stimulated by FSH. Ovulation (day 14) is when the egg is released. The luteal phase (days 15-28) prepares the uterus for potential implantation.',
            'Tracking your cycle helps you understand your body better, predict your period, identify fertility windows, and notice any irregularities that may need medical attention.',
        ],
        relatedIds: ['5', '6'],
        relatedTitles: ['Managing PMS Naturally', 'When to See a Doctor'],
    },
    '2': {
        title: 'Nutrition During Your Period',
        category: 'Nutrition',
        readTime: '4 min',
        author: 'Nutritionist Ana Lima',
        content: [
            'What you eat during your period can significantly impact how you feel. Certain foods can help reduce inflammation, ease cramps, and boost energy levels.',
            'Iron-rich foods like spinach, lentils, and lean red meat help replenish iron lost during menstruation. Pair them with vitamin C sources for better absorption.',
            'Anti-inflammatory foods such as fatty fish, walnuts, and berries can help reduce cramping and bloating. Magnesium-rich foods like dark chocolate and bananas may also help.',
            'Stay hydrated and consider reducing caffeine and salt intake, as these can worsen bloating and discomfort.',
        ],
        relatedIds: ['7', '4'],
        relatedTitles: ['Hormonal Balance and Diet', 'Exercise and Your Cycle'],
    },
};

const DEFAULT_ARTICLE: ArticleData = {
    title: 'Article Not Found',
    category: 'General',
    readTime: '1 min',
    author: 'AUSTA Health',
    content: ['This article could not be found. Please return to the insights page to browse available articles.'],
    relatedIds: [],
    relatedTitles: [],
};

const ArticleDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const articleId = typeof id === 'string' ? id : '';
    const article = ARTICLES_DB[articleId] ?? DEFAULT_ARTICLE;

    const handleShare = () => {
        window.alert('Share feature coming soon.');
    };

    const handleBookmark = () => {
        window.alert('Article bookmarked.');
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
            <button
                onClick={() => router.push('/health/cycle/insights')}
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
                    {article.category}
                </Text>
            </div>

            <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text}>
                {article.title}
            </Text>

            <Box display="flex" style={{ gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xl }}>
                <Text fontSize="sm" color={colors.gray[50]}>
                    {article.author}
                </Text>
                <Text fontSize="sm" color={colors.gray[40]}>
                    {article.readTime} read
                </Text>
            </Box>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing['2xl'] }}>
                {article.content.map((para, i) => (
                    <Text key={i} fontSize="md" color={colors.gray[60]} style={{ lineHeight: '1.7' }}>
                        {para}
                    </Text>
                ))}
            </div>

            <Box display="flex" style={{ gap: spacing.sm, marginBottom: spacing['2xl'] }}>
                <Button variant="secondary" journey="health" onPress={handleShare} accessibilityLabel="Share article">
                    Share
                </Button>
                <Button
                    variant="secondary"
                    journey="health"
                    onPress={handleBookmark}
                    accessibilityLabel="Bookmark article"
                >
                    Bookmark
                </Button>
            </Box>

            {article.relatedIds.length > 0 && (
                <>
                    <Text
                        fontSize="lg"
                        fontWeight="semiBold"
                        color={colors.journeys.health.text}
                        style={{ marginBottom: spacing.sm }}
                    >
                        Related Articles
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        {article.relatedIds.map((rid, i) => (
                            <div
                                key={rid}
                                onClick={() => router.push(`/health/cycle/article/${rid}`)}
                                style={{ cursor: 'pointer' }}
                                role="link"
                                tabIndex={0}
                                aria-label={article.relatedTitles[i]}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') router.push(`/health/cycle/article/${rid}`);
                                }}
                            >
                                <Card journey="health" elevation="sm" padding="md">
                                    <Text fontWeight="semiBold" fontSize="md">
                                        {article.relatedTitles[i]}
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

export default ArticleDetailPage;
