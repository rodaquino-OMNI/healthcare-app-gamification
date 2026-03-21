import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

/**
 * Route params for the article detail screen.
 */
interface ArticleDetailParams {
    articleId: string;
}

/**
 * Full article data.
 */
interface ArticleData {
    id: string;
    title: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    sections: { heading: string; body: string }[];
}

/**
 * Related article for the bottom section.
 */
interface RelatedArticle {
    id: string;
    title: string;
    readTime: string;
}

const MOCK_ARTICLES: Record<string, ArticleData> = {
    'article-1': {
        id: 'article-1',
        title: 'Building a Sustainable Exercise Routine',
        author: 'Dr. Maria Santos',
        date: '2026-02-20',
        category: 'Fitness',
        readTime: '6 min',
        sections: [
            {
                heading: 'Getting Started',
                body: 'Starting a new exercise routine can feel overwhelming, but the key is to begin small and build gradually. Choose activities you enjoy and set realistic goals for yourself. Consistency matters more than intensity in the early stages.',
            },
            {
                heading: 'Finding Your Schedule',
                body: 'The best time to exercise is the time that works for you. Whether you prefer morning runs or evening workouts, pick a schedule that aligns with your daily routine. Block off time in your calendar just like any other important appointment.',
            },
            {
                heading: 'Staying Motivated',
                body: 'Track your progress, celebrate small wins, and find an accountability partner. Mix up your routine to prevent boredom and listen to your body when it needs rest. Remember that rest days are just as important as workout days.',
            },
            {
                heading: 'Long-Term Success',
                body: 'Sustainable fitness is about making exercise a natural part of your life, not a chore. Focus on how movement makes you feel rather than just the numbers. Over time, these small habits compound into significant health improvements.',
            },
        ],
    },
};

const DEFAULT_ARTICLE: ArticleData = {
    id: 'default',
    title: 'Wellness Article',
    author: 'AUSTA Health Team',
    date: '2026-02-22',
    category: 'Wellness',
    readTime: '5 min',
    sections: [
        {
            heading: 'Introduction',
            body: 'Welcome to this wellness resource. This article covers key concepts for improving your overall health and well-being through evidence-based strategies.',
        },
        {
            heading: 'Key Takeaways',
            body: 'Focus on small, sustainable changes rather than drastic overhauls. Consistency in healthy habits leads to lasting improvements in physical and mental health.',
        },
        {
            heading: 'Practical Tips',
            body: 'Start with one new healthy habit per week. Track your progress and adjust as needed. Seek professional guidance when starting any new health regimen.',
        },
    ],
};

const MOCK_RELATED: RelatedArticle[] = [
    { id: 'article-2', title: 'Understanding Macronutrients', readTime: '8 min' },
    { id: 'article-3', title: 'Managing Stress Through Mindfulness', readTime: '5 min' },
    { id: 'article-5', title: 'HIIT vs Steady-State Cardio', readTime: '7 min' },
];

/**
 * ArticleDetail displays the full content of a wellness article,
 * with hero image, author info, body sections, and related articles.
 */
export const ArticleDetail: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { t } = useTranslation();
    const _theme = useTheme();
    const [isBookmarked, setIsBookmarked] = useState(false);

    const params = route.params as ArticleDetailParams | undefined;
    const articleId = params?.articleId ?? 'default';

    const article = useMemo(() => MOCK_ARTICLES[articleId] ?? DEFAULT_ARTICLE, [articleId]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleToggleBookmark = useCallback(() => {
        setIsBookmarked((prev) => !prev);
    }, []);

    const handleShare = useCallback(() => {
        // Placeholder for share functionality
    }, []);

    const handleRelatedPress = useCallback(
        (relatedId: string) => {
            navigation.push('HealthWellnessResourcesArticleDetail', { articleId: relatedId });
        },
        [navigation]
    );

    return (
        <View style={styles.container} testID="wellness-resources-article-detail-screen">
            {/* Header */}
            <View style={styles.header}>
                <Touchable
                    onPress={handleGoBack}
                    accessibilityLabel={t('common.buttons.back')}
                    accessibilityRole="button"
                    testID="wellness-resources-article-detail-back-button"
                >
                    <Ionicons name="chevron-back" size={24} color={colors.journeys.health.primary} />
                </Touchable>
                <Text variant="heading" journey="health">
                    {t('journeys.health.wellnessResources.articleDetail.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                testID="wellness-resources-article-detail-scroll"
            >
                {/* Hero Image Placeholder */}
                <View style={styles.heroPlaceholder}>
                    <Ionicons name="book-outline" size={48} color={colors.journeys.health.primary} />
                </View>

                {/* Article Title */}
                <Text fontSize="heading-xl" fontWeight="bold" journey="health" style={styles.articleTitle}>
                    {article.title}
                </Text>

                {/* Author & Date Row */}
                <View style={styles.metaRow}>
                    <View style={styles.authorRow}>
                        <Ionicons name="person-circle-outline" size={20} color={colors.gray[50]} />
                        <Text fontSize="sm" color={colors.gray[60]}>
                            {article.author}
                        </Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Ionicons name="calendar-outline" size={16} color={colors.gray[40]} />
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {article.date}
                        </Text>
                    </View>
                    <View style={styles.readTimeRow}>
                        <Ionicons name="time-outline" size={16} color={colors.gray[40]} />
                        <Text fontSize="sm" color={colors.gray[50]}>
                            {article.readTime}
                        </Text>
                    </View>
                </View>

                {/* Body Sections */}
                {article.sections.map((section, index) => (
                    <View key={`section-${index}`} style={styles.bodySection}>
                        <Text fontSize="lg" fontWeight="semiBold" journey="health">
                            {section.heading}
                        </Text>
                        <Text fontSize="md" color={colors.gray[60]} style={styles.bodyText}>
                            {section.body}
                        </Text>
                    </View>
                ))}

                {/* Action Row */}
                <View style={styles.actionsRow} testID="wellness-resources-article-detail-actions">
                    <Touchable
                        onPress={handleShare}
                        accessibilityLabel={t('journeys.health.wellnessResources.articleDetail.share')}
                        accessibilityRole="button"
                        testID="wellness-resources-article-detail-share-button"
                        style={styles.actionButton}
                    >
                        <Ionicons name="share-social-outline" size={24} color={colors.journeys.health.primary} />
                        <Text fontSize="sm" color={colors.journeys.health.primary}>
                            {t('journeys.health.wellnessResources.articleDetail.share')}
                        </Text>
                    </Touchable>
                    <Touchable
                        onPress={handleToggleBookmark}
                        accessibilityLabel={t('journeys.health.wellnessResources.articleDetail.bookmark')}
                        accessibilityRole="button"
                        testID="wellness-resources-article-detail-bookmark-button"
                        style={styles.actionButton}
                    >
                        <Ionicons
                            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color={colors.journeys.health.primary}
                        />
                        <Text fontSize="sm" color={colors.journeys.health.primary}>
                            {t('journeys.health.wellnessResources.articleDetail.bookmark')}
                        </Text>
                    </Touchable>
                </View>

                {/* Related Articles */}
                <View style={styles.relatedSection}>
                    <Text fontSize="lg" fontWeight="semiBold" journey="health">
                        {t('journeys.health.wellnessResources.articleDetail.related')}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.relatedScroll}
                    >
                        {MOCK_RELATED.map((related) => (
                            <Touchable
                                key={related.id}
                                onPress={() => handleRelatedPress(related.id)}
                                accessibilityLabel={related.title}
                                accessibilityRole="button"
                                testID={`wellness-resources-article-detail-related-${related.id}`}
                            >
                                <View style={styles.relatedCard}>
                                    <View style={styles.relatedImagePlaceholder}>
                                        <Ionicons
                                            name="book-outline"
                                            size={24}
                                            color={colors.journeys.health.primary}
                                        />
                                    </View>
                                    <View style={styles.relatedInfo}>
                                        <Text fontSize="sm" fontWeight="semiBold" numberOfLines={2}>
                                            {related.title}
                                        </Text>
                                        <Text fontSize="xs" color={colors.gray[50]}>
                                            {related.readTime}
                                        </Text>
                                    </View>
                                </View>
                            </Touchable>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.health.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacingValues.md,
        paddingTop: spacingValues['3xl'],
        paddingBottom: spacingValues.sm,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: spacingValues.md,
        paddingBottom: spacingValues['3xl'],
    },
    heroPlaceholder: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: colors.journeys.health.background,
        borderWidth: 1,
        borderColor: colors.gray[20],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacingValues.md,
    },
    articleTitle: {
        marginBottom: spacingValues.sm,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacingValues.md,
        marginBottom: spacingValues.xl,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    readTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    bodySection: {
        marginBottom: spacingValues.lg,
        gap: spacingValues.xs,
    },
    bodyText: {
        lineHeight: 22,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacingValues['2xl'],
        paddingVertical: spacingValues.lg,
        borderTopWidth: 1,
        borderTopColor: colors.gray[10],
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[10],
        marginBottom: spacingValues.xl,
    },
    actionButton: {
        alignItems: 'center',
        gap: spacingValues['4xs'],
    },
    relatedSection: {
        gap: spacingValues.sm,
    },
    relatedScroll: {
        gap: spacingValues.sm,
    },
    relatedCard: {
        width: 160,
        borderRadius: 12,
        backgroundColor: colors.gray[0],
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.gray[10],
    },
    relatedImagePlaceholder: {
        width: 160,
        height: 90,
        backgroundColor: colors.journeys.health.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    relatedInfo: {
        padding: spacingValues.sm,
        gap: spacingValues['4xs'],
    },
});

export default ArticleDetail;
